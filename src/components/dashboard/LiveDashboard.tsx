
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  MessageSquare,
  Activity,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  pendingTransactions: number;
  totalMessages: number;
  unreadMessages: number;
  systemHealth: "healthy" | "warning" | "error";
}

export function LiveDashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    totalMessages: 0,
    unreadMessages: 0,
    systemHealth: "healthy"
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
      setupRealTimeUpdates();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch user stats
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: activeUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("last_seen", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Fetch transaction stats
      const { count: totalTransactions } = await supabase
        .from("time_bank_transactions")
        .select("*", { count: "exact", head: true });

      const { count: pendingTransactions } = await supabase
        .from("time_bank_transactions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Fetch message stats
      const { count: totalMessages } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true });

      const { count: unreadMessages } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", user?.id)
        .eq("is_read", false);

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalTransactions: totalTransactions || 0,
        pendingTransactions: pendingTransactions || 0,
        totalMessages: totalMessages || 0,
        unreadMessages: unreadMessages || 0,
        systemHealth: "healthy"
      });

      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setStats(prev => ({ ...prev, systemHealth: "error" }));
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    const channel = supabase
      .channel("dashboard-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "time_bank_transactions"
        },
        () => {
          fetchDashboardStats();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages"
        },
        () => {
          fetchDashboardStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = "text-primary" 
  }: {
    title: string;
    value: number | string;
    change?: string;
    icon: React.ElementType;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className="text-xs text-muted-foreground mt-1">{change}</p>
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
        <h2 className="text-2xl font-bold">لوحة التحكم المباشرة</h2>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`gap-1 ${getHealthColor(stats.systemHealth)}`}
          >
            <Activity className="h-3 w-3" />
            {stats.systemHealth === "healthy" ? "صحي" : 
             stats.systemHealth === "warning" ? "تحذير" : "خطأ"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            آخر تحديث: {lastUpdate.toLocaleTimeString('ar-SA')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="إجمالي المستخدمين"
          value={stats.totalUsers}
          icon={Users}
          color="text-blue-600"
        />
        
        <StatCard
          title="المستخدمون النشطون"
          value={stats.activeUsers}
          change="خلال 24 ساعة"
          icon={Activity}
          color="text-green-600"
        />
        
        <StatCard
          title="إجمالي المعاملات"
          value={stats.totalTransactions}
          icon={TrendingUp}
          color="text-purple-600"
        />
        
        <StatCard
          title="المعاملات المعلقة"
          value={stats.pendingTransactions}
          change="تحتاج مراجعة"
          icon={Clock}
          color="text-yellow-600"
        />
        
        <StatCard
          title="إجمالي الرسائل"
          value={stats.totalMessages}
          icon={MessageSquare}
          color="text-indigo-600"
        />
        
        <StatCard
          title="الرسائل غير المقروءة"
          value={stats.unreadMessages}
          icon={AlertCircle}
          color="text-red-600"
        />
      </div>

      {isAdmin() && (
        <Card>
          <CardHeader>
            <CardTitle>إعدادات النظام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800">خدمة المعاملات</h3>
                <p className="text-green-600">✓ متاح</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800">نظام الرسائل</h3>
                <p className="text-green-600">✓ متاح</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800">قاعدة البيانات</h3>
                <p className="text-green-600">✓ متصل</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
