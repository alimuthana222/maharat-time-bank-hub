
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  reservedBalance: number;
  lastUpdated?: string;
  showDetails?: boolean;
}

export function BalanceCard({ 
  balance, 
  reservedBalance, 
  lastUpdated,
  showDetails = true 
}: BalanceCardProps) {
  const availableBalance = balance - reservedBalance;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Wallet className="h-5 w-5" />
          رصيدك المالي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {availableBalance.toLocaleString()}
          </div>
          <div className="text-sm text-blue-700">دينار عراقي متاح</div>
        </div>

        {showDetails && (
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">{balance.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-600">إجمالي الرصيد</div>
            </div>
            
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                <TrendingDown className="h-4 w-4" />
                <span className="font-semibold">{reservedBalance.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-600">رصيد محجوز</div>
            </div>
          </div>
        )}

        {lastUpdated && (
          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              آخر تحديث: {new Date(lastUpdated).toLocaleDateString('ar-SA')}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
