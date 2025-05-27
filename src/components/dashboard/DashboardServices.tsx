
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { ResponsiveGrid } from "@/components/ui/mobile-responsive";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  hourlyRate: number;
  status: "active" | "paused" | "draft";
  orders: number;
  rating: number;
  createdAt: string;
}

export function DashboardServices() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      title: "تدريس الرياضيات",
      description: "دروس خصوصية في الرياضيات لجميع المراحل الدراسية",
      category: "تدريس",
      hourlyRate: 2,
      status: "active",
      orders: 15,
      rating: 4.8,
      createdAt: "2024-01-01"
    },
    {
      id: "2",
      title: "تصميم الشعارات",
      description: "تصميم شعارات احترافية للشركات والمشاريع",
      category: "تصميم",
      hourlyRate: 3,
      status: "active",
      orders: 8,
      rating: 4.9,
      createdAt: "2024-01-05"
    },
    {
      id: "3",
      title: "مراجعة الأبحاث",
      description: "مراجعة وتدقيق الأبحاث العلمية والأكاديمية",
      category: "كتابة",
      hourlyRate: 1,
      status: "paused",
      orders: 3,
      rating: 4.7,
      createdAt: "2024-01-10"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "paused":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "draft":
        return "bg-gray-500/10 text-gray-600 border-gray-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "نشط";
      case "paused":
        return "متوقف";
      case "draft":
        return "مسودة";
      default:
        return "غير معروف";
    }
  };

  const handleStatusChange = (serviceId: string, newStatus: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId ? { ...service, status: newStatus as any } : service
    ));
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">خدماتي</h2>
          <p className="text-muted-foreground">إدارة الخدمات التي تقدمها</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          إضافة خدمة جديدة
        </Button>
      </div>

      <ResponsiveGrid cols={{ default: 1, md: 2, lg: 3 }}>
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{service.category}</p>
                </div>
                <Badge variant="outline" className={getStatusColor(service.status)}>
                  {getStatusText(service.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {service.description}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <span>{service.hourlyRate} ساعة/جلسة</span>
                <span>{service.orders} طلب</span>
                <span>⭐ {service.rating}</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  عرض
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  تعديل
                </Button>
              </div>

              <div className="flex gap-2">
                {service.status === "active" ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleStatusChange(service.id, "paused")}
                  >
                    إيقاف مؤقت
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleStatusChange(service.id, "active")}
                  >
                    تفعيل
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleDeleteService(service.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </ResponsiveGrid>

      {services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">لم تقم بإنشاء أي خدمات بعد</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إنشاء خدمة جديدة
          </Button>
        </div>
      )}
    </div>
  );
}
