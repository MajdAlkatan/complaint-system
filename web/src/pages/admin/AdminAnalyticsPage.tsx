import { Download, FileText } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const AdminAnalyticsPage = () => {
  const complaintsByStatus = [
    { status: "Pending", count: 234, color: "bg-yellow-500" },
    { status: "In Progress", count: 456, color: "bg-blue-500" },
    { status: "Resolved", count: 1543, color: "bg-primary" },
    { status: "Closed", count: 98, color: "bg-gray-500" },
    { status: "Rejected", count: 14, color: "bg-red-500" },
  ];

  const complaintsByPriority = [
    { priority: "Low", count: 543, color: "bg-gray-500" },
    { priority: "Medium", count: 987, color: "bg-blue-500" },
    { priority: "High", count: 654, color: "bg-orange-500" },
    { priority: "Urgent", count: 161, color: "bg-red-500" },
  ];

  const monthlyData = [
    { month: "Jan", value: 420 },
    { month: "Feb", value: 780 },
    { month: "Mar", value: 380 },
    { month: "Apr", value: 650 },
    { month: "May", value: 520 },
    { month: "Jun", value: 450 },
    { month: "Jul", value: 850 },
    { month: "Aug", value: 720 },
    { month: "Sep", value: 580 },
    { month: "Oct", value: 920 },
    { month: "Nov", value: 680 },
    { month: "Dec", value: 550 },
  ];

  const stats = [
    { label: "Total Complaints", value: "2,345", bgColor: "bg-white" },
    { label: "Active Citizens", value: "1,234", bgColor: "bg-white" },
    { label: "Employees", value: "147", bgColor: "bg-white" },
    {
      label: "Resolution Rate",
      value: "87%",
      bgColor: "bg-primary",
      textColor: "text-white",
    },
  ];

  const maxStatus = Math.max(...complaintsByStatus.map((item) => item.count));
  const maxPriority = Math.max(
    ...complaintsByPriority.map((item) => item.count)
  );

  return (
    <div className=" bg-gray-50 p-3 max-md:py-0">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex md:items-center justify-between max-md:flex-col">
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
                Analytics & Reports
              </h1>
              <p className="text-gray-600 mt-1 ">
                Download and export system analytics data
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="gap-2 text-xs">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button className="gap-2 bg-primary hover:bg-hover transition-colors duration-500 text-xs">
                <FileText className="w-4 h-4" />
                Full Report (JSON)
              </Button>
            </div>
          </div>
        </div>

        {/* Top Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Complaints by Status */}
          <Card className="border-none shadow-lg hover:shadow-2xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-lg ">Complaints by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaintsByStatus.map((item) => (
                  <div key={item.status} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-24">
                      {item.status}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all`}
                        style={{ width: `${(item.count / maxStatus) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Complaints by Priority */}
          <Card className="border-none shadow-lg hover:shadow-2xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-lg ">Complaints by Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaintsByPriority.map((item) => (
                  <div key={item.priority} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-24">
                      {item.priority}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all`}
                        style={{
                          width: `${(item.count / maxPriority) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends Chart */}
        <Card className="mb-3 border-none shadow-lg hover:shadow-2xl transition-all duration-500">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px 12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mt-10">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className={`${stat.bgColor} py-8 border-none shadow-lg hover:shadow-2xl transition-all duration-500`}
            >
              <CardContent className="">
                <div
                  className={`text-center ${stat.textColor || "text-gray-900"}`}
                >
                  <div className="text-xl lg:text-2xl font-semibold mb-2">
                    {stat.value}
                  </div>
                  <div
                    className={`text-sm ${
                      stat.textColor ? "text-white/90" : "text-gray-600"
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
