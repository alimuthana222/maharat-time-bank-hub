
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  admin?: boolean;
  owner?: boolean;
  moderator?: boolean;
}

const ProtectedRoute = ({ children, admin = false, owner = false, moderator = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, isOwner, isModerator } = useAuth();
  const location = useLocation();
  const [isRoleChecking, setIsRoleChecking] = useState(admin || owner || moderator);

  useEffect(() => {
    const checkAccess = async () => {
      if (user) {
        if (admin && !isAdmin()) {
          toast.error("ليس لديك صلاحية الوصول إلى لوحة الإدارة");
        }
        
        if (owner && !isOwner()) {
          toast.error("هذه الصفحة مخصصة لمالك المنصة فقط");
        }
        
        if (moderator && !isModerator()) {
          toast.error("هذه الصفحة مخصصة للمشرفين فقط");
        }
        
        setIsRoleChecking(false);
      }
    };

    if (user && (admin || owner || moderator)) {
      checkAccess();
    } else {
      setIsRoleChecking(false);
    }
  }, [user, admin, owner, moderator, isAdmin, isOwner, isModerator]);

  if (isLoading || isRoleChecking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  if (!user) {
    toast.error("يجب تسجيل الدخول للوصول إلى هذه الصفحة");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has required roles
  if ((admin && !isAdmin()) || (owner && !isOwner()) || (moderator && !isModerator())) {
    return <Navigate to="/dashboard" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
