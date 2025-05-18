
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/components/auth/AuthProvider";
import { TimeBankTransactionForm } from "@/components/timebank/TimeBankTransactionForm";
import { TimeBankStats } from "@/components/timebank/TimeBankStats";
import { TimeBankTabs } from "@/components/timebank/TimeBankTabs";
import { useTimeBank } from "@/hooks/useTimeBank";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TimeBank() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const {
    balance,
    transactions,
    loadingBalance,
    loadingTransactions,
    activeTab,
    handleTabChange,
    fetchTransactions,
    fetchTimeBankBalance,
  } = useTimeBank();

  const handleTransactionSuccess = () => {
    setIsDialogOpen(false);
    fetchTransactions(activeTab);
    fetchTimeBankBalance();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container mx-auto pt-20 pb-8 px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">بنك الوقت</h1>
            <p className="text-muted-foreground mb-6">
              تبادل المهارات والخدمات من خلال وحدة الوقت
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>معاملة جديدة</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>إنشاء معاملة جديدة</DialogTitle>
                <DialogDescription>
                  أضف معاملة جديدة إلى بنك الوقت الخاص بك
                </DialogDescription>
              </DialogHeader>
              <TimeBankTransactionForm onSuccess={handleTransactionSuccess} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <TimeBankStats balance={balance} loading={loadingBalance} />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>معاملات بنك الوقت</CardTitle>
            <CardDescription>
              جميع المعاملات التي قمت بإجرائها أو استلامها
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TimeBankTabs
              transactions={transactions}
              loadingTransactions={loadingTransactions}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              currentUserId={user?.id || ""}
              onStatusChange={() => fetchTransactions(activeTab)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
