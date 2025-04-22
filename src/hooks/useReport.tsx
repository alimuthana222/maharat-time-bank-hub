
import { useState } from "react";
import { ReportDialog } from "@/components/shared/ReportDialog";

export function useReport() {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportData, setReportData] = useState<{
    contentId: string;
    contentType: "post" | "comment" | "profile" | "service";
    reportedUserId: string;
  } | null>(null);

  const openReportDialog = (
    contentId: string,
    contentType: "post" | "comment" | "profile" | "service",
    reportedUserId: string
  ) => {
    setReportData({ contentId, contentType, reportedUserId });
    setIsReportDialogOpen(true);
  };

  const closeReportDialog = () => {
    setIsReportDialogOpen(false);
    setReportData(null);
  };

  const ReportDialogComponent = reportData ? (
    <ReportDialog
      isOpen={isReportDialogOpen}
      onClose={closeReportDialog}
      contentId={reportData.contentId}
      contentType={reportData.contentType}
      reportedUserId={reportData.reportedUserId}
    />
  ) : null;

  return {
    openReportDialog,
    closeReportDialog,
    ReportDialogComponent,
  };
}
