
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface PaymentData {
  amount: number;
  description: string;
  receiverId: string;
  bookingId?: string;
}

export function usePayment() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const processPayment = async (paymentData: PaymentData): Promise<boolean> => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return false;
    }

    setLoading(true);

    try {
      // التحقق من الرصيد
      const { data: balance, error: balanceError } = await supabase
        .from('user_balances')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (balanceError) {
        throw new Error("فشل في الحصول على الرصيد");
      }

      if (!balance || balance.balance < paymentData.amount) {
        toast.error("رصيد غير كافي");
        return false;
      }

      // إنشاء معاملة الدفع
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          payer_id: user.id,
          receiver_id: paymentData.receiverId,
          booking_id: paymentData.bookingId,
          amount: paymentData.amount,
          payment_method: 'zain_cash',
          status: 'completed',
          currency: 'IQD'
        })
        .select()
        .single();

      if (paymentError) {
        throw paymentError;
      }

      // تحديث الرصيد
      const { error: updateError } = await supabase.rpc('update_user_balance', {
        _user_id: user.id,
        _amount: paymentData.amount,
        _transaction_type: 'payment'
      });

      if (updateError) {
        throw updateError;
      }

      // إنشاء سجل في معاملات زين كاش
      await supabase
        .from('zain_cash_transactions')
        .insert({
          user_id: user.id,
          transaction_id: `PAY_${payment.id.slice(0, 8)}`,
          phone_number: 'wallet_payment',
          amount: paymentData.amount,
          transaction_type: 'payment',
          status: 'completed',
          description: paymentData.description
        });

      toast.success("تم الدفع بنجاح!");
      return true;

    } catch (error) {
      console.error('Payment error:', error);
      toast.error("حدث خطأ في عملية الدفع");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    processPayment,
    loading
  };
}
