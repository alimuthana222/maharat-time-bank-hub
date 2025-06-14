
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { RealMarketplace } from "@/components/marketplace/RealMarketplace";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">سوق المهارات</h1>
            <p className="text-gray-600 mt-2">
              اكتشف المهارات واحجز الخدمات من أفضل الطلاب
            </p>
          </div>
          
          <Link to="/create-ad">
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة خدمة جديدة
            </Button>
          </Link>
        </div>
        
        <RealMarketplace />
      </div>
    </div>
  );
}
