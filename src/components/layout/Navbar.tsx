
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, UsersRound, Clock, Brain } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const closeMenu = () => {
    setIsMenuOpen(false);
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
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center space-x-2">
            <Button asChild variant="outline">
              <Link to="/login">تسجيل دخول</Link>
            </Button>
            <Button asChild>
              <Link to="/register">تسجيل</Link>
            </Button>
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
                <div className="pt-4 space-y-2">
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/login" onClick={closeMenu}>تسجيل دخول</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/register" onClick={closeMenu}>تسجيل</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
