import { Plus } from "lucide-react";
import CategoryCard from "../../components/admin/cards/CategoryCard";
import { Button } from "../../components/ui/button";

const AdminCategoryPage = () => {
  const categories = [
    { name: "Pothole Repair", department: "Public Works", complaints: 234 },
    { name: "Street Lighting", department: "Public Works", complaints: 189 },
    { name: "Garbage Collection", department: "Sanitation", complaints: 456 },
    { name: "Water Supply", department: "Public Health", complaints: 123 },
    { name: "Traffic Signal", department: "Transportation", complaints: 98 },
  ];

  return (
    <div className=" ">
      <div className="  bg-white rounded-xl sm:mx-16 p-2 py-3 sm:p-12 sm:py-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
              Category Management
            </h1>
          </div>
          <Button className=" text-white shadow-sm w-full sm:w-auto">
            <Plus className="w-4 h-4 " />
            Add Category
          </Button>
        </div>

        {/* Category List */}
        <div>
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              name={category.name}
              department={category.department}
              complaints={category.complaints}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default AdminCategoryPage;
