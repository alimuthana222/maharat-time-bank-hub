
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { MessageSquare, ThumbsUp, Share, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  user_id: string;
  is_hidden: boolean;
  author_name?: string;
  author_avatar?: string;
  likes_count?: number;
  comments_count?: number;
  user_liked?: boolean;
}

interface PostsListProps {
  category?: string;
  searchQuery?: string;
  refreshTrigger?: number;
}

export function PostsList({ category, searchQuery, refreshTrigger }: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [category, searchQuery, refreshTrigger]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Mock data for now - in real app, fetch from Supabase with proper joins
      const mockPosts: Post[] = [
        {
          id: "1",
          title: "كيف يمكنني تحسين مهاراتي في البرمجة؟",
          content: "أعمل في مجال البرمجة منذ سنة واحدة وأريد تطوير مهاراتي أكثر. ما هي أفضل الطرق والموارد المتاحة؟",
          category: "technology",
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user_id: "user-1",
          is_hidden: false,
          author_name: "أحمد محمد",
          author_avatar: "https://i.pravatar.cc/150?img=1",
          likes_count: 15,
          comments_count: 8,
          user_liked: false,
        },
        {
          id: "2",
          title: "دورات مجانية في التصميم الجرافيكي",
          content: "مشاركة مجموعة من أفضل الدورات المجانية لتعلم التصميم الجرافيكي للمبتدئين والمحترفين.",
          category: "study",
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          user_id: "user-2",
          is_hidden: false,
          author_name: "سارة أحمد",
          author_avatar: "https://i.pravatar.cc/150?img=5",
          likes_count: 24,
          comments_count: 12,
          user_liked: true,
        },
        {
          id: "3",
          title: "تجربتي في العمل الحر",
          content: "أشارككم تجربتي في العمل الحر والدروس المستفادة خلال السنوات الماضية. نصائح مهمة للمبتدئين.",
          category: "career",
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          user_id: "user-3",
          is_hidden: false,
          author_name: "خالد العمري",
          author_avatar: "https://i.pravatar.cc/150?img=3",
          likes_count: 31,
          comments_count: 19,
          user_liked: false,
        },
      ];

      // Filter by category and search query
      let filteredPosts = mockPosts;
      
      if (category && category !== "all") {
        filteredPosts = filteredPosts.filter(post => post.category === category);
      }
      
      if (searchQuery) {
        filteredPosts = filteredPosts.filter(post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setPosts(filteredPosts);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل المنشورات");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    // Toggle like status
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLikedState = !post.user_liked;
        return {
          ...post,
          user_liked: newLikedState,
          likes_count: (post.likes_count || 0) + (newLikedState ? 1 : -1),
        };
      }
      return post;
    }));

    toast.success("تم تحديث الإعجاب");
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      general: "عام",
      study: "دراسة",
      career: "مهني",
      technology: "تقنية",
      help: "مساعدة",
    };
    return categoryMap[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      general: "bg-gray-500",
      study: "bg-blue-500",
      career: "bg-green-500",
      technology: "bg-purple-500",
      help: "bg-orange-500",
    };
    return colorMap[category] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            {searchQuery ? "لم يتم العثور على منشورات" : "لا توجد منشورات في هذا التصنيف"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author_avatar} />
                  <AvatarFallback>
                    {post.author_name?.charAt(0) || "؟"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{post.author_name}</h3>
                    <Badge className={`${getCategoryColor(post.category)} text-white text-xs`}>
                      {getCategoryLabel(post.category)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: ar,
                    })}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
            <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1 ${
                    post.user_liked ? "text-blue-600" : "text-muted-foreground"
                  }`}
                >
                  <ThumbsUp className={`h-4 w-4 ${post.user_liked ? "fill-current" : ""}`} />
                  {post.likes_count || 0}
                </Button>
                
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {post.comments_count || 0}
                </Button>
                
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Share className="h-4 w-4" />
                  مشاركة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
