
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  User, 
  UserCheck, 
  UserX, 
  Shield, 
  Loader2, 
  Search,
  Edit,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  university: string;
  created_at: string;
  roles: string[];
  status: "active" | "suspended";
}

export function UsersManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { isAdmin, isOwner } = useAuth();
  
  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, full_name, university, created_at");
      
      if (profilesError) throw profilesError;
      
      // For each profile, get their roles
      const enhancedUsers = await Promise.all(
        (profilesData || []).map(async (profile) => {
          // Get user roles
          const { data: rolesData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.id);
          
          const roles = (rolesData || []).map((r) => r.role);
          
          return {
            ...profile,
            roles: roles,
            status: "active" as const // Default to active for now
          };
        })
      );
      
      // Apply status filter
      let filteredUsers = enhancedUsers;
      if (statusFilter !== "all") {
        filteredUsers = enhancedUsers.filter(user => user.status === statusFilter);
      }
      
      setUsers(filteredUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(`حدث خطأ أثناء جلب المستخدمين: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewUser = (user: UserProfile) => {
    setSelectedUser(user);
    setShowUserDetails(true);
    setSelectedRole("");
  };
  
  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;
    
    try {
      setIsProcessing(true);
      
      // Check if user already has this role
      const hasRole = selectedUser.roles.includes(selectedRole);
      
      if (hasRole) {
        toast.info("المستخدم لديه هذا الدور بالفعل");
        setIsProcessing(false);
        return;
      }
      
      // Add role to user
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: selectedUser.id,
          role: selectedRole
        });
      
      if (error) throw error;
      
      // Update local state
      setSelectedUser({
        ...selectedUser,
        roles: [...selectedUser.roles, selectedRole]
      });
      
      // Update users list
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, roles: [...user.roles, selectedRole] } 
          : user
      ));
      
      toast.success(`تم تعيين دور ${selectedRole} للمستخدم بنجاح`);
    } catch (error: any) {
      console.error("Error assigning role:", error);
      toast.error(`حدث خطأ أثناء تعيين الدور: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRemoveRole = async (roleToRemove: string) => {
    if (!selectedUser) return;
    
    if (!isAdmin() && !isOwner()) {
      toast.error("ليس لديك صلاحية لتنفيذ هذا الإجراء");
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", selectedUser.id)
        .eq("role", roleToRemove);
      
      if (error) throw error;
      
      // Update local state
      setSelectedUser({
        ...selectedUser,
        roles: selectedUser.roles.filter(r => r !== roleToRemove)
      });
      
      // Update users list
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { 
              ...user, 
              roles: user.roles.filter(r => r !== roleToRemove)
            } 
          : user
      ));
      
      toast.success(`تم إزالة دور ${roleToRemove} من المستخدم بنجاح`);
    } catch (error: any) {
      console.error("Error removing role:", error);
      toast.error(`حدث خطأ أثناء إزالة الدور: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(date);
  };
  
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.full_name?.toLowerCase().includes(searchLower) ||
      user.university?.toLowerCase().includes(searchLower)
    );
  });
  
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "destructive";
      case "admin":
        return "default";
      case "moderator":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-bold">إدارة المستخدمين</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن مستخدم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-[250px]"
            />
          </div>
          
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="حالة المستخدم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المستخدمين</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="suspended">معلق</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>اسم المستخدم</TableHead>
            <TableHead>الاسم الكامل</TableHead>
            <TableHead>الجامعة</TableHead>
            <TableHead>الأدوار</TableHead>
            <TableHead>تاريخ التسجيل</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="mr-2">جاري تحميل المستخدمين...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                لا يوجد مستخدمين مطابقين لمعايير البحث
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username || "بدون اسم مستخدم"}</TableCell>
                <TableCell>{user.full_name || "غير محدد"}</TableCell>
                <TableCell>{user.university || "غير محدد"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.length > 0 ? (
                      user.roles.map((role) => (
                        <Badge key={role} variant={getRoleBadgeVariant(role)}>
                          {role === "owner" && "مالك"}
                          {role === "admin" && "مشرف"}
                          {role === "moderator" && "مشرف محتوى"}
                          {role === "user" && "مستخدم"}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">مستخدم</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>
                  <Badge variant={user.status === "active" ? "success" : "destructive"}>
                    {user.status === "active" ? "نشط" : "معلق"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleViewUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">عرض المستخدم</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تفاصيل المستخدم</DialogTitle>
            <DialogDescription>
              عرض وتعديل بيانات المستخدم والصلاحيات
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">اسم المستخدم:</div>
                <div>{selectedUser.username || "غير محدد"}</div>

                <div className="font-medium">الاسم الكامل:</div>
                <div>{selectedUser.full_name || "غير محدد"}</div>

                <div className="font-medium">الجامعة:</div>
                <div>{selectedUser.university || "غير محدد"}</div>

                <div className="font-medium">تاريخ التسجيل:</div>
                <div>{formatDate(selectedUser.created_at)}</div>
                
                <div className="font-medium">الحالة:</div>
                <div>
                  <Badge variant={selectedUser.status === "active" ? "success" : "destructive"}>
                    {selectedUser.status === "active" ? "نشط" : "معلق"}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="font-medium mb-2">الأدوار الحالية:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.roles.length > 0 ? (
                    selectedUser.roles.map((role) => (
                      <Badge key={role} variant={getRoleBadgeVariant(role)} className="flex items-center gap-1">
                        {role === "owner" && "مالك"}
                        {role === "admin" && "مشرف"}
                        {role === "moderator" && "مشرف محتوى"}
                        {role === "user" && "مستخدم"}
                        
                        {(isAdmin() || isOwner()) && role !== "owner" && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleRemoveRole(role)}
                            disabled={isProcessing}
                          >
                            <UserX className="h-3 w-3" />
                            <span className="sr-only">إزالة الدور</span>
                          </Button>
                        )}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">مستخدم</Badge>
                  )}
                </div>
              </div>

              {(isAdmin() || isOwner()) && (
                <div className="border-t pt-4">
                  <div className="font-medium mb-2">تعيين دور جديد:</div>
                  <div className="flex gap-2">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر دور" />
                      </SelectTrigger>
                      <SelectContent>
                        {isOwner() && <SelectItem value="admin">مشرف</SelectItem>}
                        {(isAdmin() || isOwner()) && <SelectItem value="moderator">مشرف محتوى</SelectItem>}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleAssignRole} 
                      disabled={!selectedRole || isProcessing}
                      size="sm"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          تعيين
                        </>
                      )}
                    </Button>
                  </div>
                  {!isOwner() && (
                    <div className="mt-2 text-xs flex items-center text-muted-foreground">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      فقط المالك يمكنه تعيين دور مشرف
                    </div>
                  )}
                </div>
              )}
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setShowUserDetails(false)}
                >
                  إغلاق
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
