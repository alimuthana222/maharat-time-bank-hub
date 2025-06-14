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
  Calendar, 
  MessageSquare, 
  Clock,
  AlertTriangle,
  Shield,
  Settings,
  TrendingUp,
  Activity,
  Eye,
  EyeOff,
  Trash2,
  UserCheck,
  UserX,
  Crown,
  ShieldCheck
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalPosts: number;
  pendingReports: number;
  activeUsers24h: number;
  totalTransactions: number;
}

interface User {
  id: string;
  username: string;
  full_name?: string;
  university?: string;
  created_at: string;
  last_seen?: string;
  roles: string[];
}

interface ContentItem {
  id: string;
  title: string;
  author_name: string;
  created_at: string;
  is_hidden: boolean;
  type: "post" | "event";
}

export function RealAdminDashboard() {
  const { user, isAdmin, isOwner } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalPosts: 0,
    pendingReports: 0,
    activeUsers24h: 0,
    totalTransactions: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    if (isAdmin() || isOwner()) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch statistics
      const [
        { count: totalUsers },
        { count: totalEvents },
        { count: totalPosts },
        { count: pendingReports },
        { count: totalTransactions }
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("community_posts").select("*", { count: "exact", head: true }),
        supabase.from("content_reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("time_bank_transactions").select("*", { count: "exact", head: true })
      ]);

      // Active users in last 24 hours
      const { count: activeUsers24h } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("last_seen", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      setStats({
        totalUsers: totalUsers || 0,
        totalEvents: totalEvents || 0,
        totalPosts: totalPosts || 0,
        pendingReports: pendingReports || 0,
        activeUsers24h: activeUsers24h || 0,
        totalTransactions: totalTransactions || 0
      });

      // Fetch users for management
      await fetchUsers();
      await fetchContent();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("حدث خطأ أثناء تحميل بيانات لوحة التحكم");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: users, error } = await supabase
        .from("profiles")
        .select(`
          id,
          username,
          full_name,
          university,
          created_at,
          last_seen
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch user roles
      const userIds = users?.map(u => u.id) || [];
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", userIds);

      const rolesByUser = roles?.reduce((acc, role) => {
        if (!acc[role.user_id]) acc[role.user_id] = [];
        acc[role.user_id].push(role.role);
        return acc;
      }, {} as Record<string, string[]>) || {};

      const usersWithRoles = users?.map(user => ({
        ...user,
        roles: rolesByUser[user.id] || ["user"]
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchContent = async () => {
    try {
      // Fetch posts
      const { data: postsData } = await supabase
        .from("community_posts")
        .select("id, title, is_hidden, created_at, author_id")
        .order("created_at", { ascending: false })
        .limit(25);

      // Fetch events
      const { data: eventsData } = await supabase
        .from("events")
        .select("id, title, created_at, organizer_id")
        .order("created_at", { ascending: false })
        .limit(25);

      // Get author profiles for posts and events
      const allAuthorIds = [
        ...(postsData?.map(post => post.author_id) || []),
        ...(eventsData?.map(event => event.organizer_id) || [])
      ];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", allAuthorIds);

      const profilesMap = profiles?.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>) || {};

      const contentItems: ContentItem[] = [
        ...(postsData?.map(post => ({
          id: post.id,
          title: post.title,
          author_name: profilesMap[post.author_id]?.username || "مجهول",
          created_at: post.created_at,
          is_hidden: post.is_hidden,
          type: "post" as const
        })) || []),
        ...(eventsData?.map(event => ({
          id: event.id,
          title: event.title,
          author_name: profilesMap[event.organizer_id]?.username || "مجهول",
          created_at: event.created_at,
          is_hidden: false,
          type: "event" as const
        })) || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setContent(contentItems);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const assignRole = async (userId: string, role: "admin" | "moderator" | "owner") => {
    if (!isOwner()) {
      toast.error("هذه العملية متاحة للمالك فقط");
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });

      if (error && error.code !== "23505") throw error;

      // Log admin action
      await supabase
        .from("admin_actions")
        .insert({
          admin_id: user?.id,
          action_type: "assign_role",
          target_type: "user",
          target_id: userId,
          details: { role }
        });

      toast.success(`تم تعيين صلاحية ${role} بنجاح`);
      fetchUsers();
    } catch (error) {
      console.error("Error assigning role:", error);
      toast.error("حدث خطأ أثناء تعيين الصلاحية");
    }
  };

  const removeRole = async (userId: string, role: "admin" | "moderator" | "owner") => {
    if (!isOwner()) {
      toast.error("هذه العملية متاحة للمالك فقط");
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) throw error;

      // Log admin action
      await supabase
        .from("admin_actions")
        .insert({
          admin_id: user?.id,
          action_type: "remove_role",
          target_type: "user",
          target_id: userId,
          details: { role }
        });

      toast.success(`تم إزالة صلاحية ${role} بنجاح`);
      fetchUsers();
    } catch (error) {
      console.error("Error removing role:", error);
      toast.error("حدث خطأ أثناء إزالة الصلاحية");
    }
  };

  const toggleContentVisibility = async (contentId: string, type: "post" | "event", isHidden: boolean) => {
    try {
      const table = type === "post" ? "community_posts" : "events";
      const { error } = await supabase
        .from(table)
        .update({ is_hidden: !isHidden })
        .eq("id", contentId);

      if (error) throw error;

      // Log admin action
      await supabase
        .from("admin_actions")
        .insert({
          admin_id: user?.id,
          action_type: isHidden ? "show_content" : "hide_content",
          target_type: type,
          target_id: contentId,
          details: {}
        });

      toast.success(isHidden ? "تم إظهار المحتوى" : "تم إخفاء المحتوى");
      fetchContent();
    } catch (error) {
      console.error("Error toggling content visibility:", error);
      toast.error("حدث خطأ أثناء تحديث المحتوى");
    }
  };

  const deleteContent = async (contentId: string, type: "post" | "event") => {
    if (!confirm("هل أنت متأكد من حذف هذا المحتوى؟")) return;

    try {
      const table = type === "post" ? "community_posts" : "events";
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", contentId);

      if (error) throw error;

      // Log admin action
      await supabase
        .from("admin_actions")
        .insert({
          admin_id: user?.id,
          action_type: "delete_content",
          target_type: type,
          target_id: contentId,
          details: {}
        });

      toast.success("تم حذف المحتوى بنجاح");
      fetchContent();
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("حدث خطأ أثناء حذف المحتوى");
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner": return <Crown className="h-4 w-4 text-yellow-600" />;
      case "admin": return <Shield className="h-4 w-4 text-red-600" />;
      case "moderator": return <ShieldCheck className="h-4 w-4 text-blue-600" />;
      default: return <UserCheck className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner": return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "admin": return "bg-red-500/10 text-red-600 border-red-200";
      case "moderator": return "bg-blue-500/10 text-blue-600 border-blue-200";
      default: return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  if (!isAdmin() && !isOwner()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">ليس لديك صلاحية للوصول إلى لوحة التحكم</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">لوحة التحكم الإدارية</h2>
        <p className="text-muted-foreground">إدارة شاملة للمنصة والمستخدمين</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="users">المستخدمين</TabsTrigger>
          <TabsTrigger value="content">المحتوى</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">إجمالي المستخدمين</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.activeUsers24h} نشط في آخر 24 ساعة
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">الفعاليات</p>
                    <p className="text-2xl font-bold">{stats.totalEvents}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">منشورات المجتمع</p>
                    <p className="text-2xl font-bold">{stats.totalPosts}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">معاملات بنك الوقت</p>
                    <p className="text-2xl font-bold">{stats.totalTransactions}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">البلاغات المعلقة</p>
                    <p className="text-2xl font-bold">{stats.pendingReports}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">حالة النظام</p>
                    <p className="text-2xl font-bold text-green-600">صحي</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* Users management section */}
          <Card>
            <CardHeader>
              <CardTitle>إدارة المستخدمين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium">{user.username}</h3>
                          {user.full_name && (
                            <p className="text-sm text-muted-foreground">{user.full_name}</p>
                          )}
                          {user.university && (
                            <p className="text-xs text-muted-foreground">{user.university}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {user.roles.map((role) => (
                            <Badge key={role} variant="outline" className={getRoleColor(role)}>
                              {getRoleIcon(role)}
                              <span className="mr-1">
                                {role === "owner" ? "مالك" : 
                                 role === "admin" ? "مدير" : 
                                 role === "moderator" ? "مشرف" : "مستخدم"}
                              </span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {isOwner() && (
                      <div className="flex gap-2">
                        <Select onValueChange={(role: "admin" | "moderator" | "owner") => assignRole(user.id, role)}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="إضافة دور" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">مدير</SelectItem>
                            <SelectItem value="moderator">مشرف</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {user.roles.filter(r => r !== "user").map((role) => (
                          <Button
                            key={role}
                            variant="outline"
                            size="sm"
                            onClick={() => removeRole(user.id, role as "admin" | "moderator" | "owner")}
                          >
                            إزالة {role === "admin" ? "مدير" : "مشرف"}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Content management section */}
          <Card>
            <CardHeader>
              <CardTitle>إدارة المحتوى</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">
                          {item.type === "post" ? "منشور" : "فعالية"}
                        </Badge>
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            بواسطة {item.author_name} • {new Date(item.created_at).toLocaleDateString('ar-IQ')}
                          </p>
                        </div>
                        {item.is_hidden && (
                          <Badge variant="destructive">مخفي</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleContentVisibility(item.id, item.type, item.is_hidden)}
                      >
                        {item.is_hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        {item.is_hidden ? "إظهار" : "إخفاء"}
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteContent(item.id, item.type)}
                      >
                        <Trash2 className="h-4 w-4" />
                        حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Settings section */}
          <Card>
            <CardHeader>
              <CardTitle>إعدادات النظام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">نظام بنك الوقت</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      تفعيل أو إلغاء تفعيل نظام تبادل الساعات
                    </p>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600">
                      مفعل
                    </Badge>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">نظام الفعاليات</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      تفعيل أو إلغاء تفعيل إنشاء الفعاليات
                    </p>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600">
                      مفعل
                    </Badge>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">المجتمع</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      تفعيل أو إلغاء تفعيل منشورات المجتمع
                    </p>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600">
                      مفعل
                    </Badge>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">السوق</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      تفعيل أو إلغاء تفعيل سوق المهارات
                    </p>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600">
                      مفعل
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
