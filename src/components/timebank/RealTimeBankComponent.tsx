
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, Send, CheckCircle, XCircle, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface TimeBankTransaction {
  id: string;
  provider_id: string;
  recipient_id: string;
  hours: number;
  description: string;
  status: string;
  created_at: string;
  provider?: {
    username: string;
    full_name?: string;
  };
  recipient?: {
    username: string;
    full_name?: string;
  };
}

interface TimeBankBalance {
  hours_earned: number;
  hours_spent: number;
  hours_pending: number;
}

export function RealTimeBankComponent() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TimeBankTransaction[]>([]);
  const [balance, setBalance] = useState<TimeBankBalance>({ hours_earned: 0, hours_spent: 0, hours_pending: 0 });
  const [loading, setLoading] = useState(true);
  const [showSendForm, setShowSendForm] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  // بيانات نموذج الإرسال
  const [sendForm, setSendForm] = useState({
    recipient_id: "",
    hours: "",
    description: ""
  });

  useEffect(() => {
    if (user) {
      fetchData();
      fetchUsers();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      await Promise.all([fetchTransactions(), fetchBalance()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("time_bank_transactions")
      .select("*")
      .or(`provider_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (data) {
      // جلب معلومات المستخدمين
      const userIds = new Set<string>();
      data.forEach(transaction => {
        userIds.add(transaction.provider_id);
        userIds.add(transaction.recipient_id);
      });

      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username, full_name")
        .in("id", Array.from(userIds));

      const profilesMap = new Map();
      if (profilesData) {
        profilesData.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
      }

      const transactionsWithProfiles = data.map(transaction => ({
        ...transaction,
        provider: profilesMap.get(transaction.provider_id),
        recipient: profilesMap.get(transaction.recipient_id),
      }));

      setTransactions(transactionsWithProfiles);
    }
  };

  const fetchBalance = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("time_bank_balances")
      .select("hours_earned, hours_spent, hours_pending")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching balance:", error);
      return;
    }

    if (data) {
      setBalance({
        hours_earned: data.hours_earned || 0,
        hours_spent: data.hours_spent || 0,
        hours_pending: data.hours_pending || 0
      });
    }
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, username, full_name")
      .neq("id", user?.id || "");

    setUsers(data || []);
  };

  const sendHours = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !sendForm.recipient_id || !sendForm.hours || !sendForm.description) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    try {
      const { error } = await supabase
        .from("time_bank_transactions")
        .insert({
          provider_id: user.id,
          recipient_id: sendForm.recipient_id,
          hours: parseInt(sendForm.hours),
          description: sendForm.description,
          status: "pending"
        });

      if (error) throw error;

      toast.success("تم إرسال الساعات بنجاح");
      setShowSendForm(false);
      setSendForm({ recipient_id: "", hours: "", description: "" });
      await fetchData();
    } catch (error) {
      console.error("Error sending hours:", error);
      toast.error("حدث خطأ أثناء إرسال الساعات");
    }
  };

  const updateTransactionStatus = async (transactionId: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("time_bank_transactions")
        .update({ status })
        .eq("id", transactionId);

      if (error) throw error;

      toast.success(`تم ${status === "approved" ? "قبول" : "رفض"} المعاملة`);
      await fetchData();
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("حدث خطأ أثناء تحديث المعاملة");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "موافق عليها";
      case "rejected":
        return "مرفوضة";
      default:
        return "في الانتظار";
    }
  };

  const currentBalance = balance.hours_earned - balance.hours_spent;

  if (loading) {
    return <div className="flex justify-center items-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات الرصيد */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{currentBalance}</p>
                <p className="text-gray-600 text-sm">الرصيد الحالي</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{balance.hours_earned}</p>
                <p className="text-gray-600 text-sm">ساعات مكتسبة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{balance.hours_spent}</p>
                <p className="text-gray-600 text-sm">ساعات مستخدمة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{balance.hours_pending}</p>
                <p className="text-gray-600 text-sm">ساعات في الانتظار</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* زر إرسال الساعات */}
      <div className="flex justify-end">
        <Dialog open={showSendForm} onOpenChange={setShowSendForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إرسال ساعات
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إرسال ساعات إلى مستخدم آخر</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={sendHours} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">المستقبل</label>
                <select
                  value={sendForm.recipient_id}
                  onChange={(e) => setSendForm({...sendForm, recipient_id: e.target.value})}
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="">اختر المستخدم</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name || user.username}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">عدد الساعات</label>
                <Input
                  type="number"
                  min="1"
                  value={sendForm.hours}
                  onChange={(e) => setSendForm({...sendForm, hours: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الوصف</label>
                <Textarea
                  value={sendForm.description}
                  onChange={(e) => setSendForm({...sendForm, description: e.target.value})}
                  placeholder="اكتب وصفاً للخدمة أو العمل المؤدى..."
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">إرسال</Button>
                <Button type="button" variant="outline" onClick={() => setShowSendForm(false)}>
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* المعاملات */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">جميع المعاملات</TabsTrigger>
          <TabsTrigger value="sent">المرسلة</TabsTrigger>
          <TabsTrigger value="received">المستقبلة</TabsTrigger>
          <TabsTrigger value="pending">في الانتظار</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              لا توجد معاملات
            </div>
          ) : (
            transactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {transaction.provider_id === user?.id ? (
                          <Send className="h-4 w-4 text-red-500" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        )}
                        <span className="font-medium">
                          {transaction.provider_id === user?.id ? "إرسال" : "استقبال"} {transaction.hours} ساعة
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        {transaction.provider_id === user?.id
                          ? `إلى: ${transaction.recipient?.full_name || transaction.recipient?.username}`
                          : `من: ${transaction.provider?.full_name || transaction.provider?.username}`
                        }
                      </p>
                      
                      <p className="text-sm">{transaction.description}</p>
                      
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString("ar")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(transaction.status)}>
                        {getStatusText(transaction.status)}
                      </Badge>

                      {transaction.recipient_id === user?.id && transaction.status === "pending" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => updateTransactionStatus(transaction.id, "approved")}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTransactionStatus(transaction.id, "rejected")}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent">
          {transactions.filter(t => t.provider_id === user?.id).map((transaction) => (
            <Card key={transaction.id}>
              {/* ... same card content */}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="received">
          {transactions.filter(t => t.recipient_id === user?.id).map((transaction) => (
            <Card key={transaction.id}>
              {/* ... same card content */}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending">
          {transactions.filter(t => t.status === "pending").map((transaction) => (
            <Card key={transaction.id}>
              {/* ... same card content */}
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
