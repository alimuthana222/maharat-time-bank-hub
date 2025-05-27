
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Star, Clock, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface Order {
  id: string;
  title: string;
  client: {
    name: string;
    avatar?: string;
    rating: number;
  };
  status: "pending" | "active" | "completed" | "cancelled";
  hours: number;
  totalPrice: number;
  dueDate: string;
  createdAt: string;
  description: string;
}

export function DashboardOrders() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      title: "جلسة تدريس رياضيات",
      client: {
        name: "أحمد محمد",
        avatar: "https://i.pravatar.cc/150?u=ahmed",
        rating: 4.8
      },
      status: "pending",
      hours: 2,
      totalPrice: 4,
      dueDate: "2024-01-20",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      description: "جلسة تدريس رياضيات للمرحلة الثانوية - الجبر والهندسة"
    },
    {
      id: "2",
      title: "تصميم شعار شركة",
      client: {
        name: "سارة أحمد",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        rating: 4.9
      },
      status: "active",
      hours: 5,
      totalPrice: 15,
      dueDate: "2024-01-25",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      description: "تصميم شعار احترافي لشركة ناشئة في مجال التقنية"
    },
    {
      id: "3",
      title: "مراجعة بحث تخرج",
      client: {
        name: "محمد عبدالله",
        avatar: "https://i.pravatar.cc/150?u=mohammed",
        rating: 4.7
      },
      status: "completed",
      hours: 3,
      totalPrice: 9,
      dueDate: "2024-01-15",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      description: "مراجعة وتدقيق بحث تخرج في مجال الهندسة"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "active":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار";
      case "active":
        return "قيد التنفيذ";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      default:
        return "غير معروف";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "active":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ));
  };

  const pendingOrders = orders.filter(order => order.status === "pending");
  const activeOrders = orders.filter(order => order.status === "active");
  const completedOrders = orders.filter(order => order.status === "completed");

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={order.client.avatar} alt={order.client.name} />
              <AvatarFallback>{order.client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{order.title}</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{order.client.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{order.client.rating}</span>
                </div>
              </div>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(order.status)}>
            {getStatusIcon(order.status)}
            <span className="mr-1">{getStatusText(order.status)}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{order.description}</p>
        
        <div className="flex items-center justify-between text-sm">
          <span>{order.hours} ساعة</span>
          <span className="font-medium">{order.totalPrice} ساعة (إجمالي)</span>
          <span className="text-muted-foreground">
            التسليم: {new Date(order.dueDate).toLocaleDateString('ar-SA')}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ar })}
          </span>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              رسالة
            </Button>
            
            {order.status === "pending" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleStatusUpdate(order.id, "cancelled")}
                >
                  رفض
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(order.id, "active")}
                >
                  قبول
                </Button>
              </>
            )}
            
            {order.status === "active" && (
              <Button
                size="sm"
                onClick={() => handleStatusUpdate(order.id, "completed")}
              >
                إكمال
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">طلباتي</h2>
        <p className="text-muted-foreground">
          تابع وأدر الطلبات الواردة لخدماتك
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">جميع الطلبات ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">قيد الانتظار ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="active">نشط ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">مكتمل ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">لا توجد طلبات بعد</p>
            </div>
          ) : (
            <div>
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {pendingOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">لا توجد طلبات قيد الانتظار</p>
            </div>
          ) : (
            <div>
              {pendingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          {activeOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">لا توجد طلبات نشطة</p>
            </div>
          ) : (
            <div>
              {activeOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">لم تكمل أي طلبات بعد</p>
            </div>
          ) : (
            <div>
              {completedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
