
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ReportManagement } from "@/components/moderation/ReportManagement";
import { useAuth } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";

export default function ModeratorDashboard() {
  const { isModerator } = useAuth();

  if (!isModerator()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">لوحة تحكم المشرف</h1>
        
        <div className="space-y-6">
          <ReportManagement />
        </div>
      </div>
    </div>
  );
}
