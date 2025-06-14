
import React, { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

interface ServiceBookingDialogProps {
  listing: {
    id: string;
    title: string;
    hourly_rate: number;
    user_id: string;
  };
}

export function ServiceBookingDialog({ listing }: ServiceBookingDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    booking_date: "",
    duration: "60",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const bookingDate = new Date(formData.booking_date);
      const durationHours = Math.ceil(parseInt(formData.duration) / 60);

      const { error } = await supabase
        .from("bookings")
        .insert({
          client_id: user.id,
          provider_id: listing.user_id,
          service_id: listing.id,
          booking_date: bookingDate.toISOString(),
          duration: parseInt(formData.duration),
          total_hours: durationHours,
          message: formData.message
        });

      if (error) throw error;

      toast.success("تم إرسال طلب الحجز بنجاح!");
      setOpen(false);
      setFormData({
        booking_date: "",
        duration: "60",
        message: ""
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("خطأ في إرسال طلب الحجز");
    } finally {
      setLoading(false);
    }
  };

  const calculateCost = () => {
    const hours = Math.ceil(parseInt(formData.duration || "60") / 60);
    return hours * listing.hourly_rate;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">احجز الآن</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>حجز خدمة: {listing.title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">تاريخ ووقت الحجز</label>
            <Input
              type="datetime-local"
              value={formData.booking_date}
              onChange={(e) => setFormData({...formData, booking_date: e.target.value})}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">مدة الخدمة (بالدقائق)</label>
            <Input
              type="number"
              min="30"
              step="30"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">رسالة إضافية</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="اكتب أي تفاصيل إضافية عن الخدمة المطلوبة..."
              rows={3}
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">التكلفة المتوقعة:</span>
              <span className="font-bold text-lg">{calculateCost().toLocaleString()} د.ع</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ({Math.ceil(parseInt(formData.duration || "60") / 60)} ساعة × {listing.hourly_rate.toLocaleString()} د.ع)
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "جاري الإرسال..." : "إرسال طلب الحجز"}
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
