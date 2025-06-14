
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { RealEventsList } from "@/components/events/RealEventsList";
import { CreateEventForm } from "@/components/events/CreateEventForm";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer } from "@/components/ui/mobile-responsive";
import { Plus, Calendar } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function RealEvents() {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <ResponsiveContainer className="pt-20 pb-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">الفعاليات</h1>
                <p className="text-muted-foreground">
                  اكتشف الفعاليات التعليمية والمهنية في العراق
                </p>
              </div>
              
              {user && (
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                  <Plus className="h-4 w-4 mr-2" />
                  إنشاء فعالية
                </Button>
              )}
            </div>
          </div>

          {showCreateForm && (
            <div className="mb-8">
              <CreateEventForm
                onEventCreated={() => setShowCreateForm(false)}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          )}

          <RealEventsList />
        </ResponsiveContainer>
      </main>

      <Footer />
    </div>
  );
}
