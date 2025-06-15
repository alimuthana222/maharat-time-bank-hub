import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  User,
  Briefcase,
  Calendar,
  MessageSquare,
  Loader2
} from "lucide-react";

interface SearchResult {
  id: string;
  type: 'user' | 'service' | 'post' | 'event';
  title: string;
  description: string;
  author?: {
    name: string;
    avatar?: string;
  };
  metadata?: {
    rating?: number;
    price?: number;
    location?: string;
    date?: string;
    category?: string;
  };
}

export function RealSearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    if (query.trim().length >= 2) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query, searchType, sortBy]);

  const performSearch = async () => {
    setLoading(true);
    try {
      let results: SearchResult[] = [];

      // البحث في المستخدمين
      if (searchType === "all" || searchType === "users") {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .or(`full_name.ilike.%${query}%,username.ilike.%${query}%,bio.ilike.%${query}%`)
          .limit(10);

        if (profiles) {
          const userResults = profiles.map(profile => ({
            id: profile.id,
            type: 'user' as const,
            title: profile.full_name || profile.username,
            description: profile.bio || "لا يوجد وصف",
            author: {
              name: profile.full_name || profile.username,
              avatar: profile.avatar_url
            },
            metadata: {
              location: profile.location
            }
          }));
          results.push(...userResults);
        }
      }

      // البحث في الخدمات
      if (searchType === "all" || searchType === "services") {
        const { data: listings } = await supabase
          .from("marketplace_listings")
          .select(`
            *,
            user:profiles!marketplace_listings_user_id_fkey(username, full_name, avatar_url)
          `)
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .eq("status", "active")
          .limit(10);

        if (listings) {
          const serviceResults = listings.map(listing => ({
            id: listing.id,
            type: 'service' as const,
            title: listing.title,
            description: listing.description,
            author: {
              name: listing.user?.full_name || listing.user?.username || "مستخدم",
              avatar: listing.user?.avatar_url
            },
            metadata: {
              price: listing.hourly_rate,
              category: listing.category
            }
          }));
          results.push(...serviceResults);
        }
      }

      // البحث في المنشورات
      if (searchType === "all" || searchType === "posts") {
        const { data: posts } = await supabase
          .from("community_posts")
          .select("*")
          .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
          .eq("is_hidden", false)
          .limit(10);

        if (posts) {
          // جلب معلومات المؤلفين بشكل منفصل
          const authorIds = posts.map(post => post.author_id);
          const { data: authors } = await supabase
            .from("profiles")
            .select("id, username, full_name, avatar_url")
            .in("id", authorIds);

          const authorsMap = authors?.reduce((acc, author) => {
            acc[author.id] = author;
            return acc;
          }, {} as Record<string, any>) || {};

          const postResults = posts.map(post => ({
            id: post.id,
            type: 'post' as const,
            title: post.title,
            description: post.content.substring(0, 150) + "...",
            author: {
              name: authorsMap[post.author_id]?.full_name || authorsMap[post.author_id]?.username || "مستخدم",
              avatar: authorsMap[post.author_id]?.avatar_url
            },
            metadata: {
              category: post.category
            }
          }));
          results.push(...postResults);
        }
      }

      // البحث في الأحداث
      if (searchType === "all" || searchType === "events") {
        const { data: events } = await supabase
          .from("events")
          .select("*")
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .eq("status", "upcoming")
          .limit(10);

        if (events) {
          // جلب معلومات المنظمين بشكل منفصل
          const organizerIds = events.map(event => event.organizer_id);
          const { data: organizers } = await supabase
            .from("profiles")
            .select("id, username, full_name, avatar_url")
            .in("id", organizerIds);

          const organizersMap = organizers?.reduce((acc, organizer) => {
            acc[organizer.id] = organizer;
            return acc;
          }, {} as Record<string, any>) || {};

          const eventResults = events.map(event => ({
            id: event.id,
            type: 'event' as const,
            title: event.title,
            description: event.description,
            author: {
              name: organizersMap[event.organizer_id]?.full_name || organizersMap[event.organizer_id]?.username || "منظم",
              avatar: organizersMap[event.organizer_id]?.avatar_url
            },
            metadata: {
              date: event.start_date,
              location: event.location,
              price: event.price
            }
          }));
          results.push(...eventResults);
        }
      }

      // ترتيب النتائج
      if (sortBy === "date") {
        results.sort((a, b) => new Date(b.metadata?.date || 0).getTime() - new Date(a.metadata?.date || 0).getTime());
      } else if (sortBy === "price") {
        results.sort((a, b) => (a.metadata?.price || 0) - (b.metadata?.price || 0));
      }

      setResults(results);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("حدث خطأ أثناء البحث");
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="h-4 w-4" />;
      case 'service': return <Briefcase className="h-4 w-4" />;
      case 'post': return <MessageSquare className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'user': return "مستخدم";
      case 'service': return "خدمة";
      case 'post': return "منشور";
      case 'event': return "حدث";
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user': return "bg-blue-500";
      case 'service': return "bg-green-500";
      case 'post': return "bg-purple-500";
      case 'event': return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* شريط البحث */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="ابحث عن المستخدمين والخدمات والمنشورات..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 text-lg h-12"
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="نوع البحث" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع النتائج</SelectItem>
                  <SelectItem value="users">المستخدمين</SelectItem>
                  <SelectItem value="services">الخدمات</SelectItem>
                  <SelectItem value="posts">المنشورات</SelectItem>
                  <SelectItem value="events">الأحداث</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">الصلة</SelectItem>
                  <SelectItem value="date">التاريخ</SelectItem>
                  <SelectItem value="price">السعر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* نتائج البحث */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : results.length === 0 && query.trim().length >= 2 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
            <p className="text-muted-foreground">
              لم يتم العثور على نتائج مطابقة لبحثك. جرب استخدام كلمات مختلفة.
            </p>
          </CardContent>
        </Card>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                نتائج البحث ({results.length})
              </CardTitle>
            </CardHeader>
          </Card>

          {results.map((result) => (
            <Card key={`${result.type}-${result.id}`} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={result.author?.avatar} />
                    <AvatarFallback>
                      {result.author?.name?.charAt(0) || "؟"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{result.title}</h3>
                      <Badge className={`${getTypeColor(result.type)} text-white`}>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(result.type)}
                          {getTypeLabel(result.type)}
                        </div>
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {result.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {result.author?.name}
                      </span>
                      
                      {result.metadata?.price && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {result.metadata.price} USD
                        </span>
                      )}
                      
                      {result.metadata?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {result.metadata.location}
                        </span>
                      )}
                      
                      {result.metadata?.category && (
                        <Badge variant="outline" className="text-xs">
                          {result.metadata.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
