
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  admin?: boolean;
  owner?: boolean;
}

const ProtectedRoute = ({ children, admin = false, owner = false }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const { checkUserRole } = useAuth();

  useEffect(() => {
    const checkRoles = async () => {
      if (user) {
        if (admin) {
          const isAdmin = await checkUserRole('admin');
          const isOwner = await checkUserRole('owner');
          if (!isAdmin && !isOwner) {
            toast.error("ليس لديك صلاحية الوصول إلى لوحة الإدارة");
          }
        }
        
        if (owner) {
          const isOwner = await checkUserRole('owner');
          if (!isOwner) {
            toast.error("هذه الصفحة مخصصة لمالك المنصة فقط");
          }
        }
        setIsRoleLoading(false);
      }
    };

    checkRoles();
  }, [user, admin, owner, checkUserRole]);

  if (isLoading || isRoleLoading) {
    return <div className="flex items-center justify-center h-screen">جاري التحميل...</div>;
  }

  if (!user) {
    toast.error("يجب تسجيل الدخول للوصول إلى هذه الصفحة");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
