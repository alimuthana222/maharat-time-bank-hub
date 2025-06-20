
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventActions } from "./EventActions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { ar } from "date-fns/locale";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  DollarSign,
  Loader2
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  content?: string;
  organizer_id: string;
  category: string;
  location: string;
  start_date: string;
  end_date: string;
  max_attendees?: number;
  current_attendees: number;
  price?: number;
  is_online: boolean;
  status: string;
  image_url?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  organizer_name?: string;
  organizer_avatar?: string;
  user_registered?: boolean;
}

export function RealEventsList() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const { data: eventsData, error } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) throw error;

      if (!eventsData) {
        setEvents([]);
        return;
      }

      // جلب معلومات المنظمين
      const organizerIds = eventsData.map(event => event.organizer_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .in("id", organizerIds);

      const profilesMap = profiles?.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>) || {};

      // فحص التسجيلات
      let registeredEventIds = new Set<string>();
      if (user && eventsData.length > 0) {
        const eventIds = eventsData.map(event => event.id);
        const { data: registrations } = await supabase
          .from("event_registrations")
          .select("event_id")
          .eq("user_id", user.id)
          .in("event_id", eventIds);

        registeredEventIds = new Set(registrations?.map(r => r.event_id) || []);
      }

      const eventsWithDetails = eventsData.map(event => ({
        ...event,
        organizer_name: profilesMap[event.organizer_id]?.full_name || profilesMap[event.organizer_id]?.username || "منظم",
        organizer_avatar: profilesMap[event.organizer_id]?.avatar_url,
        user_registered: registeredEventIds.has(event.id)
      }));

      setEvents(eventsWithDetails);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("حدث خطأ أثناء تحميل الفعاليات");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string, isRegistered: boolean) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    try {
      if (isRegistered) {
        const { error } = await supabase
          .from("event_registrations")
          .delete()
          .eq("event_id", eventId)
          .eq("user_id", user.id);

        if (error) throw error;
        toast.success("تم إلغاء التسجيل بنجاح");
      } else {
        const { error } = await supabase
          .from("event_registrations")
          .insert([{
            event_id: eventId,
            user_id: user.id
          }]);

        if (error) throw error;
        toast.success("تم التسجيل بنجاح");
      }

      fetchEvents();
    } catch (error) {
      console.error("Error handling registration:", error);
      toast.error("حدث خطأ أثناء التسجيل");
    }
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      workshop: "bg-blue-500",
      lecture: "bg-green-500",
      conference: "bg-purple-500",
      networking: "bg-orange-500",
      training: "bg-red-500",
      other: "bg-gray-500"
    };
    return colorMap[category] || "bg-gray-500";
  };

  const getCategoryLabel = (category: string) => {
    const labelMap: Record<string, string> = {
      workshop: "ورشة عمل",
      lecture: "محاضرة",
      conference: "مؤتمر",
      networking: "تواصل",
      training: "تدريب",
      other: "أخرى"
    };
    return labelMap[category] || category;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">لا توجد فعاليات متاحة حالياً</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={event.organizer_avatar} />
                  <AvatarFallback>
                    {event.organizer_name?.charAt(0) || "م"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <Badge className={`${getCategoryColor(event.category)} text-white`}>
                      {getCategoryLabel(event.category)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    نظمت بواسطة {event.organizer_name}
                  </p>
                </div>
              </div>
              
              <EventActions event={event} onUpdate={fetchEvents} />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{event.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>
                  {format(new Date(event.start_date), "dd/MM/yyyy", { locale: ar })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-green-600" />
                <span>
                  {format(new Date(event.start_date), "HH:mm", { locale: ar })} - 
                  {format(new Date(event.end_date), "HH:mm", { locale: ar })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-red-600" />
                <span>{event.is_online ? "عبر الإنترنت" : event.location}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-purple-600" />
                <span>
                  {event.current_attendees} / {event.max_attendees || "∞"} مشارك
                </span>
              </div>

              {event.price && event.price > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-yellow-600" />
                  <span>{event.price} د.ع</span>
                </div>
              )}
            </div>

            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(event.created_at), {
                  addSuffix: true,
                  locale: ar,
                })}
              </p>

              {user && (
                <Button
                  onClick={() => handleRegister(event.id, event.user_registered || false)}
                  variant={event.user_registered ? "outline" : "default"}
                  size="sm"
                >
                  {event.user_registered ? "إلغاء التسجيل" : "التسجيل"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
