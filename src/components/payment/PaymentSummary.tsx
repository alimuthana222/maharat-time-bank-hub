
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Receipt, AlertCircle } from "lucide-react";

interface PaymentSummaryProps {
  amount: number;
  description: string;
  paymentMethod: string;
  processingFee?: number;
  totalAmount?: number;
}

export function PaymentSummary({ 
  amount, 
  description, 
  paymentMethod,
  processingFee = 0,
  totalAmount
}: PaymentSummaryProps) {
  const finalAmount = totalAmount || (amount + processingFee);
  
  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'wallet':
        return 'المحفظة الداخلية';
      case 'zaincash_manual':
        return 'ZainCash';
      default:
        return method;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          ملخص الدفع
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">تفاصيل العملية</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>المبلغ الأساسي</span>
            <span className="font-medium">{amount.toLocaleString()} د.ع</span>
          </div>
          
          {processingFee > 0 && (
            <div className="flex justify-between">
              <span>رسوم المعالجة</span>
              <span className="font-medium">{processingFee.toLocaleString()} د.ع</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between text-lg font-bold">
            <span>المجموع الكلي</span>
            <span>{finalAmount.toLocaleString()} د.ع</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-sm">طريقة الدفع</span>
          <Badge variant="outline">
            {getPaymentMethodName(paymentMethod)}
          </Badge>
        </div>

        {paymentMethod === 'zaincash_manual' && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">ملاحظة مهمة</p>
              <p>سيتم معالجة الدفع عبر ZainCash وسيتطلب التحقق اليدوي من قبل الإدارة</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
