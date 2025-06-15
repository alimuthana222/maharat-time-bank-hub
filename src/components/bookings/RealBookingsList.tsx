
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingCard } from "./BookingCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  Calendar,
  Clock,
  User,
  Briefcase,
  RefreshCw,
  Loader2
} from "lucide-react";

interface Booking {
  id: string;
  client_id: string;
  provider_id: string;
  service_id: string;
  booking_date: string;
  duration: number;
  total_hours: number;
  message?: string;
  status: string;
  created_at: string;
  client?: {
    username: string;
    full_name: string;
    avatar_url?: string;
  } | null;
  provider?: {
    username: string;
    full_name: string;
    avatar_url?: string;
  } | null;
  service?: {
    title: string;
    hourly_rate: number;
    category: string;
  } | null;
}

export function RealBookingsList() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("received");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (user) {
      fetchBookings();
      setupRealTimeUpdates();
    }
  }, [user, activeTab]);

  const fetchBookings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from("bookings")
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(username, full_name, avatar_url),
          provider:profiles!bookings_provider_id_fkey(username, full_name, avatar_url),
          service:marketplace_listings!bookings_service_id_fkey(title, hourly_rate, category)
        `)
        .order("created_at", { ascending: false });

      if (activeTab === "received") {
        query = query.eq("provider_id", user.id);
      } else {
        query = query.eq("client_id", user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      // تنظيف البيانات وإصلاح الأنواع
      const cleanedData: Booking[] = (data || []).map((booking: any) => ({
        ...booking,
        client: booking.client && !booking.client.error ? booking.client : null,
        provider: booking.provider && !booking.provider.error ? booking.provider : null,
        service: booking.service && !booking.service.error ? booking.service : null,
      }));

      setBookings(cleanedData);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast.error("حدث خطأ أثناء تحميل الحجوزات");
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    if (!user) return;

    const channel = supabase
      .channel("bookings-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `client_id=eq.${user.id}`
        },
        () => {
          fetchBookings();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `provider_id=eq.${user.id}`
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    const searchText = searchQuery.toLowerCase();
    const otherUser = activeTab === "received" ? booking.client : booking.provider;
    const matchesSearch = searchQuery === "" || 
      booking.service?.title?.toLowerCase().includes(searchText) ||
      otherUser?.full_name?.toLowerCase().includes(searchText) ||
      otherUser?.username?.toLowerCase().includes(searchText);

    return matchesStatus && matchesSearch;
  });

  const getStatsForTab = () => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;

    return { total, pending, confirmed, completed };
  };

  const stats = getStatsForTab();

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">يجب تسجيل الدخول لعرض الحجوزات</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* الإحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-muted-foreground">إجمالي الحجوزات</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">قيد الانتظار</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-muted-foreground">مؤكدة</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">مكتملة</div>
          </CardContent>
        </Card>
      </div>

      {/* التبويبات والفلاتر */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              إدارة الحجوزات
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchBookings}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="received" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                الحجوزات المستلمة
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                الحجوزات المرسلة
              </TabsTrigger>
            </TabsList>

            {/* أدوات البحث والفلترة */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الحجوزات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="حالة الحجز" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="confirmed">مؤكدة</SelectItem>
                  <SelectItem value="completed">مكتملة</SelectItem>
                  <SelectItem value="cancelled">ملغية</SelectItem>
                  <SelectItem value="rejected">مرفوضة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="received" className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      {searchQuery || statusFilter !== "all" 
                        ? "لا توجد حجوزات مطابقة للمعايير المحددة" 
                        : "لم تتلق أي حجوزات بعد"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      viewType="provider"
                      onStatusChange={fetchBookings}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sent" className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      {searchQuery || statusFilter !== "all" 
                        ? "لا توجد حجوزات مطابقة للمعايير المحددة" 
                        : "لم ترسل أي حجوزات بعد"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      viewType="client"
                      onStatusChange={fetchBookings}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
