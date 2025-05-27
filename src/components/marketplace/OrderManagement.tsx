
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar, User, MessageSquare, DollarSign } from "lucide-react";

interface Order {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  hours: number;
  total_price: number;
  message?: string;
  created_at: string;
  listing_title: string;
  buyer_name: string;
  seller_name: string;
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      // This would be a proper SQL query with joins in a real implementation
      const mockOrders: Order[] = [
        {
          id: "1",
          listing_id: "listing-1",
          buyer_id: "buyer-1",
          seller_id: user.id,
          status: "pending",
          hours: 2,
          total_price: 100,
          message: "أحتاج مساعدة في حل واجب الرياضيات",
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          listing_title: "تدريس الرياضيات",
          buyer_name: "أحمد محمد",
          seller_name: "أنت",
        },
        {
          id: "2",
          listing_id: "listing-2",
          buyer_id: user.id,
          seller_id: "seller-1",
          status: "accepted",
          hours: 3,
          total_price: 150,
          message: "أريد تعلم البرمجة من الصفر",
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          listing_title: "تعليم البرمجة",
          buyer_name: "أنت",
          seller_name: "سارة أحمد",
        },
      ];

      setOrders(mockOrders);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      // Update order status in database
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: status as any } : order
      ));
      
      toast.success(`تم تحديث حالة الطلب إلى ${status}`);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث الطلب");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "accepted": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "قيد الانتظار";
      case "accepted": return "مقبول";
      case "completed": return "مكتمل";
      case "cancelled": return "ملغي";
      default: return status;
    }
  };

  if (loading) {
    return <div className="p-6 text-center">جاري تحميل الطلبات...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الطلبات</h2>
        <Badge variant="outline">{orders.length} طلب</Badge>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">لا توجد طلبات حالياً</p>
          </CardContent>
        </Card>
      ) : (
        orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.listing_title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {order.buyer_id === user?.id ? order.seller_name : order.buyer_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDistanceToNow(new Date(order.created_at), { 
                        addSuffix: true, 
                        locale: ar 
                      })}
                    </div>
                  </div>
                </div>
                <Badge className={`${getStatusColor(order.status)} text-white`}>
                  {getStatusText(order.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.message && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="font-medium">رسالة العميل:</span>
                    </div>
                    <p className="text-sm">{order.message}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{order.total_price} ريال</span>
                    </div>
                    <div>
                      <span>{order.hours} ساعة</span>
                    </div>
                  </div>
                  
                  {order.status === "pending" && order.seller_id === user?.id && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "cancelled")}
                      >
                        رفض
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "accepted")}
                      >
                        قبول
                      </Button>
                    </div>
                  )}
                  
                  {order.status === "accepted" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, "completed")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      تم الإنجاز
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
