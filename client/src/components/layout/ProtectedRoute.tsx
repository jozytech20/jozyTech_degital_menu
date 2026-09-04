import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: "owner" | "superAdmin";
}

function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.isLoading);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole) {
    return (
      <Navigate
        to={
          user.role === "superAdmin" ? "/dashboard/admin" : "/dashboard/owner"
        }
        replace
      />
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;