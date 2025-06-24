
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateListingDialog } from "./CreateListingDialog";
import { CreateServiceRequestDialog } from "./CreateServiceRequestDialog";
import { CreateBookingDialog } from "@/components/bookings/CreateBookingDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  Plus, 
  Star, 
  Clock, 
  DollarSign, 
  Calendar,
  User,
  Loader2,
  MessageSquare,
  Heart,
  Share2
} from "lucide-react";

interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  hourly_rate: number;
  delivery_time: number;
  user_id: string;
  category: string;
  type: string;
  status: string;
  listing_type: string;
  tags?: string[];
  created_at: string;
  user?: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

const categories = [
  "برمجة وتطوير",
  "تصميم جرافيك",
  "كتابة وترجمة",
  "تسويق رقمي",
  "تدريس وتعليم",
  "استشارات",
  "أخرى"
];

const types = [
  { value: "all", label: "جميع الأنواع" },
  { value: "service", label: "خدمة" },
  { value: "consultation", label: "استشارة" },
  { value: "course", label: "دورة تدريبية" },
  { value: "project", label: "مشروع" }
];

export function RealMarketplaceListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [listingTypeFilter, setListingTypeFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);

  useEffect(() => {
    fetchListings();
    setupRealTimeUpdates();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("marketplace_listings")
        .select(`
          *,
          user:profiles!marketplace_listings_user_id_fkey(username, full_name, avatar_url)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      setListings(data || []);
    } catch (error: any) {
      console.error("Error fetching listings:", error);
      toast.error("حدث خطأ أثناء تحميل القوائم");
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    const channel = supabase
      .channel("marketplace-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "marketplace_listings"
        },
        () => {
          fetchListings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredListings = listings.filter((listing) => {
    const matchesCategory = categoryFilter === "all" || listing.category === categoryFilter;
    const matchesType = typeFilter === "all" || listing.type === typeFilter;
    const matchesListingType = listingTypeFilter === "all" || listing.listing_type === listingTypeFilter;
    
    const searchText = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      listing.title.toLowerCase().includes(searchText) ||
      listing.description.toLowerCase().includes(searchText) ||
      listing.user?.full_name?.toLowerCase().includes(searchText) ||
      listing.tags?.some(tag => tag.toLowerCase().includes(searchText));

    return matchesCategory && matchesType && matchesListingType && matchesSearch;
  });

  const handleBookingClick = (listing: MarketplaceListing) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }
    
    if (user.id === listing.user_id) {
      toast.error("لا يمكنك حجز خدمتك الخاصة");
      return;
    }

    setSelectedListing(listing);
    setShowBookingDialog(true);
  };

  const handleCreateService = () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }
    setShowCreateDialog(true);
  };

  const handleRequestService = () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }
    setShowRequestDialog(true);
  };

  const handleDialogSuccess = () => {
    fetchListings();
    setShowCreateDialog(false);
    setShowRequestDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Tabs للتبديل بين العروض والطلبات */}
      <Tabs value={listingTypeFilter} onValueChange={setListingTypeFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="offer">العروض</TabsTrigger>
          <TabsTrigger value="request">الطلبات</TabsTrigger>
        </TabsList>

        <TabsContent value={listingTypeFilter} className="space-y-6">
          {/* أدوات البحث والفلترة */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث في الخدمات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التصنيفات</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="نوع الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button onClick={handleCreateService}>
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة خدمة
                  </Button>
                  <Button onClick={handleRequestService} variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    طلب خدمة
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* قائمة الخدمات */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredListings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  {searchQuery || categoryFilter !== "all" || typeFilter !== "all" 
                    ? "لا توجد خدمات مطابقة للمعايير المحددة" 
                    : "لا توجد خدمات متاحة حالياً"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={listing.user?.avatar_url} />
                          <AvatarFallback>
                            {(listing.user?.full_name || listing.user?.username || "؟").charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {listing.user?.full_name || listing.user?.username}
                          </h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            <span>4.8</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge variant="secondary">{listing.category}</Badge>
                        <Badge variant={listing.listing_type === 'request' ? 'destructive' : 'default'} className="text-xs">
                          {listing.listing_type === 'request' ? 'طلب' : 'عرض'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {listing.description}
                      </p>
                    </div>

                    {listing.tags && listing.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {listing.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {listing.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{listing.tags.length - 3} أخرى
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">{listing.hourly_rate.toLocaleString()} د.ع/ساعة</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>التسليم خلال {listing.delivery_time} أيام</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        رسالة
                      </Button>
                      {listing.listing_type === 'offer' && (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleBookingClick(listing)}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          احجز الآن
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(listing.created_at).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {showCreateDialog && (
        <CreateListingDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={handleDialogSuccess}
        />
      )}

      {showRequestDialog && (
        <CreateServiceRequestDialog 
          open={showRequestDialog} 
          onOpenChange={setShowRequestDialog}
          onSuccess={handleDialogSuccess}
        />
      )}

      {selectedListing && showBookingDialog && (
        <CreateBookingDialog
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          listing={selectedListing}
          onSuccess={fetchListings}
        />
      )}
    </div>
  );
}
