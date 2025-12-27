import { Download } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
//@ts-ignore
const LogEntry = ({ timestamp, user, action, adminId }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-4 border-b border-gray-200 last:border-0">
    {/* Timestamp */}
    <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap min-w-[140px] sm:min-w-[180px]">
      {timestamp}
    </div>

    {/* User Email */}
    <div className="text-xs sm:text-sm text-gray-700 font-medium min-w-[180px] sm:min-w-[220px]">
      {user}
    </div>

    {/* Action Description */}
    <div className="flex-1 text-xs sm:text-sm text-gray-900 font-medium">
      {action}
    </div>

    {/* Admin ID */}
    <div className="text-xs text-gray-400 whitespace-nowrap">{adminId}</div>
  </div>
);

const AdminLogsPage = () => {
  const logs = [
    {
      timestamp: "11/21/2025, 1:12:35 AM",
      user: "superadmin@system.gov",
      action: "CREATED EMP ACCOUNT - lisa_env",
      adminId: "Admin #1",
    },
    {
      timestamp: "11/26/2025, 1:12:35 AM",
      user: "superadmin@system.gov",
      action: "CHANGED COMPLAINT STATUS - CMP-2025-004",
      adminId: "Admin #1",
    },
    {
      timestamp: "11/28/2025, 1:12:35 AM",
      user: "admin@system.gov",
      action: "EXPORTED REPORT",
      adminId: "Admin #2",
    },
    {
      timestamp: "11/30/2025, 1:12:35 AM",
      user: "superadmin@system.gov",
      action: "ADD NOTE ON COMPLAINT - CMP-2025-001",
      adminId: "Admin #1",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-1">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* First Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Admin Activity Logs
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Complete audit trail of all admin actions
                </CardDescription>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto -mx-6 px-6">
              {logs.map((log, index) => (
                <LogEntry
                  key={index}
                  timestamp={log.timestamp}
                  user={log.user}
                  action={log.action}
                  adminId={log.adminId}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Second Card (Duplicate) */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Admin Activity Logs
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Complete audit trail of all admin actions
                </CardDescription>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto -mx-6 px-6">
              {logs.map((log, index) => (
                <LogEntry
                  key={`second-${index}`}
                  timestamp={log.timestamp}
                  user={log.user}
                  action={log.action}
                  adminId={log.adminId}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default AdminLogsPage;
