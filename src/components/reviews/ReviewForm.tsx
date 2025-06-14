
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";

interface ReviewFormProps {
  reviewedUserId: string;
  serviceId?: string;
  transactionId?: string;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ reviewedUserId, serviceId, transactionId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
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
      toast.error("حدث خطأ أثناء إضافة التقييم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">إضافة تقييم</h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">التقييم</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="transition-colors"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">التعليق (اختياري)</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="شارك تجربتك..."
          rows={3}
        />
      </div>

      <Button type="submit" disabled={loading || rating === 0}>
        {loading ? "جاري الإرسال..." : "إضافة التقييم"}
      </Button>
    </form>
  );
}
