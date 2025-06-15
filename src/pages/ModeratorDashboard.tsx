
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ReportManagement } from "@/components/moderation/ReportManagement";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { ContentManagement } from "@/components/admin/ContentManagement";
import { PaymentVerificationPanel } from "@/components/admin/PaymentVerificationPanel";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";

export default function ModeratorDashboard() {
  const [activeTab, setActiveTab] = useState("reports");
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);
  const { isModerator } = useAuth();

  useEffect(() => {
    if (isModerator()) {
      fetchPendingPaymentsCount();
      // تحديث العدد كل دقيقة
      const interval = setInterval(fetchPendingPaymentsCount, 60000);
      return () => clearInterval(interval);
    }
  }, [isModerator]);

  const fetchPendingPaymentsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('charge_transactions')
        .select('*', { count: 'exact', head: true })
        .eq('payment_method', 'zaincash_manual')
        .eq('manual_verification_status', 'pending');

      if (error) throw error;
      setPendingPaymentsCount(count || 0);
    } catch (error) {
      console.error('Error fetching pending payments count:', error);
    }
  };

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
            <TabsTrigger value="payments" className="relative">
              التحقق من المدفوعات
              {pendingPaymentsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {pendingPaymentsCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports">
            <ReportManagement />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>
          
          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>
          
          <TabsContent value="payments">
            <PaymentVerificationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
