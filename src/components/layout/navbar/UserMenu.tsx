
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { NotificationSystem } from "@/components/notification/NotificationSystem";
import { 
  User,
  Bell,
  LogOut,
  Settings,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";

export function UserMenu() {
  const { user, isAdmin, isModerator, isOwner, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  if (!user) {
    return (
      <Button asChild>
        <Link to="/auth">تسجيل الدخول</Link>
      </Button>
    );
  }

  return (
    <>
      <NotificationSystem />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.user_metadata.avatar_url} />
              <AvatarFallback>
                {getInitials(user.user_metadata.full_name || user.user_metadata.username || user.email || "")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.user_metadata.full_name || user.user_metadata.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={`/profile/${user.id}`}>
              <User className="mr-2 h-4 w-4" />
              <span>الملف الشخصي</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard">
              <Settings className="mr-2 h-4 w-4" />
              <span>لوحة التحكم</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/messages">
              <Bell className="mr-2 h-4 w-4" />
              <span>الرسائل</span>
            </Link>
          </DropdownMenuItem>
          
          {/* Admin/Moderator links */}
          {isModerator() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/moderator">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>لوحة المشرف</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
          
          {isAdmin() && (
            <DropdownMenuItem asChild>
              <Link to="/admin">
                <Shield className="mr-2 h-4 w-4" />
                <span>لوحة الإدارة</span>
              </Link>
            </DropdownMenuItem>
          )}
          
          {isOwner() && (
            <DropdownMenuItem asChild>
              <Link to="/owner">
                <Shield className="mr-2 h-4 w-4" />
                <span>لوحة المالك</span>
              </Link>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>تسجيل الخروج</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
