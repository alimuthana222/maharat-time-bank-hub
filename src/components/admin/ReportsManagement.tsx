
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
  AlertTriangle,
  CheckCircle2,
  Eye,
  Trash2,
  MessageSquare,
  FileText,
  Tag,
  User
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Report {
  id: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
  reporter_id: string;
  reporter_name: string;
  reported_user_id: string;
  reported_user_name: string;
  content_id: string;
  content_type: "post" | "comment" | "profile" | "service";
  reason: string;
  details?: string;
  content_preview?: string;
}

export function ReportsManagement() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { isAdmin, isModerator } = useAuth();

  useEffect(() => {
    fetchReports();
  }, [activeTab]);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const statusFilter = activeTab === "all" ? {} : { status: activeTab };

      const { data: reportsData, error: reportsError } = await supabase
        .from("content_reports")
        .select("*")
        .match(statusFilter)
        .order("created_at", { ascending: false });

      if (reportsError) throw reportsError;

      const enhancedReports = await Promise.all(
        (reportsData || []).map(async (report) => {
          // Get reporter name
          const { data: reporterData } = await supabase
            .from("profiles")
            .select("full_name, username")
            .eq("id", report.reporter_id)
            .single();

          // Get reported user name
          const { data: reportedUserData } = await supabase
            .from("profiles")
            .select("full_name, username")
            .eq("id", report.reported_user_id)
            .single();

          // Get content preview based on content type
          let contentPreview = "";
          if (report.content_type === "post") {
            const { data: postData } = await supabase
              .from("posts")
              .select("title, content")
              .eq("id", report.content_id)
              .single();
            contentPreview = postData 
              ? `${postData.title}: ${postData.content.substring(0, 100)}...` 
              : "محتوى غير موجود";
          } else if (report.content_type === "comment") {
            const { data: commentData } = await supabase
              .from("comments")
              .select("content")
              .eq("id", report.content_id)
              .single();
            contentPreview = commentData 
              ? commentData.content.substring(0, 150) 
              : "تعليق غير موجود";
          } else {
            contentPreview = "نوع محتوى غير معروف";
          }

          return {
            ...report,
            reporter_name: reporterData?.full_name || reporterData?.username || "مستخدم غير معروف",
            reported_user_name: reportedUserData?.full_name || reportedUserData?.username || "مستخدم غير معروف",
            content_preview: contentPreview || report.details || "بدون محتوى",
          } as Report;
        })
      );

      setReports(enhancedReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("حدث خطأ أثناء جلب البلاغات");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowReportDetails(true);
  };

  const handleApproveReport = async (id: string) => {
    if (!isAdmin() && !isModerator()) {
      toast.error("ليس لديك صلاحية لتنفيذ هذا الإجراء");
      return;
    }

    try {
      const { error } = await supabase
        .from("content_reports")
        .update({ status: "approved" })
        .eq("id", id);

      if (error) throw error;

      // Hide the reported content
      if (selectedReport) {
        if (selectedReport.content_type === "post") {
          await supabase
            .from("posts")
            .update({ is_hidden: true })
            .eq("id", selectedReport.content_id);
        } else if (selectedReport.content_type === "comment") {
          await supabase
            .from("comments")
            .update({ is_hidden: true })
            .eq("id", selectedReport.content_id);
        }
      }

      toast.success("تم قبول البلاغ وإزالة المحتوى المخالف");
      setShowReportDetails(false);
      fetchReports();
    } catch (error: any) {
      console.error("Error approving report:", error);
      toast.error(`حدث خطأ أثناء معالجة البلاغ: ${error.message}`);
    }
  };

  const handleRejectReport = async (id: string) => {
    if (!isAdmin() && !isModerator()) {
      toast.error("ليس لديك صلاحية لتنفيذ هذا الإجراء");
      return;
    }

    try {
      const { error } = await supabase
        .from("content_reports")
        .update({ status: "rejected" })
        .eq("id", id);

      if (error) throw error;

      toast.success("تم رفض البلاغ والإبقاء على المحتوى");
      setShowReportDetails(false);
      fetchReports();
    } catch (error: any) {
      console.error("Error rejecting report:", error);
      toast.error(`حدث خطأ أثناء معالجة البلاغ: ${error.message}`);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "post":
        return <FileText className="h-4 w-4 mr-2" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case "profile":
        return <User className="h-4 w-4 mr-2" />;
      case "service":
        return <Tag className="h-4 w-4 mr-2" />;
      default:
        return <Tag className="h-4 w-4 mr-2" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const filteredReports = reports.filter((report) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      report.reason.toLowerCase().includes(searchLower) ||
      report.reported_user_name.toLowerCase().includes(searchLower) ||
      report.reporter_name.toLowerCase().includes(searchLower) ||
      report.content_preview.toLowerCase().includes(searchLower)
    );
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار";
      case "approved":
        return "تم الإزالة";
      case "rejected":
        return "تم الرفض";
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-red-100 text-red-800";
      case "rejected":
        return "bg-green-100 text-green-800";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-bold">إدارة المحتوى المبلغ عنه</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="بحث..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[200px]"
          />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
              <TabsTrigger value="approved">تمت الإزالة</TabsTrigger>
              <TabsTrigger value="rejected">تم الرفض</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>النوع</TableHead>
            <TableHead>سبب البلاغ</TableHead>
            <TableHead>المستخدم المُبلغ</TableHead>
            <TableHead>المستخدم المُبلغ عنه</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <div className="flex justify-center">جاري تحميل البلاغات...</div>
              </TableCell>
            </TableRow>
          ) : filteredReports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                لا توجد بلاغات مطابقة لمعايير البحث
              </TableCell>
            </TableRow>
          ) : (
            filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="flex items-center">
                  {getContentTypeIcon(report.content_type)}
                  <span>
                    {report.content_type === "post" && "منشور"}
                    {report.content_type === "comment" && "تعليق"}
                    {report.content_type === "profile" && "ملف شخصي"}
                    {report.content_type === "service" && "خدمة"}
                  </span>
                </TableCell>
                <TableCell>{report.reason}</TableCell>
                <TableCell>{report.reporter_name}</TableCell>
                <TableCell>{report.reported_user_name}</TableCell>
                <TableCell>{formatDate(report.created_at)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusClass(report.status)}
                  >
                    {getStatusText(report.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewReport(report)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {report.status === "pending" && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-green-600"
                          onClick={() => handleRejectReport(report.id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleApproveReport(report.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={showReportDetails} onOpenChange={setShowReportDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تفاصيل البلاغ</DialogTitle>
            <DialogDescription>
              مراجعة المحتوى المبلغ عنه واتخاذ الإجراء المناسب
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">نوع المحتوى:</div>
                <div className="flex items-center">
                  {getContentTypeIcon(selectedReport.content_type)}
                  <span>
                    {selectedReport.content_type === "post" && "منشور"}
                    {selectedReport.content_type === "comment" && "تعليق"}
                    {selectedReport.content_type === "profile" && "ملف شخصي"}
                    {selectedReport.content_type === "service" && "خدمة"}
                  </span>
                </div>

                <div className="font-medium">تاريخ البلاغ:</div>
                <div>{formatDate(selectedReport.created_at)}</div>

                <div className="font-medium">المُبلغ:</div>
                <div>{selectedReport.reporter_name}</div>

                <div className="font-medium">المُبلغ عنه:</div>
                <div>{selectedReport.reported_user_name}</div>

                <div className="font-medium">سبب البلاغ:</div>
                <div>{selectedReport.reason}</div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">المحتوى:</div>
                <div className="p-3 border rounded-md bg-muted/30">
                  {selectedReport.content_preview}
                </div>
              </div>

              {selectedReport.status === "pending" && (
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => handleRejectReport(selectedReport.id)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span>رفض البلاغ</span>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleApproveReport(selectedReport.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>إزالة المحتوى</span>
                  </Button>
                </DialogFooter>
              )}

              {selectedReport.status !== "pending" && (
                <div className="p-3 rounded-md bg-muted text-center">
                  تم معالجة هذا البلاغ بالفعل
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
