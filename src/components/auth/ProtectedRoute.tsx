
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  moderatorOnly?: boolean;
  ownerOnly?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  adminOnly = false,
  moderatorOnly = false,
  ownerOnly = false
}: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, isModerator, isOwner } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check for specific role requirements
  if (ownerOnly && !isOwner()) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  if (moderatorOnly && !isModerator()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
