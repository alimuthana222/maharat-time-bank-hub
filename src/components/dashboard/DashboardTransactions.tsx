
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface Transaction {
  id: string;
  type: "earned" | "spent";
  amount: number;
  description: string;
  category: string;
  status: "completed" | "pending" | "failed";
  createdAt: string;
  relatedUser?: string;
}

export function DashboardTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "earned",
      amount: 3,
      description: "جلسة تدريس رياضيات",
      category: "تدريس",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      relatedUser: "أحمد محمد"
    },
    {
      id: "2",
      type: "spent",
      amount: 2,
      description: "مساعدة في تصميم الشعار",
      category: "تصميم",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      relatedUser: "سارة أحمد"
    },
    {
      id: "3",
      type: "earned",
      amount: 1,
      description: "مراجعة مقال",
      category: "كتابة",
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      relatedUser: "محمد عبدالله"
    },
    {
      id: "4",
      type: "spent",
      amount: 4,
      description: "كورس برمجة متقدم",
      category: "برمجة",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      relatedUser: "خالد العمري"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

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

  const totalEarned = transactions
    .filter(t => t.type === "earned" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.type === "spent" && t.status === "completed")
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
              transaction.type === "earned" ? "bg-green-500/10" : "bg-red-500/10"
            }`}>
              {transaction.type === "earned" ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
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
                <span>•</span>
                <span>{formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true, locale: ar })}</span>
              </div>
            </div>
          </div>
          
          <div className="text-left">
            <div className={`text-lg font-bold ${
              transaction.type === "earned" ? "text-green-600" : "text-red-600"
            }`}>
              {transaction.type === "earned" ? "+" : "-"}{transaction.amount} ساعة
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">المعاملات المالية</h2>
          <p className="text-muted-foreground">تتبع تاريخ معاملاتك في بنك الوقت</p>
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
                <div className="text-2xl font-bold text-green-600">{totalEarned}</div>
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
                <div className="text-2xl font-bold text-red-600">{totalSpent}</div>
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
                <div className="text-2xl font-bold text-yellow-600">{pendingAmount}</div>
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
