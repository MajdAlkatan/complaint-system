// import { Bell, LogOut, Search, User, X } from "lucide-react";
// import { useState } from "react";
// import AdminHeader from "../adminHeader/AdminHeader";
// import { Outlet } from "react-router-dom";

// const AdminLayout = () => {
//   const [searchValue, setSearchValue] = useState("largeoffice Main Street");

//   return (
//     <>
//       <div className="sticky top-0  z-20 bg-white">
//         <header
//           className="  border-b-3 border-gray-200 px-6 py-1 shadow-lg"
//           dir="rtl"
//         >
//           <div className="flex items-center justify-between">
//             {/* Logo and Title */}
//             <div className="flex items-center space-x-1 border-l pl-8 border-gray-400">
//               <img src="/assets/logosyr3@3x 1.svg" className="w-16 h-16 " />
//               <div className="text-right">
//                 <div className="text-sm font-semibold text-gray-900">
//                   Admin Portal
//                 </div>
//                 <div className="text-xs text-gray-500">بوابة المشرف العام</div>
//               </div>
//             </div>

//             {/* Search Bar */}
//             <div className="flex-1 max-w-md mx-8">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 " />
//                 <input
//                   type="text"
//                   value={searchValue}
//                   onChange={(e) => setSearchValue(e.target.value)}
//                   className="w-full pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-sm
//               focus:outline-none! focus:ring-1! focus:ring-primary focus:shadow-lg"
//                 />
//                 {searchValue && (
//                   <button
//                     onClick={() => setSearchValue("")}
//                     className="absolute right-3 top-1/2 -translate-y-1/2"
//                   >
//                     <X className="w-4 h-4 text-gray-400" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex items-center space-x-2">
//               <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                 <LogOut className="w-5 h-5 text-gray-700" />
//               </button>
//               <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                 <User className="w-5 h-5 text-gray-700" />
//               </button>
//               <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                 <Bell className="w-5 h-5 text-gray-700" />
//               </button>
//             </div>
//           </div>
//         </header>
//         <AdminHeader />
//       </div>
//       <main className="bg-green-50/50 py-8 md:py-10 px-2 md:px-4">
//         <Outlet />
//       </main>
//     </>
//   );
// };

// export default AdminLayout;

import { Bell, LogOut, Search, User, X } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../adminHeader/AdminHeader";

const AdminLayout = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-20 bg-white">
        <header
          className="border-b-2 border-gray-200 px-3 md:px-6 py-2 md:py-3 shadow-lg"
          dir="rtl"
        >
          <div className="flex items-center justify-between gap-2">
            {/* Logo and Title - Hidden text on mobile */}
            <div className="flex items-center space-x-1 border-l pl-3 md:pl-8 border-gray-400">
              <img
                src="/assets/logosyr3@3x 1.svg"
                className="w-10 h-10 md:w-16 md:h-16"
                alt="Logo"
              />
              <div className="text-right hidden sm:block">
                <div className="text-xs md:text-sm font-semibold text-gray-900">
                  Admin Portal
                </div>
                <div className="text-xs text-gray-500">بوابة المشرف العام</div>
              </div>
            </div>

            {/* Search Bar - Responsive */}
            <div
              className={`flex-1 max-w-md transition-all ${
                isSearchExpanded ? "mx-2" : "mx-2 md:mx-8"
              }`}
            >
              <div className="relative">
                <Search className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setIsSearchExpanded(true)}
                  onBlur={() => setIsSearchExpanded(false)}
                  placeholder="Search..."
                  className="w-full pl-8 md:pl-10 pr-8 md:pr-10 py-1.5 md:py-2 bg-white border border-gray-300 rounded-lg text-xs md:text-sm 
                    focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:shadow-lg"
                />
                {searchValue && (
                  <button
                    onClick={() => setSearchValue("")}
                    className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Actions - Responsive sizing */}
            <div className="flex items-center space-x-1 md:space-x-2">
              <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
              </button>
              <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block">
                <User className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
              </button>
              <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <LogOut className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </header>
        <AdminHeader />
      </div>

      <main className="bg-green-50/50 py-8 md:py-10 px-2 md:px-4">
        <Outlet />
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default AdminLayout;
