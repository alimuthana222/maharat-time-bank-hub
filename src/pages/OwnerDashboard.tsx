
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { RealOwnerDashboard } from "@/components/admin/RealOwnerDashboard";
import { ResponsiveContainer } from "@/components/ui/mobile-responsive";

export default function OwnerDashboard() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <ResponsiveContainer className="pt-20 pb-8">
          <RealOwnerDashboard />
        </ResponsiveContainer>
      </main>
    </div>
  );
}
