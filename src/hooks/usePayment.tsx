
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
        console.error("Balance fetch error:", balanceError);
        throw new Error("فشل في الحصول على الرصيد");
      }

      if (!balance || balance.balance < paymentData.amount) {
        toast.error(`رصيد غير كافي. رصيدك الحالي: ${balance?.balance?.toLocaleString() || 0} د.ع`);
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
          payment_method: 'wallet',
          status: 'completed',
          currency: 'IQD'
        })
        .select()
        .single();

      if (paymentError) {
        console.error("Payment creation error:", paymentError);
        throw paymentError;
      }

      // تحديث الرصيد للدافع
      const { error: updatePayerError } = await supabase.rpc('update_user_balance_with_source', {
        _user_id: user.id,
        _amount: -paymentData.amount,
        _transaction_type: 'payment',
        _source: 'wallet'
      });

      if (updatePayerError) {
        console.error("Payer balance update error:", updatePayerError);
        throw updatePayerError;
      }

      // تحديث الرصيد للمستلم
      const { error: updateReceiverError } = await supabase.rpc('update_user_balance_with_source', {
        _user_id: paymentData.receiverId,
        _amount: paymentData.amount,
        _transaction_type: 'deposit',
        _source: 'wallet'
      });

      if (updateReceiverError) {
        console.error("Receiver balance update error:", updateReceiverError);
        throw updateReceiverError;
      }

      toast.success(`تم الدفع بنجاح! تم خصم ${paymentData.amount.toLocaleString()} د.ع من رصيدك`);
      return true;

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(`حدث خطأ في عملية الدفع: ${error.message}`);
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
