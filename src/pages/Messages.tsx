
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MessageSystem } from "@/components/messaging/MessageSystem";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Messages() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        
        <div className="container mx-auto pt-20 pb-8 px-4">
          <h1 className="text-3xl font-bold mb-8">الرسائل</h1>
          <MessageSystem />
        </div>
      </div>
    </ProtectedRoute>
  );
}
