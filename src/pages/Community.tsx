
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ForumPost, ForumPostProps } from "@/components/community/ForumPost";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Filter, 
  Users, 
  Search, 
  TrendingUp, 
  Clock,
  Tag 
} from "lucide-react";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Mock data for forum posts
const FORUM_POSTS: ForumPostProps[] = [
  {
    id: "1",
    title: "نصائح للاستعداد للاختبارات النهائية",
    content: "أنا طالب في السنة الثالثة وأبحث عن نصائح للاستعداد للاختبارات النهائية بشكل فعال. ما هي الطرق التي تستخدمونها للمذاكرة وتنظيم الوقت؟",
    author: {
      name: "أحمد محمد",
      avatarFallback: "أم",
      university: "جامعة الملك سعود",
    },
    createdAt: "2025-04-15T10:30:00Z",
    likesCount: 15,
    commentsCount: 8,
    tags: ["مذاكرة", "اختبارات", "نصائح"]
  },
  {
    id: "2",
    title: "تجربتي في تطوير مهاراتي البرمجية",
    content: "أود مشاركة تجربتي في تطوير مهاراتي البرمجية من خلال العمل على مشاريع صغيرة والتعلم الذاتي. بدأت منذ سنة تقريباً وأرى تقدماً ملحوظاً...",
    author: {
      name: "سارة العتيبي",
      avatarFallback: "سع",
      university: "جامعة الأميرة نورة",
    },
    createdAt: "2025-04-14T14:45:00Z",
    likesCount: 23,
    commentsCount: 12,
    tags: ["برمجة", "تطوير_ذاتي", "تعلم"]
  },
  {
    id: "3",
    title: "البحث عن مجموعة دراسية في تخصص إدارة الأعمال",
    content: "أبحث عن طلاب مهتمين بتشكيل مجموعة دراسية في تخصص إدارة الأعمال للفصل الدراسي القادم. هدفنا المذاكرة الجماعية وتبادل المعارف والخبرات.",
    author: {
      name: "خالد الزهراني",
      avatarFallback: "خز",
      university: "جامعة الملك فهد",
    },
    createdAt: "2025-04-12T09:15:00Z",
    likesCount: 8,
    commentsCount: 15,
    tags: ["إدارة_أعمال", "مجموعة_دراسية"]
  },
  {
    id: "4",
    title: "تجربة التدريب الصيفي في شركة أرامكو",
    content: "أود مشاركة تجربتي في التدريب الصيفي بشركة أرامكو العام الماضي. كانت تجربة مميزة تعلمت منها الكثير وأنصح الجميع بالتقديم...",
    author: {
      name: "نورة السالم",
      avatarFallback: "نس",
      university: "جامعة الملك عبدالعزيز",
    },
    createdAt: "2025-04-10T16:20:00Z",
    likesCount: 45,
    commentsCount: 22,
    tags: ["تدريب_صيفي", "أرامكو", "خبرات"]
  },
];

const CATEGORIES = [
  "الكل",
  "أكاديمي",
  "مهني",
  "تقني",
  "اجتماعي",
  "ثقافي",
  "رياضي",
  "فني",
];

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState(FORUM_POSTS);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState("");
  const [category, setCategory] = useState("الكل");
  
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.includes(searchQuery) || 
                         post.content.includes(searchQuery) ||
                         post.tags?.some(tag => tag.includes(searchQuery));
    
    const matchesCategory = category === "الكل" || 
                          (post.tags && post.tags.includes(category));
    
    return matchesSearch && matchesCategory;
  });
  
  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    const tagsArray = newPostTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
      
    const newPost: ForumPostProps = {
      id: `${posts.length + 1}`,
      title: newPostTitle,
      content: newPostContent,
      author: {
        name: "أنت",
        avatarFallback: "أن",
        university: "جامعتك"
      },
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      tags: tagsArray,
    };
    
    setPosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostTags("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">المجتمع</h1>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  إنشاء منشور
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>إنشاء منشور جديد</DialogTitle>
                  <DialogDescription>
                    شارك أفكارك واستفساراتك مع مجتمع الطلاب
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">عنوان المنشور</Label>
                    <Input
                      id="title"
                      placeholder="أدخل عنوان المنشور"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">محتوى المنشور</Label>
                    <Textarea
                      id="content"
                      placeholder="اكتب محتوى منشورك هنا..."
                      rows={5}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tags" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      الوسوم
                    </Label>
                    <Input
                      id="tags"
                      placeholder="أدخل الوسوم مفصولة بفواصل (مثال: جامعة، دراسة، تخصص)"
                      value={newPostTags}
                      onChange={(e) => setNewPostTags(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">إلغاء</Button>
                  </DialogClose>
                  <Button onClick={handleCreatePost}>نشر</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="ابحث في المجتمع..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select 
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Tabs and Forum Posts */}
          <Tabs defaultValue="recent">
            <TabsList className="mb-6">
              <TabsTrigger value="recent">
                <Clock className="h-4 w-4 mr-2" />
                الأحدث
              </TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="h-4 w-4 mr-2" />
                الأكثر تفاعلاً
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <ForumPost key={post.id} {...post} />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">لا توجد منشورات تطابق بحثك</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="trending">
              {filteredPosts
                .sort((a, b) => (b.likesCount + b.commentsCount) - (a.likesCount + a.commentsCount))
                .map((post) => (
                  <ForumPost key={post.id} {...post} />
                ))
              }
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
