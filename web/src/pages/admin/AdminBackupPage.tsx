import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Download, Play } from "lucide-react";

//@ts-ignore
const StatCard = ({ value, label, bgColor, textColor }) => (
  <Card className={`${bgColor} border-0 shadow-sm`}>
    <CardContent className="p-6 max-sm:p-2 max-sm:px-3">
      <div
        className="text-xl sm:text-2xl font-bold mb-1"
        style={{ color: textColor }}
      >
        {value}
      </div>
      <div className="text-xs sm:text-sm font-medium text-gray-600">
        {label}
      </div>
    </CardContent>
  </Card>
);

//@ts-ignore
const BackupHistoryRow = ({ timestamp, size, duration, status }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-4 border-b border-gray-200 last:border-0">
    {/* Timestamp */}
    <div className="text-xs sm:text-sm text-gray-600 whitespace-nowrap min-w-[160px] sm:min-w-[180px]">
      {timestamp}
    </div>

    {/* Size */}
    <div className="text-xs sm:text-sm text-gray-900 font-medium min-w-[60px] sm:min-w-[80px]">
      {size}
    </div>

    {/* Duration */}
    <div className="text-xs sm:text-sm text-gray-600 min-w-[60px] sm:min-w-[80px]">
      {duration}
    </div>

    {/* Status & Download Button */}
    <div className="flex items-center justify-between sm:justify-end flex-1 gap-3">
      <span className="text-xs sm:text-sm font-semibold text-green-600 uppercase">
        {status}
      </span>
      <Button
        variant="outline"
        size="sm"
        className="border-gray-300 hover:bg-gray-50 text-gray-700 text-xs whitespace-nowrap"
      >
        <Download className="w-3.5 h-3.5 mr-1.5" />
        Download
      </Button>
    </div>
  </div>
);

const AdminBackupPage = () => {
  const backupHistory = [
    {
      timestamp: "11/30/2025, 1:12:35 AM",
      size: "2.4 GB",
      duration: "12 min",
      status: "SUCCESS",
    },
    {
      timestamp: "11/29/2025, 1:12:35 AM",
      size: "2.3 GB",
      duration: "11 min",
      status: "SUCCESS",
    },
    {
      timestamp: "11/28/2025, 1:12:35 AM",
      size: "2.3 GB",
      duration: "13 min",
      status: "SUCCESS",
    },
  ];

  return (
    <div className="">
      {/* Header */}
      <Card className="bg-white border border-gray-200 shadow-sm mx-2 sm:mx-12 sm:px-3 max-sm:px-0">
        <CardHeader className="pb-4 max-sm:px-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900 sm:mb-2">
                Backup Management
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Automated backups and data recovery
              </CardDescription>
            </div>
            <Button className="bg-primary hover:bg-hover  text-white shadow-sm w-full sm:w-auto">
              <Play className="w-4 h-4 mr-2" />
              Run Backup Now
            </Button>
          </div>
        </CardHeader>

        <CardContent className="max-sm:px-3">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard
              value="3"
              label="Successful Backups"
              bgColor="bg-green-50"
              textColor="#16a34a"
            />
            <StatCard
              value="Daily"
              label="Backup Schedule"
              bgColor="bg-blue-50"
              textColor="#2563eb"
            />
            <StatCard
              value="2.4 GB"
              label="Last Backup Size"
              bgColor="bg-purple-50"
              textColor="#9333ea"
            />
          </div>

          <h4 className="text-lg sm:text-xl font-bold text-gray-900">
            Backup History
          </h4>

          <div className="pt-0">
            <div className="overflow-x-auto -mx-6 px-6">
              {backupHistory.map((backup, index) => (
                <BackupHistoryRow
                  key={index}
                  timestamp={backup.timestamp}
                  size={backup.size}
                  duration={backup.duration}
                  status={backup.status}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBackupPage;
