
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

const CATEGORIES = [
  "برمجة",
  "تصميم",
  "كتابة",
  "ترجمة",
  "تدريس",
  "تعاون",
  "سؤال",
  "عام"
];

interface CreatePostProps {
  onPostCreated?: (post: any) => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("يرجى كتابة محتوى المنشور");
      return;
    }
    
    if (!category) {
      toast.error("يرجى اختيار تصنيف");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      const newPost = {
        id: `post-${Date.now()}`,
        author: {
          name: user?.user_metadata?.full_name || user?.user_metadata?.username || "مستخدم",
          avatar: user?.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${user?.email}`,
          university: user?.user_metadata?.university || "جامعة",
          verified: false
        },
        content: content.trim(),
        category,
        tags,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date().toISOString()
      };

      setTimeout(() => {
        if (onPostCreated) {
          onPostCreated(newPost);
        }
        
        // Reset form
        setContent("");
        setCategory("");
        setTags([]);
        setNewTag("");
        setIsSubmitting(false);
        
        toast.success("تم نشر المنشور بنجاح!");
      }, 1000);
      
    } catch (error) {
      setIsSubmitting(false);
      toast.error("حدث خطأ أثناء نشر المنشور");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user?.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${user?.email}`} 
              alt={user?.user_metadata?.full_name || user?.user_metadata?.username || "المستخدم"} 
            />
            <AvatarFallback>
              {(user?.user_metadata?.full_name || user?.user_metadata?.username || "م").charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span>إنشاء منشور جديد</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="شارك أفكارك مع المجتمع..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="أضف علامة..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddTag}
                disabled={!newTag.trim() || tags.length >= 5}
              >
                إضافة
              </Button>
            </div>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm">
                <Image className="h-4 w-4 mr-2" />
                إضافة صورة
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setContent("");
                  setCategory("");
                  setTags([]);
                  setNewTag("");
                }}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button 
                type="submit" 
                disabled={!content.trim() || !category || isSubmitting}
              >
                {isSubmitting ? "جاري النشر..." : "نشر"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
