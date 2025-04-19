
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageSquare, Settings, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  // Sample user data (would come from authentication in a real app)
  const user = {
    name: "أحمد محمد",
    university: "جامعة الملك سعود",
    avatarUrl: "/placeholder.svg",
    balance: 45,
    notifications: 3,
    messages: 5,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 border rounded-lg bg-card shadow-sm">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="object-cover"
            />
          </Avatar>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold">مرحباً، {user.name}</h1>
              <p className="text-muted-foreground">{user.university}</p>
            </div>
            
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Button variant="outline" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {user.notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                    {user.notifications}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" size="icon" className="relative">
                <MessageSquare className="w-5 h-5" />
                {user.messages > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                    {user.messages}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground">رصيد المحفظة</p>
              <h3 className="text-2xl font-bold mt-1">{user.balance} ساعة</h3>
            </div>
            <Wallet className="w-8 h-8 text-primary opacity-80" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground">خدمات نشطة</p>
              <h3 className="text-2xl font-bold mt-1">3</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="font-bold">3</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground">طلبات قيد التنفيذ</p>
              <h3 className="text-2xl font-bold mt-1">2</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="font-bold">2</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
