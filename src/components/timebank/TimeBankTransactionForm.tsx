
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  full_name?: string;
}

const transactionSchema = z.object({
  recipient_id: z.string({
    required_error: "يرجى اختيار المستلم",
  }),
  hours: z.coerce
    .number()
    .positive("يجب أن تكون الساعات أكبر من صفر")
    .max(100, "الحد الأقصى للساعات هو 100 ساعة"),
  description: z
    .string()
    .min(10, "يجب أن يكون الوصف 10 أحرف على الأقل")
    .max(500, "الحد الأقصى للوصف هو 500 حرف"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function TimeBankTransactionForm({ onSuccess }: { onSuccess?: () => void }) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      recipient_id: "",
      hours: 1,
      description: "",
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name")
        .neq("id", user.id);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("حدث خطأ أثناء تحميل قائمة المستخدمين");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: TransactionFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Create time bank transaction
      const { data, error } = await supabase.from("time_bank_transactions").insert({
        provider_id: user.id,
        recipient_id: values.recipient_id,
        hours: values.hours,
        description: values.description,
        status: "pending",
      });

      if (error) throw error;

      toast.success("تم إنشاء معاملة بنجاح");
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      toast.error(error.message || "حدث خطأ أثناء إنشاء المعاملة");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>إنشاء معاملة جديدة</CardTitle>
        <CardDescription>إنشاء معاملة جديدة في بنك الوقت</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recipient_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المستلم</FormLabel>
                  <Select
                    disabled={isLoading || isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المستلم" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoading ? (
                        <div className="py-2 flex items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>جاري تحميل المستخدمين...</span>
                        </div>
                      ) : users.length > 0 ? (
                        users.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.full_name || profile.username}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="py-2 text-center text-sm text-muted-foreground">
                          لا يوجد مستخدمون متاحون
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عدد الساعات</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف الخدمة</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="اكتب وصفاً مفصلاً للخدمة المقدمة..."
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري الإنشاء...
            </>
          ) : (
            "إنشاء المعاملة"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
