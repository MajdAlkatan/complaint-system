/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Download, Edit, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import AddEmployeeForm from "../../components/admin/forms/AddEmployeeForm";
import { listEmployee, getGovernmentEntity } from "../../lib/adminAction";
import toast from "react-hot-toast";

// Define employee interface based on API response
interface Employee {
  employee_id: number;
  email: string;
  username: string;
  is_verified: boolean;
  government_entity_id: number; // Note: singular
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

// Define government entity interface
interface GovernmentEntity {
  government_entities_id: number; // Note: plural
  name: string;
}

// Extended employee interface with department name
interface EmployeeWithDepartment extends Employee {
  departmentName?: string;
}

const AdminEmployeePage = () => {
  const [employees, setEmployees] = useState<EmployeeWithDepartment[]>([]);
  const [governmentEntities, setGovernmentEntities] = useState<GovernmentEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch government entities
  const loadGovernmentEntities = async () => {
    try {
      setLoadingEntities(true);
      const response = await getGovernmentEntity();
      
      console.log("Government entities response:", response);
      
      if (response && response.data && Array.isArray(response.data)) {
        // Add debug log to check the actual structure
        console.log("Government entities data:", response.data);
        console.log("First entity:", response.data[0]);
        console.log("Entity ID field:", response.data[0]?.government_entities_id);
        
        setGovernmentEntities(response.data);
      } else {
        console.warn("Unexpected government entities format:", response);
      }
    } catch (error) {
      console.error("Failed to load government entities:", error);
      toast.error("Failed to load departments");
    } finally {
      setLoadingEntities(false);
    }
  };

  // Fetch employees
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await listEmployee();

      console.log("Employees response:", response);

      let employeeList: Employee[] = [];
      
      if (Array.isArray(response)) {
        employeeList = response;
      } else if (response && Array.isArray(response.data)) {
        employeeList = response.data;
      } else if (response?.data && Array.isArray(response.data)) {
        employeeList = response.data;
      } else {
        console.warn("Unexpected employees response format:", response);
        toast.error("Unexpected data format received");
        return;
      }

      console.log("Raw employee list:", employeeList);
      console.log("First employee government_entity_id:", employeeList[0]?.government_entity_id);
      console.log("Available government entities:", governmentEntities);

      // Map department names to employees
      const employeesWithDepartment: EmployeeWithDepartment[] = employeeList.map(employee => {
        // Find the department name
        let departmentName = `Department ID: ${employee.government_entity_id}`;
        
        if (governmentEntities.length > 0) {
          console.log(`Looking for department with ID ${employee.government_entity_id}`);
          
          const entity = governmentEntities.find(
            gov => gov.government_entities_id === employee.government_entity_id
          );
          
          console.log("Found entity:", entity);
          
          if (entity) {
            departmentName = entity.name;
          }
        }
        
        return {
          ...employee,
          departmentName
        };
      });

      console.log("Employees with department:", employeesWithDepartment);
      setEmployees(employeesWithDepartment);
    } catch (error) {
      console.error("Failed to load employees:", error);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  // Load all data
  useEffect(() => {
    const loadAllData = async () => {
      await loadGovernmentEntities();
      await loadEmployees();
    };
    loadAllData();
  }, []);

  // Also refresh employees list when dialog closes (after adding new employee)
  const handleEmployeeAdded = () => {
    loadEmployees();
  };

  const getStatusColor = (isVerified: boolean) => {
    return isVerified
      ? "bg-green-100 text-green-700 hover:bg-green-100"
      : "bg-amber-100 text-amber-700 hover:bg-amber-100";
  };

  const getStatusText = (isVerified: boolean) => {
    return isVerified ? "Verified" : "Pending";
  };

  // Generate action buttons based on employee permissions
  const getActionButtons = (employee: EmployeeWithDepartment) => {
    const actions = [];
    
    if (employee.can_add_notes_on_complaints) {
      actions.push("Add Notes");
    }
    if (employee.can_request_more_info_on_complaints) {
      actions.push("Request Info");
    }
    if (employee.can_change_complaints_status) {
      actions.push("Change Status");
    }
    if (employee.can_view_reports) {
      actions.push("View Reports");
    }
    if (employee.can_export_data) {
      actions.push("Export Data");
    }
    
    return actions;
  };

  const handleDelete = async (employeeId: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        // Here you would call deleteEmployee API
        // await deleteEmployee(employeeId);
        toast.success("Employee deleted successfully");
        loadEmployees(); // Refresh the list
      } catch (error) {
        toast.error("Failed to delete employee"+ error);
      }
    }
  };

  return (
    <div className=" ">
      <div className="  bg-white rounded-xl sm:mx-16 p-2 py-3 sm:p-12 sm:py-5">
        {/* Header */}
        <div className="mb-8">
          <div className="flex md:items-center justify-between max-md:flex-col max-md:gap-4 max-md:px-2">
            <div>
              <h1 className="text-lg md:text-2xl font-semibold text-gray-900">
                Employee Management
              </h1>
              <p className="text-gray-500 md:mt-1">
                Manage employees and their permissions
              </p>
              {loadingEntities && (
                <p className="text-sm text-gray-500">Loading departments...</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                <p className="max-md:text-xs">Export Data</p>
              </Button>
              <Button
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => setIsAddDialogOpen(true)}
                disabled={loadingEntities || governmentEntities.length === 0}
              >
                <Plus className="w-4 h-4" />
                <p className="max-md:text-xs">
                  {governmentEntities.length === 0 && !loadingEntities 
                    ? "No Departments Available" 
                    : "Add Employee"}
                </p>
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading employees...</div>
          </div>
        ) : employees.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">
              {governmentEntities.length === 0 
                ? "No departments available. Please add departments first." 
                : "No employees found. Add one to get started."}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {employees.map((employee) => {
              const actions = getActionButtons(employee);
              return (
                <Card
                  key={employee.employee_id}
                  className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-6 py-4 max-md:py-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Username and Status */}
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {employee.username}
                          </h3>
                          <Badge className={getStatusColor(employee.is_verified)}>
                            {getStatusText(employee.is_verified)}
                          </Badge>
                        </div>

                        {/* Email */}
                        <p className="text-sm text-gray-600 mb-1">
                          {employee.email}
                        </p>

                        {/* Position and Department */}
                        <p className="text-sm text-gray-700 mb-4">
                          {employee.position} • {employee.departmentName}
                        </p>

                        {/* Permissions summary */}
                        <div className="mb-4">
                          <p className="text-xs text-gray-500">
                            Permissions: 
                            {employee.can_add_notes_on_complaints && " Notes"}
                            {employee.can_request_more_info_on_complaints && " Request Info"}
                            {employee.can_change_complaints_status && " Change Status"}
                            {employee.can_view_reports && " View Reports"}
                            {employee.can_export_data && " Export Data"}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {actions.map((action, index) => (
                            <Button
                              key={`${employee.employee_id}-${action}-${index}`}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              {action}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Edit and Delete Icons */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-600 hover:text-gray-900"
                          onClick={() => {
                            toast.success("Edit functionality coming soon");
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(employee.employee_id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <AddEmployeeForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onEmployeeAdded={handleEmployeeAdded}
      />
    </div>
  );
};

export default AdminEmployeePage;