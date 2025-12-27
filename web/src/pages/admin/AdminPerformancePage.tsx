import { BarChart3, CheckCircle, Lock } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

//@ts-ignore
const MetricCard = ({ value, label, bgColor, textColor }) => (
  <Card className={`${bgColor} border-0 shadow-sm`}>
    <CardContent className="px-6 py-3 max-sm:px-4 max-sm:py-2">
      <div
        className="text-lg sm:text-2xl font-bold mb-1"
        style={{ color: textColor }}
      >
        {value}
      </div>
      <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
        {label}
      </div>
    </CardContent>
  </Card>
);

//@ts-ignore
const HealthStatusRow = ({ label, status, statusColor }) => (
  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-primary"></div>
      <span className="text-sm font-medium text-gray-900">{label}</span>
    </div>
    <span className={`text-sm font-semibold ${statusColor}`}>{status}</span>
  </div>
);
2;
//@ts-ignore
const CapabilityCard = ({
  icon: Icon,
  title,
  description,
  iconBg,
  iconColor,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}) => (
  <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-6 max-sm:p-3">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${iconBg} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminPerformancePage = () => {
  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900">
              System Performance
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 max-sm:-mt-2">
              Real-time system metrics and health monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <MetricCard
                value="45.2%"
                label="CPU"
                bgColor="bg-green-50"
                textColor="#16a34a"
              />
              <MetricCard
                value="68.5%"
                label="MEMORY"
                bgColor="bg-green-50"
                textColor="#16a34a"
              />
              <MetricCard
                value="125ms"
                label="RESPONSE TIME"
                bgColor="bg-red-50"
                textColor="#dc2626"
              />
              <MetricCard
                value="42users"
                label="ACTIVE USERS"
                bgColor="bg-green-50"
                textColor="#16a34a"
              />
            </div>
            <div className="mt-10">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900">
                System Health Status
              </h4>

              <div className="space-y-3 mt-3 sm:mt-5">
                <HealthStatusRow
                  label="Database Connection"
                  status="Healthy"
                  statusColor="text-green-600"
                />
                <HealthStatusRow
                  label="API Services"
                  status="Operational"
                  statusColor="text-green-600"
                />
                <HealthStatusRow
                  label="File Storage"
                  status="Available"
                  statusColor="text-green-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Capabilities */}
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-3">
            System Capabilities
          </h2>
          <div className="space-y-4">
            <CapabilityCard
              icon={BarChart3}
              title="Real-time Analytics"
              description="Monitor complaint trends, resolution times, and department performance with comprehensive dashboards."
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <CapabilityCard
              icon={CheckCircle}
              title="Efficient Workflow"
              description="Lock complaints for focused work, request additional information, and track every action with detailed audit logs."
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <CapabilityCard
              icon={Lock}
              title="Granular Permissions"
              description="Control exactly what each employee can do with role-based access and detailed permission settings."
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPerformancePage;
