
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, Flag, Share2 } from "lucide-react";

export interface ForumPostProps {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatarFallback: string;
    university: string;
  };
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  tags?: string[];
}

export function ForumPost({
  id,
  title,
  content,
  author,
  createdAt,
  likesCount,
  commentsCount,
  tags = [],
}: ForumPostProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{author.avatarFallback}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{author.name}</div>
              <div className="text-xs text-muted-foreground">{author.university}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(createdAt)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-3">{content}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div key={index} className="bg-muted text-xs rounded-full px-2.5 py-1">
                #{tag}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-3">
        <div className="flex justify-between w-full">
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="flex gap-2 items-center">
              <ThumbsUp className="h-4 w-4" />
              <span>{likesCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex gap-2 items-center">
              <MessageSquare className="h-4 w-4" />
              <span>{commentsCount}</span>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
