
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Loader2 } from "lucide-react";

interface Transaction {
  id: string;
  provider_id: string;
  recipient_id: string;
  hours: number;
  description: string;
  status: string;
  created_at: string;
  provider_name?: string;
  recipient_name?: string;
}

interface TimeBankAnalyticsProps {
  transactions: Transaction[];
  balance: {
    hours_earned: number;
    hours_spent: number;
    hours_pending: number;
  } | null;
  loading: boolean;
  currentUserId: string;
}

export function TimeBankAnalytics({ transactions, balance, loading, currentUserId }: TimeBankAnalyticsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>تحليلات بنك الوقت</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  // Prepare data for monthly chart
  const monthlyData = React.useMemo(() => {
    const monthsArabic = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const lastSixMonths = new Array(6).fill(0).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return {
        month: monthsArabic[d.getMonth()],
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        earned: 0,
        spent: 0,
      };
    }).reverse();

    // Map transactions to months
    transactions.forEach(transaction => {
      if (transaction.status !== 'approved') return;
      
      const date = new Date(transaction.created_at);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      
      const monthData = lastSixMonths.find(m => m.monthIndex === monthIndex && m.year === year);
      if (monthData) {
        if (transaction.recipient_id === currentUserId) {
          monthData.earned += transaction.hours;
        } else if (transaction.provider_id === currentUserId) {
          monthData.spent += transaction.hours;
        }
      }
    });

    return lastSixMonths;
  }, [transactions, currentUserId]);

  // Prepare data for pie chart
  const categoryData = React.useMemo(() => {
    const categories: Record<string, { name: string; value: number; }> = {};
    
    transactions.forEach(transaction => {
      if (transaction.status !== 'approved') return;
      if (transaction.provider_id !== currentUserId) return;
      
      // Extract category from description (simple approach)
      const words = transaction.description.split(' ');
      let category = 'أخرى';
      
      if (transaction.description.includes('برمجة') || transaction.description.includes('تطوير')) {
        category = 'برمجة';
      } else if (transaction.description.includes('تصميم')) {
        category = 'تصميم';
      } else if (transaction.description.includes('ترجمة')) {
        category = 'ترجمة';
      } else if (transaction.description.includes('تدريس') || transaction.description.includes('شرح')) {
        category = 'تدريس';
      } else if (transaction.description.includes('كتابة') || transaction.description.includes('محتوى')) {
        category = 'كتابة';
      }
      
      if (!categories[category]) {
        categories[category] = { name: category, value: 0 };
      }
      
      categories[category].value += transaction.hours;
    });
    
    return Object.values(categories);
  }, [transactions, currentUserId]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];
  
  // Prepare trend data (cumulative hours over time)
  const trendData = React.useMemo(() => {
    const sortedTransactions = [...transactions]
      .filter(t => t.status === 'approved')
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    let cumulativeEarned = 0;
    let cumulativeSpent = 0;
    let cumulativeBalance = 0;
    
    return sortedTransactions.map(transaction => {
      const date = new Date(transaction.created_at);
      if (transaction.recipient_id === currentUserId) {
        cumulativeEarned += transaction.hours;
        cumulativeBalance += transaction.hours;
      } else if (transaction.provider_id === currentUserId) {
        cumulativeSpent += transaction.hours;
        cumulativeBalance -= transaction.hours;
      }
      
      return {
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        cumulativeEarned,
        cumulativeSpent,
        cumulativeBalance,
      };
    });
  }, [transactions, currentUserId]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>تحليلات بنك الوقت</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="monthly">التحليل الشهري</TabsTrigger>
            <TabsTrigger value="categories">فئات المعاملات</TabsTrigger>
            <TabsTrigger value="trend">المؤشر التراكمي</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="earned" name="الساعات المكتسبة" fill="#10b981" />
                <Bar dataKey="spent" name="الساعات المنفقة" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="categories" className="h-80">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ساعات`, 'الساعات المنفقة']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">لا توجد معاملات كافية لعرض التحليل</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="trend" className="h-80">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cumulativeBalance" 
                    name="الرصيد التراكمي" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                  <Line type="monotone" dataKey="cumulativeEarned" name="الساعات المكتسبة" stroke="#10b981" />
                  <Line type="monotone" dataKey="cumulativeSpent" name="الساعات المنفقة" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">لا توجد معاملات كافية لعرض المؤشر التراكمي</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
