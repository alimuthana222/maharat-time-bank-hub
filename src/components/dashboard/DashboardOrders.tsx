
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, MessageSquare, X } from "lucide-react";

// Sample orders data
const orders = [
  {
    id: "OR-001",
    title: "مساعدة في مشروع تخرج",
    client: "سارة العتيبي",
    status: "pending",
    date: "2025-04-15",
    category: "برمجة",
    hourlyRate: 3,
    estimatedHours: 5,
  },
  {
    id: "OR-002",
    title: "ترجمة بحث علمي",
    client: "خالد محمد",
    status: "inProgress",
    date: "2025-04-10",
    category: "ترجمة",
    hourlyRate: 2,
    estimatedHours: 3,
  },
  {
    id: "OR-003",
    title: "تصميم عرض تقديمي",
    client: "نورة السالم",
    status: "completed",
    date: "2025-04-05",
    category: "تصميم",
    hourlyRate: 2,
    estimatedHours: 2,
    completedHours: 3,
  },
  {
    id: "OR-004",
    title: "شرح مادة الإحصاء",
    client: "فهد العتيبي",
    status: "completed",
    date: "2025-04-01",
    category: "تدريس",
    hourlyRate: 3,
    estimatedHours: 8,
    completedHours: 8,
  },
  {
    id: "OR-005",
    title: "تنسيق وتحرير بحث",
    client: "هدى الزهراني",
    status: "cancelled",
    date: "2025-03-20",
    category: "تحرير",
    hourlyRate: 2,
    estimatedHours: 4,
  },
];

export function DashboardOrders() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">قيد الانتظار</Badge>;
      case "inProgress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">قيد التنفيذ</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800">مكتمل</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800">ملغي</Badge>;
      default:
        return <Badge variant="outline">غير معروف</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">إدارة الطلبات</h2>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
          <TabsTrigger value="inProgress">قيد التنفيذ</TabsTrigger>
          <TabsTrigger value="completed">مكتملة</TabsTrigger>
          <TabsTrigger value="cancelled">ملغية</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {orders.filter(o => o.status === "pending").map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
        
        <TabsContent value="inProgress" className="space-y-4">
          {orders.filter(o => o.status === "inProgress").map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {orders.filter(o => o.status === "completed").map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
        
        <TabsContent value="cancelled" className="space-y-4">
          {orders.filter(o => o.status === "cancelled").map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface OrderCardProps {
  order: {
    id: string;
    title: string;
    client: string;
    status: string;
    date: string;
    category: string;
    hourlyRate: number;
    estimatedHours: number;
    completedHours?: number;
  };
}

function OrderCard({ order }: OrderCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">قيد الانتظار</Badge>;
      case "inProgress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">قيد التنفيذ</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800">مكتمل</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800">ملغي</Badge>;
      default:
        return <Badge variant="outline">غير معروف</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">{order.title}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">#{order.id}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{order.date}</span>
          </div>
        </div>
        {getStatusBadge(order.status)}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">العميل</p>
            <p className="font-medium">{order.client}</p>
          </div>
          <div>
            <p className="text-muted-foreground">التصنيف</p>
            <p className="font-medium">{order.category}</p>
          </div>
          <div>
            <p className="text-muted-foreground">المعدل بالساعة</p>
            <p className="font-medium">{order.hourlyRate} ساعة</p>
          </div>
          <div>
            <p className="text-muted-foreground">الساعات المقدرة</p>
            <p className="font-medium">{order.estimatedHours} ساعة</p>
          </div>
          <div>
            <p className="text-muted-foreground">الإجمالي المتوقع</p>
            <p className="font-medium">{order.hourlyRate * order.estimatedHours} ساعة</p>
          </div>
          {order.completedHours && (
            <div>
              <p className="text-muted-foreground">الساعات الفعلية</p>
              <p className="font-medium">{order.completedHours} ساعة</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-2">
          {order.status === "pending" && (
            <>
              <Button variant="default" size="sm">
                <Check className="h-4 w-4 mr-1" />
                قبول
              </Button>
              <Button variant="destructive" size="sm">
                <X className="h-4 w-4 mr-1" />
                رفض
              </Button>
            </>
          )}
          {order.status === "inProgress" && (
            <Button variant="default" size="sm">
              <Check className="h-4 w-4 mr-1" />
              إكمال الطلب
            </Button>
          )}
        </div>
        <Button variant="ghost" size="sm">
          <MessageSquare className="h-4 w-4 mr-1" />
          تواصل
        </Button>
      </CardFooter>
    </Card>
  );
}
