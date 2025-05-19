
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, timeAgo } from "@/lib/date-utils";
import { Check, X, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  provider_id: string;
  recipient_id: string;
  hours: number;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  provider_name?: string;
  recipient_name?: string;
}

interface TimeBankTimelineProps {
  transactions: Transaction[];
  currentUserId: string;
  className?: string;
  limit?: number;
}

export function TimeBankTimeline({ transactions, currentUserId, className, limit = 5 }: TimeBankTimelineProps) {
  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Check className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <X className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 border-red-500/20";
      case "pending":
        return "bg-amber-500/10 border-amber-500/20";
      default:
        return "bg-muted border-muted-foreground/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "مقبولة";
      case "rejected":
        return "مرفوضة";
      case "pending":
        return "معلقة";
      default:
        return status;
    }
  };

  const getTransactionText = (transaction: Transaction) => {
    const isProvider = transaction.provider_id === currentUserId;
    
    if (isProvider) {
      return {
        title: `قمت بتقديم ${transaction.hours} ساعات إلى ${transaction.recipient_name || "مستخدم"}`,
        description: transaction.description,
        isPending: transaction.status === "pending",
        isPositive: false,
      };
    } else {
      return {
        title: `استلمت ${transaction.hours} ساعات من ${transaction.provider_name || "مستخدم"}`,
        description: transaction.description,
        isPending: transaction.status === "pending",
        isPositive: true,
      };
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>سجل المعاملات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((transaction, index) => {
              const transactionText = getTransactionText(transaction);
              
              return (
                <div key={transaction.id} className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className={cn(
                      "rounded-full p-1",
                      getStatusClass(transaction.status)
                    )}>
                      {getStatusIcon(transaction.status)}
                    </div>
                    {index < sortedTransactions.length - 1 && (
                      <div className="h-full w-px bg-border mt-1" />
                    )}
                  </div>
                  <div className="pb-8">
                    <div className="flex items-center mb-1">
                      <h3 className="text-sm font-medium">
                        {transactionText.title}
                      </h3>
                      <span className={cn(
                        "mx-2 px-2 py-0.5 rounded-full text-xs",
                        getStatusClass(transaction.status)
                      )}>
                        {getStatusText(transaction.status)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {transactionText.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo(transaction.created_at)} • {formatDate(transaction.created_at, 'short')}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-muted-foreground py-8">
              لا توجد معاملات لعرضها
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
