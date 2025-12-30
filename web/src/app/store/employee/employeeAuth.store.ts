import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axiosInstance from "../../../lib/axiosInstance";

interface EmployeeAuthState {
  isAuthenticated: boolean;
  employee: Employee | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Setters
  setIsAuthenticated: (value: boolean) => void;
  setEmployee: (employee: Employee | null) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setAuthHeaders: () => void;
  refreshAccessToken: () => Promise<boolean>;
}

interface Employee {
  employee_id: number;
  email: string;
  username: string;
  is_verified: boolean;
  government_entity_id: number;
  position: string;
  can_add_notes_on_complaints: boolean;
  can_request_more_info_on_complaints: boolean;
  can_change_complaints_status: boolean;
  can_view_reports: boolean;
  can_export_data: boolean;
}

export const useEmployeeAuthStore = create<EmployeeAuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isAuthenticated: false,
        employee: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: null,

        // Setters
        setIsAuthenticated: (value) => set({ isAuthenticated: value }),
        setEmployee: (employee) => set({ employee }),
        setAccessToken: (token) => set({ accessToken: token }),
        setRefreshToken: (token) => set({ refreshToken: token }),
        setIsLoading: (value) => set({ isLoading: value }),
        setError: (error) => set({ error }),

        // Actions
        login: async (email: string, password: string) => {
          try {
            set({ isLoading: true, error: null });

            const response = await axiosInstance.post("/employees/login", {
              email,
              password,
            });

            console.log("Login response:", response);

            if (response.data && response.status === 200) {
              const employeeData = response.data.data;
              const accessToken = response.data.access_token;
              const refreshToken = response.data.refresh_token;

              // Update axios headers
              if (accessToken) {
                axiosInstance.defaults.headers.common[
                  "Authorization"
                ] = `Bearer ${accessToken}`;
              }
              localStorage.setItem("accessToken", accessToken);
              set({
                isAuthenticated: true,
                employee: employeeData,
                accessToken,
                refreshToken,
                isLoading: false,
                error: null,
              });

              return Promise.resolve();
            } else {
              throw new Error(response.data?.message || "Login failed");
            }
          } catch (error: any) {
            console.error("Login error:", error);

            const errorMessage =
              error.response?.data?.message ||
              error.message ||
              "An error occurred during login";

            set({
              isAuthenticated: false,
              employee: null,
              accessToken: null,
              refreshToken: null,
              isLoading: false,
              error: errorMessage,
            });

            return Promise.reject(errorMessage);
          }
        },

        logout: () => {
          // Clear axios headers
          delete axiosInstance.defaults.headers.common["Authorization"];

          // Reset store state
          set({
            isAuthenticated: false,
            employee: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
          });
        },

        clearError: () => set({ error: null }),

        setAuthHeaders: () => {
          const { accessToken } = get();
          if (accessToken) {
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${accessToken}`;
          }
        },

        refreshAccessToken: async (): Promise<boolean> => {
          try {
            const { refreshToken } = get();

            if (!refreshToken) {
              console.log("No refresh token available");
              return false;
            }

            console.log("Attempting to refresh access token...");

            const response = await axiosInstance.post(
              "/employees/refresh-token",
              {
                refresh_token: refreshToken,
              }
            );

            if (response.data && response.data.access_token) {
              const newAccessToken = response.data.access_token;

              // Update store
              set({
                accessToken: newAccessToken,
              });

              // Update axios headers
              axiosInstance.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;

              console.log("Access token refreshed successfully");
              return true;
            }

            return false;
          } catch (error: any) {
            console.error("Failed to refresh access token:", error);

            // If refresh fails, logout the user
            const { logout } = get();
            logout();

            return false;
          }
        },
      }),
      {
        name: "employee-auth-storage",
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          employee: state.employee,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }),
      }
    ),
    {
      name: "employee-auth-store",
    }
  )
);

// Helper function to check if user is logged in
export const checkEmployeeAuth = (): boolean => {
  const { isAuthenticated, accessToken } = useEmployeeAuthStore.getState();
  return !!accessToken && isAuthenticated;
};

// Helper function to get auth token
export const getEmployeeToken = (): string | null => {
  const { accessToken } = useEmployeeAuthStore.getState();
  return accessToken;
};

// Helper function to get refresh token
export const getEmployeeRefreshToken = (): string | null => {
  const { refreshToken } = useEmployeeAuthStore.getState();
  return refreshToken;
};

// Initialize auth headers on app startup
export const initializeAuth = () => {
  const { setAuthHeaders } = useEmployeeAuthStore.getState();
  setAuthHeaders();
};
