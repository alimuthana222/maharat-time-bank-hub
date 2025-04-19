
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";

export function DashboardServices() {
  const [services, setServices] = useState([
    {
      id: "1",
      title: "تطوير واجهات المستخدم",
      category: "برمجة",
      description: "تصميم وتطوير واجهات مستخدم تفاعلية باستخدام React و TypeScript.",
      hourlyRate: 3,
      isActive: true,
    },
    {
      id: "2",
      title: "تطوير تطبيقات الجوال",
      category: "برمجة",
      description: "إنشاء تطبيقات للهواتف الذكية باستخدام React Native.",
      hourlyRate: 4,
      isActive: true,
    },
    {
      id: "3",
      title: "تصميم قواعد البيانات",
      category: "برمجة",
      description: "تصميم وإدارة قواعد البيانات العلائقية باستخدام PostgreSQL و MySQL.",
      hourlyRate: 3,
      isActive: false,
    },
  ]);

  const toggleServiceStatus = (id: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">خدماتي المقدمة</h2>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          إضافة خدمة جديدة
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {services.map((service) => (
          <Card key={service.id} className={`transition-opacity ${!service.isActive ? 'opacity-70' : ''}`}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <Badge variant="outline" className="mt-1 bg-primary/10">
                  {service.category}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id={`active-${service.id}`} 
                    checked={service.isActive}
                    onCheckedChange={() => toggleServiceStatus(service.id)}
                  />
                  <Label htmlFor={`active-${service.id}`}>{service.isActive ? 'نشط' : 'غير نشط'}</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{service.description}</p>
              <div className="mt-4 flex items-center">
                <span className="font-medium">{service.hourlyRate} ساعة</span>
                <span className="mx-2 text-muted-foreground">/</span>
                <span className="text-muted-foreground">الساعة</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  تعديل
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  حذف
                </Button>
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                معاينة
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
