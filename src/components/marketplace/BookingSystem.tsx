
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";

const bookingSchema = z.object({
  hours: z.coerce.number().min(1, "يجب أن تكون الساعات أكبر من صفر").max(8, "الحد الأقصى 8 ساعات"),
  date: z.date({
    required_error: "يرجى اختيار تاريخ",
  }),
  message: z.string().min(10, "يجب أن تكون الرسالة 10 أحرف على الأقل"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingSystemProps {
  listingId: string;
  listingTitle: string;
  hourlyRate: number;
  providerId: string;
}

export function BookingSystem({ listingId, listingTitle, hourlyRate, providerId }: BookingSystemProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      hours: 1,
      message: "",
    },
  });

  const onSubmit = async (values: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      const totalPrice = values.hours * hourlyRate;
      
      // Create booking/order
      console.log("Creating booking:", {
        listingId,
        providerId,
        hours: values.hours,
        date: values.date,
        message: values.message,
        totalPrice,
      });

      toast.success("تم إرسال طلب الحجز بنجاح");
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = form.watch("hours") * hourlyRate;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">احجز الآن</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>حجز خدمة: {listingTitle}</DialogTitle>
          <DialogDescription>
            املأ النموذج أدناه لحجز هذه الخدمة
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عدد الساعات</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={8}
                      {...field}
                      placeholder="أدخل عدد الساعات"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>تاريخ الجلسة</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ar })
                          ) : (
                            <span>اختر التاريخ</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رسالة للمقدم</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="اكتب رسالة تصف احتياجاتك وتوقعاتك..."
                      className="h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span>المجموع:</span>
                <span className="font-bold text-lg">{totalPrice} ريال</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {form.watch("hours") || 0} ساعة × {hourlyRate} ريال
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "جاري الإرسال..." : "تأكيد الحجز"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
