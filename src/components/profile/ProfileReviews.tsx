
import React from "react";
import { ReviewsList } from "@/components/reviews/ReviewsList";

interface ProfileReviewsProps {
  userId: string;
}

export function ProfileReviews({ userId }: ProfileReviewsProps) {
  return (
    <div className="mt-8">
      <ReviewsList userId={userId} showTitle={true} />
    </div>
  );
}
