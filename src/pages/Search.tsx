
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, User, BookOpen, Clock, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'skill' | 'listing' | 'post' | 'user';
  category?: string;
  user?: {
    username: string;
    avatar_url?: string;
  };
  created_at: string;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = [
    'برمجة', 'تصميم', 'كتابة', 'ترجمة', 'تسويق', 'تعليم', 'استشارات', 'أخرى'
  ];

  const performSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const searchTerm = `%${query}%`;
      const results: SearchResult[] = [];

      // Search skills
      const { data: skills } = await supabase
        .from('skills')
        .select(`
          id, title, description, category, created_at,
          profiles:provider_id (username, avatar_url)
        `)
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(20);

      if (skills) {
        results.push(...skills.map(skill => ({
          id: skill.id,
          title: skill.title,
          description: skill.description,
          type: 'skill' as const,
          category: skill.category,
          user: skill.profiles ? {
            username: skill.profiles.username,
            avatar_url: skill.profiles.avatar_url
          } : undefined,
          created_at: skill.created_at
        })));
      }

      // Search marketplace listings
      const { data: listings } = await supabase
        .from('marketplace_listings')
        .select(`
          id, title, description, category, created_at,
          profiles:user_id (username, avatar_url)
        `)
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .eq('status', 'active')
        .limit(20);

      if (listings) {
        results.push(...listings.map(listing => ({
          id: listing.id,
          title: listing.title,
          description: listing.description,
          type: 'listing' as const,
          category: listing.category,
          user: listing.profiles ? {
            username: listing.profiles.username,
            avatar_url: listing.profiles.avatar_url
          } : undefined,
          created_at: listing.created_at
        })));
      }

      // Search posts
      const { data: posts } = await supabase
        .from('posts')
        .select(`
          id, title, content, category, created_at,
          profiles:user_id (username, avatar_url)
        `)
        .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .eq('is_hidden', false)
        .limit(20);

      if (posts) {
        results.push(...posts.map(post => ({
          id: post.id,
          title: post.title,
          description: post.content.substring(0, 200) + '...',
          type: 'post' as const,
          category: post.category,
          user: post.profiles ? {
            username: post.profiles.username,
            avatar_url: post.profiles.avatar_url
          } : undefined,
          created_at: post.created_at
        })));
      }

      // Search users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, username, full_name, bio, avatar_url, created_at')
        .or(`username.ilike.${searchTerm},full_name.ilike.${searchTerm},bio.ilike.${searchTerm}`)
        .limit(20);

      if (users) {
        results.push(...users.map(user => ({
          id: user.id,
          title: user.full_name || user.username,
          description: user.bio || 'لا يوجد وصف',
          type: 'user' as const,
          user: {
            username: user.username,
            avatar_url: user.avatar_url
          },
          created_at: user.created_at
        })));
      }

      setResults(results);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('حدث خطأ أثناء البحث');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
    performSearch();
  };

  const filteredResults = results.filter(result => {
    if (activeTab !== 'all' && result.type !== activeTab) return false;
    if (categoryFilter !== 'all' && result.category !== categoryFilter) return false;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'skill': return <BookOpen className="h-4 w-4" />;
      case 'listing': return <MessageSquare className="h-4 w-4" />;
      case 'post': return <MessageSquare className="h-4 w-4" />;
      case 'user': return <User className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'skill': return 'مهارة';
      case 'listing': return 'إعلان';
      case 'post': return 'منشور';
      case 'user': return 'مستخدم';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              البحث في المنصة
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              ابحث عن المهارات والخدمات والمحتوى والأشخاص
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="ابحث عن مهارات، خدمات، منشورات، أو أشخاص..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                disabled={loading}
              >
                {loading ? 'جاري البحث...' : 'بحث'}
              </Button>
            </div>
          </form>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-64">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    تصفية النتائج
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">ترتيب حسب</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">الصلة</SelectItem>
                        <SelectItem value="date">التاريخ</SelectItem>
                        <SelectItem value="popularity">الشعبية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">التصنيف</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع التصنيفات</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">الكل ({results.length})</TabsTrigger>
                  <TabsTrigger value="skill">
                    المهارات ({results.filter(r => r.type === 'skill').length})
                  </TabsTrigger>
                  <TabsTrigger value="listing">
                    الإعلانات ({results.filter(r => r.type === 'listing').length})
                  </TabsTrigger>
                  <TabsTrigger value="post">
                    المنشورات ({results.filter(r => r.type === 'post').length})
                  </TabsTrigger>
                  <TabsTrigger value="user">
                    المستخدمون ({results.filter(r => r.type === 'user').length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">جاري البحث...</p>
                    </div>
                  ) : filteredResults.length > 0 ? (
                    <div className="space-y-4">
                      {filteredResults.map((result) => (
                        <Card key={`${result.type}-${result.id}`} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                {getTypeIcon(result.type)}
                                <Badge variant="secondary">
                                  {getTypeLabel(result.type)}
                                </Badge>
                                {result.category && (
                                  <Badge variant="outline">{result.category}</Badge>
                                )}
                              </div>
                              {result.user && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <User className="h-4 w-4" />
                                  {result.user.username}
                                </div>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {result.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                              {result.description}
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                              <span>
                                {new Date(result.created_at).toLocaleDateString('ar-SA')}
                              </span>
                              <Button variant="outline" size="sm">
                                عرض التفاصيل
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : query ? (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        لا توجد نتائج
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        لم نتمكن من العثور على نتائج لـ "{query}"
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        ابدأ البحث
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        أدخل كلمات البحث للعثور على ما تريد
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
