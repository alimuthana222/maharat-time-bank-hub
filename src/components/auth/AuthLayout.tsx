
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
}

export function AuthLayout({ children, title, subtitle, showBackButton = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {showBackButton && (
            <div className="mb-6">
              <Button variant="ghost" asChild className="gap-2">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                  العودة للرئيسية
                </Link>
              </Button>
            </div>
          )}
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
