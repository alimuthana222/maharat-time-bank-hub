
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeBankTransactionsList } from "@/components/timebank/TimeBankTransactionsList";

interface Transaction {
  id: string;
  provider_id: string;
  recipient_id: string;
  hours: number;
  description: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  provider_name?: string;
  recipient_name?: string;
  updated_at: string;
}

interface TimeBankTabsProps {
  transactions: Transaction[];
  loadingTransactions: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  currentUserId: string;
  onStatusChange: () => void;
}

export function TimeBankTabs({
  transactions,
  loadingTransactions,
  activeTab,
  onTabChange,
  currentUserId,
  onStatusChange,
}: TimeBankTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">الكل</TabsTrigger>
        <TabsTrigger value="sent">مرسلة</TabsTrigger>
        <TabsTrigger value="received">مستلمة</TabsTrigger>
        <TabsTrigger value="pending">معلقة</TabsTrigger>
        <TabsTrigger value="approved">موافق عليها</TabsTrigger>
        <TabsTrigger value="rejected">مرفوضة</TabsTrigger>
      </TabsList>
      <TabsContent value={activeTab}>
        <TimeBankTransactionsList
          transactions={transactions}
          loading={loadingTransactions}
          currentUserId={currentUserId}
          onStatusChange={onStatusChange}
        />
      </TabsContent>
    </Tabs>
  );
}
