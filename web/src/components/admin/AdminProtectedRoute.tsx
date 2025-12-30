import { Navigate } from "react-router-dom";
import { useAdminAuthStore } from "../../app/store/admin/adminAuth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AdminProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = "/admin-login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAdminAuthStore();

  // Redirect logic
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If auth is not required but user is authenticated, redirect away from login
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <>{children}</>;
}
