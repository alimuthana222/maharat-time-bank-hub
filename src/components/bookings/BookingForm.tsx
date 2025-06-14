
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";

interface BookingFormProps {
  providerId: string;
  serviceId?: string;
  hourlyRate: number;
  onBookingCreated?: () => void;
}

export function BookingForm({ providerId, serviceId, hourlyRate, onBookingCreated }: BookingFormProps) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60); // بالدقائق
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const totalHours = duration / 60;
  const totalCost = totalHours * hourlyRate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!date || !time) {
      toast.error("يرجى اختيار التاريخ والوقت");
      return;
    }

    setLoading(true);

    try {
      // دمج التاريخ والوقت
      const [hours, minutes] = time.split(":").map(Number);
      const bookingDateTime = new Date(date);
      bookingDateTime.setHours(hours, minutes, 0, 0);

      const { error } = await supabase
        .from("bookings")
        .insert({
          client_id: user.id,
          provider_id: providerId,
          service_id: serviceId,
          booking_date: bookingDateTime.toISOString(),
          duration,
          total_hours: totalHours,
          message: message.trim() || null,
        });

      if (error) throw error;

      toast.success("تم إرسال طلب الحجز بنجاح");
      
      // إعادة تعيين النموذج
      setDate(undefined);
      setTime("");
      setDuration(60);
      setMessage("");
      
      onBookingCreated?.();
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast.error("حدث خطأ أثناء إنشاء الحجز");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">حجز الخدمة</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">التاريخ</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="ml-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: ar }) : "اختر التاريخ"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">الوقت</label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">المدة (دقيقة)</label>
        <Input
          type="number"
          min="30"
          step="30"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">رسالة إضافية (اختياري)</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب أي تفاصيل إضافية..."
          rows={3}
        />
      </div>

      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span>المدة:</span>
          <span>{totalHours} ساعة</span>
        </div>
        <div className="flex justify-between items-center">
          <span>السعر بالساعة:</span>
          <span>{hourlyRate} ساعة</span>
        </div>
        <div className="flex justify-between items-center font-semibold border-t pt-2 mt-2">
          <span>الإجمالي:</span>
          <span>{totalCost} ساعة</span>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "جاري الإرسال..." : "إرسال طلب الحجز"}
      </Button>
    </form>
  );
}
