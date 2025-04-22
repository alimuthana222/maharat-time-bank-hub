
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ReportDialog } from "@/components/shared/ReportDialog";

interface ReportContextType {
  openReportDialog: (
    contentId: string,
    contentType: "post" | "comment" | "profile" | "service",
    reportedUserId: string
  ) => void;
  closeReportDialog: () => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <ReportContext.Provider
      value={{
        openReportDialog,
        closeReportDialog,
      }}
    >
      {children}
      {reportData && (
        <ReportDialog
          isOpen={isReportDialogOpen}
          onClose={closeReportDialog}
          contentId={reportData.contentId}
          contentType={reportData.contentType}
          reportedUserId={reportData.reportedUserId}
        />
      )}
    </ReportContext.Provider>
  );
};

export const useReport = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error("useReport must be used within a ReportProvider");
  }
  return context;
};
