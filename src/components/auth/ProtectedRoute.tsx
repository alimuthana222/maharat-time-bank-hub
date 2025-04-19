
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  admin?: boolean;
}

const ProtectedRoute = ({ children, admin = false }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">جاري التحميل...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // For admin routes, add additional checks here
  // if (admin && !userIsAdmin) {
  //   return <Navigate to="/dashboard" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
