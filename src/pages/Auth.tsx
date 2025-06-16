import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Mail, Lock, User, Building, ArrowLeft, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صالح",
  }),
  password: z.string().min(8, {
    message: "كلمة المرور يجب أن تكون على الأقل 8 أحرف",
  }),
});

// Registration form schema
const registerSchema = z.object({
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صالح",
  }),
  password: z.string().min(8, {
    message: "كلمة المرور يجب أن تكون على الأقل 8 أحرف",
  }),
  username: z.string().min(3, {
    message: "اسم المستخدم يجب أن يكون على الأقل 3 أحرف",
  }),
  fullName: z.string().min(3, {
    message: "الاسم الكامل يجب أن يكون على الأقل 3 أحرف",
  }),
  university: z.string().min(2, {
    message: "يرجى إدخال اسم الجامعة",
  }),
});

export default function Auth() {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Registration form
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      fullName: "",
      university: "",
    },
  });

  const onLoginSubmit = async (values) => {
    setLoginLoading(true);
    try {
      const { error } = await signIn(values.email, values.password);
      if (error) {
        toast.error(error.message || "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.");
      } else {
        toast.success("تم تسجيل الدخول بنجاح!");
        navigate("/");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoginLoading(false);
    }
  };

  const onRegisterSubmit = async (values) => {
    setRegisterLoading(true);
    try {
      const { error } = await signUp(values.email, values.password, {
        username: values.username,
        fullName: values.fullName,
        university: values.university,
      });
      
      if (error) {
        toast.error(error.message || "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.");
      } else {
        setRegisterSuccess(true);
        toast.success("تم إنشاء الحساب بنجاح!");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-16 px-4 py-12">
        <div className="w-full max-w-md">
          {registerSuccess ? (
            <Card className="w-full">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">تم إنشاء الحساب بنجاح!</CardTitle>
                <CardDescription>
                  تم إنشاء حسابك بنجاح. يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <p className="text-center text-muted-foreground">
                  تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. يرجى الضغط على الرابط في البريد لتأكيد حسابك والبدء في استخدام منصة مهارات.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setActiveTab("login")}>
                  العودة إلى تسجيل الدخول
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
                    <CardDescription>
                      أدخل بريدك الإلكتروني وكلمة المرور للدخول إلى حسابك
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>البريد الإلكتروني</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                  <Input placeholder="أدخل بريدك الإلكتروني" className="pl-10" {...field} />
                                </div>
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
                                <div className="relative">
                                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                  <Input
                                    type="password"
                                    placeholder="كلمة المرور"
                                    className="pl-10"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="text-sm text-right">
                          <Link to="/reset-password" className="text-primary hover:underline">
                            نسيت كلمة المرور؟
                          </Link>
                        </div>
                        <Button type="submit" className="w-full" disabled={loginLoading}>
                          {loginLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              جاري تسجيل الدخول...
                            </>
                          ) : (
                            "تسجيل الدخول"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/" className="flex items-center justify-center">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        العودة للصفحة الرئيسية
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="register">
                <Card>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
                    <CardDescription>
                      أدخل معلوماتك لإنشاء حساب جديد
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>البريد الإلكتروني</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                  <Input placeholder="أدخل بريدك الإلكتروني" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>اسم المستخدم</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input placeholder="اسم المستخدم" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  اسم المستخدم الخاص بك في المنصة
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>الاسم الكامل</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input placeholder="الاسم الكامل" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={registerForm.control}
                          name="university"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>الجامعة</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Building className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                  <Input placeholder="أدخل اسم جامعتك" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>كلمة المرور</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                  <Input
                                    type="password"
                                    placeholder="كلمة المرور"
                                    className="pl-10"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                يجب أن تكون كلمة المرور على الأقل 8 أحرف
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={registerLoading}>
                          {registerLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              جاري إنشاء الحساب...
                            </>
                          ) : (
                            "إنشاء الحساب"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex flex-col border-t pt-4">
                    <p className="text-sm text-center text-muted-foreground mb-4">
                      بالتسجيل أنت توافق على{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        شروط الاستخدام
                      </Link>{" "}
                      و{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        سياسة الخصوصية
                      </Link>
                      .
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("login")}>
                      لديك حساب بالفعل؟ تسجيل الدخول
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
