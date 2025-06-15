
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { WalletHeader } from "./WalletHeader";
import { QuickActions } from "./QuickActions";
import { TransactionItem } from "./TransactionItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  History, 
  Filter, 
  Download,
  Search,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface UserBalance {
  balance: number;
  reserved_balance: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  payment_method?: string;
  description?: string;
}

export function EnhancedWallet() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      fetchBalance();
      fetchTransactions();
    }
  }, [user]);

  const fetchBalance = async () => {
    try {
      const { data, error } = await supabase
        .from("user_balances")
        .select("balance, reserved_balance")
        .eq("user_id", user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setBalance(data || { balance: 0, reserved_balance: 0 });
    } catch (error: any) {
      console.error("Error fetching balance:", error);
      toast.error("خطأ في تحميل الرصيد");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const { data, error } = await supabase
        .from("charge_transactions")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      setTransactions(data || []);
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      toast.error("خطأ في تحميل المعاملات");
    } finally {
      setTransactionsLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchBalance(), fetchTransactions()]);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesType = typeFilter === "all" || transaction.transaction_type === typeFilter;
    const matchesSearch = searchQuery === "" || 
      transaction.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.payment_method?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">يجب تسجيل الدخول لعرض المحفظة</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">المحفظة المالية</h1>
        <Button 
          variant="outline" 
          onClick={refreshData}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      <WalletHeader
        balance={balance?.balance || 0}
        reservedBalance={balance?.reserved_balance || 0}
        currency="USD"
        loading={loading}
      />

      <QuickActions onActionComplete={refreshData} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              سجل المعاملات
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              تصدير
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المعاملات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="completed">مكتملة</SelectItem>
                <SelectItem value="verified">مؤكدة</SelectItem>
                <SelectItem value="failed">فاشلة</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="نوع المعاملة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="deposit">إيداع</SelectItem>
                <SelectItem value="withdrawal">سحب</SelectItem>
                <SelectItem value="payment">دفع</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            {transactionsLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">جاري تحميل المعاملات...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد معاملات مطابقة للمعايير المحددة</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={{
                    ...transaction,
                    type: transaction.transaction_type || transaction.type
                  }}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
