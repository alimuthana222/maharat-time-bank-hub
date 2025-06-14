
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, User, Star, Clock, Coins, Timer } from "lucide-react";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  hourly_rate?: number;
  delivery_time?: number;
  provider?: {
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
}

interface UserResult {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  skills?: string[];
  avatar_url?: string;
  university?: string;
}

export function RealSearchComponent() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceResults, setServiceResults] = useState<SearchResult[]>([]);
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("services");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("يرجى إدخال كلمة البحث");
      return;
    }

    setLoading(true);
    try {
      // البحث في الخدمات
      const { data: servicesData, error: servicesError } = await supabase
        .from("marketplace_listings")
        .select("*")
        .eq("status", "active")
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);

      if (servicesError) throw servicesError;

      // البحث في المستخدمين
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("*")
        .or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%,university.ilike.%${searchQuery}%`);

      if (usersError) throw usersError;

      // إضافة بيانات المزودين للخدمات
      if (servicesData && servicesData.length > 0) {
        const userIds = [...new Set(servicesData.map(service => service.user_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .in("id", userIds);

        const profilesMap = new Map();
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap.set(profile.id, profile);
          });
        }

        const servicesWithProviders = servicesData.map(service => ({
          ...service,
          provider: profilesMap.get(service.user_id) || null,
        }));

        setServiceResults(servicesWithProviders);
      } else {
        setServiceResults([]);
      }

      setUserResults(usersData || []);

    } catch (error) {
      console.error("Error searching:", error);
      toast.error("خطأ في البحث");
    } finally {
      setLoading(false);
    }
  };

  const getPriceDisplay = (service: SearchResult) => {
    if (service.type === 'skill_exchange') {
      return {
        icon: Timer,
        text: `${service.hourly_rate} ساعة/ساعة`,
        color: "text-blue-600"
      };
    } else {
      return {
        icon: Coins,
        text: `${service.hourly_rate?.toLocaleString()} د.ع/ساعة`,
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

  return (
    <div className="space-y-6">
      {/* شريط البحث */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ابحث عن الخدمات أو المستخدمين..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "جاري البحث..." : "بحث"}
        </Button>
      </div>

      {/* نتائج البحث */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="services">الخدمات ({serviceResults.length})</TabsTrigger>
          <TabsTrigger value="users">المستخدمين ({userResults.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceResults.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                لا توجد خدمات
              </div>
            ) : (
              serviceResults.map((service) => {
                const priceInfo = getPriceDisplay(service);
                const PriceIcon = priceInfo.icon;
                
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">{service.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{service.category}</Badge>
                            {getServiceTypeBadge(service.type)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-gray-600 text-sm line-clamp-3">{service.description}</p>

                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={service.provider?.avatar_url} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {service.provider?.full_name || service.provider?.username || "مقدم خدمة"}
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
                          <span>التسليم خلال {service.delivery_time} أيام</span>
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center gap-1 text-lg font-bold ${priceInfo.color}`}>
                            <PriceIcon className="h-4 w-4" />
                            <span>{priceInfo.text}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userResults.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                لا توجد مستخدمين
              </div>
            ) : (
              userResults.map((userResult) => (
                <Card key={userResult.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={userResult.avatar_url} />
                        <AvatarFallback>
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {userResult.full_name || userResult.username}
                        </h3>
                        <p className="text-sm text-gray-600">@{userResult.username}</p>
                        {userResult.university && (
                          <p className="text-sm text-blue-600">{userResult.university}</p>
                        )}
                      </div>
                    </div>

                    {userResult.bio && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{userResult.bio}</p>
                    )}

                    {userResult.skills && userResult.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {userResult.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {userResult.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{userResult.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
