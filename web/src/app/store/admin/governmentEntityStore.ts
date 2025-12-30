import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axiosInstance from "../../../lib/axiosInstance";

export interface GovernmentEntity {
  government_entities_id: number;
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
}

// Interface for adding new government entity
export interface AddGovernmentEntityData {
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
}

interface GovernmentEntityStore {
  // State
  governmentEntities: GovernmentEntity[];
  loading: boolean;
  error: string | null;
  isAddingEntity: boolean;

  // Actions
  setGovernmentEntities: (entities: GovernmentEntity[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsAddingEntity: (isAdding: boolean) => void;

  // CRUD Actions
  fetchGovernmentEntities: () => Promise<void>;
  addGovernmentEntity: (data: AddGovernmentEntityData) => Promise<boolean>;
  updateGovernmentEntity: (
    id: number,
    data: Partial<AddGovernmentEntityData>
  ) => Promise<boolean>;
  deleteGovernmentEntity: (id: number) => Promise<boolean>;

  // Helper methods
  getEntityById: (id: number) => GovernmentEntity | undefined;
  getEntityName: (id: number) => string;
}

export const useGovernmentEntityStore = create<GovernmentEntityStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      governmentEntities: [],
      loading: false,
      error: null,
      isAddingEntity: false,

      // Actions
      setGovernmentEntities: (entities) =>
        set({ governmentEntities: entities }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setIsAddingEntity: (isAddingEntity) => set({ isAddingEntity }),

      // Fetch government entities
      fetchGovernmentEntities: async () => {
        try {
          set({ loading: true, error: null });
          const response = await axiosInstance.get("/governmentEntites");

          const data = response.data;
          console.log("Government entities data:", data);

          // Handle different response formats
          if (Array.isArray(data)) {
            set({ governmentEntities: data });
          } else if (data && Array.isArray(data.data)) {
            set({ governmentEntities: data.data });
          } else {
            throw new Error("Unexpected data format received");
          }
        } catch (error) {
          console.error("Failed to fetch government entities:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to load departments";
          set({ error: errorMessage });
          toast.error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      // Add new government entity
      addGovernmentEntity: async (
        data: AddGovernmentEntityData
      ): Promise<boolean> => {
        try {
          set({ isAddingEntity: true, error: null });

          const response = await axiosInstance.post("/governmentEntites", data);

          if (response.status === 200 || response.status === 201) {
            toast.success("Department added successfully!");

            // Refresh the government entities list after adding
            await get().fetchGovernmentEntities();

            return true;
          } else {
            const errorMsg =
              response.data?.message || "Failed to add department";
            set({ error: errorMsg });
            toast.error(errorMsg);
            return false;
          }
        } catch (error: any) {
          console.error("Error adding department:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to add department";
          set({ error: errorMessage });
          toast.error(errorMessage);
          return false;
        } finally {
          set({ isAddingEntity: false });
        }
      },

      // Update government entity
      updateGovernmentEntity: async (
        id: number,
        data: Partial<AddGovernmentEntityData>
      ): Promise<boolean> => {
        try {
          const response = await axiosInstance.put(
            `/governmentEntites/${id}`,
            data
          );

          if (response.status === 200) {
            toast.success("Department updated successfully!");

            // Refresh the government entities list after updating
            await get().fetchGovernmentEntities();

            return true;
          } else {
            const errorMsg =
              response.data?.message || "Failed to update department";
            toast.error(errorMsg);
            return false;
          }
        } catch (error: any) {
          console.error("Error updating department:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to update department";
          toast.error(errorMessage);
          return false;
        }
      },

      // Delete government entity
      deleteGovernmentEntity: async (id: number): Promise<boolean> => {
        try {
          const response = await axiosInstance.delete(
            `/governmentEntites/${id}`
          );

          if (response.status === 200 || response.status === 204) {
            toast.success("Department deleted successfully!");

            // Refresh the government entities list after deleting
            await get().fetchGovernmentEntities();

            return true;
          } else {
            const errorMsg =
              response.data?.message || "Failed to delete department";
            toast.error(errorMsg);
            return false;
          }
        } catch (error: any) {
          console.error("Error deleting department:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to delete department";
          toast.error(errorMessage);
          return false;
        }
      },

      // Helper methods
      getEntityById: (id) => {
        const { governmentEntities } = get();
        return governmentEntities.find(
          (entity) => entity.government_entities_id === id
        );
      },

      getEntityName: (id) => {
        const entity = get().getEntityById(id);
        return entity ? entity.name : `Department ID: ${id}`;
      },
    }),
    {
      name: "government-entity-storage",
    }
  )
);
