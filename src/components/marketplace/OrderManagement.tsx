
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, XCircle, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface Order {
  id: string;
  title: string;
  description: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  hours: number;
  totalPrice: number;
  createdAt: string;
  client: {
    name: string;
    avatar?: string;
  };
  provider: {
    name: string;
    avatar?: string;
  };
  type: "sent" | "received";
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      title: "تدريس الرياضيات",
      description: "جلسة تدريس رياضيات للمرحلة الثانوية",
      status: "pending",
      hours: 2,
      totalPrice: 4,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      client: {
        name: "أحمد محمد",
        avatar: "https://i.pravatar.cc/150?u=ahmed"
      },
      provider: {
        name: "أنت",
        avatar: "https://i.pravatar.cc/150?u=you"
      },
      type: "received"
    },
    {
      id: "2",
      title: "تصميم موقع ويب",
      description: "تصميم موقع شخصي بسيط",
      status: "in_progress",
      hours: 5,
      totalPrice: 15,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      client: {
        name: "أنت",
        avatar: "https://i.pravatar.cc/150?u=you"
      },
      provider: {
        name: "سارة أحمد",
        avatar: "https://i.pravatar.cc/150?u=sarah"
      },
      type: "sent"
    },
    {
      id: "3",
      title: "مراجعة بحث علمي",
      description: "مراجعة وتدقيق بحث تخرج",
      status: "completed",
      hours: 3,
      totalPrice: 9,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      client: {
        name: "أنت",
        avatar: "https://i.pravatar.cc/150?u=you"
      },
      provider: {
        name: "د. خالد العمري",
        avatar: "https://i.pravatar.cc/150?u=khalid"
      },
      type: "sent"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "accepted":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "in_progress":
        return "bg-purple-500/10 text-purple-600 border-purple-200";
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
      case "accepted":
        return "تم القبول";
      case "in_progress":
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
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ));
  };

  const sentOrders = orders.filter(order => order.type === "sent");
  const receivedOrders = orders.filter(order => order.type === "received");

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={order.type === "sent" ? order.provider.avatar : order.client.avatar} 
                alt={order.type === "sent" ? order.provider.name : order.client.name} 
              />
              <AvatarFallback>
                {(order.type === "sent" ? order.provider.name : order.client.name).charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{order.title}</h3>
              <p className="text-sm text-muted-foreground">
                {order.type === "sent" ? `مع ${order.provider.name}` : `من ${order.client.name}`}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(order.status)}>
            {getStatusIcon(order.status)}
            <span className="mr-1">{getStatusText(order.status)}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3">{order.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4 text-sm">
            <span>{order.hours} ساعة</span>
            <span className="font-medium">{order.totalPrice} ساعة (إجمالي)</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ar })}
          </span>
        </div>

        {order.type === "received" && order.status === "pending" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate(order.id, "cancelled")}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              رفض
            </Button>
            <Button
              size="sm"
              onClick={() => handleStatusUpdate(order.id, "accepted")}
            >
              قبول
            </Button>
          </div>
        )}

        {order.status === "accepted" && (
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(order.id, "in_progress")}
            className="w-full"
          >
            بدء التنفيذ
          </Button>
        )}

        {order.status === "in_progress" && (
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(order.id, "completed")}
            className="w-full"
          >
            إكمال الطلب
          </Button>
        )}

        {order.status === "completed" && order.type === "sent" && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Star className="h-4 w-4 mr-1" />
              تقييم الخدمة
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">إدارة الطلبات</h2>
        <p className="text-muted-foreground">
          تابع حالة طلباتك والطلبات الواردة إليك
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">جميع الطلبات</TabsTrigger>
          <TabsTrigger value="sent">الطلبات المرسلة</TabsTrigger>
          <TabsTrigger value="received">الطلبات الواردة</TabsTrigger>
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

        <TabsContent value="sent" className="mt-6">
          {sentOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">لم ترسل أي طلبات بعد</p>
            </div>
          ) : (
            <div>
              {sentOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="received" className="mt-6">
          {receivedOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">لم تتلق أي طلبات بعد</p>
            </div>
          ) : (
            <div>
              {receivedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
