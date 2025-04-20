
import React, { useState } from 'react';
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface ReportedContent {
  id: string;
  content_id: string;
  content_type: 'post' | 'comment' | 'profile' | 'message';
  reporter_id: string;
  reporter_name: string;
  reported_user_id: string;
  reported_user_name: string;
  reason: string;
  content_preview: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export function ContentModeration() {
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([
    {
      id: '1',
      content_id: 'post-123',
      content_type: 'post',
      reporter_id: 'user-1',
      reporter_name: 'أحمد محمد',
      reported_user_id: 'user-2',
      reported_user_name: 'محمد خالد',
      reason: 'محتوى غير لائق',
      content_preview: 'هذا المنشور يحتوي على محتوى غير مناسب...',
      status: 'pending',
      created_at: '2025-04-15T10:30:00Z'
    },
    {
      id: '2',
      content_id: 'comment-456',
      content_type: 'comment',
      reporter_id: 'user-3',
      reporter_name: 'فاطمة علي',
      reported_user_id: 'user-4',
      reported_user_name: 'سارة أحمد',
      reason: 'تحرش',
      content_preview: 'تعليق يحتوي على تحرش بالمستخدمين...',
      status: 'pending',
      created_at: '2025-04-16T14:20:00Z'
    },
    {
      id: '3',
      content_id: 'profile-789',
      content_type: 'profile',
      reporter_id: 'user-5',
      reporter_name: 'خالد سعيد',
      reported_user_id: 'user-6',
      reported_user_name: 'عمر حسن',
      reason: 'انتحال شخصية',
      content_preview: 'ملف شخصي ينتحل شخصية مشهورة...',
      status: 'pending',
      created_at: '2025-04-17T09:45:00Z'
    }
  ]);
  
  const [selectedReport, setSelectedReport] = useState<ReportedContent | null>(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { user, isAdmin } = useAuth();
  
  // Filter reported content based on filter and search
  const filteredContent = reportedContent.filter(content => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'pending' && content.status === 'pending') ||
                         (filter === 'handled' && content.status !== 'pending') ||
                         filter === content.content_type;
                         
    const matchesSearch = content.reported_user_name.includes(searchQuery) ||
                         content.reporter_name.includes(searchQuery) ||
                         content.content_preview.includes(searchQuery) ||
                         content.reason.includes(searchQuery);
                         
    return matchesFilter && (searchQuery ? matchesSearch : true);
  });
  
  // View report details
  const handleViewReport = (report: ReportedContent) => {
    setSelectedReport(report);
    setShowReportDetails(true);
  };
  
  // Approve content (reject report)
  const handleApproveContent = async (id: string) => {
    if (!isAdmin()) {
      toast.error("ليس لديك صلاحية لتنفيذ هذا الإجراء");
      return;
    }
    
    try {
      // In real implementation, update in database
      const { error } = await supabase
        .from('reported_content')
        .update({ status: 'rejected' })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update state for immediate UI feedback
      setReportedContent(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status: 'rejected' } : item
        )
      );
      
      toast.success("تم رفض البلاغ والموافقة على المحتوى");
      setShowReportDetails(false);
    } catch (error) {
      console.error('Error approving content:', error);
      toast.error("حدث خطأ أثناء معالجة البلاغ");
    }
  };
  
  // Reject content (approve report)
  const handleRejectContent = async (id: string) => {
    if (!isAdmin()) {
      toast.error("ليس لديك صلاحية لتنفيذ هذا الإجراء");
      return;
    }
    
    try {
      // In real implementation, update in database
      const { error } = await supabase
        .from('reported_content')
        .update({ status: 'approved' })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update state for immediate UI feedback
      setReportedContent(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status: 'approved' } : item
        )
      );
      
      toast.success("تم قبول البلاغ وإزالة المحتوى المخالف");
      setShowReportDetails(false);
    } catch (error) {
      console.error('Error rejecting content:', error);
      toast.error("حدث خطأ أثناء معالجة البلاغ");
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <FileText className="h-4 w-4 mr-2" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case 'profile':
        return <User className="h-4 w-4 mr-2" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 mr-2" />;
      default:
        return <Tag className="h-4 w-4 mr-2" />;
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
          
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="تصفية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع البلاغات</SelectItem>
              <SelectItem value="pending">قيد الانتظار</SelectItem>
              <SelectItem value="handled">تمت المعالجة</SelectItem>
              <SelectItem value="post">المنشورات</SelectItem>
              <SelectItem value="comment">التعليقات</SelectItem>
              <SelectItem value="profile">الملفات الشخصية</SelectItem>
              <SelectItem value="message">الرسائل</SelectItem>
            </SelectContent>
          </Select>
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
          {filteredContent.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                لا توجد بلاغات مطابقة لمعايير البحث
              </TableCell>
            </TableRow>
          ) : (
            filteredContent.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="flex items-center">
                  {getContentTypeIcon(report.content_type)}
                  <span>
                    {report.content_type === 'post' && 'منشور'}
                    {report.content_type === 'comment' && 'تعليق'}
                    {report.content_type === 'profile' && 'ملف شخصي'}
                    {report.content_type === 'message' && 'رسالة'}
                  </span>
                </TableCell>
                <TableCell>{report.reason}</TableCell>
                <TableCell>{report.reporter_name}</TableCell>
                <TableCell>{report.reported_user_name}</TableCell>
                <TableCell>{formatDate(report.created_at)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`
                      ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${report.status === 'approved' ? 'bg-red-100 text-red-800' : ''}
                      ${report.status === 'rejected' ? 'bg-green-100 text-green-800' : ''}
                    `}
                  >
                    {report.status === 'pending' && 'قيد الانتظار'}
                    {report.status === 'approved' && 'تمت الإزالة'}
                    {report.status === 'rejected' && 'تم الرفض'}
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
                    {report.status === 'pending' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-green-600"
                          onClick={() => handleApproveContent(report.id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleRejectContent(report.id)}
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
                    {selectedReport.content_type === 'post' && 'منشور'}
                    {selectedReport.content_type === 'comment' && 'تعليق'}
                    {selectedReport.content_type === 'profile' && 'ملف شخصي'}
                    {selectedReport.content_type === 'message' && 'رسالة'}
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
              
              {selectedReport.status === 'pending' && (
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => handleApproveContent(selectedReport.id)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span>رفض البلاغ</span>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleRejectContent(selectedReport.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>إزالة المحتوى</span>
                  </Button>
                </DialogFooter>
              )}
              
              {selectedReport.status !== 'pending' && (
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
