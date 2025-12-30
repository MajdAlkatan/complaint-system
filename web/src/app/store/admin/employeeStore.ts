import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useGovernmentEntityStore } from "./governmentEntityStore";
import axiosInstance from "../../../lib/axiosInstance";
import toast from "react-hot-toast";

// Define employee interface based on API response
export interface Employee {
  employee_id: number;
  email: string;
  username: string;
  is_verified: boolean;
  government_entity_id: number;
  failed_login_attempts: number;
  locked_until: string | null;
  position: string;
  created_by: number | null;
  can_add_notes_on_complaints: boolean;
  can_request_more_info_on_complaints: boolean;
  can_change_complaints_status: boolean;
  can_view_reports: boolean;
  can_export_data: boolean;
  permissions_updated_by: number | null;
  created_at: string;
  updated_at: string;
}

// Extended employee interface with department name
export interface EmployeeWithDepartment extends Employee {
  departmentName?: string;
}

// Interface for adding new employee
export interface AddEmployeeData {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  government_entity_id: number;
  position: string;
  can_add_notes_on_complaints: number;
  can_request_more_info_on_complaints: number;
  can_change_complaints_status: number;
  can_view_reports: number;
  can_export_data: number;
}

interface EmployeeStore {
  // State
  employees: EmployeeWithDepartment[];
  loading: boolean;
  error: string | null;
  isAddDialogOpen: boolean;
  isAddingEmployee: boolean;

  // Actions
  setEmployees: (employees: EmployeeWithDepartment[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  setIsAddingEmployee: (isAdding: boolean) => void;

  // CRUD Actions
  fetchEmployees: () => Promise<void>;
  addEmployee: (data: AddEmployeeData) => Promise<boolean>;
  deleteEmployee: (employeeId: number) => Promise<boolean>;
  updateEmployee: (
    employeeId: number,
    data: Partial<Employee>
  ) => Promise<boolean>;

  // Helper methods
  getEmployeeById: (id: number) => EmployeeWithDepartment | undefined;
  getDepartmentName: (departmentId: number) => string;
}

export const useEmployeeStore = create<EmployeeStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      employees: [],
      loading: false,
      error: null,
      isAddDialogOpen: false,
      isAddingEmployee: false,

      // Actions
      setEmployees: (employees) => set({ employees }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setIsAddDialogOpen: (isAddDialogOpen) => set({ isAddDialogOpen }),
      setIsAddingEmployee: (isAddingEmployee) => set({ isAddingEmployee }),

      // Fetch employees
      fetchEmployees: async () => {
        try {
          set({ loading: true, error: null });
          const response = await axiosInstance.get("/employees");

          const data = response.data;

          let employeeList: Employee[] = [];

          // Handle different response formats
          if (Array.isArray(data)) {
            employeeList = data;
          } else if (data && Array.isArray(data.data)) {
            employeeList = data.data;
          } else if (data?.data && Array.isArray(data.data)) {
            employeeList = data.data;
          } else {
            throw new Error("Unexpected data format received");
          }

          // Get government entities store to map department names
          const governmentEntities =
            useGovernmentEntityStore.getState().governmentEntities;

          // Map department names to employees
          const employeesWithDepartment = employeeList.map((employee) => ({
            ...employee,
            departmentName:
              governmentEntities.find(
                (entity) =>
                  entity.government_entities_id ===
                  employee.government_entity_id
              )?.name || `Department ID: ${employee.government_entity_id}`,
          }));

          set({ employees: employeesWithDepartment });
        } catch (error) {
          console.error("Failed to fetch employees:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Failed to load employees";
          set({ error: errorMessage });
          toast.error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      // Add new employee
      addEmployee: async (data: AddEmployeeData): Promise<boolean> => {
        try {
          set({ isAddingEmployee: true, error: null });

          const response = await axiosInstance.post("/employees/add", data);

          if (response.status === 200 || response.status === 201) {
            toast.success("Employee added successfully!");

            // Refresh the employee list after adding
            await get().fetchEmployees();

            return true;
          } else {
            const errorMsg = response.data?.message || "Failed to add employee";
            set({ error: errorMsg });
            toast.error(errorMsg);
            return false;
          }
        } catch (error: any) {
          console.error("Error adding employee:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to add employee";
          set({ error: errorMessage });
          toast.error(errorMessage);
          return false;
        } finally {
          set({ isAddingEmployee: false });
        }
      },

      // Delete employee
      deleteEmployee: async (employeeId: number): Promise<boolean> => {
        try {
          const response = await axiosInstance.delete(
            `/employees/${employeeId}`
          );

          if (response.status === 200 || response.status === 204) {
            toast.success("Employee deleted successfully!");

            // Refresh the employee list after deleting
            await get().fetchEmployees();

            return true;
          } else {
            const errorMsg =
              response.data?.message || "Failed to delete employee";
            toast.error(errorMsg);
            return false;
          }
        } catch (error: any) {
          console.error("Error deleting employee:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to delete employee";
          toast.error(errorMessage);
          return false;
        }
      },

      // Update employee
      updateEmployee: async (
        employeeId: number,
        data: Partial<Employee>
      ): Promise<boolean> => {
        try {
          const response = await axiosInstance.put(
            `/employees/${employeeId}`,
            data
          );

          if (response.status === 200) {
            toast.success("Employee updated successfully!");

            // Refresh the employee list after updating
            await get().fetchEmployees();

            return true;
          } else {
            const errorMsg =
              response.data?.message || "Failed to update employee";
            toast.error(errorMsg);
            return false;
          }
        } catch (error: any) {
          console.error("Error updating employee:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to update employee";
          toast.error(errorMessage);
          return false;
        }
      },

      // Helper methods
      getEmployeeById: (id) => {
        const { employees } = get();
        return employees.find((emp) => emp.employee_id === id);
      },

      getDepartmentName: (departmentId) => {
        const governmentEntities =
          useGovernmentEntityStore.getState().governmentEntities;
        const entity = governmentEntities.find(
          (entity) => entity.government_entities_id === departmentId
        );
        return entity ? entity.name : `Department ID: ${departmentId}`;
      },
    }),
    {
      name: "employee-storage",
    }
  )
);
