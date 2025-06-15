
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, ArrowUpRight, ArrowDownRight, CreditCard, UserCheck } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  notes: string;
  created_at: string;
  admin_id?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading?: boolean;
}

export function TransactionHistory({ transactions, loading }: TransactionHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد الانتظار';
      case 'failed':
        return 'فشل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'mastercard':
        return CreditCard;
      case 'admin_credit':
        return UserCheck;
      default:
        return ArrowDownRight;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'mastercard':
        return 'ماستر كارد';
      case 'admin_credit':
        return 'شحن من الإدارة';
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          تاريخ المعاملات
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>لا توجد معاملات بعد</p>
          </div>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {transactions.map((transaction) => {
                const PaymentIcon = getPaymentMethodIcon(transaction.payment_method);
                return (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100 text-green-600">
                        <PaymentIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {getPaymentMethodText(transaction.payment_method)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.notes}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        +{transaction.amount.toLocaleString()} د.ع
                      </div>
                      <Badge className={getStatusColor(transaction.status)}>
                        {getStatusText(transaction.status)}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
