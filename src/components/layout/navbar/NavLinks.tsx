
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Clock, Calendar, Users } from "lucide-react";

const navLinks = [
  { name: "الرئيسية", path: "/", icon: Home },
  { name: "سوق المهارات", path: "/marketplace", icon: ShoppingBag },
  { name: "بنك الوقت", path: "/time-bank", icon: Clock },
  { name: "الفعاليات", path: "/events", icon: Calendar },
  { name: "المجتمع", path: "/community", icon: Users },
];

export function NavLinks() {
  const location = useLocation();
  
  const isActiveLink = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
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
  );
}
