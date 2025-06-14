
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { RealCommunityPosts } from "@/components/community/RealCommunityPosts";
import { ResponsiveContainer } from "@/components/ui/mobile-responsive";

export default function RealCommunity() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <ResponsiveContainer className="pt-20 pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">المجتمع</h1>
            <p className="text-muted-foreground">
              تواصل مع زملائك الطلاب في الجامعات العراقية وشارك معارفك وخبراتك
            </p>
          </div>

          <RealCommunityPosts />
        </ResponsiveContainer>
      </main>

      <Footer />
    </div>
  );
}
