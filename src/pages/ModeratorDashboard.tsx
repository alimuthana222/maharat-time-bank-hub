
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsManagement } from "@/components/admin/ReportsManagement";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ModeratorDashboard() {
  const [activeTab, setActiveTab] = useState("reports");
  const { isModerator } = useAuth();

  if (!isModerator()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">لوحة تحكم المشرف</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="reports">إدارة البلاغات</TabsTrigger>
            <TabsTrigger value="users">إدارة المستخدمين</TabsTrigger>
            <TabsTrigger value="content">إدارة المحتوى</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports">
            <ReportsManagement />
          </TabsContent>
          
          <TabsContent value="users">
            <div className="bg-muted/30 rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">إدارة المستخدمين</h2>
              <p className="text-muted-foreground">
                هذه الميزة ستكون متاحة قريبًا
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="content">
            <div className="bg-muted/30 rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">إدارة المحتوى</h2>
              <p className="text-muted-foreground">
                هذه الميزة ستكون متاحة قريبًا
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
