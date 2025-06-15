
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { BalanceCard } from "./BalanceCard";
import { TransactionHistory } from "./TransactionHistory";
import { DepositDialog } from "./DepositDialog";
import { toast } from "sonner";

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
  const [transactionsLoading, setTransactionsLoading] = useState(true);

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
      setTransactionsLoading(true);
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
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleDepositSuccess = async (transactionId: string) => {
    toast.success("تم إيداع الرصيد بنجاح!");
    await fetchBalance();
    await fetchTransactions();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BalanceCard
          balance={balance?.balance || 0}
          reservedBalance={balance?.reserved_balance || 0}
          lastUpdated={balance?.updated_at}
        />
        <div className="ml-4">
          <DepositDialog onSuccess={handleDepositSuccess} />
        </div>
      </div>

      <TransactionHistory 
        transactions={transactions} 
        loading={transactionsLoading}
      />
    </div>
  );
}
