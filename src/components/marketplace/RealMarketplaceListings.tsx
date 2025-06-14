
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateListingDialog } from "./CreateListingDialog";
import { CreateServiceRequestDialog } from "./CreateServiceRequestDialog";
import { ServiceBookingDialog } from "./ServiceBookingDialog";
import { Search, Star, Clock, User, Coins, Timer, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  hourly_rate: number;
  delivery_time: number;
  user_id: string;
  created_at: string;
  type: string;
  listing_type?: string;
  provider?: {
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export function RealMarketplaceListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const categories = [
    { value: "all", label: "جميع التصنيفات" },
    { value: "برمجة", label: "برمجة" },
    { value: "تصميم", label: "تصميم" },
    { value: "كتابة", label: "كتابة" },
    { value: "تدريس", label: "تدريس" },
    { value: "ترجمة", label: "ترجمة" },
    { value: "تسويق", label: "تسويق" },
    { value: "استشارات", label: "استشارات" },
    { value: "أخرى", label: "أخرى" }
  ];

  const serviceTypes = [
    { value: "all", label: "جميع الأنواع" },
    { value: "service", label: "خدمة مدفوعة" },
    { value: "skill_exchange", label: "تبادل مهارات" }
  ];

  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchQuery, selectedType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("marketplace_listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      if (selectedType !== "all") {
        query = query.eq("type", selectedType);
      }

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data: listingsData, error } = await query;

      if (error) throw error;

      if (listingsData && listingsData.length > 0) {
        const userIds = [...new Set(listingsData.map(listing => listing.user_id))];

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .in("id", userIds);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        }

        const profilesMap = new Map();
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap.set(profile.id, profile);
          });
        }

        const listingsWithProviders = listingsData.map(listing => ({
          ...listing,
          provider: profilesMap.get(listing.user_id) || null,
        }));

        // فصل الخدمات المقدمة عن طلبات الخدمات
        const serviceOffers = listingsWithProviders.filter(item => !item.listing_type || item.listing_type === "offer");
        const serviceRequests = listingsWithProviders.filter(item => item.listing_type === "request");

        setListings(serviceOffers);
        setRequests(serviceRequests);
      } else {
        setListings([]);
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("خطأ في تحميل البيانات");
      setListings([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContactRequester = async (request: Listing) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    // إنشاء محادثة مع طالب الخدمة
    try {
      const { error } = await supabase
        .from("conversations")
        .insert({
          participant1_id: user.id,
          participant2_id: request.user_id
        });

      if (error && !error.message.includes('duplicate')) {
        throw error;
      }

      toast.success("تم إنشاء المحادثة بنجاح! يمكنك الآن التواصل مع طالب الخدمة");
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("خطأ في إنشاء المحادثة");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">جاري التحميل...</div>;
  }

  const getPriceDisplay = (listing: Listing) => {
    if (listing.type === 'skill_exchange') {
      return {
        icon: Timer,
        text: `${listing.hourly_rate} ساعة/ساعة`,
        color: "text-blue-600"
      };
    } else {
      return {
        icon: Coins,
        text: `${listing.hourly_rate.toLocaleString()} د.ع/ساعة`,
        color: "text-green-600"
      };
    }
  };

  const getServiceTypeBadge = (type: string) => {
    if (type === 'skill_exchange') {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">تبادل مهارات</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">خدمة مدفوعة</Badge>;
    }
  };

  const renderListingCard = (listing: Listing, isRequest: boolean = false) => {
    const priceInfo = getPriceDisplay(listing);
    const PriceIcon = priceInfo.icon;
    
    return (
      <Card key={listing.id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{listing.category}</Badge>
                {getServiceTypeBadge(listing.type)}
                {isRequest && <Badge variant="outline" className="bg-orange-100 text-orange-800">طلب خدمة</Badge>}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-600 text-sm line-clamp-3">{listing.description}</p>

          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={listing.provider?.avatar_url} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {listing.provider?.full_name || listing.provider?.username || "مستخدم"}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Star className="h-3 w-3 fill-current text-yellow-400" />
                <span>4.8 (15 تقييم)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{isRequest ? `مطلوب خلال ${listing.delivery_time} أيام` : `التسليم خلال ${listing.delivery_time} أيام`}</span>
            </div>
            <div className="text-right">
              <div className={`flex items-center gap-1 text-lg font-bold ${priceInfo.color}`}>
                <PriceIcon className="h-4 w-4" />
                <span>{isRequest ? `ميزانية: ${priceInfo.text}` : priceInfo.text}</span>
              </div>
            </div>
          </div>

          {user && user.id !== listing.user_id && (
            isRequest ? (
              <Button onClick={() => handleContactRequester(listing)} className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                تقديم عرض
              </Button>
            ) : (
              <ServiceBookingDialog listing={listing} />
            )
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* شريط البحث والفلاتر */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث في السوق..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="التصنيف" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="نوع الخدمة" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {user && (
          <div className="flex gap-2">
            <CreateListingDialog />
            <CreateServiceRequestDialog />
          </div>
        )}
      </div>

      {/* علامات التبويب للخدمات والطلبات */}
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services">الخدمات المتاحة ({listings.length})</TabsTrigger>
          <TabsTrigger value="requests">طلبات الخدمات ({requests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                لا توجد خدمات متاحة
              </div>
            ) : (
              listings.map((listing) => renderListingCard(listing, false))
            )}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                لا توجد طلبات خدمات
              </div>
            ) : (
              requests.map((request) => renderListingCard(request, true))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
