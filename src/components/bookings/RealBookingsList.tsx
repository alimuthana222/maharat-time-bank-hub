
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: string;
  booking_date: string;
  duration: number;
  total_hours: number;
  message?: string;
  status: string;
  created_at: string;
  client_id: string;
  provider_id: string;
  service?: {
    title: string;
  };
  client?: {
    username: string;
    full_name?: string;
  };
  provider?: {
    username: string;
    full_name?: string;
  };
}

export function RealBookingsList() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, filter]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from("bookings")
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(username, full_name),
          provider:profiles!bookings_provider_id_fkey(username, full_name)
        `)
        .order("created_at", { ascending: false });

      if (filter === "sent") {
        query = query.eq("client_id", user.id);
      } else if (filter === "received") {
        query = query.eq("provider_id", user.id);
      } else {
        query = query.or(`client_id.eq.${user.id},provider_id.eq.${user.id}`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("خطأ في تحميل الحجوزات");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: "confirmed" | "cancelled") => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", bookingId);

      if (error) throw error;

      toast.success(`تم ${status === "confirmed" ? "قبول" : "رفض"} الحجز`);
      await fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("خطأ في تحديث الحجز");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "مؤكد";
      case "cancelled":
        return "ملغي";
      case "completed":
        return "مكتمل";
      default:
        return "قيد الانتظار";
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* فلاتر الحجوزات */}
      <div className="flex gap-2">
        <Button 
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          جميع الحجوزات
        </Button>
        <Button 
          variant={filter === "sent" ? "default" : "outline"}
          onClick={() => setFilter("sent")}
        >
          الحجوزات المرسلة
        </Button>
        <Button 
          variant={filter === "received" ? "default" : "outline"}
          onClick={() => setFilter("received")}
        >
          الحجوزات المستقبلة
        </Button>
      </div>

      {/* قائمة الحجوزات */}
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            لا توجد حجوزات
          </div>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {booking.client_id === user?.id ? "طلب حجز مرسل" : "طلب حجز مستقبل"}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>
                        {booking.client_id === user?.id 
                          ? `إلى: ${booking.provider?.full_name || booking.provider?.username}`
                          : `من: ${booking.client?.full_name || booking.client?.username}`
                        }
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {new Date(booking.booking_date).toLocaleDateString("ar", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      المدة: {booking.duration} دقيقة ({booking.total_hours} ساعة)
                    </span>
                  </div>
                </div>

                {booking.message && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm"><strong>الرسالة:</strong> {booking.message}</p>
                  </div>
                )}

                {/* أزرار التحكم للمزودين */}
                {booking.provider_id === user?.id && booking.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => updateBookingStatus(booking.id, "confirmed")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="ml-1 h-4 w-4" />
                      قبول
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateBookingStatus(booking.id, "cancelled")}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="ml-1 h-4 w-4" />
                      رفض
                    </Button>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  تم الإنشاء: {new Date(booking.created_at).toLocaleDateString("ar")}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
