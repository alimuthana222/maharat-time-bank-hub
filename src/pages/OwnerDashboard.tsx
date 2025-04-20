import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Flag,
  LayoutDashboard,
  Search,
  Settings,
  Shield,
  Star,
  Trash,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Line,
} from "recharts";

// بيانات تجريبية لإحصاءات المنصة
const PLATFORM_STATS = [
  { name: "يناير", users: 120, transactions: 80, revenue: 1200 },
  { name: "فبراير", users: 150, transactions: 100, revenue: 1600 },
  { name: "مارس", users: 200, transactions: 130, revenue: 2100 },
  { name: "أبريل", users: 250, transactions: 180, revenue: 3200 },
  { name: "مايو", users: 300, transactions: 220, revenue: 4000 },
  { name: "يونيو", users: 380, transactions: 280, revenue: 5500 },
];

// بيانات تجريبية للإعلانات
const ADS_DATA = [
  {
    id: "1",
    title: "إعلان مميز للتدريب الطلابي",
    type: "مميز+",
    category: "التوظيف والتدريب",
    views: 1240,
    clicks: 87,
    revenue: 350,
    status: "active",
  },
  {
    id: "2",
    title: "سكن طلابي قريب من الجامعة",
    type: "عادي",
    category: "السكن والمواصلات",
    views: 560,
    clicks: 45,
    revenue: 120,
    status: "active",
  },
  {
    id: "3",
    title: "برنامج تطوير المهارات البرمجية",
    type: "موجه",
    category: "الخدمات الطلابية",
    views: 890,
    clicks: 65,
    revenue: 220,
    status: "pending",
  },
  {
    id: "4",
    title: "فعالية ملتقى الخريجين",
    type: "فوري",
    category: "الفعاليات والأنشطة",
    views: 1450,
    clicks: 102,
    revenue: 400,
    status: "active",
  },
];

// ألوان للمخططات
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];

export default function OwnerDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">لوحة تحكم المالك</h1>
          </div>
          <Button variant="outline">
            <Settings className="ml-2 h-4 w-4" />
            إعدادات المنصة
          </Button>
        </div>
        
        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48,500 ريال</div>
              <p className="text-xs text-muted-foreground">
                +18% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,254</div>
              <p className="text-xs text-muted-foreground">
                +12% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الإعلانات النشطة</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78</div>
              <p className="text-xs text-muted-foreground">
                +15% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">معدل نمو المنصة</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14.5%</div>
              <p className="text-xs text-muted-foreground">
                +2.3% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="ads">إدارة الإعلانات</TabsTrigger>
            <TabsTrigger value="revenue">التقارير المالية</TabsTrigger>
            <TabsTrigger value="settings">إعدادات المنصة</TabsTrigger>
          </TabsList>
          
          {/* علامة تبويب النظرة العامة */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>نمو المنصة</CardTitle>
                  <CardDescription>تطور أعداد المستخدمين والمعاملات والإيرادات</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={PLATFORM_STATS}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line yAxisId="left" type="monotone" dataKey="transactions" stroke="#82ca9d" />
                      <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#ff8042" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>توزيع الإعلانات حسب الفئة</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "الخدمات الطلابية", value: 35 },
                          { name: "السكن والمواصلات", value: 25 },
                          { name: "التوظيف والتدريب", value: 20 },
                          { name: "الفعاليات والأنشطة", value: 15 },
                          { name: "أخرى", value: 5 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {PLATFORM_STATS.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>مقارنة أنواع الإعلانات</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: "عادي", count: 42, revenue: 1260 },
                      { name: "مميز", count: 25, revenue: 2500 },
                      { name: "مميز+", count: 12, revenue: 2400 },
                      { name: "موجه", count: 18, revenue: 1620 },
                      { name: "فوري", count: 8, revenue: 1600 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" name="العدد" />
                      <Bar dataKey="revenue" fill="#82ca9d" name="الإيرادات" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* علامة تبويب إدارة الإعلانات */}
          <TabsContent value="ads">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>إدارة الإعلانات</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="بحث عن إعلان..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="جميع الفئات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الفئات</SelectItem>
                      <SelectItem value="services">الخدمات الطلابية</SelectItem>
                      <SelectItem value="housing">السكن والمواصلات</SelectItem>
                      <SelectItem value="employment">التوظيف والتدريب</SelectItem>
                      <SelectItem value="events">الفعاليات والأنشطة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان الإعلان</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>التصنيف</TableHead>
                      <TableHead>المشاهدات</TableHead>
                      <TableHead>النقرات</TableHead>
                      <TableHead>الإيرادات</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ADS_DATA.map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell className="font-medium">{ad.title}</TableCell>
                        <TableCell>{ad.type}</TableCell>
                        <TableCell>{ad.category}</TableCell>
                        <TableCell>{ad.views}</TableCell>
                        <TableCell>{ad.clicks}</TableCell>
                        <TableCell>{ad.revenue} ريال</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`
                              ${ad.status === "active" ? "bg-green-100 text-green-800" : ""}
                              ${ad.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                            `}
                          >
                            {ad.status === "active" && "نشط"}
                            {ad.status === "pending" && "قيد المراجعة"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* علامة تبويب التقارير المالية */}
          <TabsContent value="revenue">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>التقارير المالية</CardTitle>
                  <CardDescription>
                    ملخص الإيرادات والمصروفات وصافي الربح
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm">إجمالي الإيرادات</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-xl font-bold text-green-500">48,500 ريال</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm">إجمالي المصروفات</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-xl font-bold text-red-500">18,200 ريال</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm">صافي الربح</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-xl font-bold">30,300 ريال</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { month: "يناير", revenue: 4500, expenses: 2200, profit: 2300 },
                        { month: "فبراير", revenue: 5200, expenses: 2400, profit: 2800 },
                        { month: "مارس", revenue: 6800, expenses: 2800, profit: 4000 },
                        { month: "أبريل", revenue: 7500, expenses: 3100, profit: 4400 },
                        { month: "مايو", revenue: 9200, expenses: 3600, profit: 5600 },
                        { month: "يونيو", revenue: 10800, expenses: 4100, profit: 6700 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" stackId="a" fill="#82ca9d" name="الإيرادات" />
                        <Bar dataKey="expenses" stackId="a" fill="#ff8042" name="المصروفات" />
                        <Bar dataKey="profit" fill="#8884d8" name="الأرباح" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>المعاملات المالية الأخيرة</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>رقم العملية</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>المبلغ</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>المصدر</TableHead>
                        <TableHead>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { id: "TX-001", type: "إيراد", amount: 450, date: "2025-04-15", source: "إعلان مميز", status: "completed" },
                        { id: "TX-002", type: "إيراد", amount: 220, date: "2025-04-13", source: "اشتراك سنوي", status: "completed" },
                        { id: "TX-003", type: "مصروف", amount: -180, date: "2025-04-10", source: "استضافة الموقع", status: "completed" },
                        { id: "TX-004", type: "إيراد", amount: 350, date: "2025-04-08", source: "إعلان مميز+", status: "pending" },
                        { id: "TX-005", type: "مصروف", amount: -250, date: "2025-04-05", source: "خدمات تقنية", status: "completed" },
                      ].map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium">{tx.id}</TableCell>
                          <TableCell>{tx.type}</TableCell>
                          <TableCell className={tx.amount > 0 ? "text-green-600" : "text-red-600"}>
                            {tx.amount > 0 ? "+" : ""}{tx.amount} ريال
                          </TableCell>
                          <TableCell>{tx.date}</TableCell>
                          <TableCell>{tx.source}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`
                                ${tx.status === "completed" ? "bg-green-100 text-green-800" : ""}
                                ${tx.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                              `}
                            >
                              {tx.status === "completed" && "مكتملة"}
                              {tx.status === "pending" && "قيد المعالجة"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* علامة تبويب إعدادات المنصة */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات المنصة</CardTitle>
                <CardDescription>
                  تخصيص إعدادات المنصة وسياسات المحتوى
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">إعدادات الإعلانات</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm font-medium">سعر الإعلان العادي</label>
                          <div className="flex items-center mt-1">
                            <Input type="number" defaultValue="100" />
                            <span className="mx-2">ريال</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">سعر الإعلان المميز</label>
                          <div className="flex items-center mt-1">
                            <Input type="number" defaultValue="200" />
                            <span className="mx-2">ريال</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm font-medium">سعر الإعلان المميز+</label>
                          <div className="flex items-center mt-1">
                            <Input type="number" defaultValue="350" />
                            <span className="mx-2">ريال</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">سعر الإعلان الموجه</label>
                          <div className="flex items-center mt-1">
                            <Input type="number" defaultValue="180" />
                            <span className="mx-2">ريال</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">إعدادات النظام</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium">عمولة المنصة</label>
                        <div className="flex items-center mt-1">
                          <Input type="number" defaultValue="10" />
                          <span className="mx-2">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">مدة مراجعة الإعلانات</label>
                        <div className="flex items-center mt-1">
                          <Input type="number" defaultValue="24" />
                          <span className="mx-2">ساعة</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>حفظ الإعدادات</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
