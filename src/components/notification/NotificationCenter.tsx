
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'system' | 'timebank' | 'marketplace' | 'forum';
  read: boolean;
  createdAt: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'رسالة جديدة',
    message: 'لديك رسالة جديدة من أحمد محمد',
    type: 'message',
    read: false,
    createdAt: '2025-04-19T12:30:00Z'
  },
  {
    id: '2',
    title: 'معاملة ناجحة',
    message: 'تم إضافة 3 ساعات إلى رصيدك',
    type: 'timebank',
    read: false,
    createdAt: '2025-04-19T10:15:00Z'
  },
  {
    id: '3',
    title: 'عرض جديد',
    message: 'تم نشر عرض جديد في المهارة التي تتابعها',
    type: 'marketplace',
    read: true,
    createdAt: '2025-04-18T15:45:00Z'
  },
  {
    id: '4',
    title: 'تنبيه من النظام',
    message: 'تم تحديث شروط الاستخدام، يرجى مراجعتها',
    type: 'system',
    read: true,
    createdAt: '2025-04-18T09:00:00Z'
  },
  {
    id: '5',
    title: 'منشور جديد في المجتمع',
    message: 'تمت الإجابة على استفسارك في منتدى المجتمع',
    type: 'forum',
    read: false,
    createdAt: '2025-04-19T14:20:00Z'
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Listen for real-time notifications when user is logged in
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Convert payload to our notification type
          const newNotification: Notification = {
            id: payload.new.id,
            title: payload.new.title,
            message: payload.new.message,
            type: payload.new.type,
            read: false,
            createdAt: payload.new.created_at,
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          toast(newNotification.title, {
            description: newNotification.message,
          });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  const markAsRead = async (id: string) => {
    // Update locally first for responsive UI
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    
    // If user is logged in, update in database
    if (user) {
      try {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', id)
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };
  
  const markAllAsRead = async () => {
    // Update locally first
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    
    // If user is logged in, update in database
    if (user) {
      try {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', user.id)
          .is('read', false);
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    }
  };
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
      case 'timebank':
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case 'marketplace':
        return <div className="h-2 w-2 rounded-full bg-orange-500"></div>;
      case 'system':
        return <div className="h-2 w-2 rounded-full bg-red-500"></div>;
      case 'forum':
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium">الإشعارات</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              تعيين الكل كمقروء
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[300px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={cn(
                    "p-3 hover:bg-muted/50 cursor-pointer transition-colors", 
                    !notification.read && "bg-muted/20"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-center gap-2">
                    {getNotificationIcon(notification.type)}
                    <div className="font-medium text-sm">{notification.title}</div>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{notification.message}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{formatDate(notification.createdAt)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <p className="mb-2 text-muted-foreground">لا توجد إشعارات</p>
            </div>
          )}
        </ScrollArea>
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-center text-xs"
            onClick={() => setOpen(false)}
          >
            عرض جميع الإشعارات
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
