
import React from "react";
import { TimeBankCard } from "@/components/timebank/TimeBankCard";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export interface TimeBankBalanceProps {
  balance: {
    hours_earned: number;
    hours_spent: number;
    hours_pending: number;
  } | null;
  loading: boolean;
}

export function TimeBankStats({ balance, loading }: TimeBankBalanceProps) {
  if (loading) {
    return (
      <Card className="col-span-3">
        <CardContent className="p-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <TimeBankCard
        title="الساعات المكتسبة"
        value={balance?.hours_earned || 0}
        description="إجمالي الساعات التي حصلت عليها"
        className="bg-gradient-to-r from-green-500 to-emerald-700"
      />
      <TimeBankCard
        title="الساعات المنفقة"
        value={balance?.hours_spent || 0}
        description="إجمالي الساعات التي أنفقتها"
        className="bg-gradient-to-r from-blue-500 to-indigo-700"
      />
      <TimeBankCard
        title="الساعات المعلقة"
        value={balance?.hours_pending || 0}
        description="الساعات التي في انتظار الموافقة"
        className="bg-gradient-to-r from-amber-500 to-orange-700"
      />
    </>
  );
}
