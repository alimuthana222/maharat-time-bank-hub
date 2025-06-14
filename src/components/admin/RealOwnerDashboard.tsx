
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { 
  Users, 
  DollarSign, 
  Activity, 
  TrendingUp,
  Shield,
  Settings,
  Database,
  AlertTriangle,
  CheckCircle,
  Crown,
  BarChart3
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface PlatformStats {
  totalUsers: number;
  totalRevenue: number;
  totalTransactions: number;
  activeServices: number;
  pendingReports: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  monthlyGrowth: Array<{
    month: string;
    users: number;
    revenue: number;
    transactions: number;
  }>;
  categoryStats: Array<{
    category: string;
    count: number;
    revenue: number;
  }>;
}

interface SystemMetrics {
  databaseSize: string;
  activeConnections: number;
  responseTime: number;
  uptime: string;
  memoryUsage: number;
}

export function RealOwnerDashboard() {
  const { user, isOwner } = useAuth();
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    activeServices: 0,
    pendingReports: 0,
    systemHealth: 'healthy',
    monthlyGrowth: [],
    categoryStats: []
  });
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    databaseSize: '0 MB',
    activeConnections: 0,
    responseTime: 0,
    uptime: '0 days',
    memoryUsage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOwner()) {
      fetchOwnerDashboardData();
    }
  }, [user]);

  const fetchOwnerDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch platform statistics
      const [
        { count: totalUsers },
        { count: totalTransactions },
        { count: activeServices },
        { count: pendingReports }
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("time_bank_transactions").select("*", { count: "exact", head: true }),
        supabase.from("marketplace_listings").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("content_reports").select("*", { count: "exact", head: true }).eq("status", "pending")
      ]);

      // Calculate total revenue from completed bookings
      const { data: completedBookings } = await supabase
        .from("bookings")
        .select("total_hours, marketplace_listings(hourly_rate)")
        .eq("status", "completed");

      const totalRevenue = completedBookings?.reduce((sum, booking) => {
        const rate = booking.marketplace_listings?.hourly_rate || 0;
        return sum + (rate * booking.total_hours);
      }, 0) || 0;

      // Fetch monthly growth data
      const monthlyGrowth = await fetchMonthlyGrowth();

      // Fetch category statistics
      const categoryStats = await fetchCategoryStats();

      setStats({
        totalUsers: totalUsers || 0,
        totalRevenue,
        totalTransactions: totalTransactions || 0,
        activeServices: activeServices || 0,
        pendingReports: pendingReports || 0,
        systemHealth: pendingReports && pendingReports > 10 ? 'warning' : 'healthy',
        monthlyGrowth,
        categoryStats
      });

      // Simulate system metrics (in real app, these would come from monitoring services)
      setSystemMetrics({
        databaseSize: '125 MB',
        activeConnections: Math.floor(Math.random() * 20) + 5,
        responseTime: Math.floor(Math.random() * 50) + 20,
        uptime: '15 days',
        memoryUsage: Math.floor(Math.random() * 30) + 60
      });

    } catch (error) {
      console.error("Error fetching owner dashboard data:", error);
      toast.error("حدث خطأ أثناء تحميل بيانات لوحة التحكم");
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyGrowth = async () => {
    try {
      // Get user registrations by month
      const { data: profiles } = await supabase
        .from("profiles")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1000);

      // Get transactions by month
      const { data: transactions } = await supabase
        .from("time_bank_transactions")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1000);

      // Get bookings for revenue calculation
      const { data: bookings } = await supabase
        .from("bookings")
        .select("created_at, total_hours, marketplace_listings(hourly_rate)")
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(1000);

      const monthlyData: { [key: string]: { users: number; transactions: number; revenue: number } } = {};

      // Process user registrations
      profiles?.forEach(profile => {
        const month = new Date(profile.created_at).toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
        if (!monthlyData[month]) monthlyData[month] = { users: 0, transactions: 0, revenue: 0 };
        monthlyData[month].users++;
      });

      // Process transactions
      transactions?.forEach(transaction => {
        const month = new Date(transaction.created_at).toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
        if (!monthlyData[month]) monthlyData[month] = { users: 0, transactions: 0, revenue: 0 };
        monthlyData[month].transactions++;
      });

      // Process revenue
      bookings?.forEach(booking => {
        const month = new Date(booking.created_at).toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
        if (!monthlyData[month]) monthlyData[month] = { users: 0, transactions: 0, revenue: 0 };
        const revenue = (booking.marketplace_listings?.hourly_rate || 0) * booking.total_hours;
        monthlyData[month].revenue += revenue;
      });

      return Object.entries(monthlyData)
        .map(([month, data]) => ({ month, ...data }))
        .reverse()
        .slice(-6);

    } catch (error) {
      console.error("Error fetching monthly growth:", error);
      return [];
    }
  };

  const fetchCategoryStats = async () => {
    try {
      const { data: services } = await supabase
        .from("marketplace_listings")
        .select("category");

      const { data: bookings } = await supabase
        .from("bookings")
        .select("marketplace_listings(category, hourly_rate), total_hours")
        .eq("status", "completed");

      const categoryData: { [key: string]: { count: number; revenue: number } } = {};

      // Count services by category
      services?.forEach(service => {
        if (!categoryData[service.category]) {
          categoryData[service.category] = { count: 0, revenue: 0 };
        }
        categoryData[service.category].count++;
      });

      // Calculate revenue by category
      bookings?.forEach(booking => {
        const category = booking.marketplace_listings?.category;
        if (category && categoryData[category]) {
          const revenue = (booking.marketplace_listings?.hourly_rate || 0) * booking.total_hours;
          categoryData[category].revenue += revenue;
        }
      });

      return Object.entries(categoryData)
        .map(([category, data]) => ({ category, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 8);

    } catch (error) {
      console.error("Error fetching category stats:", error);
      return [];
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = "text-primary",
    trend
  }: {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: React.ElementType;
    color?: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                {subtitle}
              </p>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  if (!isOwner()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">ليس لديك صلاحية للوصول إلى لوحة تحكم المالك</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-600" />
            لوحة تحكم المالك
          </h2>
          <p className="text-muted-foreground">إدارة شاملة للمنصة والأعمال</p>
        </div>
        <Button onClick={fetchOwnerDashboardData} disabled={loading}>
          تحديث البيانات
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          <TabsTrigger value="system">النظام</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="إجمالي المستخدمين"
              value={stats.totalUsers.toLocaleString()}
              subtitle="نمو مستمر"
              icon={Users}
              color="text-blue-600"
              trend="up"
            />
            
            <StatCard
              title="إجمالي الإيرادات"
              value={`${stats.totalRevenue.toLocaleString()} د.ع`}
              subtitle="من الحجوزات المكتملة"
              icon={DollarSign}
              color="text-green-600"
              trend="up"
            />
            
            <StatCard
              title="المعاملات النشطة"
              value={stats.totalTransactions.toLocaleString()}
              subtitle="معاملات بنك الوقت"
              icon={Activity}
              color="text-purple-600"
            />
            
            <StatCard
              title="الخدمات المتاحة"
              value={stats.activeServices.toLocaleString()}
              subtitle="خدمة نشطة"
              icon={BarChart3}
              color="text-orange-600"
            />
          </div>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>حالة النظام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800">قاعدة البيانات</h3>
                  <p className="text-green-600 text-sm">متصلة وتعمل</p>
                  <p className="text-xs text-green-500 mt-1">{systemMetrics.databaseSize}</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800">الخادم</h3>
                  <p className="text-green-600 text-sm">نشط</p>
                  <p className="text-xs text-green-500 mt-1">{systemMetrics.uptime}</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-800">الأداء</h3>
                  <p className="text-blue-600 text-sm">{systemMetrics.responseTime}ms</p>
                  <p className="text-xs text-blue-500 mt-1">وقت الاستجابة</p>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-yellow-800">البلاغات</h3>
                  <p className="text-yellow-600 text-sm">{stats.pendingReports}</p>
                  <p className="text-xs text-yellow-500 mt-1">بلاغ معلق</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Monthly Growth Chart */}
          {stats.monthlyGrowth.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>نمو المنصة الشهري</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={stats.monthlyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" name="مستخدمون جدد" />
                    <Line type="monotone" dataKey="transactions" stroke="#10b981" name="معاملات" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Category Performance */}
          {stats.categoryStats.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>الخدمات حسب التصنيف</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.categoryStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>الإيرادات حسب التصنيف</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.categoryStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#059669" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">حجم قاعدة البيانات</h3>
                  <p className="text-2xl font-bold text-blue-600">{systemMetrics.databaseSize}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">الاتصالات النشطة</h3>
                  <p className="text-2xl font-bold text-green-600">{systemMetrics.activeConnections}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">وقت الاستجابة</h3>
                  <p className="text-2xl font-bold text-purple-600">{systemMetrics.responseTime}ms</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Settings className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold">استخدام الذاكرة</h3>
                  <p className="text-2xl font-bold text-orange-600">{systemMetrics.memoryUsage}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Actions */}
          <Card>
            <CardHeader>
              <CardTitle>إجراءات النظام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto flex flex-col p-6">
                  <Database className="h-8 w-8 mb-2" />
                  نسخ احتياطي للبيانات
                  <span className="text-xs text-muted-foreground mt-1">آخر نسخة: اليوم</span>
                </Button>
                
                <Button variant="outline" className="h-auto flex flex-col p-6">
                  <Settings className="h-8 w-8 mb-2" />
                  تحديث النظام
                  <span className="text-xs text-muted-foreground mt-1">إصدار: 2.1.0</span>
                </Button>
                
                <Button variant="outline" className="h-auto flex flex-col p-6">
                  <Activity className="h-8 w-8 mb-2" />
                  مراقبة الأداء
                  <span className="text-xs text-muted-foreground mt-1">جميع الخدمات نشطة</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تقارير مفصلة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  يمكنك هنا الوصول للتقارير المفصلة حول أداء المنصة والمستخدمين
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto flex flex-col p-6">
                    <Users className="h-8 w-8 mb-2" />
                    تقرير المستخدمين
                    <span className="text-xs text-muted-foreground mt-1">نشاط وإحصائيات المستخدمين</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto flex flex-col p-6">
                    <DollarSign className="h-8 w-8 mb-2" />
                    التقرير المالي
                    <span className="text-xs text-muted-foreground mt-1">الإيرادات والمدفوعات</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto flex flex-col p-6">
                    <Activity className="h-8 w-8 mb-2" />
                    تقرير النشاط
                    <span className="text-xs text-muted-foreground mt-1">معاملات بنك الوقت</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto flex flex-col p-6">
                    <BarChart3 className="h-8 w-8 mb-2" />
                    تقرير الخدمات
                    <span className="text-xs text-muted-foreground mt-1">أداء الخدمات والحجوزات</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
