
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveGrid } from "@/components/ui/mobile-responsive";
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
import { useAuth } from "@/components/auth/AuthProvider";
import { Clock, TrendingUp, Users, MessageSquare, Calendar, Star } from "lucide-react";

interface DashboardData {
  timeBank: {
    earned: number;
    spent: number;
    balance: number;
    pending: number;
  };
  services: {
    active: number;
    completed: number;
    pending: number;
  };
  bookings: {
    incoming: number;
    outgoing: number;
    totalEarnings: number;
  };
  messages: {
    unread: number;
    total: number;
  };
  monthlyStats: Array<{
    month: string;
    earned: number;
    spent: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'earned' | 'spent' | 'booking' | 'message';
    description: string;
    amount?: number;
    date: string;
  }>;
}

export function RealDashboardStats() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>({
    timeBank: { earned: 0, spent: 0, balance: 0, pending: 0 },
    services: { active: 0, completed: 0, pending: 0 },
    bookings: { incoming: 0, outgoing: 0, totalEarnings: 0 },
    messages: { unread: 0, total: 0 },
    monthlyStats: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch time bank data
      const { data: timeBankData } = await supabase
        .from('time_bank_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch services data
      const { data: activeServices } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      // Fetch bookings data
      const [
        { data: incomingBookings },
        { data: outgoingBookings },
        { data: completedBookings }
      ] = await Promise.all([
        supabase
          .from('bookings')
          .select('*')
          .eq('provider_id', user.id),
        supabase
          .from('bookings')
          .select('*')
          .eq('client_id', user.id),
        supabase
          .from('bookings')
          .select(`
            id,
            total_hours,
            service_id,
            created_at
          `)
          .eq('provider_id', user.id)
          .eq('status', 'completed')
      ]);

      // Calculate total earnings
      let totalEarnings = 0;
      if (completedBookings && completedBookings.length > 0) {
        const serviceIds = completedBookings.map(b => b.service_id).filter(Boolean);
        if (serviceIds.length > 0) {
          const { data: services } = await supabase
            .from('marketplace_listings')
            .select('id, hourly_rate')
            .in('id', serviceIds);

          if (services) {
            totalEarnings = completedBookings.reduce((sum, booking) => {
              const service = services.find(s => s.id === booking.service_id);
              if (service && booking.total_hours) {
                return sum + (service.hourly_rate * booking.total_hours);
              }
              return sum;
            }, 0);
          }
        }
      }

      // Fetch messages data
      const { data: unreadMessages } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_id', user.id)
        .eq('is_read', false);

      const { data: totalMessages } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      // Fetch recent transactions for monthly stats
      const { data: transactions } = await supabase
        .from('time_bank_transactions')
        .select('*')
        .or(`provider_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(50);

      // Process monthly stats
      const monthlyStats = processMonthlyStats(transactions || [], user.id);

      // Fetch recent activity
      const recentActivity = await fetchRecentActivity();

      setData({
        timeBank: {
          earned: timeBankData?.hours_earned || 0,
          spent: timeBankData?.hours_spent || 0,
          balance: (timeBankData?.hours_earned || 0) - (timeBankData?.hours_spent || 0),
          pending: timeBankData?.hours_pending || 0
        },
        services: {
          active: activeServices?.length || 0,
          completed: completedBookings?.length || 0,
          pending: incomingBookings?.filter(b => b.status === 'pending').length || 0
        },
        bookings: {
          incoming: incomingBookings?.length || 0,
          outgoing: outgoingBookings?.length || 0,
          totalEarnings
        },
        messages: {
          unread: unreadMessages?.length || 0,
          total: totalMessages?.length || 0
        },
        monthlyStats,
        recentActivity
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyStats = (transactions: any[], userId: string) => {
    const monthlyData: { [key: string]: { earned: number; spent: number } } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.created_at);
      const monthKey = date.toLocaleDateString('ar-SA', { month: 'long' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { earned: 0, spent: 0 };
      }
      
      if (transaction.provider_id === userId) {
        monthlyData[monthKey].earned += transaction.hours;
      } else if (transaction.recipient_id === userId) {
        monthlyData[monthKey].spent += transaction.hours;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, stats]) => ({ month, ...stats }))
      .slice(0, 6);
  };

  const fetchRecentActivity = async () => {
    if (!user) return [];

    try {
      // Get recent transactions
      const { data: transactions } = await supabase
        .from('time_bank_transactions')
        .select('*')
        .or(`provider_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          id,
          created_at,
          service_id
        `)
        .or(`provider_id.eq.${user.id},client_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(3);

      const activity = [];

      // Add transactions to activity
      transactions?.forEach(transaction => {
        activity.push({
          id: transaction.id,
          type: transaction.provider_id === user.id ? 'earned' as const : 'spent' as const,
          description: transaction.description,
          amount: transaction.hours,
          date: transaction.created_at
        });
      });

      // Add bookings to activity
      if (bookings && bookings.length > 0) {
        const serviceIds = bookings.map(b => b.service_id).filter(Boolean);
        let serviceData: any[] = [];
        
        if (serviceIds.length > 0) {
          const { data: services } = await supabase
            .from('marketplace_listings')
            .select('id, title')
            .in('id', serviceIds);
          serviceData = services || [];
        }

        bookings.forEach(booking => {
          const service = serviceData.find(s => s.id === booking.service_id);
          activity.push({
            id: booking.id,
            type: 'booking' as const,
            description: `حجز: ${service?.title || 'خدمة'}`,
            date: booking.created_at
          });
        });
      }

      return activity
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8);

    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
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
        <h2 className="text-2xl font-bold">نظرة عامة</h2>
        <Button variant="outline" onClick={fetchDashboardData}>
          تحديث البيانات
        </Button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="رصيد بنك الوقت"
          value={data.timeBank.balance}
          subtitle="ساعة متاحة"
          icon={Clock}
          color="text-blue-600"
        />
        
        <StatCard
          title="الخدمات النشطة"
          value={data.services.active}
          subtitle={`${data.services.completed} مكتملة`}
          icon={Star}
          color="text-green-600"
        />
        
        <StatCard
          title="إجمالي الأرباح"
          value={`${data.bookings.totalEarnings.toLocaleString()} د.ع`}
          subtitle={`${data.bookings.incoming} حجز واردة`}
          icon={TrendingUp}
          color="text-purple-600"
        />
        
        <StatCard
          title="الرسائل غير المقروءة"
          value={data.messages.unread}
          subtitle={`من ${data.messages.total} رسالة`}
          icon={MessageSquare}
          color="text-orange-600"
        />
      </div>

      <ResponsiveGrid cols={{ default: 1, lg: 2 }}>
        {/* Monthly Performance */}
        {data.monthlyStats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>الأداء الشهري</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="earned" fill="#3b82f6" name="ساعات مكتسبة" />
                  <Bar dataKey="spent" fill="#ef4444" name="ساعات مصروفة" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Time Bank Overview */}
        <Card>
          <CardHeader>
            <CardTitle>بنك الوقت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">ساعات مكتسبة</span>
                <span className="text-lg font-bold text-green-600">+{data.timeBank.earned}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium">ساعات مصروفة</span>
                <span className="text-lg font-bold text-red-600">-{data.timeBank.spent}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium">ساعات معلقة</span>
                <span className="text-lg font-bold text-yellow-600">{data.timeBank.pending}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">الرصيد الحالي</span>
                <span className="text-xl font-bold text-blue-600">{data.timeBank.balance}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </ResponsiveGrid>

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
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'earned' ? 'bg-green-500' : 
                      activity.type === 'spent' ? 'bg-red-500' : 
                      'bg-blue-500'
                    }`} />
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  {activity.amount && (
                    <div className={`text-sm font-medium ${
                      activity.type === 'earned' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {activity.type === 'earned' ? '+' : '-'}{activity.amount} ساعة
                    </div>
                  )}
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
    </div>
  );
}
