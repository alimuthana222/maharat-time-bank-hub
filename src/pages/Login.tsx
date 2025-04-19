
import { useState } from "react";
import { Link } from "react-router-dom";
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

const formSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export default function Login() {
  const { signIn, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

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
    } catch (error) {
      console.error(error);
      // Error is already handled in auth context
    }
  }

  // طريقة سريعة لتسجيل الدخول للتجربة (للتطوير فقط)
  const handleQuickLogin = async (role: string) => {
    try {
      setError(null);
      let email = "";
      
      if (role === "admin") {
        email = "admin@maharat.com";
      } else if (role === "owner") {
        email = "owner@maharat.com";
      } else {
        email = "user@maharat.com";
      }
      
      await signIn(email, "password123");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">تسجيل الدخول</h1>
          <p className="text-sm text-muted-foreground">
            أدخل بياناتك لتسجيل الدخول
          </p>
        </div>

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
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-muted-foreground">
          ليس لديك حساب؟{" "}
          <Link to="/register" className="underline text-primary">
            إنشاء حساب
          </Link>
        </div>

        {/* أزرار تسجيل الدخول السريع (للتطوير فقط) */}
        <div className="space-y-2 pt-2 border-t">
          <p className="text-xs text-center text-muted-foreground">خيارات تسجيل الدخول السريع (للتطوير فقط)</p>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => handleQuickLogin("user")}>
              كمستخدم
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickLogin("admin")}>
              كمشرف
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickLogin("owner")}>
              كمالك
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
