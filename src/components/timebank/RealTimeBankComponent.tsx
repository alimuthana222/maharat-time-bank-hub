
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTimeBank } from "@/hooks/useTimeBank";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { TimeBankStats } from "./TimeBankStats";
import { Clock, Send, CheckCircle, XCircle, AlertCircle, User, Plus } from "lucide-react";
import { toast } from "sonner";

export function RealTimeBankComponent() {
  const { user } = useAuth();
  const { balance, transactions, loadingBalance, loadingTransactions, activeTab, handleTabChange } = useTimeBank();
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendForm, setSendForm] = useState({
    recipient_username: "",
    hours: "",
    description: ""
  });
  const [sendLoading, setSendLoading] = useState(false);

  const handleSendHours = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSendLoading(true);
    try {
      // First, find the recipient user
      const { data: recipient, error: recipientError } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("username", sendForm.recipient_username)
        .single();

      if (recipientError || !recipient) {
        toast.error("المستخدم غير موجود");
        return;
      }

      if (recipient.id === user.id) {
        toast.error("لا يمكنك إرسال ساعات لنفسك");
        return;
      }

      // Check if user has enough balance
      const userBalance = (balance?.hours_earned || 0) - (balance?.hours_spent || 0);
      if (userBalance < parseInt(sendForm.hours)) {
        toast.error("رصيدك غير كافي");
        return;
      }

      // Create the transaction
      const { error: transactionError } = await supabase
        .from("time_bank_transactions")
        .insert({
          provider_id: user.id,
          recipient_id: recipient.id,
          hours: parseInt(sendForm.hours),
          description: sendForm.description,
          status: "pending"
        });

      if (transactionError) throw transactionError;

      toast.success("تم إرسال الساعات بنجاح! في انتظار موافقة المستلم");
      setSendDialogOpen(false);
      setSendForm({ recipient_username: "", hours: "", description: "" });
      
    } catch (error) {
      console.error("Error sending hours:", error);
      toast.error("خطأ في إرسال الساعات");
    } finally {
      setSendLoading(false);
    }
  };

  const handleTransactionAction = async (transactionId: string, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from("time_bank_transactions")
        .update({ status: action })
        .eq("id", transactionId);

      if (error) throw error;

      toast.success(`تم ${action === 'approved' ? 'قبول' : 'رفض'} المعاملة`);
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("خطأ في تحديث المعاملة");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><AlertCircle className="w-3 h-3 mr-1" />معلق</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />مقبول</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />مرفوض</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTransactionType = (transaction: any) => {
    if (!user) return "";
    
    if (transaction.provider_id === user.id) {
      return "sent";
    } else if (transaction.recipient_id === user.id) {
      return "received";
    }
    return "";
  };

  return (
    <div className="space-y-6">
      {/* رصيد بنك الوقت */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TimeBankStats balance={balance} loading={loadingBalance} />
      </div>

      {/* أزرار الإجراءات */}
      <div className="flex gap-4">
        <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="w-4 h-4 mr-2" />
              إرسال ساعات
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إرسال ساعات إلى مستخدم آخر</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSendHours} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">اسم المستخدم المستلم</Label>
                <Input
                  id="recipient"
                  value={sendForm.recipient_username}
                  onChange={(e) => setSendForm(prev => ({...prev, recipient_username: e.target.value}))}
                  placeholder="أدخل اسم المستخدم"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hours">عدد الساعات</Label>
                <Input
                  id="hours"
                  type="number"
                  min="1"
                  value={sendForm.hours}
                  onChange={(e) => setSendForm(prev => ({...prev, hours: e.target.value}))}
                  placeholder="عدد الساعات"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={sendForm.description}
                  onChange={(e) => setSendForm(prev => ({...prev, description: e.target.value}))}
                  placeholder="اكتب وصف للمعاملة"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <Button type="submit" disabled={sendLoading} className="flex-1">
                  {sendLoading ? "جاري الإرسال..." : "إرسال"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setSendDialogOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* المعاملات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            معاملات بنك الوقت
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
              <TabsTrigger value="all">جميع المعاملات</TabsTrigger>
              <TabsTrigger value="sent">المرسلة</TabsTrigger>
              <TabsTrigger value="received">المستلمة</TabsTrigger>
              <TabsTrigger value="pending">معلقة</TabsTrigger>
              <TabsTrigger value="approved">مقبولة</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {loadingTransactions ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  لا توجد معاملات
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => {
                    const transactionType = getTransactionType(transaction);
                    const isReceived = transactionType === "received";
                    const canApprove = isReceived && transaction.status === "pending";
                    
                    return (
                      <div key={transaction.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {isReceived ? `من: ${transaction.provider_name}` : `إلى: ${transaction.recipient_name}`}
                              </p>
                              <p className="text-sm text-gray-600">{transaction.description}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(transaction.created_at).toLocaleDateString('ar-SA')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right space-y-2">
                            <div className={`text-lg font-bold ${isReceived ? 'text-green-600' : 'text-red-600'}`}>
                              {isReceived ? '+' : '-'}{transaction.hours} ساعة
                            </div>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                        
                        {canApprove && (
                          <div className="flex gap-2 pt-2 border-t">
                            <Button
                              size="sm"
                              onClick={() => handleTransactionAction(transaction.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              قبول
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTransactionAction(transaction.id, 'rejected')}
                              className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              رفض
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
