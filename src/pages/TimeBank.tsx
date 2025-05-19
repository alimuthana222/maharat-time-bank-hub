
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeBankTabs } from "@/components/timebank/TimeBankTabs";
import { TimeBankStats } from "@/components/timebank/TimeBankStats";
import { TimeBankTransactionForm } from "@/components/timebank/TimeBankTransactionForm";
import { TimeBankTransactionsList } from "@/components/timebank/TimeBankTransactionsList";
import { TimeBankAnalytics } from "@/components/timebank/TimeBankAnalytics";
import { TimeBankExport } from "@/components/timebank/TimeBankExport";
import { TimeBankTimeline } from "@/components/timebank/TimeBankTimeline";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";

const TimeBank = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading data from API
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-10 mt-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">بنك الوقت</h1>
            <p className="text-muted-foreground">
              تبادل المهارات والخدمات مع الطلاب الآخرين على أساس ساعة بساعة
            </p>
          </div>
          <TimeBankStats />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-1 sm:grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">لوحة التحكم</TabsTrigger>
            <TabsTrigger value="transactions">المعاملات</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            <TabsTrigger value="timeline">السجل الزمني</TabsTrigger>
            <TabsTrigger value="export">تصدير</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <TimeBankTabs 
              isLoading={isLoading} 
              onCreateTransaction={() => setActiveTab("transactions")}
            />
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6">
            <TimeBankTransactionForm />
            <TimeBankTransactionsList />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <TimeBankAnalytics />
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-6">
            <TimeBankTimeline />
          </TabsContent>
          
          <TabsContent value="export" className="space-y-6">
            <TimeBankExport />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default TimeBank;
