
import React, { useEffect, useState } from "react";
import { Star, User, Loader2, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  showTitle?: boolean;
  className?: string;
}

export function ReviewsList({ userId, showTitle = true, className = "" }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

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
        setTotalReviews(reviewsData.length);

        // حساب متوسط التقييم
        if (reviewsData.length > 0) {
          const avgRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
          setAverageRating(avgRating);
        } else {
          setAverageRating(0);
        }
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

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-yellow-600";
    if (rating >= 2.5) return "text-orange-600";
    return "text-red-600";
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return "ممتاز";
    if (rating >= 3.5) return "جيد جداً";
    if (rating >= 2.5) return "جيد";
    if (rating >= 1.5) return "مقبول";
    return "ضعيف";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <CardHeader className="px-0">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            التقييمات والمراجعات
          </CardTitle>
        </CardHeader>
      )}

      {totalReviews > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`text-3xl font-bold ${getRatingColor(averageRating)}`}>
                  {averageRating.toFixed(1)}
                </div>
                <div>
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
                  <p className="text-sm text-muted-foreground">
                    {getRatingText(averageRating)}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                {totalReviews} تقييم
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              لا توجد تقييمات بعد
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.reviewer.avatar_url || undefined} />
                    <AvatarFallback>
                      {(review.reviewer.full_name || review.reviewer.username).charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium">
                          {review.reviewer.full_name || review.reviewer.username}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
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
                          <Badge variant="outline" className="text-xs">
                            {getRatingText(review.rating)}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    
                    {review.comment && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    )}
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
