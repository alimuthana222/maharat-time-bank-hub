
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface AdminChargeDialogProps {
  userId: string;
  userName: string;
  onSuccess?: () => void;
}

export function AdminChargeDialog({ userId, userName, onSuccess }: AdminChargeDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(10000);
  const [notes, setNotes] = useState("");

  const handleCharge = async () => {
    if (!user || amount <= 0) return;

    setLoading(true);
    try {
      // إنشاء معاملة الشحن
      const transactionId = `ADMIN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase
        .from('charge_transactions')
        .insert({
          user_id: userId,
          transaction_id: transactionId,
          amount: amount,
          payment_method: 'admin_credit',
          status: 'completed',
          admin_id: user.id,
          notes: notes || `شحن من الإدارة للمستخدم ${userName}`
        })
        .select()
        .single();

      if (error) throw error;

      // تحديث الرصيد
      const { error: balanceError } = await supabase.rpc('update_user_balance_with_source', {
        _user_id: userId,
        _amount: amount,
        _transaction_type: 'deposit',
        _source: 'admin'
      });

      if (balanceError) throw balanceError;

      toast.success(`تم شحن ${amount.toLocaleString()} د.ع للمستخدم ${userName}`);
      setOpen(false);
      setAmount(10000);
      setNotes("");
      onSuccess?.();

    } catch (error) {
      console.error('Charge error:', error);
      toast.error("حدث خطأ في عملية الشحن");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          شحن رصيد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>شحن رصيد للمستخدم: {userName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">المبلغ (دينار عراقي)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1000}
              step={1000}
              className="text-right"
              dir="rtl"
            />
          </div>

          <div>
            <Label htmlFor="notes">ملاحظات (اختيارية)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="سبب الشحن أو ملاحظات إضافية..."
              className="text-right"
              dir="rtl"
            />
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-800">
              سيتم إضافة <span className="font-bold">{amount.toLocaleString()}</span> دينار عراقي 
              إلى رصيد المستخدم <span className="font-bold">{userName}</span>
            </p>
          </div>

          <Button 
            onClick={handleCharge} 
            className="w-full"
            disabled={loading || amount <= 0}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                جاري الشحن...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                شحن {amount.toLocaleString()} د.ع
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
