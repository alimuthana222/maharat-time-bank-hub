
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  Crown,
  Search,
  RefreshCw
} from "lucide-react";
import { Role } from "@/types/auth";

interface UserWithRoles {
  id: string;
  username: string;
  full_name: string;
  email?: string;
  created_at: string;
  roles: Role[];
}

export function OwnerUserManagement() {
  const { user, isOwner } = useAuth();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [newRole, setNewRole] = useState<Role>('user');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isOwner()) {
      fetchUsers();
    }
  }, [isOwner]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // جلب المستخدمين من جدول profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // جلب أدوار المستخدمين
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // دمج البيانات
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        roles: userRoles?.filter(role => role.user_id === profile.id).map(role => role.role as Role) || []
      })) || [];

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(`خطأ في جلب المستخدمين: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, role: Role) => {
    if (!user) return;

    setProcessing(true);
    try {
      // التحقق من عدم وجود الدور مسبقاً
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', role)
        .single();

      if (existingRole) {
        toast.error('هذا المستخدم يملك هذا الدور بالفعل');
        return;
      }

      // إضافة الدور الجديد
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role
        });

      if (error) throw error;

      // إرسال إشعار للمستخدم
      await supabase.rpc('send_notification', {
        _user_id: userId,
        _title: 'تم تعيين دور جديد',
        _body: `تم تعيينك كـ ${getRoleDisplayName(role)} من قبل الإدارة`,
        _type: 'system',
        _related_id: null,
        _related_type: 'user_role'
      });

      toast.success(`تم تعيين دور ${getRoleDisplayName(role)} بنجاح`);
      setDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();

    } catch (error: any) {
      console.error('Error assigning role:', error);
      toast.error(`خطأ في تعيين الدور: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const removeRole = async (userId: string, role: Role) => {
    if (!user) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      // إرسال إشعار للمستخدم
      await supabase.rpc('send_notification', {
        _user_id: userId,
        _title: 'تم إزالة دور',
        _body: `تم إزالة دور ${getRoleDisplayName(role)} من حسابك`,
        _type: 'system',
        _related_id: null,
        _related_type: 'user_role'
      });

      toast.success(`تم إزالة دور ${getRoleDisplayName(role)} بنجاح`);
      fetchUsers();

    } catch (error: any) {
      console.error('Error removing role:', error);
      toast.error(`خطأ في إزالة الدور: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const getRoleDisplayName = (role: Role): string => {
    switch (role) {
      case 'owner': return 'مالك';
      case 'admin': return 'مدير';
      case 'moderator': return 'مشرف';
      case 'user': return 'مستخدم';
      default: return role;
    }
  };

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4" />;
      case 'admin': return <ShieldCheck className="h-4 w-4" />;
      case 'moderator': return <Shield className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case 'owner': return 'default';
      case 'admin': return 'destructive';
      case 'moderator': return 'secondary';
      default: return 'outline';
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.roles.some(role => getRoleDisplayName(role).includes(searchTerm))
  );

  if (!isOwner()) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">ليس لديك صلاحية للوصول إلى إدارة المستخدمين</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              إدارة المستخدمين
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* شريط البحث */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في المستخدمين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* جدول المستخدمين */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>لا توجد مستخدمون</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم المستخدم</TableHead>
                  <TableHead>الاسم الكامل</TableHead>
                  <TableHead>الأدوار</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.full_name || 'غير محدد'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <Badge 
                              key={role} 
                              variant={getRoleBadgeVariant(role)}
                              className="flex items-center gap-1"
                            >
                              {getRoleIcon(role)}
                              {getRoleDisplayName(role)}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline">مستخدم عادي</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog open={dialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (open) setSelectedUser(user);
                          else setSelectedUser(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <UserPlus className="h-4 w-4 mr-1" />
                              إدارة الأدوار
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>إدارة أدوار {user.username}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">الأدوار الحالية:</h4>
                                <div className="flex gap-2 flex-wrap">
                                  {user.roles.map((role) => (
                                    <Badge 
                                      key={role} 
                                      variant={getRoleBadgeVariant(role)}
                                      className="flex items-center gap-1"
                                    >
                                      {getRoleIcon(role)}
                                      {getRoleDisplayName(role)}
                                      {role !== 'owner' && (
                                        <button
                                          onClick={() => removeRole(user.id, role)}
                                          className="ml-1 hover:text-red-600"
                                          disabled={processing}
                                        >
                                          ×
                                        </button>
                                      )}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">إضافة دور جديد:</h4>
                                <div className="flex gap-2">
                                  <Select value={newRole} onValueChange={(value: Role) => setNewRole(value)}>
                                    <SelectTrigger className="flex-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="admin">مدير</SelectItem>
                                      <SelectItem value="moderator">مشرف</SelectItem>
                                      <SelectItem value="user">مستخدم عادي</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    onClick={() => assignRole(user.id, newRole)}
                                    disabled={processing}
                                  >
                                    إضافة
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
