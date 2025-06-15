
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { MessageSystem } from "@/components/messaging/MessageSystem";
import { ResponsiveContainer } from "@/components/ui/mobile-responsive";
import { MessageCircle } from "lucide-react";

export default function Messages() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <ResponsiveContainer className="pt-20 pb-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold">الرسائل</h1>
                <p className="text-muted-foreground">
                  تواصل مع زملائك الطلاب ومقدمي الخدمات
                </p>
              </div>
            </div>
          </div>

          <MessageSystem />
        </ResponsiveContainer>
      </main>

      <Footer />
    </div>
  );
}
