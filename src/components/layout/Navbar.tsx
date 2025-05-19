
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { NotificationSystem } from "@/components/notification/NotificationSystem";
import { 
  User,
  Bell,
  LogOut,
  Settings,
  Shield,
  Menu,
  Search,
  X,
  Home,
  Calendar,
  Clock,
  ShoppingBag,
  Users,
  HelpCircle,
  Moon,
  Sun,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function Navbar() {
  const { user, isAdmin, isModerator, isOwner, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 70);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Check for theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  };
  
  const navLinks = [
    { name: "الرئيسية", path: "/", icon: Home },
    { name: "سوق المهارات", path: "/marketplace", icon: ShoppingBag },
    { name: "بنك الوقت", path: "/time-bank", icon: Clock },
    { name: "الفعاليات", path: "/events", icon: Calendar },
    { name: "المجتمع", path: "/community", icon: Users },
  ];
  
  const isActiveLink = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm" 
          : "bg-background border-b"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-bold text-2xl text-primary">مهارات</span>
            </Link>
            
            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`font-medium transition-colors hover:text-primary ${
                    isActiveLink(link.path) ? "text-primary" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <form 
              className="hidden md:flex relative" 
              onSubmit={handleSearch}
            >
              <Input
                type="search"
                placeholder="ابحث عن مهارات، طلاب..."
                className="w-64 pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
            
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="hidden md:flex"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            {/* User Section */}
            {user ? (
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
            ) : (
              <Button asChild>
                <Link to="/auth">تسجيل الدخول</Link>
              </Button>
            )}
            
            {/* Mobile Menu */}
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
                  <form 
                    className="relative mb-6" 
                    onSubmit={(e) => {
                      handleSearch(e);
                      document.querySelector<HTMLButtonElement>('.close-sheet')?.click();
                    }}
                  >
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
                      {theme === "dark" ? (
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
                        onClick={() => {
                          handleLogout();
                          document.querySelector<HTMLButtonElement>('.close-sheet')?.click();
                        }}
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
          </div>
        </div>
      </div>
    </header>
  );
}
