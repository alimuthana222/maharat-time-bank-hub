
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  MessageSquare,
  Calendar,
  Download,
  Filter
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface AnalyticsData {
  userGrowth: any[];
  transactionVolume: any[];
  categoryDistribution: any[];
  timeUsage: any[];
  dailyActivity: any[];
}

export function AnalyticsDashboard() {
  const { isAdmin, isModerator } = useAuth();
  const [data, setData] = useState<AnalyticsData>({
    userGrowth: [],
    transactionVolume: [],
    categoryDistribution: [],
    timeUsage: [],
    dailyActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    if (isAdmin() || isModerator()) {
      fetchAnalyticsData();
    }
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Generate mock data for demonstration
      const userGrowthData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }),
        users: Math.floor(Math.random() * 10) + i * 2,
        active: Math.floor(Math.random() * 5) + i
      }));

      const transactionVolumeData = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleDateString('ar-SA', { month: 'short' }),
        transactions: Math.floor(Math.random() * 100) + 50,
        hours: Math.floor(Math.random() * 500) + 200
      }));

      const categoryData = [
        { name: "تدريس", value: 35, color: "#3b82f6" },
        { name: "برمجة", value: 25, color: "#10b981" },
        { name: "تصميم", value: 20, color: "#f59e0b" },
        { name: "ترجمة", value: 15, color: "#ef4444" },
        { name: "أخرى", value: 5, color: "#8b5cf6" }
      ];

      const timeUsageData = Array.from({ length: 7 }, (_, i) => ({
        day: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][i],
        morning: Math.floor(Math.random() * 50) + 20,
        afternoon: Math.floor(Math.random() * 80) + 40,
        evening: Math.floor(Math.random() * 60) + 30
      }));

      const dailyActivityData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        activity: Math.floor(Math.random() * 100) + (i > 6 && i < 22 ? 50 : 10)
      }));

      setData({
        userGrowth: userGrowthData,
        transactionVolume: transactionVolumeData,
        categoryDistribution: categoryData,
        timeUsage: timeUsageData,
        dailyActivity: dailyActivityData
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const csvData = [
      ['التاريخ', 'المستخدمون الجدد', 'المستخدمون النشطون'],
      ...data.userGrowth.map(item => [item.date, item.users, item.active])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'analytics_data.csv';
    link.click();
  };

  if (!isAdmin() && !isModerator()) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">غير مصرح</h3>
        <p className="text-muted-foreground">
          ليس لديك الصلاحية لعرض التحليلات
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">التحليلات والإحصائيات</h2>
          <p className="text-muted-foreground">
            تحليل شامل لنشاط المنصة والمستخدمين
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-1" />
            تصدير البيانات
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-1" />
            فلترة
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">المستخدمون النشطون</p>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-xs text-green-600">+12% من الشهر الماضي</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المعاملات</p>
                <p className="text-2xl font-bold">5,678</p>
                <p className="text-xs text-green-600">+8% من الشهر الماضي</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">الساعات المتداولة</p>
                <p className="text-2xl font-bold">12,456</p>
                <p className="text-xs text-green-600">+15% من الشهر الماضي</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">الرسائل المرسلة</p>
                <p className="text-2xl font-bold">23,890</p>
                <p className="text-xs text-green-600">+22% من الشهر الماضي</p>
              </div>
              <MessageSquare className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="users">المستخدمون</TabsTrigger>
          <TabsTrigger value="transactions">المعاملات</TabsTrigger>
          <TabsTrigger value="activity">النشاط</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>نمو المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="active" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع التصنيفات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-4">
                  {data.categoryDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name} ({item.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تحليل نشاط المستخدمين</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>حجم المعاملات الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.transactionVolume}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="transactions" fill="#3b82f6" name="عدد المعاملات" />
                  <Bar dataKey="hours" fill="#10b981" name="الساعات" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>النشاط اليومي</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.dailyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="activity" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>استخدام الوقت الأسبوعي</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.timeUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="morning" stackId="a" fill="#f59e0b" name="صباحاً" />
                    <Bar dataKey="afternoon" stackId="a" fill="#3b82f6" name="ظهراً" />
                    <Bar dataKey="evening" stackId="a" fill="#8b5cf6" name="مساءً" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
