
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Role } from "@/types/auth";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export default function Login() {
  const { signIn, isLoading, setUserRole, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as { from?: string })?.from || "/dashboard";

  useEffect(() => {
    // If user is already logged in, redirect them
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(null);
      await signIn(values.email, values.password);
      // Redirection will be handled by the useEffect above
    } catch (error) {
      console.error(error);
      // Error is already handled in auth context
    }
  }

  // طريقة سريعة لتسجيل الدخول للتجربة (للتطوير فقط)
  const handleQuickLogin = async (role: Role) => {
    try {
      setError(null);
      let email = "";
      
      if (role === "admin") {
        email = "admin@maharat.com";
      } else if (role === "owner") {
        email = "owner@maharat.com";
      } else if (role === "moderator") {
        email = "moderator@maharat.com";
      } else {
        email = "user@maharat.com";
      }
      
      await signIn(email, "password123");
      
      // Update user role after successful login
      setTimeout(async () => {
        await setUserRole(role);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>أدخل بياناتك لتسجيل الدخول إلى منصة مهارات</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@domain.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
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
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="underline text-primary">
              إنشاء حساب
            </Link>
          </div>

          {/* أزرار تسجيل الدخول السريع (للتطوير فقط) */}
          <div className="space-y-2 pt-2 border-t w-full">
            <p className="text-xs text-center text-muted-foreground">خيارات تسجيل الدخول السريع (للتطوير فقط)</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleQuickLogin("user")}>
                كمستخدم
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickLogin("moderator")}>
                كمشرف محتوى
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickLogin("admin")}>
                كمشرف
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickLogin("owner")}>
                كمالك
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
