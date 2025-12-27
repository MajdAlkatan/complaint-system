import { Edit } from "lucide-react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

const CategoryCard = ({
  name,
  department,
  complaints,
  status = "Active",
}: {
  name: string;
  department: string;
  complaints: number;
  status?: string;
}) => (
  <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow mb-3">
    <div className="p-2 sm:p-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left: Category Name and Department */}
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
            {name}
          </h3>
          <p className="text-sm text-gray-500">{department}</p>
        </div>

        {/* Right: Complaints, Status Badge, and Edit Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {complaints} complaints
          </span>

          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
            {status}
          </span>

          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100 text-gray-700"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  </Card>
);

export default CategoryCard;
