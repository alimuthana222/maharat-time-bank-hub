
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginForm() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل");
      return;
    }

    setIsLoading(true);
    
    try {
      // This would connect to a real authentication system
      setTimeout(() => {
        login({
          id: "user-123",
          email: email,
          user_metadata: {
            full_name: "مستخدم افتراضي",
            university: "جامعة الملك سعود"
          }
        });
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    if (!name.trim()) {
      toast.error("يرجى إدخال الاسم الكامل");
      return;
    }

    setIsLoading(true);
    
    try {
      // This would connect to a real registration system
      setTimeout(() => {
        login({
          id: "user-" + Date.now(),
          email: email,
          user_metadata: {
            full_name: name,
            university: university
          }
        });
        toast.success("تم إنشاء الحساب بنجاح");
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error("حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
          <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
              <CardDescription>
                أدخل بيانات حسابك للوصول إلى منصة مهارات
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
              
              <Button
                type="button"
                variant="link"
                size="sm"
                className="px-0 font-normal"
                onClick={() => toast.info("سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني")}
              >
                نسيت كلمة المرور؟
              </Button>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                تسجيل الدخول
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        
        <TabsContent value="signup">
          <form onSubmit={handleSignup}>
            <CardHeader>
              <CardTitle className="text-2xl">إنشاء حساب</CardTitle>
              <CardDescription>
                أنشئ حسابك في منصة مهارات للطلاب
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">الاسم الكامل</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-university">الجامعة</Label>
                <Input
                  id="signup-university"
                  type="text"
                  placeholder="أدخل اسم جامعتك"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  يجب أن تحتوي على 6 أحرف على الأقل
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">تأكيد كلمة المرور</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                إنشاء حساب
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
