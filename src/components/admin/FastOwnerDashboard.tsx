
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Users, DollarSign, Activity, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { WithdrawalRequestsPanel } from "./WithdrawalRequestsPanel";
import { PaymentVerificationPanel } from "./PaymentVerificationPanel";

interface QuickStats {
  totalUsers: number;
  totalRevenue: number;
  activeServices: number;
  pendingPayments: number;
  pendingWithdrawals: number;
  systemHealth: "healthy" | "warning" | "error";
}

export function FastOwnerDashboard() {
  const [stats, setStats] = useState<QuickStats>({
    totalUsers: 0,
    totalRevenue: 0,
    activeServices: 0,
    pendingPayments: 0,
    pendingWithdrawals: 0,
    systemHealth: "healthy"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuickStats();
  }, []);

  const fetchQuickStats = async () => {
    try {
      setLoading(true);

      // جلب الإحصائيات الأساسية فقط للسرعة
      const [
        { count: totalUsers },
        { count: activeServices },
        { count: pendingPayments },
        { count: pendingWithdrawals }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('marketplace_listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('charge_transactions').select('*', { count: 'exact', head: true }).eq('manual_verification_status', 'pending'),
        supabase.from('withdrawal_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      // حساب الإيرادات بشكل مبسط
      const { data: completedPayments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .limit(100); // تحديد عدد السجلات للسرعة

      const totalRevenue = completedPayments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

      setStats({
        totalUsers: totalUsers || 0,
        totalRevenue,
        activeServices: activeServices || 0,
        pendingPayments: pendingPayments || 0,
        pendingWithdrawals: pendingWithdrawals || 0,
        systemHealth: "healthy"
      });

    } catch (error) {
      console.error('Error fetching quick stats:', error);
      setStats(prev => ({ ...prev, systemHealth: "error" }));
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = "text-primary",
    urgent = false
  }: {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: React.ElementType;
    color?: string;
    urgent?: boolean;
  }) => (
    <Card className={urgent ? "border-red-200 bg-red-50" : ""}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">لوحة تحكم المالك السريعة</h2>
        <Button variant="outline" onClick={fetchQuickStats}>
          تحديث الإحصائيات
        </Button>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="إجمالي المستخدمين"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          color="text-blue-600"
        />
        
        <StatCard
          title="إجمالي الإيرادات"
          value={`${stats.totalRevenue.toLocaleString()} د.ع`}
          subtitle="من المدفوعات المكتملة"
          icon={DollarSign}
          color="text-green-600"
        />
        
        <StatCard
          title="الخدمات النشطة"
          value={stats.activeServices}
          icon={Activity}
          color="text-purple-600"
        />
        
        <StatCard
          title="طلبات الشحن المعلقة"
          value={stats.pendingPayments}
          subtitle="تحتاج مراجعة"
          icon={Clock}
          color="text-yellow-600"
          urgent={stats.pendingPayments > 0}
        />
        
        <StatCard
          title="طلبات السحب المعلقة"
          value={stats.pendingWithdrawals}
          subtitle="تحتاج مراجعة"
          icon={TrendingUp}
          color="text-orange-600"
          urgent={stats.pendingWithdrawals > 0}
        />
        
        <StatCard
          title="حالة النظام"
          value={stats.systemHealth === "healthy" ? "ممتاز" : "يحتاج انتباه"}
          icon={AlertCircle}
          color={stats.systemHealth === "healthy" ? "text-green-600" : "text-red-600"}
        />
      </div>

      {/* تبويبات الإدارة */}
      <Tabs defaultValue="withdrawals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="withdrawals" className="relative">
            طلبات السحب
            {stats.pendingWithdrawals > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {stats.pendingWithdrawals}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="payments" className="relative">
            طلبات الشحن
            {stats.pendingPayments > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {stats.pendingPayments}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="withdrawals">
          <WithdrawalRequestsPanel />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentVerificationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
