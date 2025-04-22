
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول لتقديم بلاغ");
      return;
    }

    if (!reason) {
      toast.error("يرجى اختيار سبب البلاغ");
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from("content_reports")
        .insert({
          reporter_id: user.id,
          reported_user_id: reportedUserId,
          content_id: contentId,
          content_type: contentType,
          reason: reason,
          details: details,
        });

      if (error) {
        throw error;
      }

      toast.success("تم تقديم البلاغ بنجاح، سيقوم المشرفون بمراجعته");
      setReason("");
      setDetails("");
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("حدث خطأ أثناء تقديم البلاغ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>الإبلاغ عن محتوى غير لائق</DialogTitle>
          <DialogDescription>
            يرجى تقديم تفاصيل حول سبب اعتقادك أن هذا المحتوى غير مناسب
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right col-span-4">
              سبب البلاغ
            </Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger className="col-span-4">
                <SelectValue placeholder="اختر سبب البلاغ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inappropriate">محتوى غير لائق</SelectItem>
                <SelectItem value="harassment">تحرش أو مضايقة</SelectItem>
                <SelectItem value="spam">محتوى دعائي مزعج</SelectItem>
                <SelectItem value="misleading">معلومات مضللة</SelectItem>
                <SelectItem value="hate_speech">خطاب كراهية</SelectItem>
                <SelectItem value="violence">تحريض على العنف</SelectItem>
                <SelectItem value="other">سبب آخر</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="details" className="text-right col-span-4">
              تفاصيل إضافية (اختياري)
            </Label>
            <Textarea
              id="details"
              className="col-span-4"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="يرجى تقديم أي تفاصيل إضافية تساعد المشرفين على فهم المشكلة"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "جاري الإرسال..." : "إرسال البلاغ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
