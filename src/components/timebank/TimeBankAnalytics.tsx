
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Clock, TrendingUp, Users, Award } from "lucide-react";

// Sample data - In a real app, this would come from an API
const monthlyTransactions = [
  { name: "يناير", earned: 12, spent: 8 },
  { name: "فبراير", earned: 19, spent: 11 },
  { name: "مارس", earned: 15, spent: 13 },
  { name: "أبريل", earned: 18, spent: 14 },
  { name: "مايو", earned: 22, spent: 16 },
  { name: "يونيو", earned: 25, spent: 20 },
];

const categoryData = [
  { name: "تدريس", value: 35 },
  { name: "برمجة", value: 25 },
  { name: "تصميم", value: 20 },
  { name: "ترجمة", value: 15 },
  { name: "أخرى", value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface TimeBankAnalyticsProps {
  totalEarned?: number;
  totalSpent?: number;
  pendingHours?: number;
  activeUsers?: number;
  popularSkills?: Array<{ name: string, transactions: number }>;
}

export function TimeBankAnalytics({
  totalEarned = 114,
  totalSpent = 82,
  pendingHours = 12,
  activeUsers = 48,
  popularSkills = [
    { name: "تدريس رياضيات", transactions: 23 },
    { name: "برمجة ويب", transactions: 18 },
    { name: "تصميم جرافيك", transactions: 15 },
    { name: "ترجمة نصوص", transactions: 12 },
    { name: "مونتاج فيديو", transactions: 9 },
  ]
}: TimeBankAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي الساعات المكتسبة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{totalEarned}</span>
              <span className="text-muted-foreground mr-2">ساعة</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي الساعات المستخدمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-secondary mr-2" />
              <span className="text-2xl font-bold">{totalSpent}</span>
              <span className="text-muted-foreground mr-2">ساعة</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ساعات قيد الانتظار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">{pendingHours}</span>
              <span className="text-muted-foreground mr-2">ساعة</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              المستخدمين النشطين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{activeUsers}</span>
              <span className="text-muted-foreground mr-2">مستخدم</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>النشاط الشهري</CardTitle>
            <CardDescription>تحليل ساعات بنك الوقت شهريًا</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyTransactions}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorEarned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0088FE" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00C49F" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} ساعة`, undefined]} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="earned"
                  name="ساعات مكتسبة"
                  stroke="#0088FE"
                  fillOpacity={1}
                  fill="url(#colorEarned)"
                />
                <Area
                  type="monotone"
                  dataKey="spent"
                  name="ساعات مستخدمة"
                  stroke="#00C49F"
                  fillOpacity={1}
                  fill="url(#colorSpent)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>توزيع الساعات حسب التصنيف</CardTitle>
            <CardDescription>المهارات الأكثر تبادلاً</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} ساعة`, undefined]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>المهارات الأكثر تبادلاً</CardTitle>
            <CardDescription>أكثر المهارات نشاطاً في بنك الوقت</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={popularSkills}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value} معاملة`, undefined]} />
                <Legend />
                <Bar dataKey="transactions" name="عدد المعاملات" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
