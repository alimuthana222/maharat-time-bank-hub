
import React from "react";
import { formatDate } from "@/lib/date-utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: 'message' | 'system' | 'event' | 'transaction' | 'report';
  is_read: boolean;
  created_at: string;
  related_id?: string;
  related_type?: string;
}

interface NotificationItemProps {
  notification: Notification;
  icon: React.ReactNode;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, icon, onMarkAsRead }: NotificationItemProps) {
  return (
    <div 
      key={notification.id} 
      className={`p-3 ${!notification.is_read ? 'bg-muted/50' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 bg-muted rounded p-1">
            {icon}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {notification.body}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(notification.created_at)}
            </p>
          </div>
        </div>
        {!notification.is_read && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => onMarkAsRead(notification.id)}
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
