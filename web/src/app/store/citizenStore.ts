import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axiosInstance from "../../lib/axiosInstance";

export interface Citizen {
  citizen_id: number;
  national_id: string;
  full_name: string;
  date_of_birth: string;
  gender: "male" | "female" | "other";
  phone_number: string;
  email: string;
  address: string;
  city: string;
  profile_image_url: string | null;
  account_status: "active" | "suspended" | "inactive";
  created_at: string;
  updated_at: string;
  total_complaints?: number; // Optional: for stats
}

export interface UpdateCitizenData {
  full_name?: string;
  date_of_birth?: string;
  gender?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  city?: string;
  account_status?: string;
}

interface CitizenStore {
  // State
  citizens: Citizen[];
  loading: boolean;
  error: string | null;
  selectedCitizen: Citizen | null;
  isDialogOpen: boolean;
  isEditing: boolean;

  // Actions
  setCitizens: (citizens: Citizen[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCitizen: (citizen: Citizen | null) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
  setIsEditing: (isEditing: boolean) => void;

  // CRUD Actions
  fetchCitizens: () => Promise<void>;
  fetchCitizenById: (id: number) => Promise<Citizen | null>;
  deleteCitizen: (id: number) => Promise<boolean>;
  updateCitizen: (id: number, data: UpdateCitizenData) => Promise<boolean>;
  suspendCitizen: (id: number) => Promise<boolean>;
  activateCitizen: (id: number) => Promise<boolean>;

  // Helper methods
  getCitizenById: (id: number) => Citizen | undefined;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getGenderText: (gender: string) => string;
  formatDate: (dateString: string) => string;
}

export const useCitizenStore = create<CitizenStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      citizens: [],
      loading: false,
      error: null,
      selectedCitizen: null,
      isDialogOpen: false,
      isEditing: false,

      // Actions
      setCitizens: (citizens) => set({ citizens }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSelectedCitizen: (selectedCitizen) => set({ selectedCitizen }),
      setIsDialogOpen: (isDialogOpen) => set({ isDialogOpen }),
      setIsEditing: (isEditing) => set({ isEditing }),

      // Fetch all citizens
      fetchCitizens: async () => {
        try {
          set({ loading: true, error: null });
          const response = await axiosInstance.get("/citizen");

          const data = response.data;
          console.log("Citizens data:", data);

          // Handle different response formats
          if (Array.isArray(data)) {
            set({ citizens: data });
          } else if (data && Array.isArray(data.data)) {
            set({ citizens: data.data });
          } else if (data?.data && Array.isArray(data.data)) {
            set({ citizens: data.data });
          } else {
            throw new Error("Unexpected data format received");
          }
        } catch (error) {
          console.error("Failed to fetch citizens:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Failed to load citizens";
          set({ error: errorMessage });
          toast.error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      // Fetch citizen by ID
      fetchCitizenById: async (id: number): Promise<Citizen | null> => {
        try {
          set({ loading: true, error: null });
          const response = await axiosInstance.get(`/citizen/${id}`);

          const data = response.data;
          console.log("Citizen by ID data:", data);

          // Handle different response formats
          const citizen = data.data || data;
          set({ selectedCitizen: citizen });
          return citizen;
        } catch (error) {
          console.error(`Failed to fetch citizen ${id}:`, error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : `Failed to load citizen ${id}`;
          set({ error: errorMessage });
          toast.error(errorMessage);
          return null;
        } finally {
          set({ loading: false });
        }
      },

      // Delete citizen
      deleteCitizen: async (id: number): Promise<boolean> => {
        try {
          const response = await axiosInstance.delete(`/citizen/${id}`);

          if (response.status === 200 || response.status === 204) {
            toast.success("Citizen deleted successfully!");

            // Remove from local state
            const { citizens } = get();
            const updatedCitizens = citizens.filter((c) => c.citizen_id !== id);
            set({ citizens: updatedCitizens });

            return true;
          } else {
            const errorMsg =
              response.data?.message || "Failed to delete citizen";
            toast.error(errorMsg);
            return false;
          }
        } catch (error: any) {
          console.error("Error deleting citizen:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to delete citizen";
          toast.error(errorMessage);
          return false;
        }
      },

      // Update citizen
      updateCitizen: async (
        id: number,
        data: UpdateCitizenData
      ): Promise<boolean> => {
        try {
          const response = await axiosInstance.put(`/citizen/${id}`, data);

          if (response.status === 200) {
            toast.success("Citizen updated successfully!");

            // Refresh citizens list
            await get().fetchCitizens();

            return true;
          } else {
            const errorMsg =
              response.data?.message || "Failed to update citizen";
            toast.error(errorMsg);
            return false;
          }
        } catch (error: any) {
          console.error("Error updating citizen:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to update citizen";
          toast.error(errorMessage);
          return false;
        }
      },

      // Suspend citizen account
      suspendCitizen: async (id: number): Promise<boolean> => {
        try {
          const response = await axiosInstance.put(`/citizen/${id}`, {
            account_status: "suspended",
          });

          if (response.status === 200) {
            toast.success("Citizen account suspended!");

            // Refresh citizens list
            await get().fetchCitizens();

            return true;
          } else {
            const errorMsg =
              response.data?.message || "Failed to suspend citizen";
            toast.error(errorMsg);
            return false;
          }
        } catch (error: any) {
          console.error("Error suspending citizen:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to suspend citizen";
          toast.error(errorMessage);
          return false;
        }
      },

      // Activate citizen account
      activateCitizen: async (id: number): Promise<boolean> => {
        try {
          const response = await axiosInstance.put(`/citizen/${id}`, {
            account_status: "active",
          });

          if (response.status === 200) {
            toast.success("Citizen account activated!");

            // Refresh citizens list
            await get().fetchCitizens();

            return true;
          } else {
            const errorMsg =
              response.data?.message || "Failed to activate citizen";
            toast.error(errorMsg);
            return false;
          }
        } catch (error: any) {
          console.error("Error activating citizen:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to activate citizen";
          toast.error(errorMessage);
          return false;
        }
      },

      // Helper methods
      getCitizenById: (id) => {
        const { citizens } = get();
        return citizens.find((citizen) => citizen.citizen_id === id);
      },

      getStatusColor: (status: string) => {
        switch (status.toLowerCase()) {
          case "active":
            return "bg-green-100 text-green-800";
          case "suspended":
            return "bg-red-100 text-red-800";
          case "inactive":
            return "bg-gray-100 text-gray-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      },

      getStatusText: (status: string) => {
        switch (status.toLowerCase()) {
          case "active":
            return "Active";
          case "suspended":
            return "Suspended";
          case "inactive":
            return "Inactive";
          default:
            return status;
        }
      },

      getGenderText: (gender: string) => {
        switch (gender.toLowerCase()) {
          case "male":
            return "Male";
          case "female":
            return "Female";
          case "other":
            return "Other";
          default:
            return gender;
        }
      },

      formatDate: (dateString: string) => {
        try {
          return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        } catch {
          return dateString;
        }
      },
    }),
    {
      name: "citizen-storage",
    }
  )
);
