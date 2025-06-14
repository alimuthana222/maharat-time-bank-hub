
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { RealMarketplaceListings } from "@/components/marketplace/RealMarketplaceListings";

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">سوق المهارات</h1>
          <p className="text-gray-600 mt-2">
            اكتشف المهارات واحجز الخدمات من أفضل الطلاب
          </p>
        </div>
        
        <RealMarketplaceListings />
      </div>
    </div>
  );
}
