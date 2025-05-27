
import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveContainer({ children, className }: ResponsiveContainerProps) {
  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function ResponsiveGrid({ 
  children, 
  className,
  cols = { default: 1, sm: 2, md: 3, lg: 4 }
}: ResponsiveGridProps) {
  const gridClasses = [
    `grid`,
    `grid-cols-${cols.default || 1}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    `gap-4 sm:gap-6`
  ].filter(Boolean).join(" ");

  return (
    <div className={cn(gridClasses, className)}>
      {children}
    </div>
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileMenu({ isOpen, onClose, children }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-64 bg-background shadow-lg transform transition-transform duration-300 ease-in-out">
        {children}
      </div>
    </div>
  );
}

export function HideOnMobile({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("hidden md:block", className)}>{children}</div>;
}

export function ShowOnMobile({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("block md:hidden", className)}>{children}</div>;
}

export function ResponsiveText({ 
  children, 
  className,
  size = "base"
}: { 
  children: React.ReactNode; 
  className?: string;
  size?: "sm" | "base" | "lg" | "xl";
}) {
  const sizeClasses = {
    sm: "text-sm sm:text-base",
    base: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl",
    xl: "text-xl sm:text-2xl lg:text-3xl"
  };

  return (
    <div className={cn(sizeClasses[size], className)}>
      {children}
    </div>
  );
}
