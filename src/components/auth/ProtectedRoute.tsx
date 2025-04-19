
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  admin?: boolean;
  owner?: boolean;
}

const ProtectedRoute = ({ children, admin = false, owner = false }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">جاري التحميل...</div>;
  }

  if (!user) {
    toast.error("يجب تسجيل الدخول للوصول إلى هذه الصفحة");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // التحقق من صلاحيات المشرف
  if (admin && user.user_metadata?.role !== "admin") {
    toast.error("ليس لديك صلاحية الوصول إلى لوحة الإدارة");
    return <Navigate to="/dashboard" replace />;
  }

  // التحقق من صلاحيات المالك
  if (owner && user.user_metadata?.role !== "owner") {
    toast.error("هذه الصفحة مخصصة لمالك المنصة فقط");
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
