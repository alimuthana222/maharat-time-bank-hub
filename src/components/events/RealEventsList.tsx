import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Loader2 } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: string;
  start_date: string;
  end_date: string;
  location: string;
  organizer_id: string;
  max_attendees?: number;
  current_attendees: number;
  price: number;
  image_url?: string;
  is_online: boolean;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  tags?: string[];
  created_at: string;
  organizer_name?: string;
  organizer_avatar?: string;
  user_registered?: boolean;
}

const categories = [
  { value: "all", label: "جميع الفئات" },
  { value: "tech", label: "تقنية" },
  { value: "education", label: "تعليمية" },
  { value: "workshop", label: "ورشة عمل" },
  { value: "networking", label: "شبكات مهنية" },
  { value: "career", label: "تطوير مهني" },
  { value: "cultural", label: "ثقافية" },
  { value: "volunteer", label: "تطوعية" }
];

const iraqCities = [
  "جميع المدن", "بغداد", "البصرة", "الموصل", "أربيل", "النجف", 
  "كربلاء", "السليمانية", "الأنبار", "ديالى", "كركوك", 
  "بابل", "واسط", "صلاح الدين", "المثنى", "القادسية", "ذي قار", "ميسان", "دهوك"
];

export function RealEventsList() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("جميع المدن");
  const [eventType, setEventType] = useState("all");

  useEffect(() => {
    fetchEvents();
    setupRealTimeUpdates();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("events")
        .select("*")
        .eq("status", "upcoming")
        .order("start_date", { ascending: true });

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      if (selectedCity !== "جميع المدن") {
        query = query.ilike("location", `%${selectedCity}%`);
      }

      if (eventType !== "all") {
        query = query.eq("is_online", eventType === "online");
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data: eventsData, error } = await query;

      if (error) throw error;

      if (!eventsData) {
        setEvents([]);
        return;
      }

      // Get organizer profiles separately
      const organizerIds = eventsData.map(event => event.organizer_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", organizerIds);

      const profilesMap = profiles?.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>) || {};

      // Check user registrations
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
        organizer_name: profilesMap[event.organizer_id]?.username || "منظم الفعالية",
        organizer_avatar: profilesMap[event.organizer_id]?.avatar_url,
        user_registered: registeredEventIds.has(event.id),
        status: event.status as "upcoming" | "ongoing" | "completed" | "cancelled"
      }));

      setEvents(eventsWithDetails);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("حدث خطأ أثناء تحميل الفعاليات");
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    const channel = supabase
      .channel("events-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events"
        },
        () => {
          fetchEvents();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "event_registrations"
        },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    try {
      const { error } = await supabase
        .from("event_registrations")
        .insert([{
          event_id: eventId,
          user_id: user.id
        }]);

      if (error) throw error;

      toast.success("تم التسجيل في الفعالية بنجاح");
      fetchEvents();
    } catch (error: any) {
      if (error.code === "23505") {
        toast.error("لقد سجلت في هذه الفعالية مسبقاً");
      } else {
        toast.error("حدث خطأ أثناء التسجيل");
      }
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("تم إلغاء التسجيل بنجاح");
      fetchEvents();
    } catch (error) {
      toast.error("حدث خطأ أثناء إلغاء التسجيل");
    }
  };

  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-IQ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "ongoing":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "completed":
        return "bg-gray-500/10 text-gray-600 border-gray-200";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming": return "قادمة";
      case "ongoing": return "جارية";
      case "completed": return "مكتملة";
      case "cancelled": return "ملغية";
      default: return status;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, selectedCity, eventType, searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في الفعاليات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="المدينة" />
              </SelectTrigger>
              <SelectContent>
                {iraqCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue placeholder="نوع الفعالية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="offline">حضوري</SelectItem>
                <SelectItem value="online">عبر الإنترنت</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      {events.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد فعاليات متاحة حالياً</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              {event.image_url && (
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img 
                    src={event.image_url} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg leading-tight">{event.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={event.organizer_avatar} />
                        <AvatarFallback className="text-xs">
                          {event.organizer_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {event.organizer_name}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(event.status)}>
                    {getStatusText(event.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatEventDate(event.start_date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.is_online ? "عبر الإنترنت" : event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {event.current_attendees}
                      {event.max_attendees && ` من ${event.max_attendees}`}
                      {" مشارك"}
                    </span>
                  </div>

                  {event.price > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-medium">
                        {event.price} دينار عراقي
                      </span>
                    </div>
                  )}
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {event.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {event.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{event.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="pt-2">
                  {event.user_registered ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleUnregister(event.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      مسجل - إلغاء التسجيل
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => handleRegister(event.id)}
                      disabled={event.max_attendees ? event.current_attendees >= event.max_attendees : false}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {event.max_attendees && event.current_attendees >= event.max_attendees 
                        ? "الفعالية ممتلئة" 
                        : "التسجيل في الفعالية"
                      }
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
