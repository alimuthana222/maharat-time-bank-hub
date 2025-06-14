
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BarChart3, 
  Clock, 
  ShoppingBag, 
  MessageCircle, 
  User, 
  Search,
  Calendar,
  Users,
  PartyPopper,
  Shield,
  Crown,
  UserCheck
} from "lucide-react";

export function NavLinks() {
  const location = useLocation();
  const { user, isAdmin, isOwner, isModerator } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) => cn(
    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
    isActive(path) ? "text-primary" : "text-muted-foreground"
  );

  return (
    <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
      <Link to="/" className={linkClass("/")}>
        <Home className="h-4 w-4" />
        الرئيسية
      </Link>
      
      {user && (
        <>
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            <BarChart3 className="h-4 w-4" />
            لوحة التحكم
          </Link>
          
          <Link to="/marketplace" className={linkClass("/marketplace")}>
            <ShoppingBag className="h-4 w-4" />
            سوق المهارات
          </Link>
          
          <Link to="/timebank" className={linkClass("/timebank")}>
            <Clock className="h-4 w-4" />
            بنك الوقت
          </Link>

          <Link to="/bookings" className={linkClass("/bookings")}>
            <Calendar className="h-4 w-4" />
            الحجوزات
          </Link>
          
          <Link to="/messages" className={linkClass("/messages")}>
            <MessageCircle className="h-4 w-4" />
            الرسائل
          </Link>
          
          <Link to="/search" className={linkClass("/search")}>
            <Search className="h-4 w-4" />
            البحث
          </Link>
        </>
      )}
      
      <Link to="/community" className={linkClass("/community")}>
        <Users className="h-4 w-4" />
        المجتمع
      </Link>
      
      <Link to="/events" className={linkClass("/events")}>
        <PartyPopper className="h-4 w-4" />
        الفعاليات
      </Link>

      {/* Admin Links */}
      {isOwner() && (
        <Link to="/owner" className={linkClass("/owner")}>
          <Crown className="h-4 w-4" />
          لوحة المالك
        </Link>
      )}
      
      {isAdmin() && !isOwner() && (
        <Link to="/admin" className={linkClass("/admin")}>
          <Shield className="h-4 w-4" />
          لوحة الإدارة
        </Link>
      )}
      
      {isModerator() && !isAdmin() && (
        <Link to="/moderator" className={linkClass("/moderator")}>
          <UserCheck className="h-4 w-4" />
          لوحة المشرف
        </Link>
      )}
    </nav>
  );
}
