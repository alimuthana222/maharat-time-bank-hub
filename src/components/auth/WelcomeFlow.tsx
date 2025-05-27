
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Users, BookOpen, Clock, MessageSquare } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "بنك المهارات",
    description: "شارك مهاراتك واكتسب مهارات جديدة من الآخرين",
    path: "/marketplace"
  },
  {
    icon: Clock,
    title: "بنك الوقت",
    description: "اربح واستخدم الساعات مقابل تبادل المهارات",
    path: "/timebank"
  },
  {
    icon: MessageSquare,
    title: "المجتمع",
    description: "تواصل مع الطلاب وشارك في النقاشات",
    path: "/community"
  },
  {
    icon: Users,
    title: "الفعاليات",
    description: "احضر ونظم فعاليات تعليمية وتطويرية",
    path: "/events"
  }
];

export function WelcomeFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  const handleExploreFeature = (path: string) => {
    navigate(path);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">مرحباً بك في منصة مهارات!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              تم إنشاء حسابك بنجاح. اكتشف الآن ما يمكنك فعله على المنصة:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4" onClick={() => handleExploreFeature(feature.path)}>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button onClick={handleGetStarted} size="lg" className="gap-2">
              ابدأ الآن
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              نصيحة: يمكنك الوصول لهذه الميزات في أي وقت من لوحة التحكم
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
