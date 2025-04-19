
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardOrders } from "@/components/dashboard/DashboardOrders";
import { DashboardServices } from "@/components/dashboard/DashboardServices";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardTransactions } from "@/components/dashboard/DashboardTransactions";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <DashboardHeader />
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="w-full flex justify-start border-b mb-6">
              <TabsTrigger value="overview" className="flex-1 sm:flex-none">نظرة عامة</TabsTrigger>
              <TabsTrigger value="services" className="flex-1 sm:flex-none">خدماتي</TabsTrigger>
              <TabsTrigger value="orders" className="flex-1 sm:flex-none">طلباتي</TabsTrigger>
              <TabsTrigger value="transactions" className="flex-1 sm:flex-none">المعاملات المالية</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <DashboardStats />
            </TabsContent>
            
            <TabsContent value="services">
              <DashboardServices />
            </TabsContent>
            
            <TabsContent value="orders">
              <DashboardOrders />
            </TabsContent>
            
            <TabsContent value="transactions">
              <DashboardTransactions />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
