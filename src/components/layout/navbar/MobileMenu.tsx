
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/AuthProvider";
import { getTheme, setTheme, type Theme } from "@/lib/theme-utils";
import { 
  Menu,
  Search,
  Home,
  Calendar,
  Clock,
  ShoppingBag,
  Users,
  HelpCircle,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function MobileMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTheme, setCurrentTheme] = useState<Theme>("light");

  const navLinks = [
    { name: "الرئيسية", path: "/", icon: Home },
    { name: "سوق المهارات", path: "/marketplace", icon: ShoppingBag },
    { name: "بنك الوقت", path: "/time-bank", icon: Clock },
    { name: "الفعاليات", path: "/events", icon: Calendar },
    { name: "المجتمع", path: "/community", icon: Users },
  ];

  useEffect(() => {
    const theme = getTheme();
    setCurrentTheme(theme);
  }, []);

  const isActiveLink = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      document.querySelector<HTMLButtonElement>('.close-sheet')?.click();
    }
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    document.querySelector<HTMLButtonElement>('.close-sheet')?.click();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>منصة مهارات</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          {/* Mobile Search */}
          <form className="relative mb-6" onSubmit={handleSearch}>
            <Input
              type="search"
              placeholder="ابحث عن مهارات، طلاب..."
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>
          
          <nav className="space-y-4">
            {navLinks.map((link) => (
              <SheetClose asChild key={link.path}>
                <Link 
                  to={link.path} 
                  className={`flex items-center gap-3 px-2 py-2 rounded-md transition-colors ${
                    isActiveLink(link.path) 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted"
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.name}</span>
                </Link>
              </SheetClose>
            ))}
            
            <SheetClose asChild>
              <Link 
                to="/help" 
                className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted"
              >
                <HelpCircle className="h-5 w-5" />
                <span>مركز المساعدة</span>
              </Link>
            </SheetClose>
          </nav>
          
          <div className="mt-6 pt-6 border-t">
            {/* Theme Toggle */}
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={toggleTheme}
            >
              {currentTheme === "dark" ? (
                <>
                  <Sun className="mr-2 h-5 w-5" />
                  الوضع الفاتح
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-5 w-5" />
                  الوضع الداكن
                </>
              )}
            </Button>
            
            {/* Login/Logout */}
            {user ? (
              <Button 
                variant="outline" 
                className="w-full mt-4 justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                تسجيل الخروج
              </Button>
            ) : (
              <SheetClose asChild>
                <Button className="w-full mt-4" asChild>
                  <Link to="/auth">تسجيل الدخول</Link>
                </Button>
              </SheetClose>
            )}
          </div>
        </div>
        <SheetClose className="hidden close-sheet" />
      </SheetContent>
    </Sheet>
  );
}
