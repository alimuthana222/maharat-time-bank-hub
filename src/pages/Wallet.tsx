
import React from "react";
import { UserBalance } from "@/components/payment/UserBalance";

export default function Wallet() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">المحفظة المالية</h1>
          <p className="text-muted-foreground">
            إدارة رصيدك وعرض تاريخ المعاملات المالية
          </p>
        </div>
        
        <UserBalance />
      </div>
    </div>
  );
}
