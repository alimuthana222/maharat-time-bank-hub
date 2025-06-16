
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  UserCog,
  Shield,
  Settings,
  BarChart3,
  PieChart,
  Calendar,
  Bell,
  RefreshCw
} from "lucide-react";
import { OwnerUserManagement } from "./OwnerUserManagement";
import { WithdrawalRequestsPanel } from "./WithdrawalRequestsPanel";
import { PaymentVerificationPanel } from "./PaymentVerificationPanel";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell
} from "recharts";

interface DashboardData {
  totalUsers: number;
  totalRevenue: number;
  activeServices: number;
  pendingRequests: number;
  monthlyGrowth: number;
  revenueGrowth: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function ImprovedOwnerDashboard() {
  const [data, setData] = useState<DashboardData>({
    totalUsers: 0,
    totalRevenue: 0,
    activeServices: 0,
    pendingRequests: 0,
    monthlyGrowth: 0,
    revenueGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
    fetchChartData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // جلب إجمالي المستخدمين
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // جلب الخدمات النشطة
      const { count: activeServices } = await supabase
        .from('marketplace_listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // جلب طلبات السحب المعلقة
      const { count: pendingRequests } = await supabase
        .from('withdrawal_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // حساب الإيرادات (مبسط)
      const { data: completedBookings } = await supabase
        .from('bookings')
        .select('total_hours, service_id')
        .eq('status', 'completed');

      const { data: services } = await supabase
        .from('marketplace_listings')
        .select('id, hourly_rate');

      let totalRevenue = 0;
      if (completedBookings && services) {
        const serviceRatesMap = new Map(services.map(s => [s.id, s.hourly_rate]));
        totalRevenue = completedBookings.reduce((sum, booking) => {
          const hourlyRate = serviceRatesMap.get(booking.service_id) || 0;
          return sum + (hourlyRate * (booking.total_hours || 0));
        }, 0);
      }

      setData({
        totalUsers: totalUsers || 0,
        totalRevenue,
        activeServices: activeServices || 0,
        pendingRequests: pendingRequests || 0,
        monthlyGrowth: 12.5,
        revenueGrowth: 8.3,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    // بيانات وهمية للرسوم البيانية - يمكن استبدالها بالبيانات الحقيقية
    const monthlyData = [
      { month: 'يناير', users: 120, revenue: 15000 },
      { month: 'فبراير', users: 150, revenue: 18000 },
      { month: 'مارس', users: 200, revenue: 22000 },
      { month: 'أبريل', users: 250, revenue: 28000 },
      { month: 'مايو', users: 300, revenue: 35000 },
      { month: 'يونيو', users: 380, revenue: 42000 },
    ];
    setChartData(monthlyData);
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = "text-primary",
    growth,
    urgent = false
  }: {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: React.ElementType;
    color?: string;
    growth?: number;
    urgent?: boolean;
  }) => (
    <Card className={`${urgent ? "border-red-200 bg-red-50" : ""} hover:shadow-lg transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {growth !== undefined && (
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+{growth}%</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full bg-primary/10`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">لوحة تحكم المالك</h2>
          <p className="text-muted-foreground">إدارة شاملة للنظام والمستخدمين</p>
        </div>
        <Button variant="outline" onClick={fetchDashboardData} className="gap-2">
          <RefreshCw className="h-4 w-4" />
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
          growth={data.monthlyGrowth}
        />
        
        <StatCard
          title="إجمالي الإيرادات"
          value={`${data.totalRevenue.toLocaleString()} د.ع`}
          subtitle="من الخدمات المكتملة"
          icon={DollarSign}
          color="text-green-600"
          growth={data.revenueGrowth}
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
          icon={Bell}
          color="text-orange-600"
          urgent={data.pendingRequests > 0}
        />
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              نمو المستخدمين الشهري
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              نمو الإيرادات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* تبويبات الإدارة */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="gap-2">
            <UserCog className="h-4 w-4" />
            إدارة المستخدمين
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="gap-2">
            <DollarSign className="h-4 w-4" />
            طلبات السحب
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <Activity className="h-4 w-4" />
            طلبات الشحن
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            إعدادات النظام
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <OwnerUserManagement />
        </TabsContent>

        <TabsContent value="withdrawals">
          <WithdrawalRequestsPanel />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentVerificationPanel />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات النظام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">إعدادات الأمان</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        إدارة إعدادات الأمان والمصادقة
                      </p>
                      <Button className="mt-4" variant="outline">
                        تكوين الأمان
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">إعدادات النظام</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        تكوين إعدادات النظام العامة
                      </p>
                      <Button className="mt-4" variant="outline">
                        إدارة الإعدادات
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
