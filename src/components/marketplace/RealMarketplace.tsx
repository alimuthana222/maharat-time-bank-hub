
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Star, Clock, User, MapPin } from "lucide-react";
import { BookingForm } from "@/components/bookings/BookingForm";
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  hourly_rate: number;
  category: string;
  type: string;
  image_url: string | null;
  tags: string[] | null;
  delivery_time: number;
  user_id: string;
  created_at: string;
  provider: {
    full_name: string | null;
    username: string;
    avatar_url: string | null;
    university: string | null;
  };
}

export function RealMarketplace() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    fetchListings();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true);
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchListings = async () => {
    try {
      const { data: listingsData, error } = await supabase
        .from("marketplace_listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (listingsData) {
        // جلب معلومات مقدمي الخدمات
        const listingsWithProviders = await Promise.all(
          listingsData.map(async (listing) => {
            const { data: provider } = await supabase
              .from("profiles")
              .select("full_name, username, avatar_url, university")
              .eq("id", listing.user_id)
              .single();

            return {
              ...listing,
              provider: provider || {
                full_name: null,
                username: "مستخدم غير معروف",
                avatar_url: null,
                university: null,
              },
            };
          })
        );

        setListings(listingsWithProviders);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.provider.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.provider.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || listing.category === selectedCategory;
    const matchesType = selectedType === "all" || listing.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  if (loading) {
    return <div className="text-center py-8">جاري تحميل الخدمات...</div>;
  }

  return (
    <div className="space-y-6">
      {/* فلاتر البحث */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن خدمة أو مقدم خدمة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="التصنيف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع التصنيفات</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name_ar}>
                  {category.name_ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="نوع الخدمة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              <SelectItem value="service">خدمة</SelectItem>
              <SelectItem value="skill_exchange">تبادل مهارات</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* عرض النتائج */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            لا توجد خدمات مطابقة لمعايير البحث
          </div>
        ) : (
          filteredListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={listing.provider.avatar_url || undefined} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg leading-tight">{listing.title}</h3>
                    <p className="text-sm text-gray-600">
                      {listing.provider.full_name || listing.provider.username}
                    </p>
                    {listing.provider.university && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        {listing.provider.university}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-gray-700 text-sm line-clamp-3">{listing.description}</p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{listing.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {listing.delivery_time} أيام
                  </div>
                </div>

                {listing.tags && listing.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {listing.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {listing.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{listing.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-blue-600">
                      {listing.hourly_rate} ساعة/ساعة
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">عرض التفاصيل</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{listing.title}</DialogTitle>
                        </DialogHeader>
                        
                        <Tabs defaultValue="details" className="w-full">
                          <TabsList>
                            <TabsTrigger value="details">تفاصيل الخدمة</TabsTrigger>
                            <TabsTrigger value="reviews">التقييمات</TabsTrigger>
                            <TabsTrigger value="booking">الحجز</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="details" className="space-y-4">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={listing.provider.avatar_url || undefined} />
                                <AvatarFallback>
                                  <User className="h-8 w-8" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {listing.provider.full_name || listing.provider.username}
                                </h3>
                                {listing.provider.university && (
                                  <p className="text-gray-600">{listing.provider.university}</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <p className="text-gray-700">{listing.description}</p>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <strong>التصنيف:</strong> {listing.category}
                                </div>
                                <div>
                                  <strong>نوع الخدمة:</strong> {listing.type === 'service' ? 'خدمة' : 'تبادل مهارات'}
                                </div>
                                <div>
                                  <strong>وقت التسليم:</strong> {listing.delivery_time} أيام
                                </div>
                                <div>
                                  <strong>السعر:</strong> {listing.hourly_rate} ساعة/ساعة
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="reviews">
                            <ReviewsList userId={listing.user_id} />
                          </TabsContent>
                          
                          <TabsContent value="booking">
                            <BookingForm
                              providerId={listing.user_id}
                              serviceId={listing.id}
                              hourlyRate={listing.hourly_rate}
                            />
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
