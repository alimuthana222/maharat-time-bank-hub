
import React from "react";
import { TimeBankTransaction } from "@/components/timebank/TimeBankTransaction";
import { Loader2 } from "lucide-react";

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

interface TimeBankTransactionsListProps {
  transactions: Transaction[];
  loading: boolean;
  currentUserId: string;
  onStatusChange: () => void;
}

export function TimeBankTransactionsList({
  transactions,
  loading,
  currentUserId,
  onStatusChange,
}: TimeBankTransactionsListProps) {
  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        لا توجد معاملات لعرضها
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <TimeBankTransaction
          key={transaction.id}
          transaction={transaction}
          currentUserId={currentUserId}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
