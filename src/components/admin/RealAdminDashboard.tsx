import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Users, DollarSign, Activity, AlertTriangle, TrendingUp, Clock, UserCog } from "lucide-react";
import { WithdrawalRequestsPanel } from "./WithdrawalRequestsPanel";
import { PaymentVerificationPanel } from "./PaymentVerificationPanel";
import { AdminUserManagement } from "./AdminUserManagement";

interface RealAdminDashboardData {
  totalUsers: number;
  totalRevenue: number;
  activeServices: number;
  pendingRequests: number;
}

export function RealAdminDashboard() {
  const [data, setData] = useState<RealAdminDashboardData>({
    totalUsers: 0,
    totalRevenue: 0,
    activeServices: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch active services
      const { count: activeServices } = await supabase
        .from('marketplace_listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Calculate revenue from completed bookings (simplified calculation)
      const { data: completedBookings } = await supabase
        .from('bookings')
        .select('total_hours, service_id')
        .eq('status', 'completed');

      // Get services with hourly rates
      const { data: services } = await supabase
        .from('marketplace_listings')
        .select('id, hourly_rate');

      // Calculate total revenue
      let totalRevenue = 0;
      if (completedBookings && services) {
        const serviceRatesMap = new Map(services.map(s => [s.id, s.hourly_rate]));
        totalRevenue = completedBookings.reduce((sum, booking) => {
          const hourlyRate = serviceRatesMap.get(booking.service_id) || 0;
          return sum + (hourlyRate * (booking.total_hours || 0));
        }, 0);
      }

      // Fetch pending requests count (e.g. pending withdrawal requests)
      const { count: pendingRequests } = await supabase
        .from('withdrawal_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setData({
        totalUsers: totalUsers || 0,
        totalRevenue,
        activeServices: activeServices || 0,
        pendingRequests: pendingRequests || 0,
      });
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">لوحة تحكم المدير</h2>
        <Button variant="outline" onClick={fetchDashboardData}>
          تحديث البيانات
        </Button>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المستخدمين"
          value={data.totalUsers.toLocaleString()}
          icon={Users}
          color="text-blue-600"
        />
        
        <StatCard
          title="إجمالي الإيرادات"
          value={`${data.totalRevenue.toLocaleString()} د.ع`}
          subtitle="من الخدمات المكتملة"
          icon={DollarSign}
          color="text-green-600"
        />
        
        <StatCard
          title="الخدمات النشطة"
          value={data.activeServices}
          icon={Activity}
          color="text-purple-600"
        />
        
        <StatCard
          title="طلبات معلقة"
          value={data.pendingRequests}
          subtitle="تحتاج مراجعة"
          icon={Clock}
          color="text-orange-600"
          urgent={data.pendingRequests > 0}
        />
      </div>

      {/* تبويبات الإدارة */}
      <Tabs defaultValue="withdrawals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="withdrawals">طلبات السحب</TabsTrigger>
          <TabsTrigger value="payments">طلبات الشحن</TabsTrigger>
          <TabsTrigger value="moderators" className="relative">
            <UserCog className="h-4 w-4 mr-2" />
            إدارة المشرفين
          </TabsTrigger>
        </TabsList>

        <TabsContent value="withdrawals">
          <WithdrawalRequestsPanel />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentVerificationPanel />
        </TabsContent>

        <TabsContent value="moderators">
          <AdminUserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
