import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Eye, MessageSquare, Trash2, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

interface Report {
  id: string;
  reporter_id: string;
  reporter_name?: string;
  reported_user_id: string;
  reported_user_name?: string;
  content_id: string;
  content_type: "post" | "comment" | "profile" | "service";
  reason: string;
  details?: string;
  content_preview?: string;
  status: "pending" | "resolved" | "rejected";
  created_at: string;
}

export function ReportManagement() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [viewReportDetails, setViewReportDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("pending");
  const { user, isModerator } = useAuth();

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
            .select("username, full_name")
            .eq("id", report.reporter_id)
            .single();

          // Get reported user name
          const { data: reportedUserData } = await supabase
            .from("profiles")
            .select("username, full_name")
            .eq("id", report.reported_user_id)
            .single();

          // Get content preview based on content type
          let contentPreview = "";
          if (report.content_type === "post" || report.content_type === "comment") {
            const { data: contentData } = await supabase
              .from(report.content_type === "post" ? "posts" : "comments")
              .select("content")
              .eq("id", report.content_id)
              .single();
            contentPreview = contentData?.content || "";
          } else if (report.content_type === "profile") {
            contentPreview = "محتوى غير مناسب في الملف الشخصي";
          } else if (report.content_type === "service") {
            const { data: serviceData } = await supabase
              .from("skills")
              .select("title, description")
              .eq("id", report.content_id)
              .single();
            contentPreview = serviceData ? `${serviceData.title}: ${serviceData.description}` : "";
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
    setViewReportDetails(true);
  };

  const handleResolveReport = async (id: string, action: "resolve" | "reject") => {
    if (!isModerator()) {
      toast.error("ليس لديك صلاحية لتنفيذ هذا الإجراء");
      return;
    }

    try {
      const { error } = await supabase
        .from("content_reports")
        .update({ status: action === "resolve" ? "resolved" : "rejected" })
        .eq("id", id);

      if (error) throw error;

      // If we're resolving a report and it's about content (not a profile), we might also want to hide/delete the reported content
      if (action === "resolve" && selectedReport) {
        // This is where we would add additional logic to hide/delete content if needed
        if (selectedReport.content_type === "post" || selectedReport.content_type === "comment") {
          await supabase
            .from(selectedReport.content_type === "post" ? "posts" : "comments")
            .update({ is_hidden: true })
            .eq("id", selectedReport.content_id);
        }
      }

      toast.success(
        action === "resolve"
          ? "تم تأكيد البلاغ وإخفاء المحتوى المخالف"
          : "تم رفض البلاغ"
      );

      // Close dialog and refresh reports
      setViewReportDetails(false);
      fetchReports();
    } catch (error) {
      console.error("Error handling report:", error);
      toast.error("حدث خطأ أثناء معالجة البلاغ");
    }
  };

  const formatReasonText = (reason: string) => {
    const reasonMap: Record<string, string> = {
      inappropriate: "محتوى غير لائق",
      harassment: "تحرش أو مضايقة",
      spam: "محتوى دعائي مزعج",
      misleading: "معلومات مضللة",
      hate_speech: "خطاب كراهية",
      violence: "تحريض على العنف",
      other: "سبب آخر",
    };

    return reasonMap[reason] || reason;
  };

  const formatContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case "post":
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case "profile":
        return <User className="h-4 w-4 mr-2" />;
      case "service":
        return <MessageSquare className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const formatContentTypeText = (contentType: string) => {
    const typeMap: Record<string, string> = {
      post: "منشور",
      comment: "تعليق",
      profile: "ملف شخصي",
      service: "خدمة",
    };

    return typeMap[contentType] || contentType;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <span>إدارة البلاغات</span>
        </CardTitle>
        <CardDescription>مراجعة بلاغات المستخدمين واتخاذ الإجراءات المناسبة</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
            <TabsTrigger value="resolved">تم الحل</TabsTrigger>
            <TabsTrigger value="all">الكل</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="py-10 text-center text-muted-foreground">جاري تحميل البيانات...</div>
          ) : reports.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">لا توجد بلاغات</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>النوع</TableHead>
                  <TableHead>السبب</TableHead>
                  <TableHead>المُبلِغ</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="flex items-center">
                      {formatContentTypeIcon(report.content_type)}
                      <span>{formatContentTypeText(report.content_type)}</span>
                    </TableCell>
                    <TableCell>{formatReasonText(report.reason)}</TableCell>
                    <TableCell>{report.reporter_name}</TableCell>
                    <TableCell>{formatDate(report.created_at)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`
                          ${report.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                          ${report.status === "resolved" ? "bg-green-100 text-green-800" : ""}
                          ${report.status === "rejected" ? "bg-red-100 text-red-800" : ""}
                        `}
                      >
                        {report.status === "pending" && "قيد المراجعة"}
                        {report.status === "resolved" && "تم الحل"}
                        {report.status === "rejected" && "تم الرفض"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
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
                              onClick={() => handleResolveReport(report.id, "resolve")}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleResolveReport(report.id, "reject")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Tabs>

        {/* Report Details Dialog */}
        <Dialog open={viewReportDetails} onOpenChange={setViewReportDetails}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>تفاصيل البلاغ</DialogTitle>
              <DialogDescription>مراجعة محتوى البلاغ واتخاذ الإجراء المناسب</DialogDescription>
            </DialogHeader>

            {selectedReport && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">نوع المحتوى:</div>
                  <div className="flex items-center">
                    {formatContentTypeIcon(selectedReport.content_type)}
                    {formatContentTypeText(selectedReport.content_type)}
                  </div>

                  <div className="font-medium">تاريخ البلاغ:</div>
                  <div>{formatDate(selectedReport.created_at)}</div>

                  <div className="font-medium">المُبلِغ:</div>
                  <div>{selectedReport.reporter_name}</div>

                  <div className="font-medium">المُبلَغ عنه:</div>
                  <div>{selectedReport.reported_user_name}</div>

                  <div className="font-medium">سبب البلاغ:</div>
                  <div>{formatReasonText(selectedReport.reason)}</div>
                </div>

                {selectedReport.details && (
                  <div className="space-y-2">
                    <div className="font-medium">تفاصيل إضافية:</div>
                    <div className="p-3 border rounded-md bg-muted/30">{selectedReport.details}</div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="font-medium">محتوى البلاغ:</div>
                  <div className="p-3 border rounded-md bg-muted/30">
                    {selectedReport.content_preview}
                  </div>
                </div>

                {selectedReport.status === "pending" ? (
                  <DialogFooter className="flex justify-between">
                    <Button
                      variant="destructive"
                      onClick={() => handleResolveReport(selectedReport.id, "resolve")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      تأكيد البلاغ وإخفاء المحتوى
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleResolveReport(selectedReport.id, "reject")}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      رفض البلاغ
                    </Button>
                  </DialogFooter>
                ) : (
                  <div className="p-3 rounded-md bg-muted text-center">
                    تمت معالجة هذا البلاغ بالفعل
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
