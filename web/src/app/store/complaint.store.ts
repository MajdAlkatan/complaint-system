import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axiosInstance from "../../lib/axiosInstance";

export interface Complaint {
  complaints_id: number;
  reference_number: string;
  citizen_id: number;
  entity_id: number;
  complaint_type: number;
  location: string;
  description: string;
  status: "new" | "pending" | "in_progress" | "resolved" | "rejected";
  completed_at: string | null;
  locked: boolean;
  locked_by_employee_id: number | null;
  locked_at: string | null;
  created_at: string;
  updated_at: string;
  notes?: string; // Optional field for notes
  requested_info?: boolean; // Optional field for info request status
}

export interface UpdateComplaintData {
  status?: string;
  notes?: string;
  description?: string;
  location?: string;
}

interface ComplaintStore {
  // State
  complaints: Complaint[];
  loading: boolean;
  error: string | null;
  selectedComplaint: Complaint | null;
  isDialogOpen: boolean;

  // Actions
  setComplaints: (complaints: Complaint[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedComplaint: (complaint: Complaint | null) => void;
  setIsDialogOpen: (isOpen: boolean) => void;

  // CRUD Actions
  fetchComplaints: () => Promise<void>;
  lockComplaint: (id: number) => Promise<boolean>;
  unlockComplaint: (id: number) => Promise<boolean>;
  requestNotes: (id: number, message?: string) => Promise<boolean>;
  updateComplaint: (id: number, data: UpdateComplaintData) => Promise<boolean>;

  // Helper methods
  getComplaintById: (id: number) => Complaint | undefined;
  getStatusColor: (status: string) => string;
  getStatusBadge: (status: string) => string;
  canTakeAction: (complaint: Complaint) => boolean;
}

export const useComplaintStore = create<ComplaintStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      complaints: [],
      loading: false,
      error: null,
      selectedComplaint: null,
      isDialogOpen: false,

      // Actions
      setComplaints: (complaints) => set({ complaints }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSelectedComplaint: (selectedComplaint) => set({ selectedComplaint }),
      setIsDialogOpen: (isDialogOpen) => set({ isDialogOpen }),

      // Fetch complaints
      fetchComplaints: async () => {
        try {
          set({ loading: true, error: null });
          const response = await axiosInstance.get("/complaints");

          const data = response.data;
          console.log("Complaints data:", data);

          // Handle different response formats
          if (Array.isArray(data)) {
            set({ complaints: data });
          } else if (data && Array.isArray(data.data)) {
            set({ complaints: data.data });
          } else {
            throw new Error("Unexpected data format received");
          }
        } catch (error) {
          console.error("Failed to fetch complaints:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to load complaints";
          set({ error: errorMessage });
          toast.error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      // Lock complaint
      lockComplaint: async (id: number): Promise<boolean> => {
        try {
          const response = await axiosInstance.put(`/complaints/lock/${id}`);

          if (response.status === 200) {
            toast.success("Complaint locked successfully!");

            // Refresh complaints list
            await get().fetchComplaints();

            return true;
          } else {
            const errorMsg =
              response.data?.message || "Failed to lock complaint";
            toast.error(errorMsg);
            return false;
          }
        } catch (error: any) {
          console.error("Error locking complaint:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to lock complaint";
          toast.error(errorMessage);
          return false;
        }
      },

      // Unlock complaint
      unlockComplaint: async (id: number): Promise<boolean> => {
        try {
          const response = await axiosInstance.put(`/complaints/unLock/${id}`);

          if (response.status === 200) {
            toast.success("Complaint unlocked successfully!");

            // Refresh complaints list
            await get().fetchComplaints();

            return true;
          } else {
            const errorMsg =
              response.data?.message || "Failed to unlock complaint";
            toast.error(errorMsg);
            return false;
          }
        } catch (error: any) {
          console.error("Error unlocking complaint:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to unlock complaint";
          toast.error(errorMessage);
          return false;
        }
      },

      // Request notes
      requestNotes: async (
        id: number,
        message: string = "You should add some notes"
      ): Promise<boolean> => {
        try {
          const response = await axiosInstance.put(
            `/complaints/requestNotes/${id}`,
            {
              message,
            }
          );

          if (response.status === 200) {
            toast.success("Notes request sent successfully!");

            // Refresh complaints list
            await get().fetchComplaints();

            return true;
          } else {
            const errorMsg =
              response.data?.message || "Failed to request notes";
            toast.error(errorMsg);
            return false;
          }
        } catch (error: any) {
          console.error("Error requesting notes:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to request notes";
          toast.error(errorMessage);
          return false;
        }
      },

      // Update complaint
      updateComplaint: async (
        id: number,
        data: UpdateComplaintData
      ): Promise<boolean> => {
        try {
          const response = await axiosInstance.put(`/complaints/${id}`, data);

          if (response.status === 200) {
            toast.success("Complaint updated successfully!");

            // Refresh complaints list
            await get().fetchComplaints();

            return true;
          } else {
            const errorMsg =
              response.data?.message || "Failed to update complaint";
            toast.error(errorMsg);
            return false;
          }
        } catch (error: any) {
          console.error("Error updating complaint:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to update complaint";
          toast.error(errorMessage);
          return false;
        }
      },

      // Helper methods
      getComplaintById: (id) => {
        const { complaints } = get();
        return complaints.find((complaint) => complaint.complaints_id === id);
      },

      getStatusColor: (status: string) => {
        switch (status.toLowerCase()) {
          case "new":
            return "bg-blue-100 text-blue-800";
          case "pending":
            return "bg-amber-100 text-amber-800";
          case "in_progress":
            return "bg-purple-100 text-purple-800";
          case "resolved":
            return "bg-green-100 text-green-800";
          case "rejected":
            return "bg-red-100 text-red-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      },

      getStatusBadge: (status: string) => {
        switch (status.toLowerCase()) {
          case "new":
            return "New";
          case "pending":
            return "Pending";
          case "in_progress":
            return "In Progress";
          case "resolved":
            return "Resolved";
          case "rejected":
            return "Rejected";
          default:
            return status;
        }
      },

      canTakeAction: (complaint: Complaint) => {
        // Check if complaint is locked by current user or not locked at all
        // You might want to check the logged-in user's ID here
        return !complaint.locked || complaint.locked_by_employee_id === null;
      },
    }),
    {
      name: "complaint-storage",
    }
  )
);
