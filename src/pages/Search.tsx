
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { RealSearchComponent } from "@/components/search/RealSearchComponent";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <SearchIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">البحث</h1>
            <p className="text-gray-600">ابحث عن الخدمات والمستخدمين</p>
          </div>
        </div>
        
        <RealSearchComponent />
      </div>
    </div>
  );
}
