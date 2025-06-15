
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { EnhancedWallet } from "@/components/wallet/EnhancedWallet";

export default function Wallet() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <EnhancedWallet />
      </main>
    </div>
  );
}
