
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MastercardPayment } from "@/components/payment/MastercardPayment";
import { usePayment } from "@/hooks/usePayment";
import { Wallet, CreditCard } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  description: string;
  receiverId: string;
  bookingId?: string;
  onSuccess: () => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  amount,
  description,
  receiverId,
  bookingId,
  onSuccess
}: PaymentDialogProps) {
  const { processPayment, loading } = usePayment();
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'mastercard'>('wallet');

  const handleWalletPayment = async () => {
    const success = await processPayment({
      amount,
      description,
      receiverId,
      bookingId
    });

    if (success) {
      onSuccess();
      onOpenChange(false);
    }
  };

  const handleMastercardSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>اختر طريقة الدفع</DialogTitle>
        </DialogHeader>

        <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'wallet' | 'mastercard')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              المحفظة
            </TabsTrigger>
            <TabsTrigger value="mastercard" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              ماستر كارد
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold">{amount.toLocaleString()} د.ع</div>
                  <p className="text-muted-foreground">{description}</p>
                  
                  <Button 
                    onClick={handleWalletPayment}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "جارٍ الدفع..." : "ادفع من المحفظة"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mastercard" className="mt-4">
            <MastercardPayment
              amount={amount}
              description={description}
              onSuccess={handleMastercardSuccess}
              onCancel={() => onOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
