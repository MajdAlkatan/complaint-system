import { AlertTriangle, Download, Shield } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

//@ts-ignore
const StatCard = ({ value, label, bgColor, textColor, icon: Icon }) => (
  <Card className={`${bgColor} border-0 shadow-sm`}>
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-3xl sm:text-4xl font-bold ${textColor} mb-1`}>
            {value}
          </div>
          <div className="text-sm font-medium text-gray-700">{label}</div>
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${textColor} opacity-20`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
//@ts-ignore
const LoginAttemptRow = ({ timestamp, email, role, ipAddress }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-4 border-b border-gray-200 last:border-0">
    {/* Timestamp */}
    <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap min-w-[140px] sm:min-w-[160px]">
      {timestamp}
    </div>

    {/* Email */}
    <div className="text-xs sm:text-sm text-gray-900 font-medium min-w-[180px] sm:min-w-[200px]">
      {email}
    </div>

    {/* Role */}
    <div className="text-xs sm:text-sm text-gray-600 min-w-[80px] sm:min-w-[100px]">
      {role}
    </div>

    {/* IP Address & Block Button */}
    <div className="flex items-center justify-between sm:justify-end flex-1 gap-3">
      <div className="text-xs sm:text-sm text-red-600 font-mono">
        {ipAddress}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="border-gray-300 hover:bg-gray-50 text-gray-700 text-xs whitespace-nowrap"
      >
        Block IP
      </Button>
    </div>
  </div>
);

const AdminSecurityPage = () => {
  const failedAttempts = [
    {
      timestamp: "11/30/2025, 11:12:36 PM",
      email: "suspicious@email.com",
      role: "citizen",
      ipAddress: "192.168.1.203",
    },
    {
      timestamp: "11/30/2025, 8:12:36 PM",
      email: "admin@system.gov",
      role: "admin",
      ipAddress: "203.46.67.108",
    },
    {
      timestamp: "12/1/2025, 12:12:55 AM",
      email: "hacker@test.com",
      role: "employee",
      ipAddress: "192.168.1.201",
    },
  ];

  return (
    <div className="">
      <div className="bg-white rounded-xl sm:mx-16 p-2 py-3 sm:p-12 sm:py-5">
        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Security Monitoring
            </h3>
            <p className="text-sm text-gray-500">
              Track failed login attempts and security events
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export Security Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            value="3"
            label="Failed Login Attempts (24h)"
            bgColor="bg-red-50"
            textColor="text-red-600"
            icon={AlertTriangle}
          />
          <StatCard
            value="2"
            label="Suspicious IP Addresses"
            bgColor="bg-yellow-50"
            textColor="text-yellow-600"
            icon={AlertTriangle}
          />
          <StatCard
            value="0"
            label="Locked Accounts"
            bgColor="bg-green-50"
            textColor="text-green-600"
            icon={Shield}
          />
        </div>

        {/* Recent Failed Login Attempts */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
              Recent Failed Login Attempts
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto -mx-6 px-6">
              {failedAttempts.map((attempt, index) => (
                <LoginAttemptRow
                  key={index}
                  timestamp={attempt.timestamp}
                  email={attempt.email}
                  role={attempt.role}
                  ipAddress={attempt.ipAddress}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSecurityPage;
