// import { Card, CardContent } from "../../components/ui/card";
// import { activities, departments } from "../../data/data";

// import { Clock, Info, CheckCircle2, FileText, TrendingUp } from "lucide-react";
// const AdminOverviewPage = () => {
//   return (
//     <div className=" bg-green-50/50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//             {/* Left Column */}
//             <div className="space-y-6 col-span-3">
//               {/* Active and New Cases Row */}
//               <div className="grid grid-cols-2 gap-4">
//                 {/* Active Cases Card */}
//                 <Card className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ">
//                   <CardContent className="">
//                     <div className="flex items-start justify-between mb-8">
//                       <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 shadow-sm">
//                         Active
//                       </span>
//                       <div className="p-2.5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm">
//                         <Clock className="w-4 h-4 text-orange-600" />
//                       </div>
//                     </div>

//                     <div className="space-y-1" dir="rtl">
//                       <div className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                         1
//                       </div>
//                       <div className="text-sm text-gray-500 font-medium">
//                         In progress
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* New Cases Card */}
//                 <Card className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
//                   <CardContent className="">
//                     <div className="flex items-start justify-between mb-8">
//                       <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 shadow-sm">
//                         New
//                       </span>
//                       <div className="p-2.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm">
//                         <Info className="w-4 h-4 text-blue-600" />
//                       </div>
//                     </div>

//                     <div className="space-y-1" dir="rtl">
//                       <div className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                         0
//                       </div>
//                       <div className="text-sm text-gray-500 font-medium">
//                         Awaiting assignment
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Resolution Rate Card */}
//               <Card className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-0 shadow-sm hover:shadow-lg transition-all duration-300">
//                 <CardContent className="p-2 px-4">
//                   <div className="grid grid-cols-2 gap-8 items-center">
//                     <div className="space-y-2">
//                       <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
//                         Resolution rate
//                       </div>
//                       <div className="text-2xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
//                         0%
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-4">
//                       <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-sm">
//                         <CheckCircle2 className="w-6 h-6 text-green-600" />
//                       </div>
//                       <div>
//                         <div className="text-2xl font-bold text-gray-900">
//                           0
//                         </div>
//                         <div className="text-sm text-gray-600 font-medium ">
//                           Successfully Resolved
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Right Column - My Active Cases Card */}
//             <Card
//               dir="rtl"
//               className="relative overflow-hidden col-span-2 bg-primary/90  border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] "
//             >
//               <CardContent className="p-3 h-full flex flex-col ">
//                 <div className="flex items-start justify-start gap-3 ">
//                   <div className="p-3 bg-white/20  rounded-2xl shadow-lg">
//                     <FileText className="w-6 h-6 text-white" />
//                   </div>{" "}
//                   <div>
//                     {" "}
//                     <div className="text-white text-base font-bold  tracking-wide">
//                       My Active Cases
//                     </div>
//                     <div className="text-white/90 text-sm font-medium">
//                       Complaints locked to you
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex-1 flex flex-col justify-center -mt-20">
//                   <div className="text-3xl font-bold text-white drop-shadow-lg">
//                     1
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className="text-white text-base font-semibold">
//                       Ready for your attention
//                     </span>
//                     <TrendingUp className="w-5 h-5 text-white animate-pulse" />
//                   </div>
//                 </div>

//                 {/* Decorative elements */}
//                 <div className="absolute -top-9 -right-7 w-20 h-20 bg-primary/20 rounded-full  "></div>
//                 <div className="absolute -bottom-7 -left-8 w-18 h-18 bg-primary/20 rounded-full "></div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Department Performance */}
//         <div className="mt-10 bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-10">
//           <h2 className="text-lg font-bold text-gray-900 mb-4">
//             Department Performance
//           </h2>

//           <div className="space-y-4">
//             {departments.map((dept, index) => (
//               <div key={index}>
//                 <div className="flex items-center justify-between mb-1.5">
//                   <span className="text-sm font-medium text-gray-900">
//                     {dept.name}
//                   </span>
//                   <div className="flex items-center space-x-3">
//                     <span className="text-sm font-bold text-gray-900">
//                       {dept.percentage}%
//                     </span>
//                     <span className="text-xs text-gray-500">
//                       {dept.resolved} / {dept.total}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Progress Bar */}
//                 <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                   <div
//                     className={`h-full ${dept.color} rounded-full transition-all duration-500`}
//                     style={{ width: `${dept.percentage}%` }}
//                   ></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <h2 className="text-lg font-bold text-gray-900 mb-4">
//             Recent Activity
//           </h2>

//           <div className="space-y-3">
//             {activities.map((activity, index) => (
//               <div
//                 key={index}
//                 className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0"
//               >
//                 <div className="flex items-start space-x-2.5">
//                   {/* Icon */}
//                   <div className={`mt-0.5 ${activity.iconColor}`}>
//                     <activity.icon className="w-3.5 h-3.5" />
//                   </div>

//                   {/* Content */}
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">
//                       {activity.action}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-0.5">
//                       {activity.user}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Time */}
//                 <span className="text-xs text-gray-400 whitespace-nowrap">
//                   {activity.time}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminOverviewPage;

import { Card, CardContent } from "../../components/ui/card";
import { activities, departments } from "../../data/data";

import { Clock, Info, CheckCircle2, FileText, TrendingUp } from "lucide-react";

const AdminOverviewPage = () => {
  return (
    <div className="bg-green-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6 lg:col-span-3">
              {/* Active and New Cases Row */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Active Cases Card */}
                <Card className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-2 py-0 sm:p-4 sm:py-3">
                    <div className="flex items-start justify-between mb-4 sm:mb-8">
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 shadow-sm">
                        Active
                      </span>
                      <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
                      </div>
                    </div>

                    <div className="space-y-1" dir="rtl">
                      <div className="text-lg sm:text-xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        1
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium">
                        In progress
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* New Cases Card */}
                <Card className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-2 py-0 sm:p-4 sm:py-3">
                    <div className="flex items-start justify-between mb-4 sm:mb-8">
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 shadow-sm">
                        New
                      </span>
                      <div className="p-2 sm:p-2.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm">
                        <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                      </div>
                    </div>

                    <div className="space-y-1" dir="rtl">
                      <div className="text-lg sm:text-xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        0
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium">
                        Awaiting assignment
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resolution Rate Card */}
              <Card className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 items-center">
                    <div className="space-y-2">
                      <div className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">
                        Resolution rate
                      </div>
                      <div className="text-lg sm:text-xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        0%
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2.5 sm:p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-sm">
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl font-bold text-gray-900">
                          0
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 font-medium">
                          Successfully Resolved
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - My Active Cases Card */}
            <Card
              dir="rtl"
              className="relative overflow-hidden lg:col-span-2 bg-primary/90 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <CardContent className="p-4 sm:p-6 h-full flex flex-col min-h-[200px] sm:min-h-[250px]">
                <div className="flex items-start justify-start gap-3">
                  <div className="p-2.5 sm:p-3 bg-white/20 rounded-2xl shadow-lg">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base text-white font-bold tracking-wide">
                      My Active Cases
                    </div>
                    <div className="text-xs sm:text-sm text-white/90 font-medium">
                      Complaints locked to you
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center mt-4 sm:-mt-20">
                  <div className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                    1
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-sm sm:text-base text-white font-semibold">
                      Ready for your attention
                    </span>
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-9 -right-7 w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-full"></div>
                <div className="absolute -bottom-7 -left-8 w-14 h-14 sm:w-18 sm:h-18 bg-primary/20 rounded-full"></div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Department Performance */}
        <div className="mt-6 sm:mt-10 bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 sm:mb-10">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
            Department Performance
          </h2>

          <div className="space-y-4">
            {departments.map((dept, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                    {dept.name}
                  </span>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      {dept.percentage}%
                    </span>
                    <span className="text-xs text-gray-500">
                      {dept.resolved} / {dept.total}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${dept.color} rounded-full transition-all duration-500`}
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>

          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-start space-x-2.5">
                  {/* Icon */}
                  <div className={`mt-0.5 ${activity.iconColor}`}>
                    <activity.icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {activity.user}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
