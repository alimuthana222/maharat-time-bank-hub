
import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment, CommentProps } from "@/components/community/Comment";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface CommentsSectionProps {
  postId: string;
  comments: CommentProps[];
  commentsCount: number;
  onAddComment: (comment: CommentProps) => void;
}

export function CommentsSection({ postId, comments, commentsCount, onAddComment }: CommentsSectionProps) {
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();

  const handleAddComment = () => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول لإضافة تعليق");
      return;
    }

    if (!commentText.trim()) {
      toast.error("التعليق لا يمكن أن يكون فارغاً");
      return;
    }

    const newComment: CommentProps = {
      id: `comment-${Date.now()}`,
      author: user.user_metadata?.full_name || "مستخدم",
      content: commentText,
      createdAt: new Date().toISOString()
    };

    onAddComment(newComment);
    setCommentText("");
    toast.success("تمت إضافة التعليق بنجاح");
  };

  return (
    <div className="w-full mt-4 border-t pt-4">
      <h4 className="text-sm font-medium mb-3">التعليقات ({commentsCount})</h4>
      
      {/* Comment Input */}
      <div className="flex gap-2 mb-4">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{user?.user_metadata?.full_name?.[0] || "م"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea 
            placeholder="أضف تعليقاً..." 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="mb-2 h-20 resize-none"
          />
          <Button 
            size="sm" 
            disabled={!commentText.trim()} 
            onClick={handleAddComment}
          >
            إضافة تعليق
          </Button>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm">
            لا توجد تعليقات. كن أول من يعلق!
          </div>
        )}
      </div>
    </div>
  );
}
