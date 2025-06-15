
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewFormProps {
  reviewedUserId: string;
  serviceId?: string;
  transactionId?: string;
  onReviewSubmitted?: () => void;
  className?: string;
}

export function ReviewForm({ 
  reviewedUserId, 
  serviceId, 
  transactionId, 
  onReviewSubmitted,
  className = ""
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (rating === 0) {
      toast.error("يرجى اختيار تقييم");
      return;
    }

    if (user.id === reviewedUserId) {
      toast.error("لا يمكنك تقييم نفسك");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("reviews")
        .insert({
          reviewer_id: user.id,
          reviewed_user_id: reviewedUserId,
          service_id: serviceId,
          transaction_id: transactionId,
          rating,
          comment: comment.trim() || null,
        });

      if (error) throw error;

      toast.success("تم إضافة التقييم بنجاح");
      setRating(0);
      setComment("");
      onReviewSubmitted?.();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      if (error.code === '23505') {
        toast.error("لقد قمت بتقييم هذا المستخدم من قبل");
      } else {
        toast.error("حدث خطأ أثناء إضافة التقييم");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">إضافة تقييم</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">التقييم</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-all duration-200 hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredStar || rating) 
                        ? "text-yellow-400 fill-current" 
                        : "text-gray-300 hover:text-yellow-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {rating === 1 && "ضعيف"}
                {rating === 2 && "مقبول"}
                {rating === 3 && "جيد"}
                {rating === 4 && "ممتاز"}
                {rating === 5 && "رائع"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">التعليق (اختياري)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="شارك تجربتك مع هذا المستخدم..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 حرف
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={loading || rating === 0}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                جاري الإرسال...
              </>
            ) : (
              "إضافة التقييم"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
