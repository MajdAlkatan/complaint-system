import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployeeAuthStore } from "../../app/store/employee/employeeAuth.store";
import { Button } from "../../components/ui/button";
import { LogOut } from "lucide-react";

export default function EmployeeDashboard() {
  const { isAuthenticated, employee, logout } = useEmployeeAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/employee-login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/employee-login");
  };

  // if (!employee) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-gray-500">Loading employee data...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Welcome, {employee.username}!
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{employee.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Position</p>
              <p className="font-medium">{employee.position}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="font-medium">{employee.employee_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">
                {employee.is_verified ? "Verified" : "Pending Verification"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Permissions</h3>
            <div className="flex flex-wrap gap-2">
              {employee.can_add_notes_on_complaints && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Add Notes
                </span>
              )}
              {employee.can_request_more_info_on_complaints && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Request Info
                </span>
              )}
              {employee.can_change_complaints_status && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Change Status
                </span>
              )}
              {employee.can_view_reports && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  View Reports
                </span>
              )}
              {employee.can_export_data && (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  Export Data
                </span>
              )}
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
