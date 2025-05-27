
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    university: string;
    verified: boolean;
  };
  content: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  images?: string[];
}

export function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: "أحمد محمد",
        avatar: "https://i.pravatar.cc/150?u=ahmed",
        university: "جامعة الملك سعود",
        verified: true
      },
      content: "نصائح مهمة لطلاب البرمجة: ابدأوا بتعلم أساسيات الخوارزميات قبل التعمق في أي لغة برمجة. هذا سيساعدكم كثيراً في فهم المفاهيم الأساسية وحل المشاكل بطريقة منطقية.",
      category: "برمجة",
      tags: ["برمجة", "نصائح", "تعليم"],
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      isBookmarked: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: "2",
      author: {
        name: "سارة أحمد",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        university: "جامعة الملك عبدالعزيز",
        verified: false
      },
      content: "شاركت اليوم في مسابقة التصميم الجامعية وحصلت على المركز الثاني! 🎉 تجربة رائعة ومفيدة جداً. شكراً لكل من دعمني وشجعني.",
      category: "تصميم",
      tags: ["تصميم", "مسابقة", "إنجاز"],
      likes: 47,
      comments: 15,
      shares: 7,
      isLiked: true,
      isBookmarked: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      images: ["https://picsum.photos/600/400?random=1"]
    },
    {
      id: "3",
      author: {
        name: "محمد عبدالله",
        avatar: "https://i.pravatar.cc/150?u=mohammed",
        university: "جامعة الإمام",
        verified: true
      },
      content: "أبحث عن شريك للعمل على مشروع تطبيق جوال. المشروع عبارة عن منصة لربط الطلاب بالمدرسين. إذا كان لديك خبرة في React Native أو Flutter، تواصل معي!",
      category: "تعاون",
      tags: ["مشروع", "تطبيق", "شراكة"],
      likes: 12,
      comments: 6,
      shares: 2,
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
    }
  ]);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "برمجة":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "تصميم":
        return "bg-orange-500/10 text-orange-600 border-orange-200";
      case "كتابة":
        return "bg-purple-500/10 text-purple-600 border-purple-200";
      case "تعاون":
        return "bg-green-500/10 text-green-600 border-green-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{post.author.name}</h3>
                    {post.author.verified && (
                      <Badge variant="secondary" className="text-xs">
                        ✓ موثق
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{post.author.university}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ar })}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getCategoryColor(post.category)}>
                  {post.category}
                </Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">{post.content}</p>
            
            {post.images && post.images.length > 0 && (
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={post.images[0]} 
                  alt="Post image" 
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
            
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`gap-2 ${post.isLiked ? 'text-red-600' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  {post.likes}
                </Button>
                
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {post.comments}
                </Button>
                
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  {post.shares}
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                className={post.isBookmarked ? 'text-blue-600' : ''}
                onClick={() => handleBookmark(post.id)}
              >
                <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
