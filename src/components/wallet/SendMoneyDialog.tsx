
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { Send, Search } from "lucide-react";

interface SendMoneyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SendMoneyDialog({ open, onOpenChange, onSuccess }: SendMoneyDialogProps) {
  const { user } = useAuth();
  const [recipientUsername, setRecipientUsername] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [recipientInfo, setRecipientInfo] = useState<{id: string, username: string, full_name: string} | null>(null);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);

  const searchUser = async () => {
    if (!recipientUsername.trim()) {
      toast.error("يرجى إدخال اسم المستخدم");
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name')
        .eq('username', recipientUsername.trim())
        .single();

      if (error || !data) {
        toast.error("المستخدم غير موجود");
        setRecipientId(null);
        setRecipientInfo(null);
        return;
      }

      if (data.id === user?.id) {
        toast.error("لا يمكنك إرسال أموال لنفسك");
        setRecipientId(null);
        setRecipientInfo(null);
        return;
      }

      setRecipientId(data.id);
      setRecipientInfo(data);
      toast.success(`تم العثور على: ${data.full_name || data.username}`);
    } catch (error) {
      console.error('Error searching user:', error);
      toast.error("خطأ في البحث عن المستخدم");
    } finally {
      setSearching(false);
    }
  };

  const sendMoney = async () => {
    if (!user || !recipientId || amount <= 0 || !recipientInfo) {
      toast.error("يرجى ملء جميع الحقول بشكل صحيح");
      return;
    }

    setSending(true);
    try {
      // التحقق من الرصيد
      const { data: balance, error: balanceError } = await supabase
        .from('user_balances')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (balanceError || !balance || balance.balance < amount) {
        toast.error(`رصيد غير كافي. رصيدك الحالي: ${balance?.balance?.toLocaleString() || 0} د.ع`);
        return;
      }

      // الحصول على معلومات المرسل
      const { data: senderInfo, error: senderError } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('id', user.id)
        .single();

      if (senderError) {
        console.error('Error fetching sender info:', senderError);
        throw senderError;
      }

      // إنشاء معاملة الدفع
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          payer_id: user.id,
          receiver_id: recipientId,
          amount: amount,
          payment_method: 'wallet',
          status: 'completed',
          currency: 'IQD'
        });

      if (paymentError) throw paymentError;

      // تحديث رصيد المرسل
      const { error: senderError2 } = await supabase.rpc('update_user_balance_with_source', {
        _user_id: user.id,
        _amount: -amount,
        _transaction_type: 'payment',
        _source: 'wallet'
      });

      if (senderError2) throw senderError2;

      // تحديث رصيد المستلم
      const { error: receiverError } = await supabase.rpc('update_user_balance_with_source', {
        _user_id: recipientId,
        _amount: amount,
        _transaction_type: 'deposit',
        _source: 'wallet'
      });

      if (receiverError) throw receiverError;

      // إرسال إشعار للمستلم
      const senderName = senderInfo?.full_name || senderInfo?.username || 'مستخدم';
      const { error: notificationError } = await supabase.rpc('send_notification', {
        _user_id: recipientId,
        _title: 'تحويل مالي جديد',
        _body: `استلمت ${amount.toLocaleString()} د.ع من ${senderName}`,
        _type: 'payment',
        _related_id: null,
        _related_type: 'payment'
      });

      if (notificationError) {
        console.error('Error sending notification:', notificationError);
      }

      toast.success(`تم إرسال ${amount.toLocaleString()} د.ع إلى ${recipientInfo.full_name || recipientInfo.username} بنجاح!`);
      
      // إعادة تعيين النموذج
      setRecipientUsername("");
      setAmount(0);
      setDescription("");
      setRecipientId(null);
      setRecipientInfo(null);
      
      onSuccess?.();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error sending money:', error);
      toast.error(`خطأ في إرسال الأموال: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            إرسال أموال
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>اسم المستخدم المستلم</Label>
            <div className="flex gap-2">
              <Input
                value={recipientUsername}
                onChange={(e) => setRecipientUsername(e.target.value)}
                placeholder="اكتب اسم المستخدم"
                className="flex-1"
              />
              <Button
                onClick={searchUser}
                disabled={searching}
                size="sm"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {recipientInfo && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                ✓ تم العثور على: {recipientInfo.full_name || recipientInfo.username}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>المبلغ (دينار عراقي)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1000}
              step={1000}
              placeholder="0"
              disabled={!recipientId}
            />
            <p className="text-sm text-muted-foreground">الحد الأدنى: 1,000 د.ع</p>
          </div>

          <div className="space-y-2">
            <Label>وصف العملية (اختياري)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب وصف للعملية..."
              disabled={!recipientId}
            />
          </div>

          <Button
            onClick={sendMoney}
            disabled={!recipientId || amount < 1000 || sending}
            className="w-full"
          >
            {sending ? "جارٍ الإرسال..." : `إرسال ${amount.toLocaleString()} د.ع`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
