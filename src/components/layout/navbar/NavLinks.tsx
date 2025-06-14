
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "الرئيسية" },
  { href: "/community", label: "المجتمع" },
  { href: "/events", label: "الفعاليات" },
  { href: "/marketplace", label: "السوق" },
  { href: "/timebank", label: "بنك الوقت" },
];

interface NavLinksProps {
  className?: string;
  mobile?: boolean;
  onItemClick?: () => void;
}

export function NavLinks({ className, mobile = false, onItemClick }: NavLinksProps) {
  const location = useLocation();

  return (
    <nav className={cn("flex gap-6", mobile && "flex-col gap-4", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          onClick={onItemClick}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            location.pathname === item.href 
              ? "text-primary border-b-2 border-primary pb-1" 
              : "text-muted-foreground",
            mobile && "text-base py-2"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
