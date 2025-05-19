
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";
import { formatDateForInput } from "@/lib/date-utils";

export function TimeBankExport() {
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [format, setFormat] = useState<string>("csv");
  const [includeFields, setIncludeFields] = useState({
    transactionId: true,
    description: true,
    hours: true,
    status: true,
    provider: true,
    recipient: true,
    date: true,
  });

  const handleExport = () => {
    // In a real app, this would trigger an API call to generate the export
    // For demo, we'll just show a success message
    toast.success("تم تصدير البيانات بنجاح");
    
    // Simulate file download
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8,");
    element.setAttribute("download", `timebank-export-${formatDateForInput(startDate)}-to-${formatDateForInput(endDate)}.${format}`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>تصدير بيانات بنك الوقت</CardTitle>
        <CardDescription>
          قم بتصدير بيانات معاملات بنك الوقت بتنسيق CSV أو Excel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>تاريخ البداية</Label>
            <DatePicker date={startDate} setDate={setStartDate} />
          </div>
          <div className="space-y-2">
            <Label>تاريخ النهاية</Label>
            <DatePicker date={endDate} setDate={setEndDate} />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>تنسيق الملف</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue placeholder="اختر تنسيق الملف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="xlsx">Excel</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <Label>الحقول المضمّنة</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="transaction-id"
                checked={includeFields.transactionId}
                onCheckedChange={(checked) => 
                  setIncludeFields({...includeFields, transactionId: !!checked})
                }
              />
              <Label htmlFor="transaction-id">رقم المعاملة</Label>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="description"
                checked={includeFields.description}
                onCheckedChange={(checked) => 
                  setIncludeFields({...includeFields, description: !!checked})
                }
              />
              <Label htmlFor="description">الوصف</Label>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="hours"
                checked={includeFields.hours}
                onCheckedChange={(checked) => 
                  setIncludeFields({...includeFields, hours: !!checked})
                }
              />
              <Label htmlFor="hours">عدد الساعات</Label>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="status"
                checked={includeFields.status}
                onCheckedChange={(checked) => 
                  setIncludeFields({...includeFields, status: !!checked})
                }
              />
              <Label htmlFor="status">الحالة</Label>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="provider"
                checked={includeFields.provider}
                onCheckedChange={(checked) => 
                  setIncludeFields({...includeFields, provider: !!checked})
                }
              />
              <Label htmlFor="provider">المزود</Label>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="recipient"
                checked={includeFields.recipient}
                onCheckedChange={(checked) => 
                  setIncludeFields({...includeFields, recipient: !!checked})
                }
              />
              <Label htmlFor="recipient">المستلم</Label>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="date"
                checked={includeFields.date}
                onCheckedChange={(checked) => 
                  setIncludeFields({...includeFields, date: !!checked})
                }
              />
              <Label htmlFor="date">التاريخ</Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleExport} className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" />
          تصدير البيانات
        </Button>
      </CardFooter>
    </Card>
  );
}
