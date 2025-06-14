
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function TimeBankPreview() {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalHours: 0,
    activeUsers: 0
  });

  useEffect(() => {
    fetchTimeBankStats();
  }, []);

  const fetchTimeBankStats = async () => {
    try {
      // Get total transactions
      const { count: transactionCount } = await supabase
        .from("time_bank_transactions")
        .select("*", { count: "exact", head: true });

      // Get total hours from completed transactions
      const { data: hoursData } = await supabase
        .from("time_bank_transactions")
        .select("hours")
        .eq("status", "completed");

      // Get active users count
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      const totalHours = hoursData?.reduce((sum, transaction) => sum + transaction.hours, 0) || 0;

      setStats({
        totalTransactions: transactionCount || 0,
        totalHours,
        activeUsers: usersCount || 0
      });
    } catch (error) {
      console.error("Error fetching timebank stats:", error);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">بنك الوقت</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            نظام تبادل المهارات بالوقت - ساعد الآخرين واكسب ساعات لتستفيد من خدماتهم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold">{stats.totalHours.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">إجمالي الساعات المتبادلة</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">إجمالي المعاملات</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">المستخدمون النشطون</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">كيف يعمل بنك الوقت؟</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <p className="text-gray-600">قدم خدمة أو مهارة لطالب آخر واكسب ساعات</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-blue-600">2</span>
                  </div>
                  <p className="text-gray-600">استخدم الساعات المكتسبة للحصول على خدمات من الآخرين</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-blue-600">3</span>
                  </div>
                  <p className="text-gray-600">بناء شبكة تبادل مهارات قوية مع زملائك</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
                <h4 className="text-xl font-bold mb-2">ابدأ رحلتك اليوم</h4>
                <p className="mb-4">انضم إلى مجتمع تبادل المهارات</p>
                <Button asChild variant="secondary">
                  <Link to="/timebank">
                    دخول بنك الوقت
                    <ArrowLeft className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
