
import React, { useEffect, useState } from "react";
import { Star, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: {
    id: string;
    full_name: string | null;
    username: string;
    avatar_url: string | null;
  };
}

interface ReviewsListProps {
  userId: string;
}

export function ReviewsList({ userId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [userId]);

  const fetchReviews = async () => {
    try {
      const { data: reviewsData, error } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer_id
        `)
        .eq("reviewed_user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (reviewsData) {
        // جلب معلومات المراجعين
        const reviewsWithProfiles = await Promise.all(
          reviewsData.map(async (review) => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name, username, avatar_url")
              .eq("id", review.reviewer_id)
              .single();

            return {
              ...review,
              reviewer: {
                id: review.reviewer_id,
                full_name: profile?.full_name || null,
                username: profile?.username || "مستخدم",
                avatar_url: profile?.avatar_url || null,
              },
            };
          })
        );

        setReviews(reviewsWithProfiles);

        // حساب متوسط التقييم
        const avgRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
        setAverageRating(avgRating || 0);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("ar", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  if (loading) {
    return <div className="text-center py-4">جاري تحميل التقييمات...</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= averageRating ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="font-medium">{averageRating.toFixed(1)}</span>
          <span className="text-gray-600">({reviews.length} تقييم)</span>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          لا توجد تقييمات بعد
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={review.reviewer.avatar_url || undefined} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {review.reviewer.full_name || review.reviewer.username}
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {review.comment && (
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
