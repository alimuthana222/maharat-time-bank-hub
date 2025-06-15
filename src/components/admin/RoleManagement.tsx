
import React, { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Plus, X, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Role } from "@/types/auth";

interface RoleManagementProps {
  userId: string;
  currentRoles: Role[];
  onRolesUpdate: (newRoles: Role[]) => void;
}

export function RoleManagement({ userId, currentRoles, onRolesUpdate }: RoleManagementProps) {
  const { isAdmin, isOwner } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role | "">("");
  const [isProcessing, setIsProcessing] = useState(false);

  const canManageRoles = isAdmin() || isOwner();

  const handleAssignRole = async () => {
    if (!selectedRole || !canManageRoles) return;

    // التحقق من الصلاحيات المحددة
    if (selectedRole === "admin" && !isOwner()) {
      toast.error("فقط المالك يمكنه تعيين دور المدير");
      return;
    }

    if (selectedRole === "moderator" && !isAdmin() && !isOwner()) {
      toast.error("فقط الإدارة والمالك يمكنهم تعيين دور المشرف");
      return;
    }

    setIsProcessing(true);
    try {
      // Check if user already has this role
      if (currentRoles.includes(selectedRole)) {
        toast.info("المستخدم لديه هذا الدور بالفعل");
        return;
      }

      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: selectedRole
        });

      if (error) throw error;

      const newRoles = [...currentRoles, selectedRole];
      onRolesUpdate(newRoles);
      setSelectedRole("");
      toast.success(`تم تعيين دور ${selectedRole} بنجاح`);
    } catch (error: any) {
      toast.error(`حدث خطأ أثناء تعيين الدور: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveRole = async (roleToRemove: Role) => {
    if (!canManageRoles) return;

    // التحقق من الصلاحيات المحددة
    if (roleToRemove === "admin" && !isOwner()) {
      toast.error("فقط المالك يمكنه إزالة دور المدير");
      return;
    }

    if (roleToRemove === "moderator" && !isAdmin() && !isOwner()) {
      toast.error("فقط الإدارة والمالك يمكنهم إزالة دور المشرف");
      return;
    }

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", roleToRemove);

      if (error) throw error;

      const newRoles = currentRoles.filter(role => role !== roleToRemove);
      onRolesUpdate(newRoles);
      toast.success(`تم إزالة دور ${roleToRemove} بنجاح`);
    } catch (error: any) {
      toast.error(`حدث خطأ أثناء إزالة الدور: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case "admin": return "مشرف";
      case "moderator": return "مشرف محتوى";
      case "user": return "مستخدم";
      case "owner": return "مالك";
      default: return role;
    }
  };

  const getRoleVariant = (role: Role) => {
    switch (role) {
      case "owner": return "destructive";
      case "admin": return "default";
      case "moderator": return "secondary";
      default: return "outline";
    }
  };

  const getAvailableRoles = () => {
    const roles: Role[] = [];
    
    // المالك يمكنه إضافة دور المدير والمشرف
    if (isOwner()) {
      if (!currentRoles.includes("admin")) roles.push("admin");
      if (!currentRoles.includes("moderator")) roles.push("moderator");
    }
    // الإدارة يمكنها إضافة دور المشرف فقط
    else if (isAdmin()) {
      if (!currentRoles.includes("moderator")) roles.push("moderator");
    }
    
    return roles;
  };

  if (!canManageRoles) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            الأدوار
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {currentRoles.map((role) => (
              <Badge key={role} variant={getRoleVariant(role)}>
                {getRoleLabel(role)}
              </Badge>
            ))}
            {currentRoles.length === 0 && (
              <Badge variant="outline">مستخدم</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const availableRoles = getAvailableRoles();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          إدارة الأدوار
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">الأدوار الحالية:</label>
          <div className="flex flex-wrap gap-2">
            {currentRoles.map((role) => (
              <Badge 
                key={role} 
                variant={getRoleVariant(role)}
                className="flex items-center gap-1"
              >
                {getRoleLabel(role)}
                {role !== "owner" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemoveRole(role)}
                    disabled={isProcessing}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </Badge>
            ))}
            {currentRoles.length === 0 && (
              <Badge variant="outline">مستخدم</Badge>
            )}
          </div>
        </div>

        {availableRoles.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">تعيين دور جديد:</label>
            <div className="flex gap-2">
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="اختر دور" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {getRoleLabel(role)}
                    </SelectItem>
                  ))}
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
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {isOwner() 
                ? "كمالك، يمكنك تعيين جميع الأدوار"
                : "كمدير، يمكنك تعيين دور المشرف فقط"
              }
            </div>
          </div>
        )}

        {availableRoles.length === 0 && (
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            لا توجد أدوار إضافية متاحة للتعيين
          </div>
        )}
      </CardContent>
    </Card>
  );
}
