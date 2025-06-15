import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  MessageSquare, 
  Check, 
  X, 
  Star,
  AlertCircle,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface Booking {
  id: string;
  client_id: string;
  provider_id: string;
  service_id: string;
  booking_date: string;
  duration: number;
  total_hours: number;
  message?: string;
  status: string;
  created_at: string;
  client?: {
    username: string;
    full_name: string;
    avatar_url?: string;
  } | null;
  provider?: {
    username: string;
    full_name: string;
    avatar_url?: string;
  } | null;
  service?: {
    title: string;
    hourly_rate: number;
    category: string;
  } | null;
}

interface BookingCardProps {
  booking: Booking;
  onStatusChange?: () => void;
  viewType: 'client' | 'provider';
}

export function BookingCard({ booking, onStatusChange, viewType }: BookingCardProps) {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'default';
      case 'completed':
        return 'default';
      case 'cancelled':
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'confirmed':
        return 'مؤكد';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      case 'rejected':
        return 'مرفوض';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <Check className="h-4 w-4" />;
      case 'completed':
        return <Star className="h-4 w-4" />;
      case 'cancelled':
      case 'rejected':
        return <X className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = async (newStatus: string, reason?: string) => {
    if (!user) return;

    setIsUpdating(true);
    try {
      const updateData: any = { status: newStatus };
      if (reason) {
        updateData.rejection_reason = reason;
      }

      const { error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", booking.id);

      if (error) throw error;

      toast.success(`تم ${newStatus === 'confirmed' ? 'تأكيد' : newStatus === 'rejected' ? 'رفض' : 'تحديث'} الحجز بنجاح`);
      onStatusChange?.();
      setShowRejectForm(false);
      setRejectReason("");
    } catch (error: any) {
      console.error("Error updating booking:", error);
      toast.error("حدث خطأ أثناء تحديث الحجز");
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateTotal = () => {
    return (booking.service?.hourly_rate || 0) * booking.total_hours;
  };

  const otherUser = viewType === 'client' ? booking.provider : booking.client;
  const isProvider = viewType === 'provider';
  const canManage = isProvider && booking.status === 'pending';
  const canReview = booking.status === 'completed' && !showReviewForm;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherUser?.avatar_url} />
              <AvatarFallback>
                {(otherUser?.full_name || otherUser?.username || "؟").charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {otherUser?.full_name || otherUser?.username}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isProvider ? "عميل" : "مقدم الخدمة"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusIcon(booking.status)}
            <Badge variant={getStatusVariant(booking.status)}>
              {getStatusText(booking.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* تفاصيل الخدمة */}
        {booking.service && (
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">{booking.service.title}</h4>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {booking.service.hourly_rate} USD/ساعة
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {booking.total_hours} ساعة
              </span>
              <Badge variant="outline" className="text-xs">
                {booking.service.category}
              </Badge>
            </div>
          </div>
        )}

        {/* معلومات الحجز */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-muted-foreground">تاريخ الحجز</label>
            <div className="flex items-center gap-1 mt-1">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(booking.booking_date), "PPP", { locale: ar })}
              </span>
            </div>
          </div>
          <div>
            <label className="text-muted-foreground">وقت البداية</label>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-4 w-4" />
              <span>
                {format(new Date(booking.booking_date), "HH:mm")}
              </span>
            </div>
          </div>
        </div>

        {/* رسالة العميل */}
        {booking.message && (
          <div>
            <label className="text-sm text-muted-foreground">رسالة العميل</label>
            <div className="mt-1 p-3 bg-muted rounded-lg text-sm">
              {booking.message}
            </div>
          </div>
        )}

        {/* ملخص التكلفة */}
        <div className="p-3 bg-primary/5 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">إجمالي التكلفة:</span>
            <span className="text-lg font-bold text-primary">
              {calculateTotal()} USD
            </span>
          </div>
        </div>

        {/* إجراءات للمقدم */}
        {canManage && !showRejectForm && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRejectForm(true)}
              className="flex-1"
              disabled={isUpdating}
            >
              <X className="h-4 w-4 mr-1" />
              رفض
            </Button>
            <Button
              size="sm"
              onClick={() => handleStatusUpdate('confirmed')}
              className="flex-1"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Check className="h-4 w-4 mr-1" />
              )}
              تأكيد
            </Button>
          </div>
        )}

        {/* نموذج الرفض */}
        {showRejectForm && (
          <div className="space-y-3">
            <label className="text-sm font-medium">سبب الرفض</label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="اكتب سبب رفض الحجز..."
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectReason("");
                }}
                className="flex-1"
                disabled={isUpdating}
              >
                إلغاء
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleStatusUpdate('rejected', rejectReason)}
                className="flex-1"
                disabled={isUpdating || !rejectReason.trim()}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <X className="h-4 w-4 mr-1" />
                )}
                رفض الحجز
              </Button>
            </div>
          </div>
        )}

        {/* إضافة تقييم للحجوزات المكتملة */}
        {canReview && (
          <div className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setShowReviewForm(true)}
              className="w-full"
            >
              <Star className="h-4 w-4 mr-2" />
              إضافة تقييم
            </Button>
          </div>
        )}

        {/* نموذج التقييم */}
        {showReviewForm && otherUser && (
          <div className="border-t pt-4">
            <ReviewForm
              reviewedUserId={viewType === 'client' ? booking.provider_id : booking.client_id}
              serviceId={booking.service_id}
              transactionId={booking.id}
              onReviewSubmitted={() => {
                setShowReviewForm(false);
                toast.success("تم إضافة التقييم بنجاح");
              }}
            />
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="text-xs text-muted-foreground border-t pt-3">
          تم الإنشاء في {format(new Date(booking.created_at), "PPP 'في' HH:mm", { locale: ar })}
        </div>
      </CardContent>
    </Card>
  );
}
