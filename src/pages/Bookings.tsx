
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { RealBookingsList } from "@/components/bookings/RealBookingsList";
import { Calendar } from "lucide-react";

export default function Bookings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">حجوزاتي</h1>
            <p className="text-gray-600">إدارة جميع حجوزاتك وطلبات الخدمات</p>
          </div>
        </div>
        
        <RealBookingsList />
      </div>
    </div>
  );
}
