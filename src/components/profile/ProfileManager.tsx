
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, University, FileText, Save, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import useApi from "@/hooks/useApi";
import Loading from "@/components/common/Loading";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  university: string | null;
  avatar_url: string | null;
  created_at: string;
}

export function ProfileManager() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    university: '',
  });

  const { loading, execute } = useApi({ 
    showSuccessToast: true, 
    successMessage: "تم تحديث الملف الشخصي بنجاح" 
  });

  const { loading: fetchLoading, execute: fetchProfile } = useApi();

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    const { data } = await fetchProfile(async () => {
      return await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();
    });

    if (data) {
      setProfile(data);
      setFormData({
        username: data.username || '',
        full_name: data.full_name || '',
        bio: data.bio || '',
        university: data.university || '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) return;

    await execute(async () => {
      return await supabase
        .from('profiles')
        .update({
          username: formData.username,
          full_name: formData.full_name,
          bio: formData.bio,
          university: formData.university,
        })
        .eq('id', user.id);
    });

    // Reload profile after update
    loadProfile();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (fetchLoading || !profile) {
    return <Loading text="جاري تحميل الملف الشخصي..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            الملف الشخصي
          </CardTitle>
          <CardDescription>
            إدارة معلوماتك الشخصية وإعدادات الحساب
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url || ''} />
              <AvatarFallback className="text-lg">
                {profile.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm" className="gap-2">
                <Camera className="h-4 w-4" />
                تغيير الصورة
              </Button>
              <p className="text-sm text-muted-foreground mt-1">
                JPG أو PNG، حد أقصى 5MB
              </p>
            </div>
          </div>

          <Separator />

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="full_name">الاسم الكامل</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">الجامعة</Label>
              <Input
                id="university"
                value={formData.university}
                onChange={(e) => handleChange('university', e.target.value)}
                placeholder="اسم الجامعة"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">نبذة شخصية</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="اكتب نبذة عن نفسك..."
                rows={4}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loading size="sm" className="mr-2" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  حفظ التغييرات
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            معلومات الحساب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">البريد الإلكتروني</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">تاريخ الانضمام</span>
            <span className="font-medium">
              {new Date(profile.created_at).toLocaleDateString('ar-SA')}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">حالة الحساب</span>
            <Badge variant="default">نشط</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileManager;
