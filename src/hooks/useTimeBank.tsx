
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface TimeBankBalance {
  user_id: string;
  hours_earned: number;
  hours_spent: number;
  hours_pending: number;
  username: string;
}

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

export function useTimeBank() {
  const [balance, setBalance] = useState<TimeBankBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { user } = useAuth();

  const fetchTimeBankBalance = async () => {
    if (!user) return;

    setLoadingBalance(true);
    try {
      const { data, error } = await supabase
        .from("time_bank_balances")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setBalance(data || {
        user_id: user.id,
        hours_earned: 0,
        hours_spent: 0,
        hours_pending: 0,
        username: user.user_metadata.username,
      });
    } catch (error) {
      console.error("Error fetching time bank balance:", error);
      toast.error("حدث خطأ أثناء تحميل رصيد بنك الوقت");
    } finally {
      setLoadingBalance(false);
    }
  };

  const fetchTransactions = async (tab: string) => {
    if (!user) return;

    setLoadingTransactions(true);
    try {
      let query = supabase
        .from("time_bank_transactions")
        .select("*")
        .or(`provider_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      // Apply filter based on tab
      if (tab === "sent") {
        query = query.eq("provider_id", user.id);
      } else if (tab === "received") {
        query = query.eq("recipient_id", user.id);
      } else if (tab === "pending") {
        query = query.eq("status", "pending");
      } else if (tab === "approved") {
        query = query.eq("status", "approved");
      } else if (tab === "rejected") {
        query = query.eq("status", "rejected");
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch user names for all transactions
      const enhancedTransactions = await Promise.all(
        (data || []).map(async (transaction) => {
          const [providerResult, recipientResult] = await Promise.all([
            supabase
              .from("profiles")
              .select("username, full_name")
              .eq("id", transaction.provider_id)
              .single(),
            supabase
              .from("profiles")
              .select("username, full_name")
              .eq("id", transaction.recipient_id)
              .single(),
          ]);

          return {
            ...transaction,
            status: transaction.status as "pending" | "approved" | "rejected",
            provider_name:
              providerResult.data?.full_name ||
              providerResult.data?.username ||
              "مستخدم غير معروف",
            recipient_name:
              recipientResult.data?.full_name ||
              recipientResult.data?.username ||
              "مستخدم غير معروف",
          };
        })
      );

      setTransactions(enhancedTransactions as Transaction[]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("حدث خطأ أثناء تحميل المعاملات");
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    fetchTransactions(value);
  };

  useEffect(() => {
    if (user) {
      fetchTimeBankBalance();
      fetchTransactions(activeTab);

      // Subscribe to changes in transactions
      const channel = supabase
        .channel("timebank-changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "time_bank_transactions",
            filter: `provider_id=eq.${user.id}`,
          },
          (_) => {
            fetchTransactions(activeTab);
            fetchTimeBankBalance();
          }
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "time_bank_transactions",
            filter: `recipient_id=eq.${user.id}`,
          },
          (_) => {
            fetchTransactions(activeTab);
            fetchTimeBankBalance();
            toast.info("لديك معاملة جديدة في بنك الوقت");
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "time_bank_transactions",
            filter: `or(provider_id.eq.${user.id},recipient_id.eq.${user.id})`,
          },
          (_) => {
            fetchTransactions(activeTab);
            fetchTimeBankBalance();
            toast.info("تم تحديث إحدى معاملاتك في بنك الوقت");
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, activeTab]);

  return {
    balance,
    transactions,
    loadingBalance,
    loadingTransactions,
    activeTab,
    handleTabChange,
    fetchTransactions,
    fetchTimeBankBalance,
  };
}

export type { TimeBankBalance, Transaction };
