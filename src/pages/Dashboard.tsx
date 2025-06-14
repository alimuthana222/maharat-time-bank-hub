
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RealDashboardStats } from "@/components/dashboard/RealDashboardStats";
import { DashboardServices } from "@/components/dashboard/DashboardServices";
import { DashboardOrders } from "@/components/dashboard/DashboardOrders";
import { DashboardTransactions } from "@/components/dashboard/DashboardTransactions";
import { ResponsiveContainer } from "@/components/ui/mobile-responsive";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <ResponsiveContainer className="pt-20 pb-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">لوحة التحكم</h1>
              <p className="text-muted-foreground">
                مرحباً بك! هنا يمكنك متابعة جميع أنشطتك
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="services">خدماتي</TabsTrigger>
                <TabsTrigger value="orders">طلباتي</TabsTrigger>
                <TabsTrigger value="transactions">المعاملات</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <RealDashboardStats />
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <DashboardServices />
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <DashboardOrders />
              </TabsContent>

              <TabsContent value="transactions" className="mt-6">
                <DashboardTransactions />
              </TabsContent>
            </Tabs>
          </div>
        </ResponsiveContainer>
      </main>
    </div>
  );
}
