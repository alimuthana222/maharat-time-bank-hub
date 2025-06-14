
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, MessageCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { BookingForm } from "@/components/bookings/BookingForm";
import { ReviewsList } from "@/components/reviews/ReviewsList";

interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  hourly_rate: number;
  category: string;
  user_id: string;
  created_at: string;
  image_url?: string;
  tags?: string[];
  provider?: {
    username: string;
    avatar_url?: string;
    full_name?: string;
  };
}

export function RealMarketplaceListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // بيانات النموذج
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hourly_rate: "",
    category: "",
    requirements: "",
    delivery_time: "1"
  });

  const categories = [
    "برمجة وتطوير",
    "التصميم", 
    "التدريس والتعليم",
    "الترجمة",
    "الكتابة والمحتوى",
    "التسويق الرقمي",
    "الاستشارات",
    "أخرى"
  ];

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const listingsWithProviders = await Promise.all(
        (data || []).map(async (listing) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, avatar_url, full_name")
            .eq("id", listing.user_id)
            .single();

          return {
            ...listing,
            provider: profile
          };
        })
      );

      setListings(listingsWithProviders);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const createListing = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!formData.title || !formData.description || !formData.hourly_rate || !formData.category) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      const { error } = await supabase
        .from("marketplace_listings")
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          hourly_rate: parseInt(formData.hourly_rate),
          category: formData.category,
          requirements: formData.requirements || null,
          delivery_time: parseInt(formData.delivery_time),
          type: "service",
          status: "active"
        });

      if (error) throw error;

      toast.success("تم إنشاء الخدمة بنجاح");
      setShowCreateForm(false);
      setFormData({
        title: "",
        description: "",
        hourly_rate: "",
        category: "",
        requirements: "",
        delivery_time: "1"
      });
      await fetchListings();
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast.error("حدث خطأ أثناء إنشاء الخدمة");
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesCategory = selectedCategory === "all" || listing.category === selectedCategory;
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {/* شريط البحث والفلاتر */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="ابحث عن الخدمات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="اختر التصنيف" />
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

        {user && (
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="ml-2 h-4 w-4" />
                إضافة خدمة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إضافة خدمة جديدة</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={createListing} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">عنوان الخدمة *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="مثال: تطوير موقع ويب متجاوب"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الوصف *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="اكتب وصفاً مفصلاً عن خدمتك..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">السعر بالساعة *</label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.hourly_rate}
                      onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                      placeholder="25"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">التصنيف *</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">المتطلبات (اختياري)</label>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                    placeholder="ما هي المتطلبات أو المعلومات التي تحتاجها من العميل؟"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">مدة التسليم (بالأيام)</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.delivery_time}
                    onChange={(e) => setFormData({...formData, delivery_time: e.target.value})}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit">إنشاء الخدمة</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    إلغاء
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* قائمة الخدمات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            لا توجد خدمات متاحة
          </div>
        ) : (
          filteredListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{listing.title}</CardTitle>
                    <p className="text-sm text-gray-600">
                      بواسطة {listing.provider?.full_name || listing.provider?.username}
                    </p>
                  </div>
                  <Badge variant="secondary">{listing.category}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-sm line-clamp-3">
                  {listing.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-green-600">
                    {listing.hourly_rate} ساعة/الساعة
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm">5.0</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {user && user.id !== listing.user_id && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1">احجز الآن</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>حجز خدمة: {listing.title}</DialogTitle>
                        </DialogHeader>
                        <BookingForm
                          providerId={listing.user_id}
                          serviceId={listing.id}
                          hourlyRate={listing.hourly_rate}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>التقييمات والمراجعات</DialogTitle>
                      </DialogHeader>
                      <ReviewsList userId={listing.user_id} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
