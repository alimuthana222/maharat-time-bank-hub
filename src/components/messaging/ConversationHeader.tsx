
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConversationHeaderProps {
  participant: {
    username: string;
    full_name?: string;
    avatar_url?: string;
  } | null;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function ConversationHeader({ participant, onBack, showBackButton }: ConversationHeaderProps) {
  const displayName = participant?.full_name || participant?.username || "مستخدم غير معروف";

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-white">
      {showBackButton && (
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      
      <Avatar className="h-10 w-10">
        <AvatarImage src={participant?.avatar_url} />
        <AvatarFallback>
          {displayName[0]?.toUpperCase() || "م"}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h3 className="font-medium">{displayName}</h3>
        <p className="text-sm text-green-600">متصل الآن</p>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>عرض الملف الشخصي</DropdownMenuItem>
          <DropdownMenuItem>كتم الإشعارات</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">حظر المستخدم</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
