
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface MastercardPaymentProps {
  amount: number;
  description: string;
  onSuccess?: (transactionId: string) => void;
  onCancel?: () => void;
}

export function MastercardPayment({ 
  amount, 
  description, 
  onSuccess, 
  onCancel 
}: MastercardPaymentProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });

  const handleInputChange = (field: string, value: string) => {
    if (field === "cardNumber") {
      // تنسيق رقم البطاقة
      value = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
      if (value.length > 19) return;
    } else if (field === "expiryDate") {
      // تنسيق تاريخ انتهاء الصلاحية
      value = value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4);
      }
      if (value.length > 5) return;
    } else if (field === "cvv") {
      // CVV فقط أرقام
      value = value.replace(/\D/g, "");
      if (value.length > 4) return;
    }

    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const validateCard = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = cardData;
    
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("رقم البطاقة غير صحيح");
      return false;
    }
    
    if (!expiryDate || expiryDate.length < 5) {
      toast.error("تاريخ انتهاء الصلاحية غير صحيح");
      return false;
    }
    
    if (!cvv || cvv.length < 3) {
      toast.error("رمز الأمان غير صحيح");
      return false;
    }
    
    if (!cardholderName.trim()) {
      toast.error("اسم حامل البطاقة مطلوب");
      return false;
    }
    
    return true;
  };

  const handlePayment = async () => {
    if (!user || !validateCard()) return;

    setLoading(true);
    try {
      // إنشاء معاملة الدفع
      const transactionId = `MC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase
        .from('charge_transactions')
        .insert({
          user_id: user.id,
          transaction_id: transactionId,
          amount: amount,
          payment_method: 'mastercard',
          status: 'completed', // في التطبيق الحقيقي سيكون pending حتى يتم التأكيد
          notes: description
        })
        .select()
        .single();

      if (error) throw error;

      // تحديث الرصيد
      const { error: balanceError } = await supabase.rpc('update_user_balance_with_source', {
        _user_id: user.id,
        _amount: amount,
        _transaction_type: 'deposit',
        _source: 'mastercard'
      });

      if (balanceError) throw balanceError;

      toast.success("تم الدفع بنجاح!");
      onSuccess?.(data.id);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error("حدث خطأ في عملية الدفع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          الدفع بالماستر كارد
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <p className="text-sm text-blue-800">
            المبلغ: <span className="font-bold">{amount.toLocaleString()}</span> دينار عراقي
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="cardholderName">اسم حامل البطاقة</Label>
            <Input
              id="cardholderName"
              value={cardData.cardholderName}
              onChange={(e) => handleInputChange("cardholderName", e.target.value)}
              placeholder="اسم حامل البطاقة"
              dir="rtl"
            />
          </div>

          <div>
            <Label htmlFor="cardNumber">رقم البطاقة</Label>
            <Input
              id="cardNumber"
              value={cardData.cardNumber}
              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
              placeholder="1234 5678 9012 3456"
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="expiryDate">تاريخ انتهاء الصلاحية</Label>
              <Input
                id="expiryDate"
                value={cardData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                placeholder="MM/YY"
                dir="ltr"
              />
            </div>
            <div>
              <Label htmlFor="cvv">رمز الأمان</Label>
              <Input
                id="cvv"
                value={cardData.cvv}
                onChange={(e) => handleInputChange("cvv", e.target.value)}
                placeholder="123"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handlePayment} 
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                دفع {amount.toLocaleString()} د.ع
              </>
            )}
          </Button>
          
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              إلغاء
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
