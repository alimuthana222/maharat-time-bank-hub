
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentType: "post" | "comment" | "profile" | "service";
  reportedUserId: string;
}

export function ReportDialog({ 
  isOpen, 
  onClose, 
  contentId, 
  contentType, 
  reportedUserId 
}: ReportDialogProps) {
  const [reportReason, setReportReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!reportReason.trim()) {
      toast.error("يرجى ذكر سبب البلاغ");
      return;
    }

    if (!user) {
      toast.error("يجب تسجيل الدخول لإرسال البلاغات");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from("content_reports")
        .insert({
          content_id: contentId,
          content_type: contentType,
          reporter_id: user.id,
          reported_user_id: reportedUserId,
          reason: reportReason,
          status: "pending"
        });

      if (error) throw error;
      
      toast.success("تم إرسال البلاغ بنجاح وسيتم مراجعته من قبل المشرفين");
      setReportReason("");
      onClose();
    } catch (error: any) {
      console.error("Error submitting report:", error);
      toast.error(`حدث خطأ أثناء إرسال البلاغ: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>الإبلاغ عن المحتوى</DialogTitle>
          <DialogDescription>
            يرجى توضيح سبب الإبلاغ عن هذا المحتوى. سيتم مراجعة البلاغ من قبل المشرفين.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          placeholder="اذكر سبب البلاغ..."
          className="min-h-[100px]"
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>إلغاء</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "جاري الإرسال..." : "إرسال البلاغ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
