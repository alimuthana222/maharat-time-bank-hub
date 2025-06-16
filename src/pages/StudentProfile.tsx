mport React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { EnhancedProfileManager } from "@/components/profile/EnhancedProfileManager";
import { User } from "lucide-react";

export default function StudentProfile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex items-center gap-3 mb-8">
          <User className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ملفي الشخصي</h1>
            <p className="text-gray-600">إدارة معلوماتك الشخصية ومهاراتك</p>
          </div>
        </div>
        
        <EnhancedProfileManager />
      </div>
    </div>
  );
}
