
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  DollarSign, 
  User, 
  Loader2,
  Star,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  hourly_rate: number;
  delivery_time: number;
  user_id: string;
  category: string;
  type: string;
  tags?: string[];
  user?: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface CreateBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: MarketplaceListing | null;
  onSuccess?: () => void;
}

export function CreateBookingDialog({
  open,
  onOpenChange,
  listing,
  onSuccess
}: CreateBookingDialogProps) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", 
    "17:00", "18:00", "19:00", "20:00"
  ];

  const calculateTotal = () => {
    if (!listing) return 0;
    return listing.hourly_rate * duration;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !listing || !selectedDate || !selectedTime) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (user.id === listing.user_id) {
      toast.error("لا يمكنك حجز خدمتك الخاصة");
      return;
    }

    setIsSubmitting(true);

    try {
      // تحديد تاريخ ووقت الحجز
      const bookingDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      bookingDateTime.setHours(hours, minutes, 0, 0);

      const { error } = await supabase
        .from("bookings")
        .insert({
          client_id: user.id,
          provider_id: listing.user_id,
          service_id: listing.id,
          booking_date: bookingDateTime.toISOString(),
          duration: duration,
          total_hours: duration,
          message: message.trim() || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("تم إرسال طلب الحجز بنجاح");
      onOpenChange(false);
      onSuccess?.();
      
      // إعادة تعيين النموذج
      setSelectedDate(undefined);
      setSelectedTime("");
      setDuration(1);
      setMessage("");
      
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast.error("حدث خطأ أثناء إنشاء الحجز");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            حجز خدمة
          </DialogTitle>
          <DialogDescription>
            املأ التفاصيل أدناه لحجز هذه الخدمة
          </DialogDescription>
        </DialogHeader>

        {/* معلومات الخدمة */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  {listing.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{listing.user?.full_name || listing.user?.username}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{listing.hourly_rate} USD/ساعة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>التسليم خلال {listing.delivery_time} أيام</span>
                  </div>
                </div>

                {listing.tags && listing.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {listing.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* اختيار التاريخ */}
          <div className="space-y-2">
            <Label>تاريخ الحجز *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP", { locale: ar })
                  ) : (
                    <span>اختر التاريخ</span>
                  )}
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

          {/* اختيار الوقت */}
          <div className="space-y-2">
            <Label>وقت البداية *</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الوقت" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* المدة بالساعات */}
          <div className="space-y-2">
            <Label>عدد الساعات *</Label>
            <Input
              type="number"
              min="1"
              max="8"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
              placeholder="عدد الساعات"
            />
            <p className="text-xs text-muted-foreground">
              الحد الأقصى 8 ساعات لكل حجز
            </p>
          </div>

          {/* رسالة إضافية */}
          <div className="space-y-2">
            <Label>رسالة للمقدم (اختياري)</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب أي تفاصيل إضافية أو متطلبات خاصة..."
              rows={3}
            />
          </div>

          {/* ملخص التكلفة */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">ملخص التكلفة</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>سعر الساعة:</span>
                  <span>{listing.hourly_rate} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>عدد الساعات:</span>
                  <span>{duration} ساعة</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>المجموع:</span>
                  <span>{calculateTotal()} USD</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* أزرار العمل */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !selectedDate || !selectedTime}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  إرسال طلب الحجز
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
