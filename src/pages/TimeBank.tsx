
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { RealTimeBankComponent } from "@/components/timebank/RealTimeBankComponent";
import { Clock } from "lucide-react";

export default function TimeBank() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Clock className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">بنك الوقت</h1>
            <p className="text-gray-600">إدارة ساعاتك ومعاملاتك في بنك الوقت</p>
          </div>
        </div>
        
        <RealTimeBankComponent />
      </div>
    </div>
  );
}
