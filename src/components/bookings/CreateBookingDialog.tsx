
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: {
    id: string;
    title: string;
    hourly_rate: number;
    user_id: string;
    delivery_time: number;
    type: string;
  };
  onSuccess: () => void;
}

export function CreateBookingDialog({ open, onOpenChange, listing, onSuccess }: CreateBookingDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [totalHours, setTotalHours] = useState("1");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (user.id === listing.user_id) {
      toast.error("لا يمكنك حجز خدمتك الخاصة");
      return;
    }

    if (!selectedDate) {
      toast.error("يرجى اختيار تاريخ الحجز");
      return;
    }

    if (!totalHours || parseInt(totalHours) < 1) {
      toast.error("يرجى إدخال عدد ساعات صحيح");
      return;
    }

    console.log("محاولة إنشاء حجز:", {
      client_id: user.id,
      provider_id: listing.user_id,
      service_id: listing.id,
      booking_date: selectedDate.toISOString(),
      total_hours: parseInt(totalHours),
      duration: parseInt(totalHours) * 60,
      message: message.trim() || null,
      status: "pending"
    });

    setLoading(true);
    try {
      const bookingData = {
        client_id: user.id,
        provider_id: listing.user_id,
        service_id: listing.id,
        booking_date: selectedDate.toISOString(),
        total_hours: parseInt(totalHours),
        duration: parseInt(totalHours) * 60, // تحويل إلى دقائق
        message: message.trim() || null,
        status: "pending"
      };

      console.log("إرسال بيانات الحجز:", bookingData);

      const { data, error } = await supabase
        .from("bookings")
        .insert([bookingData])
        .select();

      if (error) {
        console.error("خطأ في قاعدة البيانات:", error);
        throw error;
      }

      console.log("تم إنشاء الحجز بنجاح:", data);
      toast.success("تم إرسال طلب الحجز بنجاح");
      setSelectedDate(undefined);
      setTotalHours("1");
      setMessage("");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("خطأ كامل:", error);
      const errorMessage = error?.message || "حدث خطأ أثناء إنشاء الحجز";
      toast.error(`حدث خطأ: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const totalCost = listing.hourly_rate * parseInt(totalHours || "0");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>حجز الخدمة</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* معلومات الخدمة */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">{listing.title}</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                {listing.type === 'skill_exchange' 
                  ? `المطلوب: ${listing.hourly_rate} ساعة من بنك الوقت`
                  : `السعر: ${listing.hourly_rate.toLocaleString()} د.ع/ساعة`
                }
              </p>
              <p>مدة التسليم: {listing.delivery_time} أيام</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* تاريخ الحجز */}
            <div>
              <Label>تاريخ الحجز *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* عدد الساعات */}
            <div>
              <Label htmlFor="hours">عدد الساعات *</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="hours"
                  type="number"
                  value={totalHours}
                  onChange={(e) => setTotalHours(e.target.value)}
                  min="1"
                  placeholder="1"
                  required
                />
              </div>
            </div>

            {/* رسالة إضافية */}
            <div>
              <Label htmlFor="message">رسالة إضافية</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب أي تفاصيل إضافية أو متطلبات خاصة..."
                rows={3}
              />
            </div>

            {/* التكلفة الإجمالية */}
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {listing.type === 'skill_exchange' ? 'إجمالي الساعات المطلوبة:' : 'التكلفة الإجمالية:'}
                </span>
                <span className="text-xl font-bold text-primary">
                  {listing.type === 'skill_exchange' 
                    ? `${totalCost} ساعة`
                    : `${totalCost.toLocaleString()} د.ع`
                  }
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {totalHours} ساعة × {listing.type === 'skill_exchange' 
                  ? `${listing.hourly_rate} ساعة`
                  : `${listing.hourly_rate.toLocaleString()} د.ع`
                }
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                إرسال طلب الحجز
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                إلغاء
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
