
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Plus, Minus, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { ZainCashPayment } from "./ZainCashPayment";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface UserBalance {
  balance: number;
  reserved_balance: number;
  updated_at: string;
}

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  status: string;
  description: string;
  created_at: string;
}

export function UserBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [depositAmount, setDepositAmount] = useState(10000);

  useEffect(() => {
    if (user) {
      fetchBalance();
      fetchTransactions();
    }
  }, [user]);

  const fetchBalance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching balance:', error);
        return;
      }

      setBalance(data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('zain_cash_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDepositSuccess = async (transactionId: string) => {
    // تحديث الرصيد محلياً
    await fetchBalance();
    await fetchTransactions();
    setShowDepositDialog(false);
  };

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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const availableBalance = (balance?.balance || 0) - (balance?.reserved_balance || 0);

  return (
    <div className="space-y-6">
      {/* رصيد المستخدم */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            رصيدك المالي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {availableBalance.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">الرصيد المتاح</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {(balance?.reserved_balance || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">رصيد محجوز</div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
              <DialogTrigger asChild>
                <Button className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  إيداع
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إيداع رصيد</DialogTitle>
                </DialogHeader>
                <ZainCashPayment
                  amount={depositAmount}
                  description="إيداع رصيد في المحفظة"
                  onSuccess={handleDepositSuccess}
                  onCancel={() => setShowDepositDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* تاريخ المعاملات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            آخر المعاملات
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد معاملات بعد
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className={`font-bold ${
                      transaction.transaction_type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.transaction_type === 'deposit' ? '+' : '-'}
                      {transaction.amount.toLocaleString()} د.ع
                    </div>
                    <Badge className={getStatusColor(transaction.status)}>
                      {getStatusText(transaction.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
