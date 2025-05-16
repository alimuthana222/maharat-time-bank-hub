
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Login form schema
const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

// Registration form schema
const registrationSchema = z.object({
  username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
  fullName: z.string().min(2, "الاسم الكامل مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  university: z.string().optional(),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

export default function Auth() {
  const { user, signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Registration form
  const registrationForm = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      university: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login
  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        toast.error(error.message || "فشل تسجيل الدخول، يرجى المحاولة مرة أخرى");
      } else {
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error?.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration
  const onRegisterSubmit = async (values: z.infer<typeof registrationSchema>) => {
    setIsLoading(true);
    try {
      const userData = {
        username: values.username,
        fullName: values.fullName,
        university: values.university,
      };
      
      const { error } = await signUp(values.email, values.password, userData);
      
      if (error) {
        toast.error(error.message || "فشل إنشاء الحساب، يرجى المحاولة مرة أخرى");
      } else {
        toast.success("تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني للتفعيل.");
        setActiveTab("login");
      }
    } catch (error: any) {
      toast.error(error?.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-16 flex flex-col items-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">مرحباً بك في مهارات</CardTitle>
            <CardDescription>
              منصة تبادل المهارات والخدمات للطلاب الجامعيين
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل بريدك الإلكتروني" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>كلمة المرور</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="●●●●●●●●" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      تسجيل الدخول
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              {/* Registration Form */}
              <TabsContent value="register">
                <Form {...registrationForm}>
                  <form onSubmit={registrationForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registrationForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم المستخدم</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسم المستخدم" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registrationForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الكامل</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسمك الكامل" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registrationForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل بريدك الإلكتروني" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registrationForm.control}
                      name="university"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الجامعة</FormLabel>
                          <FormControl>
                            <Input placeholder="(اختياري) أدخل اسم جامعتك" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registrationForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>كلمة المرور</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="●●●●●●●●" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registrationForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تأكيد كلمة المرور</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="●●●●●●●●" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      إنشاء حساب
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
