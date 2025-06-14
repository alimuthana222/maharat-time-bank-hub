
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search, TrendingUp, TrendingDown, Clock, Wallet } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface Transaction {
  id: string;
  type: "earned" | "spent" | "deposit";
  amount: number;
  description: string;
  category: string;
  status: "completed" | "pending" | "failed";
  createdAt: string;
  relatedUser?: string;
  transaction_id?: string;
}

export function DashboardTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // جلب معاملات زين كاش
      const { data: zainCashData, error: zainError } = await supabase
        .from('zain_cash_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // جلب معاملات التبادل في بنك الوقت
      const { data: timeBankData, error: timeBankError } = await supabase
        .from('time_bank_transactions')
        .select(`
          *,
          provider:profiles!time_bank_transactions_provider_id_fkey(username, full_name),
          recipient:profiles!time_bank_transactions_recipient_id_fkey(username, full_name)
        `)
        .or(`provider_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (zainError) console.error('Error fetching zain cash transactions:', zainError);
      if (timeBankError) console.error('Error fetching time bank transactions:', timeBankError);

      const allTransactions: Transaction[] = [];

      // معالجة معاملات زين كاش
      if (zainCashData) {
        zainCashData.forEach(transaction => {
          allTransactions.push({
            id: transaction.id,
            type: transaction.transaction_type === 'deposit' ? 'deposit' : 'spent',
            amount: transaction.amount,
            description: transaction.description || 'معاملة زين كاش',
            category: 'مالية',
            status: transaction.status as "completed" | "pending" | "failed",
            createdAt: transaction.created_at,
            transaction_id: transaction.transaction_id
          });
        });
      }

      // معالجة معاملات بنك الوقت
      if (timeBankData) {
        timeBankData.forEach(transaction => {
          const isProvider = transaction.provider_id === user.id;
          const relatedUser = isProvider 
            ? (transaction.recipient as any)?.full_name || (transaction.recipient as any)?.username
            : (transaction.provider as any)?.full_name || (transaction.provider as any)?.username;

          allTransactions.push({
            id: transaction.id,
            type: isProvider ? 'earned' : 'spent',
            amount: transaction.hours,
            description: transaction.description,
            category: 'بنك الوقت',
            status: transaction.status as "completed" | "pending" | "failed",
            createdAt: transaction.created_at,
            relatedUser
          });
        });
      }

      // ترتيب المعاملات حسب التاريخ
      allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.relatedUser && transaction.relatedUser.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "failed":
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "pending":
        return "قيد الانتظار";
      case "failed":
        return "فشل";
      default:
        return "غير معروف";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <TrendingUp className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "failed":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "earned":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "spent":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "deposit":
        return <Wallet className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const totalEarned = transactions
    .filter(t => t.type === "earned" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => (t.type === "spent" || t.type === "deposit") && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter(t => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              transaction.type === "earned" ? "bg-green-500/10" : 
              transaction.type === "deposit" ? "bg-blue-500/10" : "bg-red-500/10"
            }`}>
              {getTypeIcon(transaction.type)}
            </div>
            
            <div>
              <h4 className="font-medium">{transaction.description}</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{transaction.category}</span>
                {transaction.relatedUser && (
                  <>
                    <span>•</span>
                    <span>{transaction.relatedUser}</span>
                  </>
                )}
                {transaction.transaction_id && (
                  <>
                    <span>•</span>
                    <span>#{transaction.transaction_id}</span>
                  </>
                )}
                <span>•</span>
                <span>{formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true, locale: ar })}</span>
              </div>
            </div>
          </div>
          
          <div className="text-left">
            <div className={`text-lg font-bold ${
              transaction.type === "earned" ? "text-green-600" : 
              transaction.type === "deposit" ? "text-blue-600" : "text-red-600"
            }`}>
              {transaction.type === "earned" ? "+" : transaction.type === "deposit" ? "+" : "-"}
              {transaction.amount.toLocaleString()} {transaction.category === 'بنك الوقت' ? 'ساعة' : 'د.ع'}
            </div>
            <Badge variant="outline" className={getStatusColor(transaction.status)}>
              {getStatusIcon(transaction.status)}
              <span className="mr-1">{getStatusText(transaction.status)}</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">المعاملات المالية</h2>
          <p className="text-muted-foreground">تتبع تاريخ معاملاتك</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          تصدير التقرير
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{totalEarned.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">إجمالي المكتسب</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{totalSpent.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">إجمالي المصروف</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{pendingAmount.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">قيد الانتظار</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المعاملات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="نوع المعاملة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="earned">مكتسب</SelectItem>
                <SelectItem value="spent">مصروف</SelectItem>
                <SelectItem value="deposit">إيداع</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="failed">فشل</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <div>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                ? "لم يتم العثور على معاملات مطابقة للبحث"
                : "لا توجد معاملات بعد"
              }
            </p>
          </div>
        ) : (
          <div>
            {filteredTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
