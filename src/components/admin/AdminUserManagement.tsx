
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { 
  Users, 
  UserPlus, 
  Shield,
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

export function AdminUserManagement() {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isAdmin()) {
      fetchUsers();
    }
  }, [isAdmin]);

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

  const assignModeratorRole = async (userId: string) => {
    if (!user) return;

    setProcessing(true);
    try {
      // التحقق من عدم وجود دور المشرف مسبقاً
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', 'moderator')
        .single();

      if (existingRole) {
        toast.error('هذا المستخدم مشرف بالفعل');
        return;
      }

      // إضافة دور المشرف
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'moderator'
        });

      if (error) throw error;

      // إرسال إشعار للمستخدم
      await supabase.rpc('send_notification', {
        _user_id: userId,
        _title: 'تم تعيينك كمشرف',
        _body: 'تم تعيينك كمشرف في المنصة من قبل الإدارة',
        _type: 'system',
        _related_id: null,
        _related_type: 'user_role'
      });

      toast.success('تم تعيين المستخدم كمشرف بنجاح');
      setDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();

    } catch (error: any) {
      console.error('Error assigning moderator role:', error);
      toast.error(`خطأ في تعيين دور المشرف: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const removeModeratorRole = async (userId: string) => {
    if (!user) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'moderator');

      if (error) throw error;

      // إرسال إشعار للمستخدم
      await supabase.rpc('send_notification', {
        _user_id: userId,
        _title: 'تم إزالة دور المشرف',
        _body: 'تم إزالة دور المشرف من حسابك',
        _type: 'system',
        _related_id: null,
        _related_type: 'user_role'
      });

      toast.success('تم إزالة دور المشرف بنجاح');
      fetchUsers();

    } catch (error: any) {
      console.error('Error removing moderator role:', error);
      toast.error(`خطأ في إزالة دور المشرف: ${error.message}`);
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
      case 'moderator': return <Shield className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin()) {
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
              إدارة المشرفين
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
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((userData) => {
                  const isModerator = userData.roles.includes('moderator');
                  const isAdmin = userData.roles.includes('admin');
                  const isOwner = userData.roles.includes('owner');
                  
                  return (
                    <TableRow key={userData.id}>
                      <TableCell className="font-medium">{userData.username}</TableCell>
                      <TableCell>{userData.full_name || 'غير محدد'}</TableCell>
                      <TableCell>
                        {isOwner ? (
                          <Badge variant="default">مالك</Badge>
                        ) : isAdmin ? (
                          <Badge variant="destructive">مدير</Badge>
                        ) : isModerator ? (
                          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                            <Shield className="h-3 w-3" />
                            مشرف
                          </Badge>
                        ) : (
                          <Badge variant="outline">مستخدم عادي</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(userData.created_at).toLocaleDateString('ar-SA')}
                      </TableCell>
                      <TableCell>
                        {!isOwner && !isAdmin && (
                          <div className="flex gap-2">
                            {isModerator ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeModeratorRole(userData.id)}
                                disabled={processing}
                              >
                                إزالة الإشراف
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => assignModeratorRole(userData.id)}
                                disabled={processing}
                              >
                                <UserPlus className="h-4 w-4 mr-1" />
                                تعيين كمشرف
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
