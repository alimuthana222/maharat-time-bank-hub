
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, 
  Settings, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Database,
  Mail,
  Smartphone
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useTheme } from "next-themes";
import { toast } from "sonner";

interface AppConfig {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  maxFileSize: number;
  enableNotifications: boolean;
  enableDarkMode: boolean;
  defaultLanguage: string;
  supportEmail: string;
  privacyPolicy: string;
  termsOfService: string;
}

export function AppSettings() {
  const { isAdmin, isOwner } = useAuth();
  const { theme, setTheme } = useTheme();
  const [config, setConfig] = useState<AppConfig>({
    siteName: "منصة مهارات",
    siteDescription: "منصة تبادل المهارات والخدمات بين الطلاب الجامعيين",
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: false,
    maxFileSize: 5,
    enableNotifications: true,
    enableDarkMode: true,
    defaultLanguage: "ar",
    supportEmail: "support@maharatplatform.com",
    privacyPolicy: "",
    termsOfService: ""
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // In a real app, load from backend
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Load existing settings
    } catch (error) {
      toast.error("خطأ في تحميل الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // In a real app, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      toast.error("خطأ في حفظ الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key: keyof AppConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  if (!isAdmin() && !isOwner()) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">غير مصرح</h3>
        <p className="text-muted-foreground">
          ليس لديك الصلاحية لعرض إعدادات التطبيق
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إعدادات التطبيق</h2>
          <p className="text-muted-foreground">
            إدارة إعدادات المنصة والتحكم في الميزات
          </p>
        </div>
        <Button onClick={saveSettings} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="appearance">المظهر</TabsTrigger>
          <TabsTrigger value="advanced">متقدم</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                الإعدادات العامة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">اسم الموقع</Label>
                  <Input
                    id="siteName"
                    value={config.siteName}
                    onChange={(e) => handleConfigChange("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">بريد الدعم</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={config.supportEmail}
                    onChange={(e) => handleConfigChange("supportEmail", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">وصف الموقع</Label>
                <Textarea
                  id="siteDescription"
                  value={config.siteDescription}
                  onChange={(e) => handleConfigChange("siteDescription", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">وضع الصيانة</Label>
                    <p className="text-sm text-muted-foreground">
                      تفعيل وضع الصيانة يمنع المستخدمين من الوصول للموقع
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={config.maintenanceMode}
                    onCheckedChange={(checked) => handleConfigChange("maintenanceMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowRegistration">السماح بالتسجيل</Label>
                    <p className="text-sm text-muted-foreground">
                      السماح للمستخدمين الجدد بإنشاء حسابات
                    </p>
                  </div>
                  <Switch
                    id="allowRegistration"
                    checked={config.allowRegistration}
                    onCheckedChange={(checked) => handleConfigChange("allowRegistration", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                إعدادات الأمان
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireEmailVerification">تأكيد البريد الإلكتروني</Label>
                  <p className="text-sm text-muted-foreground">
                    طلب تأكيد البريد الإلكتروني عند التسجيل
                  </p>
                </div>
                <Switch
                  id="requireEmailVerification"
                  checked={config.requireEmailVerification}
                  onCheckedChange={(checked) => handleConfigChange("requireEmailVerification", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxFileSize">الحد الأقصى لحجم الملف (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  min="1"
                  max="100"
                  value={config.maxFileSize}
                  onChange={(e) => handleConfigChange("maxFileSize", parseInt(e.target.value))}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">إعدادات الخصوصية</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="privacyPolicy">سياسة الخصوصية</Label>
                  <Textarea
                    id="privacyPolicy"
                    value={config.privacyPolicy}
                    onChange={(e) => handleConfigChange("privacyPolicy", e.target.value)}
                    rows={5}
                    placeholder="أدخل سياسة الخصوصية..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="termsOfService">شروط الخدمة</Label>
                  <Textarea
                    id="termsOfService"
                    value={config.termsOfService}
                    onChange={(e) => handleConfigChange("termsOfService", e.target.value)}
                    rows={5}
                    placeholder="أدخل شروط الخدمة..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                إعدادات الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableNotifications">تفعيل الإشعارات</Label>
                  <p className="text-sm text-muted-foreground">
                    تفعيل نظام الإشعارات في التطبيق
                  </p>
                </div>
                <Switch
                  id="enableNotifications"
                  checked={config.enableNotifications}
                  onCheckedChange={(checked) => handleConfigChange("enableNotifications", checked)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">أنواع الإشعارات</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">رسائل جديدة</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">معاملات بنك الوقت</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">طلبات الخدمات</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">تحديثات النظام</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">تقارير أسبوعية</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">إشعارات التسويق</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                إعدادات المظهر
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">المظهر</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    اختر مظهر التطبيق
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => setTheme("light")}
                      className="h-20 flex flex-col"
                    >
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300 mb-1"></div>
                      فاتح
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => setTheme("dark")}
                      className="h-20 flex flex-col"
                    >
                      <div className="w-6 h-6 rounded-full bg-gray-800 mb-1"></div>
                      داكن
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      onClick={() => setTheme("system")}
                      className="h-20 flex flex-col"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-white to-gray-800 mb-1"></div>
                      النظام
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base font-medium">اللغة</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={config.defaultLanguage === "ar" ? "default" : "outline"}
                      onClick={() => handleConfigChange("defaultLanguage", "ar")}
                    >
                      العربية
                    </Button>
                    <Button
                      variant={config.defaultLanguage === "en" ? "default" : "outline"}
                      onClick={() => handleConfigChange("defaultLanguage", "en")}
                    >
                      English
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                الإعدادات المتقدمة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-yellow-600">
                      تحذير
                    </Badge>
                  </div>
                  <p className="text-sm text-yellow-800">
                    الإعدادات المتقدمة قد تؤثر على أداء التطبيق. تأكد من فهم التغييرات قبل تطبيقها.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>إعدادات قاعدة البيانات</Label>
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-sm">الحالة: متصل</p>
                      <p className="text-sm">الاستجابة: 45ms</p>
                      <p className="text-sm">الذاكرة المستخدمة: 2.3GB</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>إعدادات الخادم</Label>
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-sm">الحالة: نشط</p>
                      <p className="text-sm">وقت التشغيل: 24 يوم</p>
                      <p className="text-sm">الذاكرة: 78% مستخدمة</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base font-medium">عمليات النظام</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button variant="outline" className="h-auto flex flex-col p-4">
                      <Database className="h-6 w-6 mb-2" />
                      نسخ احتياطي للبيانات
                    </Button>
                    <Button variant="outline" className="h-auto flex flex-col p-4">
                      <Globe className="h-6 w-6 mb-2" />
                      تحديث الخدمات
                    </Button>
                    <Button variant="outline" className="h-auto flex flex-col p-4">
                      <Settings className="h-6 w-6 mb-2" />
                      إعادة تشغيل النظام
                    </Button>
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
