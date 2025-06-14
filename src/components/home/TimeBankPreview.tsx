
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const sampleTransactions = [
  {
    id: 1,
    provider: "أحمد محمد",
    recipient: "سارة أحمد",
    skill: "تدريس الرياضيات",
    hours: 2,
    status: "completed",
    date: "منذ يومين"
  },
  {
    id: 2,
    provider: "خالد العلي",
    recipient: "فاطمة حسن",
    skill: "تطوير الويب",
    hours: 3,
    status: "pending",
    date: "منذ ساعة"
  },
  {
    id: 3,
    provider: "ليلى إبراهيم",
    recipient: "محمد عبدالله",
    skill: "التصميم الجرافيكي",
    hours: 1.5,
    status: "completed",
    date: "أمس"
  }
];

const stats = [
  { label: "إجمالي الساعات المتبادلة", value: "1,247", icon: Clock },
  { label: "المستخدمون النشطون", value: "89", icon: Users },
  { label: "نمو هذا الشهر", value: "+23%", icon: TrendingUp }
];

export function TimeBankPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            بنك الوقت - نظام تبادل الساعات
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ساعد زميلاً في مادة تتقنها واحصل على ساعات لتعلم مهارة جديدة. 
            نظام عادل ومتوازن يضمن استفادة الجميع من خبرات بعضهم البعض.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Transactions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              المعاملات الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium">{transaction.provider}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{transaction.recipient}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {transaction.skill} • {transaction.hours} ساعة
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={transaction.status === "completed" ? "default" : "secondary"}
                      className={
                        transaction.status === "completed" 
                          ? "bg-green-500 hover:bg-green-600" 
                          : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }
                    >
                      {transaction.status === "completed" ? "مكتملة" : "معلقة"}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {transaction.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            كيف يعمل نظام بنك الوقت؟
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h4 className="font-semibold mb-2">ساعد زميلاً</h4>
              <p className="text-gray-600 text-sm">
                قدم مساعدة في مادة أو مهارة تتقنها واكسب ساعات
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h4 className="font-semibold mb-2">اطلب المساعدة</h4>
              <p className="text-gray-600 text-sm">
                استخدم ساعاتك للحصول على مساعدة في مهارات جديدة
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h4 className="font-semibold mb-2">نمو مستمر</h4>
              <p className="text-gray-600 text-sm">
                طور مهاراتك باستمرار من خلال التبادل العادل
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/timebank">
            <Button size="lg" className="px-8 py-4">
              استكشف بنك الوقت
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
