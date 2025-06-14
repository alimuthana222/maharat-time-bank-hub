
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Star, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FeaturedService {
  id: string;
  title: string;
  description: string;
  category: string;
  hourly_rate: number;
  delivery_time: number;
  provider?: {
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export function MarketplacePreview() {
  const [featuredServices, setFeaturedServices] = useState<FeaturedService[]>([]);

  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  const fetchFeaturedServices = async () => {
    try {
      const { data: servicesData, error } = await supabase
        .from("marketplace_listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;

      if (servicesData && servicesData.length > 0) {
        const userIds = [...new Set(servicesData.map(service => service.user_id))];

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

        const servicesWithProviders = servicesData.map(service => ({
          ...service,
          provider: profilesMap.get(service.user_id) || null,
        }));

        setFeaturedServices(servicesWithProviders);
      }
    } catch (error) {
      console.error("Error fetching featured services:", error);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">سوق المهارات</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشف مهارات متنوعة من أفضل الطلاب واحجز الخدمات التي تحتاجها
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{service.title}</CardTitle>
                  <Badge variant="secondary">{service.category}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-2">{service.description}</p>

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
                      <span>4.8</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{service.delivery_time} أيام</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {service.hourly_rate.toLocaleString()} د.ع
                    </p>
                    <p className="text-xs text-gray-500">لكل ساعة</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link to="/marketplace">
              تصفح جميع الخدمات
              <ArrowLeft className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
