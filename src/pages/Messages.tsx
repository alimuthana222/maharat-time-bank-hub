
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { RealMessageSystem } from "@/components/messaging/RealMessageSystem";
import { MessageCircle } from "lucide-react";

export default function Messages() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <MessageCircle className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الرسائل</h1>
            <p className="text-gray-600">تواصل مع الطلاب ومقدمي الخدمات</p>
          </div>
        </div>
        
        <RealMessageSystem />
      </div>
    </div>
  );
}
