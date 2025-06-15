
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Minus, 
  Send, 
  Receipt, 
  CreditCard
} from "lucide-react";
import { DepositDialog } from "@/components/payment/DepositDialog";
import { SendMoneyDialog } from "./SendMoneyDialog";
import { WithdrawDialog } from "./WithdrawDialog";
import { useAuth } from "@/components/auth/AuthProvider";

interface QuickActionsProps {
  onActionComplete?: () => void;
}

export function QuickActions({ onActionComplete }: QuickActionsProps) {
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showSendMoneyDialog, setShowSendMoneyDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const { user } = useAuth();

  const quickActions = [
    {
      title: "شحن الرصيد",
      description: "إضافة أموال للمحفظة",
      icon: Plus,
      action: () => setShowDepositDialog(true),
      color: "bg-green-500 hover:bg-green-600",
      iconColor: "text-white"
    },
    {
      title: "إرسال أموال",
      description: "تحويل للمستخدمين",
      icon: Send,
      action: () => setShowSendMoneyDialog(true),
      color: "bg-blue-500 hover:bg-blue-600",
      iconColor: "text-white"
    },
    {
      title: "طلب سحب",
      description: "سحب إلى ZainCash",
      icon: Minus,
      action: () => setShowWithdrawDialog(true),
      color: "bg-orange-500 hover:bg-orange-600",
      iconColor: "text-white"
    },
    {
      title: "الفواتير",
      description: "عرض الفواتير",
      icon: Receipt,
      action: () => console.log("Bills"),
      color: "bg-purple-500 hover:bg-purple-600",
      iconColor: "text-white"
    }
  ];

  const handleDepositSuccess = (transactionId: string) => {
    setShowDepositDialog(false);
    onActionComplete?.();
  };

  const handleActionComplete = () => {
    onActionComplete?.();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            العمليات السريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                  onClick={action.action}
                >
                  <div className={`p-2 rounded-full ${action.color}`}>
                    <IconComponent className={`h-4 w-4 ${action.iconColor}`} />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <DepositDialog onSuccess={handleDepositSuccess} />
      
      <SendMoneyDialog
        open={showSendMoneyDialog}
        onOpenChange={setShowSendMoneyDialog}
        onSuccess={handleActionComplete}
      />
      
      <WithdrawDialog
        open={showWithdrawDialog}
        onOpenChange={setShowWithdrawDialog}
        onSuccess={handleActionComplete}
      />
    </>
  );
}
