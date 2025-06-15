
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ZainCashPayment } from "./ZainCashPayment";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, Wallet } from "lucide-react";

interface PaymentButtonProps {
  amount: number;
  description: string;
  onSuccess?: (transactionId: string) => void;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  children?: React.ReactNode;
}

export function PaymentButton({
  amount,
  description,
  onSuccess,
  variant = "default",
  size = "default",
  children
}: PaymentButtonProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handlePaymentSuccess = (transactionId: string) => {
    setShowPaymentDialog(false);
    onSuccess?.(transactionId);
  };

  return (
    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          {children || (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              دفع {amount.toLocaleString()} د.ع
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            إكمال الدفع
          </DialogTitle>
        </DialogHeader>
        <ZainCashPayment
          amount={amount}
          description={description}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentDialog(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
