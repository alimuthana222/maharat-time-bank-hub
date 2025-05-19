
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HomeIcon, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="relative mx-auto w-32 h-32">
              {/* 404 with animated dots */}
              <div className="text-6xl font-extrabold text-primary">404</div>
              <div className="absolute top-0 right-0 h-8 w-8 bg-primary/10 rounded-full animate-ping" style={{ animationDelay: '0.2s', animationDuration: '3s' }}></div>
              <div className="absolute bottom-0 left-0 h-6 w-6 bg-secondary/10 rounded-full animate-ping" style={{ animationDelay: '0.8s', animationDuration: '2.5s' }}></div>
              <div className="absolute top-1/2 left-1/4 h-4 w-4 bg-accent/10 rounded-full animate-ping" style={{ animationDelay: '0.5s', animationDuration: '2s' }}></div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">الصفحة غير موجودة</h1>
          <p className="text-muted-foreground mb-8">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو حذفها.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/" className="flex items-center justify-center">
                <HomeIcon className="mr-2 h-4 w-4" />
                العودة للصفحة الرئيسية
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/help" className="flex items-center justify-center">
                <Search className="mr-2 h-4 w-4" />
                بحث في مركز المساعدة
              </Link>
            </Button>
          </div>
          
          <div className="mt-12">
            <Button variant="ghost" asChild>
              <Link to="/" className="flex items-center text-sm">
                <ArrowLeft className="mr-1 h-3 w-3" />
                العودة للخلف
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
