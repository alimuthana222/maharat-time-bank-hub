
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  FileText,
  MessageSquare,
  Eye,
  Trash2,
  Check,
  Loader2,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

interface Content {
  id: string;
  type: "post" | "comment";
  title?: string;
  content: string;
  author: {
    id: string;
    name: string;
    username?: string;
    university?: string;
  };
  created_at: string;
  is_hidden: boolean;
  category?: string;
}

export function ContentManagement() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showContentDetails, setShowContentDetails] = useState(false);
  const [contentType, setContentType] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const { isAdmin, isModerator } = useAuth();

  useEffect(() => {
    fetchContents();
  }, [contentType, visibilityFilter, categoryFilter]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Get unique categories from posts
      const { data: categoryData, error } = await supabase
        .from("posts")
        .select("category")
        .not("category", "is", null);
      
      if (error) throw error;
      
      if (categoryData) {
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(categoryData.map(item => item.category).filter(Boolean))
        );
        
        setCategories(uniqueCategories as string[]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchContents = async () => {
    try {
      setLoading(true);

      let postsData: any[] = [];
      let commentsData: any[] = [];
      
      // Fetch posts if content type is 'all' or 'post'
      if (contentType === "all" || contentType === "post") {
        const visibility = visibilityFilter === "all" 
          ? {} 
          : { is_hidden: visibilityFilter === "hidden" };
          
        const category = categoryFilter === "all" 
          ? {} 
          : { category: categoryFilter };
        
        const { data: posts, error: postsError } = await supabase
          .from("posts")
          .select("*, user_id")
          .match({ ...visibility, ...category })
          .order("created_at", { ascending: false });
          
        if (postsError) throw postsError;
        
        if (posts) {
          // Get author information for each post
          postsData = await Promise.all(
            posts.map(async (post) => {
              const { data: authorData } = await supabase
                .from("profiles")
                .select("full_name, username, university")
                .eq("id", post.user_id)
                .single();
                
              return {
                id: post.id,
                type: "post" as const,
                title: post.title,
                content: post.content,
                author: {
                  id: post.user_id,
                  name: authorData?.full_name || authorData?.username || "مستخدم غير معروف",
                  username: authorData?.username,
                  university: authorData?.university
                },
                created_at: post.created_at,
                is_hidden: post.is_hidden,
                category: post.category
              };
            })
          );
        }
      }
      
      // Fetch comments if content type is 'all' or 'comment'
      if (contentType === "all" || contentType === "comment") {
        const visibility = visibilityFilter === "all" 
          ? {} 
          : { is_hidden: visibilityFilter === "hidden" };
        
        const { data: comments, error: commentsError } = await supabase
          .from("comments")
          .select("*, user_id")
          .match(visibility)
          .order("created_at", { ascending: false });
          
        if (commentsError) throw commentsError;
        
        if (comments) {
          // Get author information for each comment
          commentsData = await Promise.all(
            comments.map(async (comment) => {
              const { data: authorData } = await supabase
                .from("profiles")
                .select("full_name, username, university")
                .eq("id", comment.user_id)
                .single();
                
              return {
                id: comment.id,
                type: "comment" as const,
                content: comment.content,
                author: {
                  id: comment.user_id,
                  name: authorData?.full_name || authorData?.username || "مستخدم غير معروف",
                  username: authorData?.username,
                  university: authorData?.university
                },
                created_at: comment.created_at,
                is_hidden: comment.is_hidden
              };
            })
          );
        }
      }
      
      // Combine posts and comments
      setContents([...postsData, ...commentsData]);
    } catch (error: any) {
      console.error("Error fetching content:", error);
      toast.error(`حدث خطأ أثناء جلب المحتوى: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContent = (content: Content) => {
    setSelectedContent(content);
    setShowContentDetails(true);
  };

  const handleToggleVisibility = async (id: string, type: string, isCurrentlyHidden: boolean) => {
    if (!isAdmin() && !isModerator()) {
      toast.error("ليس لديك صلاحية لتنفيذ هذا الإجراء");
      return;
    }

    try {
      const table = type === "post" ? "posts" : "comments";
      
      const { error } = await supabase
        .from(table)
        .update({ is_hidden: !isCurrentlyHidden })
        .eq("id", id);

      if (error) throw error;

      // Update UI
      setContents(contents.map(item => 
        item.id === id && item.type === type
          ? { ...item, is_hidden: !isCurrentlyHidden }
          : item
      ));
      
      if (selectedContent && selectedContent.id === id) {
        setSelectedContent({
          ...selectedContent,
          is_hidden: !isCurrentlyHidden
        });
      }

      toast.success(
        isCurrentlyHidden
          ? "تم إظهار المحتوى بنجاح"
          : "تم إخفاء المحتوى بنجاح"
      );
    } catch (error: any) {
      console.error("Error toggling content visibility:", error);
      toast.error(`حدث خطأ أثناء تغيير حالة المحتوى: ${error.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "post":
        return <FileText className="h-4 w-4 mr-2" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const filteredContents = contents.filter((content) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      content.content.toLowerCase().includes(searchLower) ||
      content.title?.toLowerCase().includes(searchLower) ||
      content.author.name.toLowerCase().includes(searchLower) ||
      (content.category?.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">إدارة المحتوى</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث في المحتوى..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-[200px]"
            />
          </div>
          
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="نوع المحتوى" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="post">منشورات</SelectItem>
              <SelectItem value="comment">تعليقات</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="visible">ظاهر</SelectItem>
              <SelectItem value="hidden">مخفي</SelectItem>
            </SelectContent>
          </Select>
          
          {contentType !== "comment" && categories.length > 0 && (
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>النوع</TableHead>
            <TableHead>المحتوى</TableHead>
            <TableHead>الكاتب</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="mr-2">جاري تحميل المحتوى...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredContents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                لا يوجد محتوى مطابق لمعايير البحث
              </TableCell>
            </TableRow>
          ) : (
            filteredContents.map((content) => (
              <TableRow key={`${content.type}-${content.id}`}>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center">
                    {getContentTypeIcon(content.type)}
                    <span>
                      {content.type === "post" ? "منشور" : "تعليق"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {content.title ? (
                    <div>
                      <div className="font-medium">{content.title}</div>
                      <div className="text-sm text-muted-foreground truncate">{content.content}</div>
                    </div>
                  ) : (
                    content.content
                  )}
                </TableCell>
                <TableCell>{content.author.name}</TableCell>
                <TableCell className="whitespace-nowrap">{formatDate(content.created_at)}</TableCell>
                <TableCell>
                  <Badge
                    variant={content.is_hidden ? "destructive" : "success"}
                  >
                    {content.is_hidden ? "مخفي" : "ظاهر"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleViewContent(content)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">عرض</span>
                    </Button>
                    <Button 
                      variant={content.is_hidden ? "secondary" : "destructive"} 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleToggleVisibility(content.id, content.type, content.is_hidden)}
                    >
                      {content.is_hidden ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {content.is_hidden ? "إظهار" : "إخفاء"}
                      </span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={showContentDetails} onOpenChange={setShowContentDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تفاصيل المحتوى</DialogTitle>
            <DialogDescription>
              عرض ومعالجة المحتوى المنشور
            </DialogDescription>
          </DialogHeader>

          {selectedContent && (
            <div className="space-y-4">
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="font-medium">النوع:</div>
                  <div className="flex items-center">
                    {getContentTypeIcon(selectedContent.type)}
                    <span>
                      {selectedContent.type === "post" ? "منشور" : "تعليق"}
                    </span>
                  </div>
                </div>

                {selectedContent.title && (
                  <div>
                    <div className="font-medium">العنوان:</div>
                    <div className="mt-1 text-lg font-semibold">{selectedContent.title}</div>
                  </div>
                )}

                <div>
                  <div className="font-medium">المحتوى:</div>
                  <div className="mt-1 p-3 rounded-md border bg-muted/30">{selectedContent.content}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">الكاتب:</div>
                  <div>{selectedContent.author.name}</div>

                  {selectedContent.author.university && (
                    <>
                      <div className="font-medium">الجامعة:</div>
                      <div>{selectedContent.author.university}</div>
                    </>
                  )}
                  
                  {selectedContent.category && (
                    <>
                      <div className="font-medium">التصنيف:</div>
                      <div>{selectedContent.category}</div>
                    </>
                  )}

                  <div className="font-medium">التاريخ:</div>
                  <div>{formatDate(selectedContent.created_at)}</div>

                  <div className="font-medium">الحالة:</div>
                  <div>
                    <Badge
                      variant={selectedContent.is_hidden ? "destructive" : "success"}
                    >
                      {selectedContent.is_hidden ? "مخفي" : "ظاهر"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setShowContentDetails(false)}
                >
                  إغلاق
                </Button>
                <Button
                  variant={selectedContent.is_hidden ? "secondary" : "destructive"}
                  onClick={() => handleToggleVisibility(
                    selectedContent.id, 
                    selectedContent.type, 
                    selectedContent.is_hidden
                  )}
                >
                  {selectedContent.is_hidden ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      <span>إظهار المحتوى</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>إخفاء المحتوى</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
