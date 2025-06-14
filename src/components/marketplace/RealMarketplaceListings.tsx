
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateListingDialog } from "./CreateListingDialog";
import { ServiceBookingDialog } from "./ServiceBookingDialog";
import { Search, Star, Clock, User } from "lucide-react";
import { toast } from "sonner";

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  hourly_rate: number;
  delivery_time: number;
  user_id: string;
  created_at: string;
  provider?: {
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export function RealMarketplaceListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, searchQuery]);

  const fetchListings = async () => {
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

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data: listingsData, error } = await query;

      if (error) throw error;

      if (listingsData && listingsData.length > 0) {
        // Fetch provider profiles
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

        setListings(listingsWithProviders);
      } else {
        setListings([]);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("خطأ في تحميل الخدمات");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* شريط البحث والفلاتر */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث عن الخدمات..."
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
        </div>

        {user && <CreateListingDialog />}
      </div>

      {/* قائمة الخدمات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            لا توجد خدمات متاحة
          </div>
        ) : (
          listings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                    <Badge variant="secondary" className="mt-2">{listing.category}</Badge>
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
                      {listing.provider?.full_name || listing.provider?.username || "مقدم خدمة"}
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
                    <span>التسليم خلال {listing.delivery_time} أيام</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {listing.hourly_rate.toLocaleString()} د.ع
                    </p>
                    <p className="text-xs text-gray-500">لكل ساعة</p>
                  </div>
                </div>

                {user && user.id !== listing.user_id && (
                  <ServiceBookingDialog listing={listing} />
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
