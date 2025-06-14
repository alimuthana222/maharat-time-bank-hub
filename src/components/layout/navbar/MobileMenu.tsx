
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { 
  Menu,
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

export function MobileMenu() {
  const location = useLocation();
  const { user, isAdmin, isOwner, isModerator } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) => cn(
    "flex items-center gap-3 w-full p-2 text-right rounded-lg transition-colors hover:bg-accent",
    isActive(path) ? "bg-accent text-accent-foreground" : "text-muted-foreground"
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <nav className="flex flex-col space-y-2 mt-6">
          <Link to="/" className={linkClass("/")}>
            <Home className="h-5 w-5" />
            الرئيسية
          </Link>
          
          {user && (
            <>
              <Link to="/dashboard" className={linkClass("/dashboard")}>
                <BarChart3 className="h-5 w-5" />
                لوحة التحكم
              </Link>
              
              <Link to="/marketplace" className={linkClass("/marketplace")}>
                <ShoppingBag className="h-5 w-5" />
                سوق المهارات
              </Link>
              
              <Link to="/timebank" className={linkClass("/timebank")}>
                <Clock className="h-5 w-5" />
                بنك الوقت
              </Link>

              <Link to="/bookings" className={linkClass("/bookings")}>
                <Calendar className="h-5 w-5" />
                الحجوزات
              </Link>
              
              <Link to="/messages" className={linkClass("/messages")}>
                <MessageCircle className="h-5 w-5" />
                الرسائل
              </Link>
              
              <Link to="/search" className={linkClass("/search")}>
                <Search className="h-5 w-5" />
                البحث
              </Link>

              <Link to="/profile" className={linkClass("/profile")}>
                <User className="h-5 w-5" />
                ملفي الشخصي
              </Link>
            </>
          )}
          
          <Link to="/community" className={linkClass("/community")}>
            <Users className="h-5 w-5" />
            المجتمع
          </Link>
          
          <Link to="/events" className={linkClass("/events")}>
            <PartyPopper className="h-5 w-5" />
            الفعاليات
          </Link>

          {/* Admin Links */}
          {isOwner() && (
            <Link to="/owner" className={linkClass("/owner")}>
              <Crown className="h-5 w-5" />
              لوحة المالك
            </Link>
          )}
          
          {isAdmin() && !isOwner() && (
            <Link to="/admin" className={linkClass("/admin")}>
              <Shield className="h-5 w-5" />
              لوحة الإدارة
            </Link>
          )}
          
          {isModerator() && !isAdmin() && (
            <Link to="/moderator" className={linkClass("/moderator")}>
              <UserCheck className="h-5 w-5" />
              لوحة المشرف
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
