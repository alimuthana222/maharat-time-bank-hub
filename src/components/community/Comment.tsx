
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export interface CommentProps {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export function Comment({ comment }: { comment: CommentProps }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: ar });
  };

  return (
    <div className="flex gap-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{comment.author[0] || "م"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 bg-muted/30 p-3 rounded-md">
        <div className="flex justify-between">
          <div className="font-medium text-sm">{comment.author}</div>
          <div className="text-xs text-muted-foreground">
            {formatDate(comment.createdAt)}
          </div>
        </div>
        <div className="text-sm mt-1">{comment.content}</div>
        <div className="flex items-center gap-2 mt-2">
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>إعجاب</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">رد</Button>
        </div>
      </div>
    </div>
  );
}
