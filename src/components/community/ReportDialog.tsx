
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

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitReport: (reason: string) => void;
}

export function ReportDialog({ open, onOpenChange, onSubmitReport }: ReportDialogProps) {
  const [reportReason, setReportReason] = useState("");

  const handleSubmit = () => {
    if (!reportReason) {
      toast.error("يرجى ذكر سبب البلاغ");
      return;
    }

    onSubmitReport(reportReason);
    setReportReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>الإبلاغ عن المنشور</DialogTitle>
          <DialogDescription>
            يرجى توضيح سبب الإبلاغ عن هذا المنشور. سيتم مراجعة البلاغ من قبل المشرفين.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          placeholder="اذكر سبب البلاغ..."
          className="min-h-[100px]"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button onClick={handleSubmit}>إرسال البلاغ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
