
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

interface NotificationBadgeProps {
  count: number;
  variant?: "default" | "destructive" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
}

export function NotificationBadge({ 
  count, 
  variant = "destructive", 
  size = "sm" 
}: NotificationBadgeProps) {
  if (count === 0) return null;

  const sizeClasses = {
    sm: "h-5 w-5 text-xs",
    md: "h-6 w-6 text-sm",
    lg: "h-7 w-7 text-base"
  };

  return (
    <Badge 
      variant={variant}
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        flex items-center justify-center 
        absolute -top-1 -right-1 
        min-w-0 p-0
        animate-pulse
      `}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}
