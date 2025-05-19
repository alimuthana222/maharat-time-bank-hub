import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { timeAgo } from "@/lib/date-utils";

export interface ListingCardProps {
  id: string;
  title: string;
  type: "offer" | "need";
  category: string;
  description: string;
  hourlyRate: number;
  postedBy: {
    name: string;
    university: string;
    avatarUrl?: string;
  };
  createdAt?: string;
  deadline?: string;
  tags?: string[];
}

export function ListingCard({
  id,
  title,
  type,
  category,
  description,
  hourlyRate,
  postedBy,
  createdAt,
  deadline,
  tags,
}: ListingCardProps) {
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
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  // Function to get color for type (offer/need)
  const getTypeColor = (type: "offer" | "need") => {
    return type === "offer"
      ? "bg-green-500/10 text-green-600 border-green-200"
      : "bg-blue-500/10 text-blue-600 border-blue-200";
  };
  
  // Function to get text for type (offer/need)
  const getTypeText = (type: "offer" | "need") => {
    return type === "offer" ? "عرض" : "طلب";
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-6 pb-4 border-b bg-muted/10">
        <div className="flex justify-between items-start">
          <Badge
            variant="outline"
            className={`mb-3 ${getCategoryColor(category)}`}
          >
            {category}
          </Badge>
          
          <Badge
            variant="outline"
            className={getTypeColor(type)}
          >
            {getTypeText(type)}
          </Badge>
        </div>
        
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{hourlyRate} ساعة لكل ساعة عمل</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <CardDescription className="line-clamp-3 h-18 mb-4">
          {description}
        </CardDescription>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {deadline && (
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4 mr-1" />
            <span>الموعد النهائي: {new Date(deadline).toLocaleDateString('ar-SA')}</span>
          </div>
        )}
        
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={postedBy.avatarUrl} alt={postedBy.name} />
            <AvatarFallback>{getInitials(postedBy.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-sm font-medium">{postedBy.name}</div>
            <div className="text-xs text-muted-foreground">
              {postedBy.university}
            </div>
          </div>
          {createdAt && (
            <div className="text-xs text-muted-foreground">
              {timeAgo(createdAt)}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <Button asChild className="w-full">
          <Link to={`/marketplace/${id}`} className="flex items-center justify-center">
            عرض التفاصيل
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
