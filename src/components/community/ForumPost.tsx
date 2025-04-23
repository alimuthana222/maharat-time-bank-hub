
import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  MoreVertical,
  Flag
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useReport } from "@/context/ReportContext";

export interface ForumPostProps {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatarFallback: string;
    university?: string;
    id?: string;
  };
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  tags?: string[];
  onToggleComments?: () => void;
  isPreview?: boolean;
}

export function ForumPost({
  id,
  title,
  content,
  author,
  createdAt,
  likesCount,
  commentsCount,
  tags,
  onToggleComments,
  isPreview = false
}: ForumPostProps) {
  const [liked, setLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);
  const { user } = useAuth();
  const { openReportDialog } = useReport();
  
  const handleLikeClick = () => {
    if (!user) return;
    
    setLiked(!liked);
    setLocalLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleReportPost = () => {
    if (!user || !author.id) return;
    openReportDialog(
      id,
      "post",
      author.id
    );
  };
  
  const formattedDate = formatDistanceToNow(new Date(createdAt), { 
    addSuffix: true, 
    locale: ar 
  });

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Avatar>
              <AvatarFallback>{author.avatarFallback}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{author.name}</h3>
              {author.university && (
                <p className="text-sm text-muted-foreground">{author.university}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="ml-2 rtl:mr-2">{formattedDate}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical size={16} />
                  <span className="sr-only">القائمة</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user && author.id && author.id !== user.id && (
                  <DropdownMenuItem onClick={handleReportPost} className="text-red-500">
                    <Flag size={16} className="ml-2 rtl:mr-2" />
                    الإبلاغ عن المنشور
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mt-4">{title}</h2>
      </CardHeader>
      
      <CardContent>
        <p className={isPreview ? "line-clamp-3" : ""}>{content}</p>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex space-x-4 rtl:space-x-reverse">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center gap-1 ${liked ? "text-red-500" : ""}`}
            onClick={handleLikeClick}
          >
            <Heart size={18} className={liked ? "fill-current" : ""} />
            <span>{localLikesCount}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={onToggleComments}
          >
            <MessageSquare size={18} />
            <span>{commentsCount}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Share2 size={18} />
          </Button>
        </div>
        
        {isPreview && (
          <Button variant="ghost" size="sm">قراءة المزيد</Button>
        )}
      </CardFooter>
    </Card>
  );
}
