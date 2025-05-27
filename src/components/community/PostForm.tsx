
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

const postSchema = z.object({
  title: z.string().min(5, "يجب أن يكون العنوان 5 أحرف على الأقل").max(100, "الحد الأقصى 100 حرف"),
  content: z.string().min(20, "يجب أن يكون المحتوى 20 حرف على الأقل"),
  category: z.string({
    required_error: "يرجى اختيار التصنيف",
  }),
});

type PostFormValues = z.infer<typeof postSchema>;

const categories = [
  { value: "general", label: "عام" },
  { value: "study", label: "دراسة" },
  { value: "career", label: "مهني" },
  { value: "technology", label: "تقنية" },
  { value: "help", label: "مساعدة" },
];

interface PostFormProps {
  onPostCreated?: () => void;
  className?: string;
}

export function PostForm({ onPostCreated, className }: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  const onSubmit = async (values: PostFormValues) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        title: values.title,
        content: values.content,
        category: values.category,
      });

      if (error) throw error;

      toast.success("تم إنشاء المنشور بنجاح");
      form.reset();
      setShowForm(false);
      
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error: any) {
      toast.error(`حدث خطأ: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <Button 
            onClick={() => setShowForm(true)}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            إنشاء منشور جديد
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>إنشاء منشور جديد</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="اكتب عنوان المنشور..."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>التصنيف</FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المحتوى</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="اكتب محتوى المنشور..."
                      className="h-32"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  form.reset();
                }}
                disabled={isSubmitting}
                className="flex-1"
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    جاري النشر...
                  </>
                ) : (
                  "نشر"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
