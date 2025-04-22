
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
  const { user, isLoading, isAdmin, isOwner } = useAuth();
  const location = useLocation();
  const [isRoleChecking, setIsRoleChecking] = useState(admin || owner);

  useEffect(() => {
    const checkAccess = async () => {
      if (user) {
        if (admin && !isAdmin()) {
          toast.error("ليس لديك صلاحية الوصول إلى لوحة الإدارة");
        }
        
        if (owner && !isOwner()) {
          toast.error("هذه الصفحة مخصصة لمالك المنصة فقط");
        }
        
        setIsRoleChecking(false);
      }
    };

    if (user && (admin || owner)) {
      checkAccess();
    } else {
      setIsRoleChecking(false);
    }
  }, [user, admin, owner, isAdmin, isOwner]);

  if (isLoading || isRoleChecking) {
    return <div className="flex items-center justify-center h-screen">جاري التحميل...</div>;
  }

  if (!user) {
    toast.error("يجب تسجيل الدخول للوصول إلى هذه الصفحة");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required roles
  if ((admin && !isAdmin()) || (owner && !isOwner())) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
