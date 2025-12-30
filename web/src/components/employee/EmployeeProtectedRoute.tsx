import { Navigate } from "react-router-dom";
import { useEmployeeAuthStore } from "../../app/store/employee/employeeAuth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function EmployeeProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = "/employee-login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useEmployeeAuthStore();

  // Redirect logic
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If auth is not required but user is authenticated, redirect away from login
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/employee-dashboard" replace />;
  }

  return <>{children}</>;
}
