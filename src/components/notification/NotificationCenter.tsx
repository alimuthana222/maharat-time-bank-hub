
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Settings,
  MessageSquare,
  Calendar,
  DollarSign,
  User,
  AlertCircle,
  Loader2
} from "lucide-react";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  related_id?: string;
  related_type?: string;
  is_read: boolean;
  created_at: string;
}

export function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      fetchNotifications();
      setupRealTimeUpdates();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("حدث خطأ أثناء تحميل الإشعارات");
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    if (!user) return;

    const channel = supabase
      .channel("notifications-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (notificationId: string) => {
    if (!user || markingAsRead.has(notificationId)) return;

    setMarkingAsRead(prev => new Set(prev).add(notificationId));
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", user.id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("حدث خطأ أثناء تحديث الإشعار");
    } finally {
      setMarkingAsRead(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      toast.success("تم وضع علامة قراءة على جميع الإشعارات");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("حدث خطأ أثناء تحديث الإشعارات");
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId)
        .eq("user_id", user.id);

      if (error) throw error;

      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("حدث خطأ أثناء حذف الإشعار");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "booking":
        return <Calendar className="h-4 w-4 text-green-500" />;
      case "payment":
        return <DollarSign className="h-4 w-4 text-yellow-500" />;
      case "user":
        return <User className="h-4 w-4 text-purple-500" />;
      case "system":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case "message": return "رسالة";
      case "booking": return "حجز";
      case "payment": return "دفع";
      case "user": return "مستخدم";
      case "system": return "نظام";
      default: return "إشعار";
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              الإشعارات
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                قراءة الكل
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد إشعارات</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-4">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50 ${
                    !notification.is_read ? "bg-primary/5 border-l-4 border-l-primary" : ""
                  }`}>
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.body}
                          </p>
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {getNotificationTypeLabel(notification.type)}
                            </Badge>
                            <span>
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                                locale: ar,
                              })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              disabled={markingAsRead.has(notification.id)}
                            >
                              {markingAsRead.has(notification.id) ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {index < notifications.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
