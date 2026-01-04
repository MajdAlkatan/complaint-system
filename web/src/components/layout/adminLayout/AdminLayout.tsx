// import { Bell, LogOut, Search, User, X } from "lucide-react";
// import { useState } from "react";
// import { Outlet } from "react-router-dom";
// import AdminHeader from "../adminHeader/AdminHeader";
// import { Button } from "../../ui/button";
// import { useAdminAuthStore } from "../../../app/store/admin/adminAuth.store";

// const AdminLayout = () => {
//   const [searchValue, setSearchValue] = useState("");
//   const [isSearchExpanded, setIsSearchExpanded] = useState(false);
//   const { logout } = useAdminAuthStore();
//   return (
//     <>
//       <div className="sticky top-0 z-20 bg-white">
//         <header
//           className="border-b-2 border-gray-200 px-3 md:px-6 py-2 md:py-3 shadow-lg"
//           dir="rtl"
//         >
//           <div className="flex items-center justify-between gap-2">
//             {/* Logo and Title - Hidden text on mobile */}
//             <div className="flex items-center space-x-1 border-l pl-3 md:pl-8 border-gray-400">
//               <img
//                 src="/assets/logosyr3@3x 1.svg"
//                 className="w-10 h-10 md:w-16 md:h-16"
//                 alt="Logo"
//               />
//               <div className="text-right hidden sm:block">
//                 <div className="text-xs md:text-sm font-semibold text-gray-900">
//                   Admin Portal
//                 </div>
//                 <div className="text-xs text-gray-500">بوابة المشرف العام</div>
//               </div>
//             </div>

//             {/* Search Bar - Responsive */}
//             <div
//               className={`flex-1 max-w-md transition-all ${
//                 isSearchExpanded ? "mx-2" : "mx-2 md:mx-8"
//               }`}
//             >
//               <div className="relative">
//                 <Search className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   value={searchValue}
//                   onChange={(e) => setSearchValue(e.target.value)}
//                   onFocus={() => setIsSearchExpanded(true)}
//                   onBlur={() => setIsSearchExpanded(false)}
//                   placeholder="Search..."
//                   className="w-full pl-8 md:pl-10 pr-8 md:pr-10 py-1.5 md:py-2 bg-white border border-gray-300 rounded-lg text-xs md:text-sm
//                     focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:shadow-lg"
//                 />
//                 {searchValue && (
//                   <button
//                     onClick={() => setSearchValue("")}
//                     className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2"
//                   >
//                     <X className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Actions - Responsive sizing */}
//             <div className="flex items-center space-x-1 md:space-x-2">
//               <Button variant="outline">
//                 <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
//               </Button>
//               <Button variant={"outline"}>
//                 <User className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
//               </Button>
//               <Button variant={"outline"} onClick={logout}>
//                 <LogOut className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
//               </Button>
//             </div>
//           </div>
//         </header>
//         <AdminHeader />
//       </div>

//       <main className="bg-green-50/50 py-8 md:py-10 px-2 md:px-4">
//         <Outlet />
//       </main>

//       <style>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </>
//   );
// };

// export default AdminLayout;

import {
  AlertCircle,
  BarChart,
  Bell,
  Calendar,
  CheckCircle,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  Mail,
  Menu,
  Section,
  SectionIcon,
  Settings,
  User,
  User2Icon,
  X,
} from "lucide-react";
import { FcDepartment } from "react-icons/fc";

import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { GrUserWorker } from "react-icons/gr";

import { cn } from "../../../lib/utils";
import { useAdminAuthStore } from "../../../app/store/admin/adminAuth.store";

// Define TypeScript interfaces
interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: string;
}

const AdminLayout = () => {
  const { isAuthenticated, admin, logout } = useAdminAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin-login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Fetch notifications (mock data for now)
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: "New Complaint Assigned",
        description: "Complaint #CMP-2024-001 has been assigned to you",
        time: "2 hours ago",
        read: false,
        type: "assignment",
      },
      {
        id: 2,
        title: "Status Update Required",
        description: "Complaint #CMP-2024-002 requires your attention",
        time: "1 day ago",
        read: false,
        type: "reminder",
      },
      {
        id: 3,
        title: "Weekly Report Ready",
        description: "Your weekly performance report is available",
        time: "2 days ago",
        read: true,
        type: "report",
      },
      {
        id: 4,
        title: "System Maintenance",
        description: "Scheduled maintenance on Saturday, 10 PM - 2 AM",
        time: "3 days ago",
        read: true,
        type: "system",
      },
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.read).length);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const navItems = [
    { path: "/admin-dashboard", label: "Dashboard", icon: Home },
    {
      path: "/admin-dashboard/complaints",
      label: "Complaints",
      icon: FileText,
    },
    { path: "/admin-dashboard/reports", label: "Reports", icon: BarChart },
    {
      path: "/admin-dashboard/citizens",
      label: "Citizens",
      icon: User2Icon,
    },
    {
      path: "/admin-dashboard/employees",
      label: "Employees",
      icon: GrUserWorker,
    },
    {
      path: "/admin-dashboard/departments",
      label: "Departments",
      icon: FcDepartment,
    },
    { path: "/admin-dashboard/settings", label: "Settings", icon: Settings },
  ];

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading admin data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <h1 className="text-lg font-semibold">Admin Portal</h1>
        </div>
        <div className="flex items-center space-x-2">
          <NotificationsDropdown
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={markNotificationAsRead}
            onMarkAllAsRead={markAllAsRead}
          />
          <ProfileDropdown
            admin={admin}
            onLogout={handleLogout}
            navigate={navigate}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64  bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ",
          sidebarOpen ? "" : "hidden"
        )}
      >
        {/* Logo */}
        <div className="py-5 px-1 border-b">
          <div className="flex items-center space-x-3">
            <img src="/logo.svg" className="w-14 h-14" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
              <p className="text-sm text-gray-500">Complaint Management</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage />
              <AvatarFallback className="bg-primary text-white">
                {admin.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900 truncate">
                {admin.username}
              </h2>
              <p className="text-sm text-gray-600 truncate">{admin.position}</p>
              <p className="text-xs text-gray-500 mt-1">ID: {admin.admin_id}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              <span className="truncate">{admin.email}</span>
            </div>
            <div className="mt-2 flex items-center"></div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left h-auto py-3 px-4 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <Icon className="mr-3 h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`${sidebarOpen ? "lg:ml-64" : "lg:ml-0"} ${cn(
          " min-h-screen transition-all duration-300"
        )}`}
      >
        {/* Top Header */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-800">
              {navItems.find((item) => location.pathname.startsWith(item.path))
                ?.label || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationsDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={markNotificationAsRead}
              onMarkAllAsRead={markAllAsRead}
            />

            <ProfileDropdown
              admin={admin}
              onLogout={handleLogout}
              navigate={navigate}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Notifications Dropdown Component
interface NotificationsDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const [open, setOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "reminder":
        return <Bell className="h-4 w-4 text-amber-500" />;
      case "report":
        return <BarChart className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs h-auto p-0 hover:bg-transparent"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "py-3 px-4 cursor-pointer hover:bg-gray-50",
                  !notification.read && "bg-blue-50"
                )}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.description}
                    </p>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No notifications</p>
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-center text-primary hover:text-primary/80 cursor-pointer"
          onClick={() => {
            // Navigate to notifications page
            console.log("View all notifications");
          }}
        >
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Profile Dropdown Component
interface ProfileDropdownProps {
  admin: any;
  onLogout: () => void;
  navigate: (path: string) => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  admin,
  onLogout,
  navigate,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage />
            <AvatarFallback className="bg-primary text-white">
              {admin.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-gray-900">{admin.username}</p>
            <p className="text-sm text-gray-500 truncate">{admin.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/admin/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminLayout;
