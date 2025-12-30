import { Route, Routes } from "react-router-dom";
import AdminLoginPage from "../pages/admin/AdminLoginPage";

import AdminLayout from "../components/layout/adminLayout/AdminLayout";
import IntroPage from "../pages/IntroPage";
import PageNotFound from "../pages/PageNotFound";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeLoginPage from "../pages/employee/EmployeeLoginPage";

import AdminOverviewPage from "../pages/admin/AdminOverviewPage";
import AdminAnalyticsPage from "../pages/admin/AdminAnalyticsPage";
import AdminEmployeePage from "../pages/admin/AdminEmployeePage";
import AdminDepartmentPage from "../pages/admin/AdminDepartmentPage";
import AdminCategoryPage from "../pages/admin/AdminCategoryPage";
import AdminLogsPage from "../pages/admin/AdminLogsPage";
import AdminSecurityPage from "../pages/admin/AdminSecurityPage";
import AdminPerformancePage from "../pages/admin/AdminPerformancePage";
import AdminBackupPage from "../pages/admin/AdminBackupPage";

import EmployeeProtectedRoute from "../components/employee/EmployeeProtectedRoute";
import AdminProtectedRoute from "../components/admin/AdminProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="*" element={<PageNotFound />} />

      <Route
        path="/admin-login"
        element={
          <AdminProtectedRoute requireAuth={false}>
            <AdminLoginPage />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="overview" element={<AdminOverviewPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="employee" element={<AdminEmployeePage />} />
        <Route path="department" element={<AdminDepartmentPage />} />
        <Route path="category" element={<AdminCategoryPage />} />
        <Route path="logs" element={<AdminLogsPage />} />
        <Route path="security" element={<AdminSecurityPage />} />
        <Route path="performance" element={<AdminPerformancePage />} />
        <Route path="backup" element={<AdminBackupPage />} />
      </Route>

      <Route
        path="/employee-login"
        element={
          <EmployeeProtectedRoute requireAuth={false}>
            <EmployeeLoginPage />
          </EmployeeProtectedRoute>
        }
      />
      <Route
        path="/employee-dashboard"
        element={
          <EmployeeProtectedRoute>
            <EmployeeDashboard />
          </EmployeeProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
