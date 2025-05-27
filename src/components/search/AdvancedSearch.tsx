
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Users, 
  BookOpen, 
  MessageSquare,
  Calendar,
  Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SearchResults {
  users: any[];
  skills: any[];
  posts: any[];
  events: any[];
}

export function AdvancedSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [results, setResults] = useState<SearchResults>({
    users: [],
    skills: [],
    posts: [],
    events: []
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (query.length >= 2) {
      const debounceTimeout = setTimeout(() => {
        performSearch();
      }, 300);
      return () => clearTimeout(debounceTimeout);
    } else {
      setResults({ users: [], skills: [], posts: [], events: [] });
    }
  }, [query, category, sortBy]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const searchTerm = `%${query}%`;
      
      // Search users
      const { data: users } = await supabase
        .from("profiles")
        .select("*")
        .or(`username.ilike.${searchTerm},full_name.ilike.${searchTerm},university.ilike.${searchTerm}`)
        .limit(10);

      // Search skills
      const { data: skills } = await supabase
        .from("skills")
        .select(`
          *,
          provider:profiles!skills_provider_id_fkey(username, full_name, avatar_url)
        `)
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},category.ilike.${searchTerm}`)
        .limit(10);

      // Search posts
      const { data: posts } = await supabase
        .from("posts")
        .select(`
          *,
          author:profiles!posts_user_id_fkey(username, full_name, avatar_url)
        `)
        .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .eq("is_hidden", false)
        .limit(10);

      setResults({
        users: users || [],
        skills: skills || [],
        posts: posts || [],
        events: [] // Add events when implemented
      });
    } catch (error: any) {
      toast.error(`خطأ في البحث: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getTotalResults = () => {
    return results.users.length + results.skills.length + results.posts.length + results.events.length;
  };

  const UserResult = ({ user }: { user: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback>
              {user.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium">{user.full_name || user.username}</h3>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            {user.university && (
              <Badge variant="outline" className="mt-1">
                {user.university}
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm">
            عرض الملف
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const SkillResult = ({ skill }: { skill: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{skill.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {skill.description}
              </p>
            </div>
            <Badge variant="secondary">{skill.category}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={skill.provider?.avatar_url} />
                <AvatarFallback>
                  {skill.provider?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{skill.provider?.full_name || skill.provider?.username}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{skill.hourly_rate} ساعة</span>
              <Button variant="outline" size="sm">
                طلب الخدمة
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PostResult = ({ post }: { post: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="font-medium">{post.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.content}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.author?.avatar_url} />
                <AvatarFallback>
                  {post.author?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{post.author?.full_name || post.author?.username}</span>
            </div>
            <div className="flex items-center gap-2">
              {post.category && <Badge variant="outline">{post.category}</Badge>}
              <Button variant="outline" size="sm">
                قراءة المزيد
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">البحث المتقدم</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن المستخدمين، المهارات، المنشورات..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="التصنيف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع التصنيفات</SelectItem>
              <SelectItem value="programming">برمجة</SelectItem>
              <SelectItem value="design">تصميم</SelectItem>
              <SelectItem value="teaching">تدريس</SelectItem>
              <SelectItem value="writing">كتابة</SelectItem>
              <SelectItem value="translation">ترجمة</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">الصلة</SelectItem>
              <SelectItem value="date">التاريخ</SelectItem>
              <SelectItem value="rating">التقييم</SelectItem>
              <SelectItem value="price">السعر</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {query.length >= 2 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {loading ? "جاري البحث..." : `تم العثور على ${getTotalResults()} نتيجة`}
            </span>
          </div>
        )}
      </div>

      {query.length >= 2 && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              الكل ({getTotalResults()})
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-1" />
              المستخدمون ({results.users.length})
            </TabsTrigger>
            <TabsTrigger value="skills">
              <BookOpen className="h-4 w-4 mr-1" />
              المهارات ({results.skills.length})
            </TabsTrigger>
            <TabsTrigger value="posts">
              <MessageSquare className="h-4 w-4 mr-1" />
              المنشورات ({results.posts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {results.users.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">المستخدمون</h3>
                <div className="space-y-2">
                  {results.users.slice(0, 3).map((user) => (
                    <UserResult key={user.id} user={user} />
                  ))}
                </div>
              </div>
            )}
            
            {results.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">المهارات</h3>
                <div className="space-y-2">
                  {results.skills.slice(0, 3).map((skill) => (
                    <SkillResult key={skill.id} skill={skill} />
                  ))}
                </div>
              </div>
            )}
            
            {results.posts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">المنشورات</h3>
                <div className="space-y-2">
                  {results.posts.slice(0, 3).map((post) => (
                    <PostResult key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-2">
            {results.users.map((user) => (
              <UserResult key={user.id} user={user} />
            ))}
          </TabsContent>

          <TabsContent value="skills" className="space-y-2">
            {results.skills.map((skill) => (
              <SkillResult key={skill.id} skill={skill} />
            ))}
          </TabsContent>

          <TabsContent value="posts" className="space-y-2">
            {results.posts.map((post) => (
              <PostResult key={post.id} post={post} />
            ))}
          </TabsContent>
        </Tabs>
      )}

      {query.length < 2 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">ابدأ البحث</h3>
          <p className="text-muted-foreground">
            اكتب على الأقل حرفين للبدء في البحث
          </p>
        </div>
      )}

      {query.length >= 2 && getTotalResults() === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">لا توجد نتائج</h3>
          <p className="text-muted-foreground">
            جرب استخدام كلمات مختلفة أو أقل تحديداً
          </p>
        </div>
      )}
    </div>
  );
}
