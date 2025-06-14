
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { 
  MessageSquare, 
  ThumbsUp, 
  Share, 
  MoreHorizontal,
  Search,
  Plus,
  Send,
  Loader2,
  Pin
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category?: string;
  tags?: string[];
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  author_name?: string;
  author_avatar?: string;
  user_liked?: boolean;
}

interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  author_id: string;
  content: string;
  likes_count: number;
  is_hidden: boolean;
  created_at: string;
  author_name?: string;
  author_avatar?: string;
}

const categories = [
  { value: "all", label: "جميع التصنيفات" },
  { value: "general", label: "عام" },
  { value: "study", label: "دراسة" },
  { value: "career", label: "مهني" },
  { value: "technology", label: "تقنية" },
  { value: "help", label: "مساعدة" },
  { value: "discussion", label: "نقاش" }
];

export function RealCommunityPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  
  // New post form
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general"
  });

  useEffect(() => {
    fetchPosts();
    setupRealTimeUpdates();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("community_posts")
        .select(`
          *,
          profiles!community_posts_author_id_fkey(username, avatar_url)
        `)
        .eq("is_hidden", false)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Check user likes
      if (user && data) {
        const postIds = data.map(post => post.id);
        const { data: likes } = await supabase
          .from("post_likes")
          .select("post_id")
          .eq("user_id", user.id)
          .in("post_id", postIds);

        const likedPostIds = new Set(likes?.map(l => l.post_id) || []);

        const postsWithLikes = data.map(post => ({
          ...post,
          author_name: post.profiles?.username || "مستخدم",
          author_avatar: post.profiles?.avatar_url,
          user_liked: likedPostIds.has(post.id)
        }));

        setPosts(postsWithLikes);
      } else {
        setPosts(data?.map(post => ({
          ...post,
          author_name: post.profiles?.username || "مستخدم",
          author_avatar: post.profiles?.avatar_url,
          user_liked: false
        })) || []);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("حدث خطأ أثناء تحميل المنشورات");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from("post_comments")
        .select(`
          *,
          profiles!post_comments_author_id_fkey(username, avatar_url)
        `)
        .eq("post_id", postId)
        .eq("is_hidden", false)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const commentsWithAuthor = data?.map(comment => ({
        ...comment,
        author_name: comment.profiles?.username || "مستخدم",
        author_avatar: comment.profiles?.avatar_url
      })) || [];

      setComments(prev => ({
        ...prev,
        [postId]: commentsWithAuthor
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("حدث خطأ أثناء تحميل التعليقات");
    }
  };

  const setupRealTimeUpdates = () => {
    const channel = supabase
      .channel("community-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "community_posts"
        },
        () => {
          fetchPosts();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "post_likes"
        },
        () => {
          fetchPosts();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "post_comments"
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'post_id' in payload.new) {
            const postId = payload.new.post_id as string;
            if (expandedComments.has(postId)) {
              fetchComments(postId);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    try {
      const { error } = await supabase
        .from("community_posts")
        .insert([{
          title: newPost.title.trim(),
          content: newPost.content.trim(),
          author_id: user.id,
          category: newPost.category
        }]);

      if (error) throw error;

      toast.success("تم إنشاء المنشور بنجاح");
      setNewPost({ title: "", content: "", category: "general" });
      setShowCreatePost(false);
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("حدث خطأ أثناء إنشاء المنشور");
    }
  };

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    try {
      if (currentlyLiked) {
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("post_likes")
          .insert([{
            post_id: postId,
            user_id: user.id
          }]);

        if (error) throw error;
      }

      fetchPosts();
    } catch (error) {
      console.error("Error handling like:", error);
      toast.error("حدث خطأ أثناء تحديث الإعجاب");
    }
  };

  const handleComment = async (postId: string) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    const commentContent = newComment[postId]?.trim();
    if (!commentContent) {
      toast.error("يرجى كتابة تعليق");
      return;
    }

    try {
      const { error } = await supabase
        .from("post_comments")
        .insert([{
          post_id: postId,
          author_id: user.id,
          content: commentContent
        }]);

      if (error) throw error;

      setNewComment(prev => ({ ...prev, [postId]: "" }));
      fetchComments(postId);
      fetchPosts(); // Refresh to update comment count
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("حدث خطأ أثناء إضافة التعليق");
    }
  };

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
    setExpandedComments(newExpanded);
  };

  const getCategoryLabel = (category?: string) => {
    return categories.find(c => c.value === category)?.label || category || "عام";
  };

  const getCategoryColor = (category?: string) => {
    const colorMap: Record<string, string> = {
      general: "bg-gray-500",
      study: "bg-blue-500",
      career: "bg-green-500",
      technology: "bg-purple-500",
      help: "bg-orange-500",
      discussion: "bg-indigo-500"
    };
    return colorMap[category || "general"] || "bg-gray-500";
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المنشورات..."
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

            <Button onClick={() => setShowCreatePost(true)}>
              <Plus className="h-4 w-4 mr-2" />
              منشور جديد
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Post Form */}
      {showCreatePost && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">إنشاء منشور جديد</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="عنوان المنشور..."
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <Select 
                  value={newPost.category} 
                  onValueChange={(value) => setNewPost(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.value !== "all").map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Textarea
                placeholder="محتوى المنشور..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                required
              />
              
              <div className="flex gap-2">
                <Button type="submit">نشر</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreatePost(false)}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? "لم يتم العثور على منشورات" : "لا توجد منشورات في هذا التصنيف"}
            </p>
          </CardContent>
        </Card>
      ) : (
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
                        {post.is_pinned && (
                          <Pin className="h-4 w-4 text-blue-600" />
                        )}
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
                <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id, post.user_liked || false)}
                      className={`flex items-center gap-1 ${
                        post.user_liked ? "text-blue-600" : "text-muted-foreground"
                      }`}
                    >
                      <ThumbsUp className={`h-4 w-4 ${post.user_liked ? "fill-current" : ""}`} />
                      {post.likes_count || 0}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => toggleComments(post.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      {post.comments_count || 0}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Share className="h-4 w-4" />
                      مشاركة
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                {expandedComments.has(post.id) && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    {/* Add Comment */}
                    {user && (
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback>
                            {user.user_metadata?.username?.charAt(0) || "أ"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Input
                            placeholder="اكتب تعليقاً..."
                            value={newComment[post.id] || ""}
                            onChange={(e) => setNewComment(prev => ({ 
                              ...prev, 
                              [post.id]: e.target.value 
                            }))}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleComment(post.id);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleComment(post.id)}
                            disabled={!newComment[post.id]?.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Comments List */}
                    {comments[post.id]?.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author_avatar} />
                          <AvatarFallback>
                            {comment.author_name?.charAt(0) || "؟"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.author_name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.created_at), {
                                  addSuffix: true,
                                  locale: ar,
                                })}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
