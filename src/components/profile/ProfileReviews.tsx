
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export interface Review {
  id: string;
  reviewer: {
    name: string;
    avatarUrl?: string;
  };
  rating: number;
  comment: string;
  date: string;
  categories: {
    quality: number;
    speed: number;
    cooperation: number;
  };
}

interface ProfileReviewsProps {
  reviews: Review[];
}

export function ProfileReviews({ reviews }: ProfileReviewsProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">التقييمات والمراجعات</h2>
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <img 
                      src={review.reviewer.avatarUrl || "/placeholder.svg"} 
                      alt={review.reviewer.name} 
                    />
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{review.reviewer.name}</h3>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              
              <p className="mt-4">{review.comment}</p>
              
              <div className="grid grid-cols-3 gap-4 mt-4 text-center text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">الجودة</div>
                  <div className="font-medium">{review.categories.quality}/5</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">السرعة</div>
                  <div className="font-medium">{review.categories.speed}/5</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">التعاون</div>
                  <div className="font-medium">{review.categories.cooperation}/5</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
