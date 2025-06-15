
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { Minus, Phone, AlertCircle } from "lucide-react";

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function WithdrawDialog({ open, onOpenChange, onSuccess }: WithdrawDialogProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState(0);
  const [zaincashPhone, setZaincashPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitWithdrawRequest = async () => {
    if (!user || amount < 5000 || !zaincashPhone.trim()) {
      toast.error("يرجى ملء جميع الحقول بشكل صحيح");
      return;
    }

    setSubmitting(true);
    try {
      // التحقق من الرصيد
      const { data: balance, error: balanceError } = await supabase
        .from('user_balances')
        .select('balance, reserved_balance')
        .eq('user_id', user.id)
        .single();

      if (balanceError || !balance || balance.balance < amount) {
        toast.error(`رصيد غير كافي. رصيدك الحالي: ${balance?.balance?.toLocaleString() || 0} د.ع`);
        return;
      }

      // إنشاء طلب السحب
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: user.id,
          amount: amount,
          zaincash_phone: zaincashPhone,
          notes: notes,
          status: 'pending'
        });

      if (error) throw error;

      // حجز المبلغ من الرصيد المتاح
      const { error: reserveError } = await supabase
        .from('user_balances')
        .update({
          balance: balance.balance - amount,
          reserved_balance: (balance.reserved_balance || 0) + amount
        })
        .eq('user_id', user.id);

      if (reserveError) throw reserveError;

      toast.success("تم تقديم طلب السحب بنجاح! سيتم مراجعته من قبل الإدارة");
      
      // إعادة تعيين النموذج
      setAmount(0);
      setZaincashPhone("");
      setNotes("");
      
      onSuccess?.();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error submitting withdrawal request:', error);
      toast.error(`خطأ في تقديم طلب السحب: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Minus className="h-5 w-5" />
            طلب سحب رصيد
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">ملاحظة مهمة</p>
                <p>سيتم مراجعة طلب السحب من قبل الإدارة وسيتم التحويل عبر ZainCash خلال 24-48 ساعة</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>المبلغ المراد سحبه (دينار عراقي)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={5000}
              step={1000}
              placeholder="0"
            />
            <p className="text-sm text-muted-foreground">الحد الأدنى: 5,000 د.ع</p>
          </div>

          <div className="space-y-2">
            <Label>رقم ZainCash للتحويل</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={zaincashPhone}
                onChange={(e) => setZaincashPhone(e.target.value)}
                placeholder="07xxxxxxxxx"
                className="pl-10"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>ملاحظات إضافية (اختياري)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي ملاحظات خاصة بطلب السحب..."
            />
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              سيتم حجز المبلغ من رصيدك فور تقديم الطلب وسيتم إرجاعه في حالة رفض الطلب
            </p>
          </div>

          <Button
            onClick={submitWithdrawRequest}
            disabled={amount < 5000 || !zaincashPhone.trim() || submitting}
            className="w-full"
          >
            {submitting ? "جارٍ تقديم الطلب..." : `تقديم طلب سحب ${amount.toLocaleString()} د.ع`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
