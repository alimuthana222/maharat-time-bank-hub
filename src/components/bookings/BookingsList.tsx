
import React, { useEffect, useState } from "react";
import { Calendar, Clock, User, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";

interface Booking {
  id: string;
  booking_date: string;
  duration: number;
  total_hours: number;
  message: string | null;
  status: string;
  created_at: string;
  client_id: string;
  provider_id: string;
  client?: {
    full_name: string | null;
    username: string;
    avatar_url: string | null;
  };
  provider?: {
    full_name: string | null;
    username: string;
    avatar_url: string | null;
  };
}

export function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const { data: bookingsData, error } = await supabase
        .from("bookings")
        .select("*")
        .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (bookingsData) {
        // جلب معلومات العملاء والمقدمين
        const bookingsWithProfiles = await Promise.all(
          bookingsData.map(async (booking) => {
            const { data: clientProfile } = await supabase
              .from("profiles")
              .select("full_name, username, avatar_url")
              .eq("id", booking.client_id)
              .single();

            const { data: providerProfile } = await supabase
              .from("profiles")
              .select("full_name, username, avatar_url")
              .eq("id", booking.provider_id)
              .single();

            return {
              ...booking,
              client: clientProfile,
              provider: providerProfile,
            };
          })
        );

        setBookings(bookingsWithProfiles);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("حدث خطأ أثناء جلب الحجوزات");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;

      toast.success("تم تحديث حالة الحجز");
      fetchBookings(); // إعادة تحميل البيانات
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("حدث خطأ أثناء تحديث الحجز");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "في الانتظار", variant: "secondary" as const },
      confirmed: { label: "مؤكد", variant: "default" as const },
      completed: { label: "مكتمل", variant: "default" as const },
      cancelled: { label: "ملغي", variant: "destructive" as const },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: new Intl.DateTimeFormat("ar", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date),
      time: new Intl.DateTimeFormat("ar", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date),
    };
  };

  if (loading) {
    return <div className="text-center py-8">جاري تحميل الحجوزات...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد حجوزات بعد
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const isProvider = user?.id === booking.provider_id;
        const otherParty = isProvider ? booking.client : booking.provider;
        const { date, time } = formatDateTime(booking.booking_date);

        return (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {isProvider ? "طلب حجز جديد" : "حجزك"}
                </CardTitle>
                {getStatusBadge(booking.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={otherParty?.avatar_url || undefined} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {otherParty?.full_name || otherParty?.username || "مستخدم غير معروف"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isProvider ? "العميل" : "مقدم الخدمة"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{time}</span>
                </div>
              </div>

              <div className="text-sm">
                <p><strong>المدة:</strong> {booking.duration} دقيقة ({booking.total_hours} ساعة)</p>
              </div>

              {booking.message && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                    <p className="text-sm">{booking.message}</p>
                  </div>
                </div>
              )}

              {isProvider && booking.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => updateBookingStatus(booking.id, "confirmed")}
                  >
                    قبول الحجز
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateBookingStatus(booking.id, "cancelled")}
                  >
                    رفض الحجز
                  </Button>
                </div>
              )}

              {booking.status === "confirmed" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateBookingStatus(booking.id, "completed")}
                >
                  تأكيد الإنتهاء
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
