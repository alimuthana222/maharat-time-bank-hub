
import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { 
  MessageSquare, 
  ThumbsUp, 
  Flag, 
  Share2, 
  MoreHorizontal,
  Bookmark,
  AlertTriangle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { CommentsSection } from "./CommentsSection";
import { ReportDialog } from "./ReportDialog";
import { CommentProps } from "./Comment";

export interface ForumPostProps {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatarFallback: string;
    university: string;
  };
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  tags?: string[];
}

export function ForumPost({
  id,
  title,
  content,
  author,
  createdAt,
  likesCount: initialLikesCount,
  commentsCount: initialCommentsCount,
  tags = [],
}: ForumPostProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { user } = useAuth();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };
  
  const handleLike = () => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول للتفاعل مع المنشورات");
      return;
    }
    
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };
  
  const handleSave = () => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول لحفظ المنشورات");
      return;
    }
    
    setSaved(!saved);
    toast.success(saved ? "تم إلغاء حفظ المنشور" : "تم حفظ المنشور");
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `${title} - ${author.name}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing: ', err);
        toast.error("حدث خطأ أثناء المشاركة");
      });
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("تم نسخ رابط المنشور إلى الحافظة"))
        .catch(() => toast.error("حدث خطأ أثناء نسخ الرابط"));
    }
  };
  
  const handleReport = () => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول للإبلاغ عن المنشورات");
      return;
    }
    
    setShowReportDialog(true);
  };
  
  const handleSubmitReport = (reason: string) => {
    toast.success("تم إرسال البلاغ وسيتم مراجعته من قبل المشرفين");
    setShowReportDialog(false);
  };

  const handleAddComment = (newComment: CommentProps) => {
    setComments([...comments, newComment]);
    setCommentsCount(prev => prev + 1);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{author.avatarFallback}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{author.name}</div>
              <div className="text-xs text-muted-foreground">{author.university}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">
              {formatDate(createdAt)}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">المزيد من الخيارات</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSave}>
                  <Bookmark className="mr-2 h-4 w-4" />
                  <span>{saved ? "إلغاء الحفظ" : "حفظ المنشور"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>مشاركة المنشور</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleReport} className="text-red-500">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  <span>الإبلاغ عن المنشور</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-3">{content}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div key={index} className="bg-muted text-xs rounded-full px-2.5 py-1">
                #{tag}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-3 flex flex-col">
        <div className="flex justify-between w-full">
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex gap-2 items-center ${liked ? 'text-primary' : ''}`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{likesCount}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex gap-2 items-center"
              onClick={() => setShowComments(!showComments)}  
            >
              <MessageSquare className="h-4 w-4" />
              <span>{commentsCount}</span>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={saved ? "default" : "ghost"} 
              size="sm" 
              onClick={handleSave}
              className="flex gap-1 items-center"
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">{saved ? "محفوظ" : "حفظ"}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleReport}>
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Comments Section */}
        {showComments && (
          <CommentsSection 
            postId={id}
            comments={comments}
            commentsCount={commentsCount}
            onAddComment={handleAddComment}
          />
        )}
      </CardFooter>
      
      {/* Report Dialog */}
      <ReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        onSubmitReport={handleSubmitReport}
      />
    </Card>
  );
}
