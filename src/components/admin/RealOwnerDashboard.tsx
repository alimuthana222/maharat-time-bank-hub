import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Users, DollarSign, Activity, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OwnerDashboardData {
  totalUsers: number;
  totalRevenue: number;
  activeServices: number;
  totalBookings: number;
  monthlyGrowth: number;
  timeBankHours: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    date: string;
    user?: string;
  }>;
  userGrowth: Array<{
    month: string;
    users: number;
    revenue: number;
  }>;
  categoryStats: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recentUsers: Array<{
    id: string;
    username: string;
    full_name: string;
    created_at: string;
  }>;
  topProviders: Array<{
    id: string;
    username: string;
    full_name: string;
    services_count: number;
    revenue: number;
  }>;
}

export function RealOwnerDashboard() {
  const [data, setData] = useState<OwnerDashboardData>({
    totalUsers: 0,
    totalRevenue: 0,
    activeServices: 0,
    totalBookings: 0,
    monthlyGrowth: 0,
    timeBankHours: 0,
    recentActivity: [],
    userGrowth: [],
    categoryStats: [],
    recentUsers: [],
    topProviders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwnerDashboardData();
  }, []);

  const fetchOwnerDashboardData = async () => {
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

      // Fetch total bookings
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

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

      // Fetch time bank total hours
      const { data: timeBankData } = await supabase
        .from('time_bank_transactions')
        .select('hours')
        .eq('status', 'approved');

      const timeBankHours = timeBankData?.reduce((sum, t) => sum + t.hours, 0) || 0;

      // Fetch category statistics
      const { data: categoryData } = await supabase
        .from('marketplace_listings')
        .select('category')
        .eq('status', 'active');

      const categoryStats = categoryData?.reduce((acc: any[], item) => {
        const existing = acc.find(c => c.name === item.category);
        if (existing) {
          existing.value += 1;
        } else {
          acc.push({
            name: item.category,
            value: 1,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
          });
        }
        return acc;
      }, []) || [];

      // Calculate monthly growth
      const currentDate = new Date();
      const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

      const { count: currentMonthUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', currentMonth.toISOString());

      const { count: lastMonthUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonth.toISOString())
        .lt('created_at', currentMonth.toISOString());

      const monthlyGrowth = lastMonthUsers && lastMonthUsers > 0 
        ? ((currentMonthUsers || 0) - lastMonthUsers) / lastMonthUsers * 100 
        : 0;

      // Fetch recent users
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, username, full_name, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch recent activity with separate queries to avoid relation errors
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select('id, created_at, status, client_id')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentListings } = await supabase
        .from('marketplace_listings')
        .select('id, created_at, title, user_id')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get user details for recent activities
      const bookingUserIds = recentBookings?.map(b => b.client_id) || [];
      const listingUserIds = recentListings?.map(l => l.user_id) || [];
      const allUserIds = [...new Set([...bookingUserIds, ...listingUserIds])];

      const { data: activityUsers } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', allUserIds);

      const usersMap = new Map(activityUsers?.map(u => [u.id, u.username]) || []);

      const recentActivity = [
        ...(recentBookings?.map(booking => ({
          id: booking.id,
          type: 'حجز',
          description: `حجز جديد من ${usersMap.get(booking.client_id) || 'مستخدم'}`,
          date: booking.created_at,
          user: usersMap.get(booking.client_id)
        })) || []),
        ...(recentListings?.map(listing => ({
          id: listing.id,
          type: 'خدمة',
          description: `خدمة جديدة: ${listing.title}`,
          date: listing.created_at,
          user: usersMap.get(listing.user_id)
        })) || [])
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

      // Generate user growth data (last 6 months)
      const userGrowth = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const { count: monthUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        // Calculate revenue for this month (simplified)
        const { data: monthBookings } = await supabase
          .from('bookings')
          .select('total_hours, service_id')
          .eq('status', 'completed')
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        let monthRevenue = 0;
        if (monthBookings && services) {
          const serviceRatesMap = new Map(services.map(s => [s.id, s.hourly_rate]));
          monthRevenue = monthBookings.reduce((sum, booking) => {
            const hourlyRate = serviceRatesMap.get(booking.service_id) || 0;
            return sum + (hourlyRate * (booking.total_hours || 0));
          }, 0);
        }

        userGrowth.push({
          month: date.toLocaleDateString('ar-SA', { month: 'short' }),
          users: monthUsers || 0,
          revenue: monthRevenue
        });
      }

      // Fetch top providers
      const { data: topProvidersData } = await supabase
        .from('profiles')
        .select('id, username, full_name')
        .limit(10);

      // Get service counts for each provider
      const topProviders = [];
      if (topProvidersData) {
        for (const provider of topProvidersData) {
          const { count: servicesCount } = await supabase
            .from('marketplace_listings')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', provider.id);

          const { data: providerBookings } = await supabase
            .from('bookings')
            .select('total_hours, service_id')
            .eq('provider_id', provider.id)
            .eq('status', 'completed');

          let revenue = 0;
          if (providerBookings && services) {
            const serviceRatesMap = new Map(services.map(s => [s.id, s.hourly_rate]));
            revenue = providerBookings.reduce((sum, booking) => {
              const hourlyRate = serviceRatesMap.get(booking.service_id) || 0;
              return sum + (hourlyRate * (booking.total_hours || 0));
            }, 0);
          }

          topProviders.push({
            id: provider.id,
            username: provider.username,
            full_name: provider.full_name || provider.username,
            services_count: servicesCount || 0,
            revenue
          });
        }
      }

      topProviders.sort((a, b) => b.revenue - a.revenue).splice(5);

      setData({
        totalUsers: totalUsers || 0,
        totalRevenue,
        activeServices: activeServices || 0,
        totalBookings: totalBookings || 0,
        monthlyGrowth,
        timeBankHours,
        recentActivity,
        userGrowth,
        categoryStats,
        recentUsers: recentUsers || [],
        topProviders
      });

    } catch (error) {
      console.error('Error fetching owner dashboard data:', error);
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
    color = "text-primary" 
  }: {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: React.ElementType;
    color?: string;
  }) => (
    <Card>
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
        <h2 className="text-2xl font-bold">لوحة تحكم المالك</h2>
        <Button variant="outline" onClick={fetchOwnerDashboardData}>
          تحديث البيانات
        </Button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المستخدمين"
          value={data.totalUsers.toLocaleString()}
          subtitle={`نمو ${data.monthlyGrowth.toFixed(1)}% هذا الشهر`}
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
          subtitle="خدمات متاحة حالياً"
          icon={Activity}
          color="text-purple-600"
        />
        
        <StatCard
          title="إجمالي الحجوزات"
          value={data.totalBookings}
          subtitle="جميع الحجوزات"
          icon={TrendingUp}
          color="text-orange-600"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="users">المستخدمين</TabsTrigger>
          <TabsTrigger value="providers">مقدمي الخدمات</TabsTrigger>
          <TabsTrigger value="timebank">بنك الوقت</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>نمو المستخدمين والإيرادات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#3b82f6" name="مستخدمين جدد" />
                    <Bar dataKey="revenue" fill="#10b981" name="الإيرادات" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع الخدمات حسب التصنيف</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>النشاط الأخير</CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {data.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  لا يوجد نشاط حديث
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>المستخدمين الجدد</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المستخدم</TableHead>
                    <TableHead>الاسم الكامل</TableHead>
                    <TableHead>تاريخ التسجيل</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.full_name || 'غير محدد'}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('ar-SA')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>أفضل مقدمي الخدمات</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المستخدم</TableHead>
                    <TableHead>الاسم الكامل</TableHead>
                    <TableHead>عدد الخدمات</TableHead>
                    <TableHead>الإيرادات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>{provider.username}</TableCell>
                      <TableCell>{provider.full_name}</TableCell>
                      <TableCell>{provider.services_count}</TableCell>
                      <TableCell>{provider.revenue.toLocaleString()} د.ع</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timebank" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                نظرة عامة على بنك الوقت
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{data.timeBankHours}</p>
                  <p className="text-sm text-gray-600">إجمالي الساعات المتبادلة</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{data.totalUsers}</p>
                  <p className="text-sm text-gray-600">المستخدمين النشطين</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{data.activeServices}</p>
                  <p className="text-sm text-gray-600">خدمات التبادل المتاحة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
