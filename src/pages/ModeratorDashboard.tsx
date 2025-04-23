
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsManagement } from "@/components/admin/ReportsManagement";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { ContentManagement } from "@/components/admin/ContentManagement";
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
            <UsersManagement />
          </TabsContent>
          
          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
