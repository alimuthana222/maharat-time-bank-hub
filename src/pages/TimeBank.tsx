
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
import { ResponsiveContainer, ResponsiveGrid } from "@/components/ui/mobile-responsive";
import { PageLoading } from "@/components/common/LoadingStates";
import { ErrorPage } from "@/components/common/ErrorHandling";
import { useTimeBank } from "@/hooks/useTimeBank";
import { useAuth } from "@/components/auth/AuthProvider";

const TimeBank = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { balance, loadingBalance, transactions, loadingTransactions, fetchTransactions } = useTimeBank();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoading />;
  }

  if (error) {
    return <ErrorPage message={error} onRetry={() => setError(null)} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <ResponsiveContainer className="py-10 mt-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">بنك الوقت</h1>
              <p className="text-muted-foreground">
                تبادل المهارات والخدمات مع الطلاب الآخرين على أساس ساعة بساعة
              </p>
            </div>
          </div>

          <div className="mb-8">
            <ResponsiveGrid cols={{ default: 1, md: 3 }}>
              <TimeBankStats balance={balance} loading={loadingBalance} />
            </ResponsiveGrid>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 w-full">
              <TabsTrigger value="dashboard">لوحة التحكم</TabsTrigger>
              <TabsTrigger value="transactions">المعاملات</TabsTrigger>
              <TabsTrigger value="analytics" className="hidden md:flex">التحليلات</TabsTrigger>
              <TabsTrigger value="timeline" className="hidden md:flex">السجل الزمني</TabsTrigger>
              <TabsTrigger value="export" className="hidden md:flex">تصدير</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <TimeBankTabs 
                isLoading={isLoading} 
                onCreateTransaction={() => setActiveTab("transactions")}
              />
            </TabsContent>
            
            <TabsContent value="transactions" className="space-y-6">
              <TimeBankTransactionForm />
              <TimeBankTransactionsList 
                transactions={transactions}
                loading={loadingTransactions}
                currentUserId={user?.id || ""}
                onStatusChange={() => fetchTransactions("all")}
              />
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
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
};

export default TimeBank;
