
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import { toast } from "sonner";

interface Transaction {
  id: string;
  provider_id: string;
  recipient_id: string;
  hours: number;
  description: string;
  status: string;
  created_at: string;
  provider_name?: string;
  recipient_name?: string;
}

interface TimeBankExportProps {
  transactions: Transaction[];
  balance: {
    hours_earned: number;
    hours_spent: number;
    hours_pending: number;
  } | null;
  className?: string;
}

export function TimeBankExport({ transactions, balance, className }: TimeBankExportProps) {
  const exportToCSV = () => {
    if (transactions.length === 0) {
      toast.warning("لا توجد معاملات للتصدير");
      return;
    }
    
    try {
      // Format the transactions for CSV export
      const headers = ["المعرف", "المرسل", "المستلم", "الساعات", "الوصف", "الحالة", "تاريخ الإنشاء"];
      
      const rows = transactions.map(transaction => [
        transaction.id,
        transaction.provider_name || transaction.provider_id,
        transaction.recipient_name || transaction.recipient_id,
        transaction.hours,
        transaction.description,
        translateStatus(transaction.status),
        formatDate(transaction.created_at, 'full'),
      ]);

      // Add summary row
      const summaryData = [
        ["", "", "", "", "", "", ""],
        ["ملخص الحساب", "", "", "", "", "", ""],
        ["الساعات المكتسبة", balance?.hours_earned || 0, "", "", "", "", ""],
        ["الساعات المنفقة", balance?.hours_spent || 0, "", "", "", "", ""],
        ["الساعات المعلقة", balance?.hours_pending || 0, "", "", "", "", ""],
        ["الرصيد الإجمالي", (balance?.hours_earned || 0) - (balance?.hours_spent || 0), "", "", "", "", ""]
      ];
      
      // Add metadata
      const metadata = [
        ["تم التصدير في", formatDate(new Date().toISOString(), 'full'), "", "", "", "", ""],
        ["عدد المعاملات", transactions.length, "", "", "", "", ""]
      ];
      
      // Combine headers, transaction rows, and summary
      const csvContent = [
        ...metadata,
        ["", "", "", "", "", "", ""],
        headers, 
        ...rows, 
        [""], 
        ...summaryData
      ]
        .map(row => row.join(","))
        .join("\n");
      
      // Create a download link
      const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" }); // UTF-8 BOM for Excel
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `timebank-transactions-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("تم تصدير المعاملات بنجاح");
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      toast.error("حدث خطأ أثناء تصدير المعاملات");
    }
  };

  const translateStatus = (status: string): string => {
    switch (status) {
      case "pending":
        return "معلقة";
      case "approved":
        return "مقبولة";
      case "rejected":
        return "مرفوضة";
      default:
        return status;
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={exportToCSV}
    >
      <Download className="h-4 w-4 mr-2" />
      تصدير المعاملات
    </Button>
  );
}
