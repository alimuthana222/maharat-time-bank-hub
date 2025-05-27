
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { Star, Clock, TrendingUp } from "lucide-react";

export function DashboardHeader() {
  const { user } = useAuth();

  const stats = [
    {
      title: "الرصيد الحالي",
      value: "12",
      unit: "ساعة",
      icon: Clock,
      color: "text-blue-600"
    },
    {
      title: "التقييم",
      value: "4.8",
      unit: "من 5",
      icon: Star,
      color: "text-yellow-600"
    },
    {
      title: "النمو الشهري",
      value: "+15%",
      unit: "مقارنة بالشهر السابق",
      icon: TrendingUp,
      color: "text-green-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage 
              src={user?.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${user?.email}`} 
              alt={user?.user_metadata?.full_name || user?.user_metadata?.username || "المستخدم"} 
            />
            <AvatarFallback>
              {(user?.user_metadata?.full_name || user?.user_metadata?.username || "م").charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              مرحباً، {user?.user_metadata?.full_name || user?.user_metadata?.username || "مستخدم"}
            </h1>
            <p className="text-muted-foreground">
              {user?.user_metadata?.university || "طالب جامعي"}
            </p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">عضو نشط</Badge>
              <Badge variant="outline">تم التحقق</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">{stat.unit}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
