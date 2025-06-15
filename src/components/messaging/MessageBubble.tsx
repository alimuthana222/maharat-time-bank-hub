
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
    sender?: {
      username: string;
      avatar_url?: string;
    };
  };
  isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const timeAgo = formatDistanceToNow(new Date(message.created_at), {
    addSuffix: true,
    locale: ar
  });

  return (
    <div className={`flex gap-3 mb-4 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.sender?.avatar_url} />
          <AvatarFallback>
            {message.sender?.username?.[0]?.toUpperCase() || "م"}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-xs lg:max-w-md`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwnMessage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-900'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
          {timeAgo}
        </div>
      </div>
    </div>
  );
}
