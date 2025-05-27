
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Search, 
  UserPlus, 
  Shield, 
  Ban, 
  CheckCircle,
  Clock,
  Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Role } from "@/types/auth";

interface UserProfile {
  id: string;
  username: string;
  full_name: string | null;
  university: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  last_seen: string | null;
  roles: Role[];
  status: "active" | "suspended" | "pending";
}

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        roles: userRoles?.filter(ur => ur.user_id === profile.id).map(ur => ur.role) || [],
        status: "active" as const
      })) || [];

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast.error(`خطأ في تحميل المستخدمين: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: Role) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: newRole });

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, roles: [...user.roles, newRole] }
          : user
      ));

      toast.success("تم تحديث الدور بنجاح");
    } catch (error: any) {
      toast.error(`خطأ في تحديث الدور: ${error.message}`);
    }
  };

  const handleRoleRemove = async (userId: string, roleToRemove: Role) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", roleToRemove);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, roles: user.roles.filter(role => role !== roleToRemove) }
          : user
      ));

      toast.success("تم إزالة الدور بنجاح");
    } catch (error: any) {
      toast.error(`خطأ في إزالة الدور: ${error.message}`);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.university?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === "all" || user.roles.includes(selectedRole as Role);
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: Role) => {
    switch (role) {
      case "owner":
        return "bg-red-500/10 text-red-600";
      case "admin":
        return "bg-blue-500/10 text-blue-600";
      case "moderator":
        return "bg-purple-500/10 text-purple-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case "owner":
        return "مالك";
      case "admin":
        return "مشرف";
      case "moderator":
        return "مشرف محتوى";
      case "user":
        return "مستخدم";
      default:
        return role;
    }
  };

  const UserCard = ({ user }: { user: UserProfile }) => (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar_url || ''} />
              <AvatarFallback>
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user.full_name || user.username}</h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              {user.university && (
                <p className="text-xs text-muted-foreground">{user.university}</p>
              )}
            </div>
          </div>
          <Badge variant={user.status === "active" ? "default" : "secondary"}>
            {user.status === "active" ? "نشط" : "معلق"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">الأدوار:</label>
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role) => (
              <Badge key={role} variant="outline" className={getRoleColor(role)}>
                {getRoleLabel(role)}
                {role !== "owner" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => handleRoleRemove(user.id, role)}
                  >
                    ×
                  </Button>
                )}
              </Badge>
            ))}
            {user.roles.length === 0 && (
              <Badge variant="outline">مستخدم عادي</Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Select onValueChange={(role) => handleRoleUpdate(user.id, role as Role)}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="إضافة دور" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="moderator">مشرف محتوى</SelectItem>
              <SelectItem value="admin">مشرف</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>انضم: {new Date(user.created_at).toLocaleDateString('ar-SA')}</p>
          {user.last_seen && (
            <p>آخر ظهور: {new Date(user.last_seen).toLocaleDateString('ar-SA')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
          <p className="text-muted-foreground">
            إدارة المستخدمين والأدوار والصلاحيات
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Users className="h-4 w-4" />
            {users.length} مستخدم
          </Badge>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث عن المستخدمين..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="فلترة حسب الدور" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأدوار</SelectItem>
            <SelectItem value="owner">مالك</SelectItem>
            <SelectItem value="admin">مشرف</SelectItem>
            <SelectItem value="moderator">مشرف محتوى</SelectItem>
            <SelectItem value="user">مستخدم عادي</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="فلترة حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="suspended">معلق</SelectItem>
            <SelectItem value="pending">في الانتظار</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">لا توجد نتائج</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedRole !== "all" || selectedStatus !== "all"
              ? "لم يتم العثور على مستخدمين مطابقين للفلاتر المحددة"
              : "لا يوجد مستخدمين مسجلين بعد"
            }
          </p>
        </div>
      )}
    </div>
  );
}
