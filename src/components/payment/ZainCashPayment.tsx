
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Smartphone, DollarSign, Clock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface ZainCashPaymentProps {
  amount: number;
  description: string;
  onSuccess?: (transactionId: string) => void;
  onCancel?: () => void;
}

export function ZainCashPayment({ amount, description, onSuccess, onCancel }: ZainCashPaymentProps) {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'input' | 'processing' | 'completed' | 'failed'>('input');

  const validatePhoneNumber = (phone: string) => {
    // التحقق من رقم زين العراقي
    const zainPattern = /^(964)?7[89]\d{8}$/;
    return zainPattern.test(phone.replace(/\s+/g, ''));
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("رقم الهاتف غير صحيح. يجب أن يكون رقم زين عراقي صالح");
      return;
    }

    if (!transactionId.trim()) {
      toast.error("يرجى إدخال رقم المعاملة");
      return;
    }

    setLoading(true);
    setStatus('processing');

    try {
      // إنشاء معاملة Zain Cash
      const { data, error } = await supabase
        .from('zain_cash_transactions')
        .insert({
          user_id: user.id,
          transaction_id: transactionId,
          phone_number: phoneNumber,
          amount: amount,
          transaction_type: 'payment',
          description: description,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // محاكاة عملية التحقق من الدفع (في التطبيق الحقيقي، ستكون هذه عملية API call لزين كاش)
      setTimeout(async () => {
        try {
          // تحديث حالة المعاملة
          const { error: updateError } = await supabase
            .from('zain_cash_transactions')
            .update({ status: 'completed' })
            .eq('id', data.id);

          if (updateError) throw updateError;

          setStatus('completed');
          toast.success("تم الدفع بنجاح!");
          
          if (onSuccess) {
            onSuccess(data.transaction_id);
          }
        } catch (error) {
          console.error('Error updating transaction:', error);
          setStatus('failed');
          toast.error("فشل في تأكيد الدفع");
        }
      }, 3000);

    } catch (error) {
      console.error('Payment error:', error);
      setStatus('failed');
      toast.error("حدث خطأ في عملية الدفع");
    } finally {
      setLoading(false);
    }
  };

  const StatusDisplay = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto text-yellow-500 animate-spin mb-4" />
            <h3 className="text-lg font-semibold mb-2">جارٍ التحقق من الدفع...</h3>
            <p className="text-muted-foreground">يرجى الانتظار بينما نتحقق من معاملة الدفع</p>
          </div>
        );
      case 'completed':
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-green-600">تم الدفع بنجاح!</h3>
            <p className="text-muted-foreground">رقم المعاملة: {transactionId}</p>
          </div>
        );
      case 'failed':
        return (
          <div className="text-center py-8">
            <div className="h-12 w-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-500 text-xl">✕</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-red-600">فشل في عملية الدفع</h3>
            <p className="text-muted-foreground">يرجى المحاولة مرة أخرى</p>
            <Button variant="outline" onClick={() => setStatus('input')} className="mt-4">
              إعادة المحاولة
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  if (status !== 'input') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <StatusDisplay />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Smartphone className="h-6 w-6 text-blue-600" />
          <CardTitle>دفع بواسطة زين كاش</CardTitle>
        </div>
        <div className="flex items-center justify-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <span className="text-2xl font-bold">{amount.toLocaleString()} د.ع</span>
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">تعليمات الدفع:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. اتصل بـ *120# من هاتف زين</li>
            <li>2. اختر خدمات الدفع</li>
            <li>3. أدخل المبلغ: {amount.toLocaleString()} د.ع</li>
            <li>4. أكمل العملية واحصل على رقم المعاملة</li>
          </ol>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="phone">رقم هاتف زين</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="07xxxxxxxx"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="text-left"
              dir="ltr"
            />
          </div>

          <div>
            <Label htmlFor="transactionId">رقم المعاملة من زين كاش</Label>
            <Input
              id="transactionId"
              type="text"
              placeholder="أدخل رقم المعاملة"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handlePayment} 
            disabled={loading || !phoneNumber || !transactionId}
            className="flex-1"
          >
            {loading ? "جارٍ التحقق..." : "تأكيد الدفع"}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              إلغاء
            </Button>
          )}
        </div>

        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            آمن ومحمي بواسطة زين كاش
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
