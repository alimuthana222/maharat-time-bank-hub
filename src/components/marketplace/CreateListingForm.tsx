
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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

const listingSchema = z.object({
  title: z.string().min(5, {
    message: "العنوان يجب أن يتكون من 5 أحرف على الأقل",
  }),
  category: z.string({
    required_error: "يرجى اختيار تصنيف",
  }),
  description: z.string().min(10, {
    message: "الوصف يجب أن يتكون من 10 أحرف على الأقل",
  }),
  hourlyRate: z.coerce.number().min(1, {
    message: "السعر يجب أن يكون 1 على الأقل",
  }).max(10, {
    message: "السعر يجب ألا يتجاوز 10 ساعات",
  }),
  type: z.enum(["offer", "need"], {
    required_error: "يرجى اختيار نوع الإعلان",
  }),
});

type ListingFormValues = z.infer<typeof listingSchema>;

const CATEGORIES = [
  "تدريس",
  "برمجة",
  "تصميم",
  "ترجمة",
  "تحرير",
  "مونتاج",
  "تسويق",
  "أخرى",
];

interface CreateListingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateListing: (listing: any) => void;
}

export function CreateListingForm({
  open,
  onOpenChange,
  onCreateListing,
}: CreateListingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      hourlyRate: 1,
      type: "offer",
    },
  });

  function onSubmit(values: ListingFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newListing = {
        id: `new-${Date.now()}`,
        title: values.title,
        category: values.category,
        description: values.description,
        hourlyRate: values.hourlyRate,
        type: values.type,
        postedBy: {
          name: "أنت",
          university: "جامعتك",
          avatarUrl: "https://i.pravatar.cc/150?u=you"
        },
        createdAt: new Date().toISOString(),
        tags: [values.category],
      };
      
      onCreateListing(newListing);
      form.reset();
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {form.getValues("type") === "offer" ? "إضافة عرض جديد" : "إضافة طلب جديد"}
          </DialogTitle>
          <DialogDescription>
            أضف تفاصيل الخدمة التي تريد تقديمها أو الخدمة التي تحتاجها
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع الإعلان</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الإعلان" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="offer">أقدم خدمة</SelectItem>
                      <SelectItem value="need">أبحث عن خدمة</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الإعلان</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل عنوان الخدمة"
                      {...field}
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر تصنيفاً" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أدخل وصفاً تفصيلياً للخدمة"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السعر (بالساعات)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    حدد عدد الساعات التي تريد مقابل الخدمة (من 1 إلى 10 ساعات)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "جاري النشر..." : "نشر الإعلان"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
