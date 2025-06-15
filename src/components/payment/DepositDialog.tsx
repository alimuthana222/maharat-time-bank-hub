
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { ZainCashPayment } from "./ZainCashPayment";

interface DepositDialogProps {
  onSuccess?: (transactionId: string) => void;
}

export function DepositDialog({ onSuccess }: DepositDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(10000);
  const [showPayment, setShowPayment] = useState(false);

  const presetAmounts = [5000, 10000, 25000, 50000, 100000];

  const handleDepositSuccess = (transactionId: string) => {
    setOpen(false);
    setShowPayment(false);
    setAmount(10000);
    onSuccess?.(transactionId);
  };

  const handleProceedToPayment = () => {
    if (amount >= 1000) {
      setShowPayment(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          إيداع رصيد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>إيداع رصيد جديد</DialogTitle>
        </DialogHeader>
        
        {!showPayment ? (
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
              <p className="text-sm text-muted-foreground mt-1">
                الحد الأدنى: 1,000 د.ع
              </p>
            </div>

            <div>
              <Label>مبالغ سريعة</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAmount(preset)}
                  >
                    {preset.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                سيتم إضافة <span className="font-bold">{amount.toLocaleString()}</span> دينار عراقي إلى رصيدك
              </p>
            </div>

            <Button 
              onClick={handleProceedToPayment} 
              className="w-full"
              disabled={amount < 1000}
            >
              متابعة إلى الدفع
            </Button>
          </div>
        ) : (
          <ZainCashPayment
            amount={amount}
            description="إيداع رصيد في المحفظة"
            onSuccess={handleDepositSuccess}
            onCancel={() => setShowPayment(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
