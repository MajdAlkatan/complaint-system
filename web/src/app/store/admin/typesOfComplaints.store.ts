import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axiosInstance from "../../../lib/axiosInstance";

// Types
export interface ComplaintType {
  id: number;
  type: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TypesOfComplaintsState {
  // State
  types: ComplaintType[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  currentType: ComplaintType | null;

  // Setters
  setTypes: (types: ComplaintType[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  setIsSubmitting: (value: boolean) => void;
  setCurrentType: (type: ComplaintType | null) => void;

  // Actions
  fetchTypes: () => Promise<void>;
  getTypeById: (id: number) => ComplaintType | undefined;
  addType: (
    type: string
  ) => Promise<{ success: boolean; data?: ComplaintType; error?: string }>;
  updateType: (
    id: number,
    type: string
  ) => Promise<{ success: boolean; data?: ComplaintType; error?: string }>;
  deleteType: (id: number) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
  clearCurrentType: () => void;
}

export const useTypesOfComplaintsStore = create<TypesOfComplaintsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      types: [],
      isLoading: false,
      error: null,
      isSubmitting: false,
      currentType: null,

      // Setters
      setTypes: (types) => set({ types }),
      setIsLoading: (value) => set({ isLoading: value }),
      setError: (error) => set({ error }),
      setIsSubmitting: (value) => set({ isSubmitting: value }),
      setCurrentType: (type) => set({ currentType: type }),

      // Actions
      fetchTypes: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await axiosInstance.get("/Alltypes");

          if (response.data && response.status === 200) {
            set({
              types: response.data.data || response.data,
              isLoading: false,
            });
          } else {
            throw new Error("Failed to fetch complaint types");
          }
        } catch (error: any) {
          console.error("Error fetching complaint types:", error);

          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to fetch complaint types";

          set({ error: errorMessage, isLoading: false, types: [] });
        }
      },

      getTypeById: (id: number) => {
        const { types } = get();
        return types.find((type) => type.id === id);
      },

      addType: async (type: string) => {
        try {
          set({ isSubmitting: true, error: null });

          const response = await axiosInstance.post("/complaints/addType", {
            type: type.trim(),
          });

          console.log("Add type response:", response);

          return { success: true };
        } catch (error: any) {
          console.error("Error adding complaint type:", error);

          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to add complaint type";

          set({ error: errorMessage, isSubmitting: false });
          return { success: false, error: errorMessage };
        }
      },

      updateType: async (id: number, type: string) => {
        try {
          set({ isSubmitting: true, error: null });

          const response = await axiosInstance.put(`/complaints/types/${id}`, {
            type: type.trim(),
          });

          if (response.data && response.status === 200) {
            const updatedType = response.data.data || response.data;

            // Update in local state
            set((state) => ({
              types: state.types.map((t) => (t.id === id ? updatedType : t)),
              isSubmitting: false,
              currentType: updatedType,
            }));

            return { success: true, data: updatedType };
          } else {
            throw new Error(
              response.data?.message || "Failed to update complaint type"
            );
          }
        } catch (error: any) {
          console.error("Error updating complaint type:", error);

          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to update complaint type";

          set({ error: errorMessage, isSubmitting: false });
          return { success: false, error: errorMessage };
        }
      },

      deleteType: async (id: number) => {
        try {
          set({ isLoading: true, error: null });

          const response = await axiosInstance.delete(
            `/complaints/types/${id}`
          );

          if (response.status === 200 || response.status === 204) {
            // Remove from local state
            set((state) => ({
              types: state.types.filter((type) => type.id !== id),
              isLoading: false,
              currentType:
                state.currentType?.id === id ? null : state.currentType,
            }));

            return { success: true };
          } else {
            throw new Error(
              response.data?.message || "Failed to delete complaint type"
            );
          }
        } catch (error: any) {
          console.error("Error deleting complaint type:", error);

          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to delete complaint type";

          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      clearError: () => set({ error: null }),
      clearCurrentType: () => set({ currentType: null }),
    }),
    {
      name: "types-of-complaints-store",
    }
  )
);

// Helper functions
export const useComplaintTypes = () => {
  const { types, isLoading, error } = useTypesOfComplaintsStore();
  return { types, isLoading, error };
};

export const getComplaintTypeName = (id: number): string => {
  const { getTypeById } = useTypesOfComplaintsStore.getState();
  const type = getTypeById(id);
  return type?.type || "Unknown Type";
};
