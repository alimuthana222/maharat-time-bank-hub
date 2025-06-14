
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface ServiceBookingDialogProps {
  listing: {
    id: string;
    title: string;
    user_id: string;
    hourly_rate: number;
    type: string;
  };
}

export function ServiceBookingDialog({ listing }: ServiceBookingDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [message, setMessage] = useState("");

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedDate || !selectedTime) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      // دمج التاريخ والوقت
      const [hours, minutes] = selectedTime.split(':');
      const bookingDateTime = new Date(selectedDate);
      bookingDateTime.setHours(parseInt(hours), parseInt(minutes));

      // حساب إجمالي الساعات
      const totalHours = Math.ceil(parseInt(duration) / 60);

      const { error } = await supabase
        .from("bookings")
        .insert({
          client_id: user.id,
          provider_id: listing.user_id,
          service_id: listing.id,
          booking_date: bookingDateTime.toISOString(),
          duration: parseInt(duration),
          total_hours: totalHours,
          message: message,
          status: "pending"
        });

      if (error) throw error;

      toast.success("تم إرسال طلب الحجز بنجاح!");
      setOpen(false);
      setSelectedDate(undefined);
      setSelectedTime("");
      setDuration("60");
      setMessage("");
      
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("خطأ في إرسال طلب الحجز");
    } finally {
      setLoading(false);
    }
  };

  // أوقات متاحة
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Clock className="mr-2 h-4 w-4" />
          احجز الآن
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>حجز خدمة: {listing.title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleBooking} className="space-y-4">
          <div className="space-y-2">
            <Label>التاريخ</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
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

          <div className="space-y-2">
            <Label>الوقت</Label>
            <select 
              value={selectedTime} 
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">اختر الوقت</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>المدة (بالدقائق)</Label>
            <Input
              type="number"
              min="30"
              step="30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>رسالة إضافية (اختياري)</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب أي تفاصيل إضافية للحجز"
              rows={3}
            />
          </div>

          {/* ملخص التكلفة */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>المدة:</span>
              <span>{duration} دقيقة</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>التكلفة:</span>
              <span>
                {listing.type === 'skill_exchange' 
                  ? `${Math.ceil(parseInt(duration) / 60)} ساعة من بنك الوقت`
                  : `${(listing.hourly_rate * Math.ceil(parseInt(duration) / 60)).toLocaleString()} د.ع`
                }
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "جاري الإرسال..." : "تأكيد الحجز"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
