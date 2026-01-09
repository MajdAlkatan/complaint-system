import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axiosInstance from "../../../lib/axiosInstance";
import toast from "react-hot-toast";

interface AdminAuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isCheckingAuth: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setAdmin: (admin: Admin | null) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  setIsCheckingAuth: (value: boolean) => void;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;

  refreshAccessToken: () => Promise<boolean>;
  checkUser: () => Promise<boolean>; // New function
}

interface Admin {
  admin_id: number;
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

export const useAdminAuthStore = create<AdminAuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isAuthenticated: false,
        admin: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: null,
        isCheckingAuth: false,

        // Setters
        setIsAuthenticated: (value) => set({ isAuthenticated: value }),
        setAdmin: (admin) => set({ admin }),
        setAccessToken: (token) => set({ accessToken: token }),
        setRefreshToken: (token) => set({ refreshToken: token }),
        setIsLoading: (value) => set({ isLoading: value }),
        setError: (error) => set({ error }),
        setIsCheckingAuth: (value) => set({ isCheckingAuth: value }),

        // Actions
        login: async (email: string, password: string) => {
          try {
            set({ isLoading: true, error: null });

            const response = await axiosInstance.post("/admins/login", {
              email,
              password,
            });

            console.log("Login response:", response);

            if (response.data && response.status === 200) {
              const adminData = response.data.user;
              const accessToken = response.data.access_token;
              const refreshToken = response.data.refresh_token;

              localStorage.setItem("accessToken", accessToken);

              set({
                isAuthenticated: true,
                admin: adminData,
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
              admin: null,
              accessToken: null,
              refreshToken: null,
              isLoading: false,
              error: errorMessage,
            });

            return Promise.reject(errorMessage);
          }
        },

        // New checkUser function
        checkUser: async (): Promise<boolean> => {
          try {
            const { accessToken, logout } = get();

            if (!accessToken) {
              console.log("No access token available");
              return false;
            }

            set({ isCheckingAuth: true, error: null });

            // Make API call to check user authentication
            const response = await axiosInstance.get("/admins/CheckUser", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            console.log("CheckUser response:", response);

            if (response.data && response.status === 200) {
              // User is authenticated
              set({
                isCheckingAuth: false,
                error: null,
              });
              return true;
            } else {
              throw new Error("Authentication check failed");
            }
          } catch (error: any) {
            console.error("CheckUser error:", error);

            const errorMessage =
              error.response?.data?.message ||
              error.message ||
              "Authentication check failed";

            // If error is 401 (Unauthorized), try to refresh token
            if (error.response?.status === 401) {
              const { refreshAccessToken } = get();
              const refreshed = await refreshAccessToken();

              if (refreshed) {
                const retryResult = await get().checkUser();
                return retryResult;
              }
            }

            return false;
          }
        },

        logout: () => {
          // Reset store state
          set({
            isAuthenticated: false,
            admin: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
          });
          toast.success("Logout Successfully");
        },

        clearError: () => set({ error: null }),

        refreshAccessToken: async (): Promise<boolean> => {
          try {
            const { refreshToken } = get();

            if (!refreshToken) {
              console.log("No refresh token available");
              return false;
            }

            console.log("Attempting to refresh access token...");

            const response = await axiosInstance.post("/admins/refresh-token", {
              refresh_token: refreshToken,
            });

            if (response.data && response.data.access_token) {
              const newAccessToken = response.data.access_token;

              // Update store
              set({
                accessToken: newAccessToken,
              });

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
        name: "admin-auth-storage",
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          admin: state.admin,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }),
      }
    ),
    {
      name: "admin-auth-store",
    }
  )
);

export const checkAdminAuthStatus = async (): Promise<boolean> => {
  const { checkUser } = useAdminAuthStore.getState();
  return await checkUser();
};
// Helper function to check if user is logged in
export const checkAdminAuth = (): boolean => {
  const { isAuthenticated, accessToken } = useAdminAuthStore.getState();
  return !!accessToken && isAuthenticated;
};

// Helper function to get auth token
export const getAdminToken = (): string | null => {
  const { accessToken } = useAdminAuthStore.getState();
  return accessToken;
};

// Helper function to get refresh token
export const getAdminRefreshToken = (): string | null => {
  const { refreshToken } = useAdminAuthStore.getState();
  return refreshToken;
};
