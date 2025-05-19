
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Star, Clock, ArrowUpRight } from "lucide-react";

interface SkillCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  hourlyRate: number;
  provider: {
    name: string;
    university: string;
    avatarUrl?: string;
  };
  rating?: number;
  reviewCount?: number;
  badges?: string[];
}

export function SkillCard({
  id,
  title,
  category,
  description,
  hourlyRate,
  provider,
  rating = 0,
  reviewCount = 0,
  badges = [],
}: SkillCardProps) {
  // Function to get color for category
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "برمجة":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "تصميم":
        return "bg-orange-500/10 text-orange-600 border-orange-200";
      case "ترجمة":
        return "bg-purple-500/10 text-purple-600 border-purple-200";
      case "تدريس":
        return "bg-teal-500/10 text-teal-600 border-teal-200";
      case "كتابة":
        return "bg-red-500/10 text-red-600 border-red-200";
      case "تصوير":
        return "bg-pink-500/10 text-pink-600 border-pink-200";
      case "صوتيات":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "تسويق":
        return "bg-indigo-500/10 text-indigo-600 border-indigo-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };
  
  // Get provider initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="bg-muted/30 p-6">
          <div className="flex justify-between items-start mb-4">
            <Badge
              variant="outline"
              className={`${getCategoryColor(category)}`}
            >
              {category}
            </Badge>

            {badges && badges.length > 0 && (
              <div className="flex gap-2">
                {badges.map((badge, index) => (
                  <Badge key={index} variant="secondary">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
              <span className="text-sm font-medium">
                {rating > 0 ? rating.toFixed(1) : "جديد"}
              </span>
            </div>
            
            {reviewCount > 0 && (
              <span className="text-xs text-muted-foreground">
                ({reviewCount} تقييم)
              </span>
            )}
            
            <div className="flex items-center ml-auto">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm font-medium">
                {hourlyRate} ساعة
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <CardDescription className="line-clamp-3 h-18 mb-4">
          {description}
        </CardDescription>
        
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={provider.avatarUrl} alt={provider.name} />
            <AvatarFallback>{getInitials(provider.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{provider.name}</div>
            <div className="text-xs text-muted-foreground">
              {provider.university}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Button asChild className="w-full">
          <Link to={`/skills/${id}`} className="flex items-center justify-center">
            عرض التفاصيل
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
