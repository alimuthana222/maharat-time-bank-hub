
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentDialog } from "@/components/marketplace/PaymentDialog";
import { CreditCard } from "lucide-react";

interface EnhancedPaymentButtonProps {
  amount: number;
  description: string;
  receiverId: string;
  bookingId?: string;
  onSuccess?: () => void;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  children?: React.ReactNode;
  className?: string;
}

export function EnhancedPaymentButton({
  amount,
  description,
  receiverId,
  bookingId,
  onSuccess,
  variant = "default",
  size = "default",
  children,
  className
}: EnhancedPaymentButtonProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handlePaymentSuccess = () => {
    setShowPaymentDialog(false);
    onSuccess?.();
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size}
        className={className}
        onClick={() => setShowPaymentDialog(true)}
      >
        {children || (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            دفع {amount.toLocaleString()} د.ع
          </>
        )}
      </Button>

      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        amount={amount}
        description={description}
        receiverId={receiverId}
        bookingId={bookingId}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
