import { BarChart, Bell, Calendar, FileText, Shield } from "lucide-react";
import { useEmployeeAuthStore } from "../../app/store/employee/employeeAuth.store";
import { Button } from "../../components/ui/button";

export default function EmployeeDashboard() {
  const { employee } = useEmployeeAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className=" rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {employee?.username}! 👋
            </h1>
            <p className=" mt-2">
              Here's what's happening with your complaints today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm ">Employee ID</p>
              <p className="text-xl font-mono font-bold">
                {employee?.employee_id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Assigned Complaints</p>
              <p className="text-2xl font-bold mt-2">24</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">+2 from yesterday</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-2xl font-bold mt-2">8</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <Bell className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Require attention</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Resolved Today</p>
              <p className="text-2xl font-bold mt-2">5</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">+3 from yesterday</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Response Time</p>
              <p className="text-2xl font-bold mt-2">4.2h</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <BarChart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">-0.5h from last week</p>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            {/* Activity list would go here */}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              New Complaint Note
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Follow-up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
