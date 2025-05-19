
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowUpRight, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface SkillCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  hourlyRate: number;
  rating?: number;
  reviewCount?: number;
  provider: {
    name: string;
    university?: string;
    avatarUrl?: string;
  };
  badges?: string[];
}

export function SkillCard({
  id,
  title,
  category,
  description,
  hourlyRate,
  rating,
  reviewCount,
  provider,
  badges,
}: SkillCardProps) {
  // Function to get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <CardHeader className="p-6 pb-4 border-b">
        <Badge
          variant="outline"
          className={`mb-3 ${getCategoryColor(category)}`}
        >
          {category}
        </Badge>
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        
        {(rating !== undefined && reviewCount !== undefined) && (
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="flex items-center mr-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
              <span className="font-medium">{rating.toFixed(1)}</span>
            </div>
            <span>({reviewCount} تقييم)</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-6 flex-grow">
        <div className="line-clamp-3 h-18 mb-4">{description}</div>
        
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center mt-4">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={provider.avatarUrl} alt={provider.name} />
            <AvatarFallback>{getInitials(provider.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-sm font-medium">{provider.name}</div>
            {provider.university && (
              <div className="text-xs text-muted-foreground">
                {provider.university}
              </div>
            )}
          </div>
          <div className="text-lg font-bold text-primary">
            {hourlyRate} <span className="text-sm">ساعة</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4 mt-auto">
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
