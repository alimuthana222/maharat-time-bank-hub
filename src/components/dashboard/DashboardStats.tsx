
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveGrid } from "@/components/ui/mobile-responsive";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

export function DashboardStats() {
  const monthlyData = [
    { month: "يناير", earned: 8, spent: 5 },
    { month: "فبراير", earned: 12, spent: 7 },
    { month: "مارس", earned: 15, spent: 10 },
    { month: "أبريل", earned: 18, spent: 12 },
    { month: "مايو", earned: 22, spent: 15 },
    { month: "يونيو", earned: 25, spent: 18 }
  ];

  const categoryData = [
    { name: "تدريس", value: 35, color: "#3b82f6" },
    { name: "برمجة", value: 25, color: "#10b981" },
    { name: "تصميم", value: 20, color: "#f59e0b" },
    { name: "ترجمة", value: 15, color: "#ef4444" },
    { name: "أخرى", value: 5, color: "#8b5cf6" }
  ];

  const recentActivity = [
    { date: "2024-01-15", type: "earned", hours: 3, description: "جلسة تدريس رياضيات" },
    { date: "2024-01-14", type: "spent", hours: 2, description: "مساعدة في البرمجة" },
    { date: "2024-01-13", type: "earned", hours: 1, description: "مراجعة مقال" },
    { date: "2024-01-12", type: "spent", hours: 4, description: "تصميم شعار" }
  ];

  return (
    <div className="space-y-6">
      <ResponsiveGrid cols={{ default: 1, lg: 2 }}>
        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>الأداء الشهري</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earned" fill="#3b82f6" name="ساعات مكتسبة" />
                <Bar dataKey="spent" fill="#ef4444" name="ساعات مصروفة" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع الخدمات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ResponsiveGrid>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'earned' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  activity.type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {activity.type === 'earned' ? '+' : '-'}{activity.hours} ساعة
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
