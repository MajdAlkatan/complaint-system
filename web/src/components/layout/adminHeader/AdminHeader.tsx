// import React from "react";
// import { NavLink, useLocation } from "react-router-dom";

// const AdminHeader = () => {
//   const tabs = [
//     "overview",
//     "analytics",
//     "employee",
//     "department",
//     "category",
//     "logs",
//     "security",
//     "performance",
//     "backup",
//   ];

//   const location = useLocation();
//   const currentTab = location.pathname.split("/").pop() || "overview";

//   return (
//     <div className="bg-green-50/50   px-6 py-4">
//       <div className="flex space-x-2 overflow-x-auto">
//         {tabs.map((tab) => (
//           <NavLink
//             key={tab}
//             to={`/admin-dashboard/${tab}`}
//             className={({ isActive }) =>
//               `px-2 py-1 md:px-6 md:py-2 rounded-full text-xs  md:text-sm font-medium whitespace-nowrap transition-colors ${
//                 isActive || currentTab === tab
//                   ? "bg-primary text-white"
//                   : "bg-white text-gray-700 hover:bg-gray-100"
//               } border border-gray-100 shadow-sm mb-1 hover:shadow-md`
//             }
//           >
//             {/* Capitalize first letter for display */}
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </NavLink>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminHeader;

import { NavLink, useLocation } from "react-router-dom";

const AdminHeader = () => {
  const tabs = [
    "overview",
    "analytics",
    "employee",
    "department",
    "category",
    "logs",
    "security",
    "performance",
    "backup",
  ];

  const location = useLocation();
  const currentTab = location.pathname.split("/").pop() || "overview";

  return (
    <div className="bg-green-50/50 px-3 md:px-6 py-3 md:py-4">
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
        {tabs.map((tab) => (
          <NavLink
            to={`/admin-dashboard/${tab}`}
            key={tab}
            className={`px-3 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              currentTab === tab
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            } border border-gray-100 shadow-sm hover:shadow-md`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
export default AdminHeader;
