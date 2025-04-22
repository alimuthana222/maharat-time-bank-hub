
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, UsersRound, Clock, MessageSquare, User, LogOut, Shield, Star } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, isAdmin, isOwner, isModerator } = useAuth();
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" to="/">
            <span className="hidden font-bold sm:inline-block text-xl">مهارات</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
              to="/timebank"
            >
              <Clock size={18} />
              <span>بنك الوقت</span>
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
              to="/marketplace"
            >
              <UsersRound size={18} />
              <span>السوق</span>
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
              to="/ads"
            >
              <Star size={18} />
              <span>الإعلانات</span>
            </Link>
            {user && (
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
                to="/messages"
              >
                <MessageSquare size={18} />
                <span>الرسائل</span>
              </Link>
            )}
            {user && (
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
                to="/community"
              >
                <UsersRound size={18} />
                <span>المجتمع</span>
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="flex items-center gap-3">
                {user.email && (
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      لوحة التحكم
                    </Button>
                  </Link>
                )}
                {isModerator() && !isAdmin() && (
                  <Link to="/moderator">
                    <Button variant="outline" size="sm">
                      <Shield className="ml-1 h-4 w-4" />
                      لوحة المشرف
                    </Button>
                  </Link>
                )}
                {isAdmin() && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      <Shield className="ml-1 h-4 w-4" />
                      لوحة الإدارة
                    </Button>
                  </Link>
                )}
                {isOwner() && (
                  <Link to="/owner">
                    <Button variant="outline" size="sm">
                      <Shield className="ml-1 h-4 w-4" />
                      لوحة المالك
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {getInitials(user.user_metadata?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="ml-2 h-4 w-4" />
                        <span>الملف الشخصي</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <User className="ml-2 h-4 w-4" />
                        <span>لوحة التحكم</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="ml-2 h-4 w-4" />
                      <span>تسجيل خروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link to="/login">تسجيل دخول</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">تسجيل</Link>
                </Button>
              </>
            )}
          </nav>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  مهارات
                </SheetTitle>
                <SheetDescription>
                  منصة تبادل المهارات والخدمات للطلاب
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-6">
                <Link
                  className="text-foreground/80 hover:text-foreground flex items-center gap-2 py-2"
                  to="/timebank"
                  onClick={closeMenu}
                >
                  <Clock size={18} />
                  <span>بنك الوقت</span>
                </Link>
                <Link
                  className="text-foreground/80 hover:text-foreground flex items-center gap-2 py-2"
                  to="/marketplace"
                  onClick={closeMenu}
                >
                  <UsersRound size={18} />
                  <span>السوق</span>
                </Link>
                <Link
                  className="text-foreground/80 hover:text-foreground flex items-center gap-2 py-2"
                  to="/ads"
                  onClick={closeMenu}
                >
                  <Star size={18} />
                  <span>الإعلانات</span>
                </Link>
                {user && (
                  <Link
                    className="text-foreground/80 hover:text-foreground flex items-center gap-2 py-2"
                    to="/messages"
                    onClick={closeMenu}
                  >
                    <MessageSquare size={18} />
                    <span>الرسائل</span>
                  </Link>
                )}
                {user && (
                  <Link
                    className="text-foreground/80 hover:text-foreground flex items-center gap-2 py-2"
                    to="/community"
                    onClick={closeMenu}
                  >
                    <UsersRound size={18} />
                    <span>المجتمع</span>
                  </Link>
                )}
                <div className="pt-4 space-y-2">
                  {user ? (
                    <>
                      <Button asChild className="w-full" variant="outline">
                        <Link to="/profile" onClick={closeMenu}>الملف الشخصي</Link>
                      </Button>
                      <Button asChild className="w-full" variant="outline">
                        <Link to="/dashboard" onClick={closeMenu}>لوحة التحكم</Link>
                      </Button>
                      {isModerator() && !isAdmin() && (
                        <Button asChild className="w-full" variant="outline">
                          <Link to="/moderator" onClick={closeMenu}>
                            <Shield className="ml-1 h-4 w-4" />
                            لوحة المشرف
                          </Link>
                        </Button>
                      )}
                      {isAdmin() && (
                        <Button asChild className="w-full" variant="outline">
                          <Link to="/admin" onClick={closeMenu}>
                            <Shield className="ml-1 h-4 w-4" />
                            لوحة الإدارة
                          </Link>
                        </Button>
                      )}
                      {isOwner() && (
                        <Button asChild className="w-full" variant="outline">
                          <Link to="/owner" onClick={closeMenu}>
                            <Shield className="ml-1 h-4 w-4" />
                            لوحة المالك
                          </Link>
                        </Button>
                      )}
                      <Button className="w-full" onClick={() => { signOut(); closeMenu(); }}>
                        تسجيل خروج
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild className="w-full" variant="outline">
                        <Link to="/login" onClick={closeMenu}>تسجيل دخول</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link to="/register" onClick={closeMenu}>تسجيل</Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
