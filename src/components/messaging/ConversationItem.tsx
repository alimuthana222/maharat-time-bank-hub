
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface ConversationItemProps {
  conversation: {
    id: string;
    last_message_at: string;
    other_participant?: {
      username: string;
      full_name: string | null;
      avatar_url: string | null;
    };
  };
  isSelected?: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  const displayName = conversation.other_participant?.full_name || 
                     conversation.other_participant?.username || 
                     "مستخدم غير معروف";

  const timeAgo = formatDistanceToNow(new Date(conversation.last_message_at), {
    addSuffix: true,
    locale: ar
  });

  return (
    <Card 
      className={`cursor-pointer transition-colors hover:bg-accent ${
        isSelected ? 'bg-accent' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.other_participant?.avatar_url || undefined} />
            <AvatarFallback>
              {displayName[0]?.toUpperCase() || "م"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{displayName}</div>
            <div className="text-sm text-muted-foreground">{timeAgo}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
