
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle, 
  XCircle,
  CreditCard,
  Phone,
  DollarSign
} from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  payment_method?: string;
  description?: string;
}

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const getTransactionIcon = () => {
    if (transaction.type === 'deposit' || transaction.type === 'credit') {
      return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
    }
    return <ArrowUpRight className="h-4 w-4 text-red-600" />;
  };

  const getPaymentMethodIcon = () => {
    switch (transaction.payment_method) {
      case 'mastercard':
        return <CreditCard className="h-3 w-3" />;
      case 'zaincash_manual':
        return <Phone className="h-3 w-3" />;
      case 'wallet':
        return <DollarSign className="h-3 w-3" />;
      default:
        return <DollarSign className="h-3 w-3" />;
    }
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
      case 'verified':
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'pending':
        return <Clock className="h-3 w-3 text-orange-600" />;
      case 'failed':
      case 'rejected':
        return <XCircle className="h-3 w-3 text-red-600" />;
      default:
        return <Clock className="h-3 w-3 text-gray-600" />;
    }
  };

  const getStatusVariant = () => {
    switch (transaction.status) {
      case 'completed':
      case 'verified':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = () => {
    switch (transaction.status) {
      case 'completed':
        return 'مكتملة';
      case 'verified':
        return 'مؤكدة';
      case 'pending':
        return 'قيد الانتظار';
      case 'failed':
        return 'فاشلة';
      case 'rejected':
        return 'مرفوضة';
      default:
        return transaction.status;
    }
  };

  const getTypeText = () => {
    switch (transaction.type) {
      case 'deposit':
        return 'إيداع';
      case 'withdrawal':
        return 'سحب';
      case 'payment':
        return 'دفع';
      case 'credit':
        return 'إضافة رصيد';
      default:
        return transaction.type;
    }
  };

  const getPaymentMethodText = () => {
    switch (transaction.payment_method) {
      case 'mastercard':
        return 'ماستر كارد';
      case 'zaincash_manual':
        return 'ZainCash';
      case 'wallet':
        return 'المحفظة';
      case 'admin_credit':
        return 'شحن من الإدارة';
      default:
        return transaction.payment_method || 'غير محدد';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const isPositive = transaction.type === 'deposit' || transaction.type === 'credit';

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
          {getTransactionIcon()}
        </div>
        
        <div>
          <div className="font-medium text-sm flex items-center gap-2">
            {getTypeText()}
            <div className="flex items-center gap-1 text-muted-foreground">
              {getPaymentMethodIcon()}
              <span className="text-xs">{getPaymentMethodText()}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(transaction.created_at)}
          </div>
          {transaction.description && (
            <div className="text-xs text-muted-foreground">
              {transaction.description}
            </div>
          )}
        </div>
      </div>

      <div className="text-left">
        <div className={`font-bold text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : '-'}{Math.abs(transaction.amount).toLocaleString()} د.ع
        </div>
        
        <div className="flex items-center gap-1 justify-end mt-1">
          {getStatusIcon()}
          <Badge variant={getStatusVariant()} className="text-xs">
            {getStatusText()}
          </Badge>
        </div>
      </div>
    </div>
  );
}
