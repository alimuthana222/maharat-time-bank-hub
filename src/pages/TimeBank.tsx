
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { TimeBankTransactionForm } from "@/components/timebank/TimeBankTransactionForm";
import { TimeBankTransaction } from "@/components/timebank/TimeBankTransaction";
import { TimeBankCard } from "@/components/timebank/TimeBankCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

export default function TimeBank() {
  const [balance, setBalance] = useState<TimeBankBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();

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
          {loadingBalance ? (
            <Card className="col-span-3">
              <CardContent className="p-6 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </CardContent>
            </Card>
          ) : (
            <>
              <TimeBankCard
                title="الساعات المكتسبة"
                value={balance?.hours_earned || 0}
                description="إجمالي الساعات التي حصلت عليها"
                className="bg-gradient-to-r from-green-500 to-emerald-700"
              />
              <TimeBankCard
                title="الساعات المنفقة"
                value={balance?.hours_spent || 0}
                description="إجمالي الساعات التي أنفقتها"
                className="bg-gradient-to-r from-blue-500 to-indigo-700"
              />
              <TimeBankCard
                title="الساعات المعلقة"
                value={balance?.hours_pending || 0}
                description="الساعات التي في انتظار الموافقة"
                className="bg-gradient-to-r from-amber-500 to-orange-700"
              />
            </>
          )}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>معاملات بنك الوقت</CardTitle>
            <CardDescription>
              جميع المعاملات التي قمت بإجرائها أو استلامها
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="sent">مرسلة</TabsTrigger>
                <TabsTrigger value="received">مستلمة</TabsTrigger>
                <TabsTrigger value="pending">معلقة</TabsTrigger>
                <TabsTrigger value="approved">موافق عليها</TabsTrigger>
                <TabsTrigger value="rejected">مرفوضة</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab}>
                {loadingTransactions ? (
                  <div className="py-10 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground">
                    لا توجد معاملات لعرضها
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <TimeBankTransaction
                        key={transaction.id}
                        transaction={transaction}
                        currentUserId={user?.id || ""}
                        onStatusChange={() => fetchTransactions(activeTab)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
