
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Flag, MessageSquareWarning, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function ModeratorDashboard() {
  useEffect(() => {
    document.title = "لوحة المشرف | مهارات";
  }, []);

  const handleApproveContent = (id: string) => {
    toast.success(`تم الموافقة على المحتوى #${id}`);
  };

  const handleRejectContent = (id: string) => {
    toast.success(`تم رفض المحتوى #${id}`);
  };

  const reportedContent = [
    {
      id: "123",
      title: "منشور غير لائق",
      reportedBy: "أحمد محمد",
      reportReason: "محتوى غير مناسب",
      date: "2025-04-21"
    },
    {
      id: "124",
      title: "تعليق مسيء",
      reportedBy: "خالد العمري",
      reportReason: "إساءة لمستخدم آخر",
      date: "2025-04-20"
    },
    {
      id: "125",
      title: "إعلان مخالف",
      reportedBy: "سارة عبدالله",
      reportReason: "محتوى مضلل",
      date: "2025-04-18"
    }
  ];

  const pendingContent = [
    {
      id: "223",
      title: "طلب مراجعة مهارة",
      submittedBy: "محمد أحمد",
      type: "مهارة",
      date: "2025-04-22"
    },
    {
      id: "224",
      title: "طلب مراجعة إعلان",
      submittedBy: "نورة سعد",
      type: "إعلان",
      date: "2025-04-21"
    }
  ];

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">لوحة مشرف المحتوى</h1>
          <p className="text-muted-foreground mt-2">إدارة ومراجعة محتوى المنصة</p>
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              <span>المحتوى المبلغ عنه</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span>مراجعة المحتوى</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-destructive" />
                  <span>المحتوى المبلغ عنه</span>
                </CardTitle>
                <CardDescription>مراجعة وتقييم المحتوى المبلغ عنه من قبل المستخدمين</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportedContent.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <span className="text-sm text-muted-foreground">{item.date}</span>
                      </div>
                      <div className="text-sm mb-3">
                        <span className="text-muted-foreground">أبلغ عنه:</span> {item.reportedBy}
                      </div>
                      <div className="text-sm mb-4">
                        <span className="text-muted-foreground">سبب البلاغ:</span> {item.reportReason}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleApproveContent(item.id)} className="flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          <span>محتوى مقبول</span>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRejectContent(item.id)} className="flex items-center gap-2">
                          <MessageSquareWarning className="h-4 w-4" />
                          <span>إزالة المحتوى</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-amber-500" />
                  <span>مراجعة المحتوى</span>
                </CardTitle>
                <CardDescription>مراجعة المهارات والإعلانات قبل نشرها</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingContent.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <span className="text-sm text-muted-foreground">{item.date}</span>
                      </div>
                      <div className="text-sm mb-3">
                        <span className="text-muted-foreground">قدمه:</span> {item.submittedBy}
                      </div>
                      <div className="text-sm mb-4">
                        <span className="text-muted-foreground">النوع:</span> {item.type}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleApproveContent(item.id)} className="flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          <span>موافقة</span>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRejectContent(item.id)} className="flex items-center gap-2">
                          <MessageSquareWarning className="h-4 w-4" />
                          <span>رفض</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
