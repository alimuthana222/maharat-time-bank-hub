import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle2,
  Flag,
  LayoutDashboard,
  Search,
  Settings,
  Shield,
  User,
  Users,
  UserCog,
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
} from "recharts";
import { AdminUserManagement } from "@/components/admin/AdminUserManagement";
import { WithdrawalRequestsPanel } from "@/components/admin/WithdrawalRequestsPanel";
import { PaymentVerificationPanel } from "@/components/admin/PaymentVerificationPanel";

// Mock users data
const USERS_DATA = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@university.edu",
    university: "جامعة الملك سعود",
    status: "active",
    joinDate: "2023-09-15",
    servicesCount: 5,
    hoursBalance: 45,
  },
  {
    id: "2",
    name: "سارة العتيبي",
    email: "sarah@university.edu",
    university: "جامعة الأميرة نورة",
    status: "active",
    joinDate: "2023-10-02",
    servicesCount: 3,
    hoursBalance: 28,
  },
  {
    id: "3",
    name: "خالد الزهراني",
    email: "khalid@university.edu",
    university: "جامعة الملك فهد",
    status: "pending",
    joinDate: "2023-11-10",
    servicesCount: 0,
    hoursBalance: 0,
  },
  {
    id: "4",
    name: "نورة السالم",
    email: "noura@university.edu",
    university: "جامعة الملك عبدالعزيز",
    status: "active",
    joinDate: "2023-08-20",
    servicesCount: 8,
    hoursBalance: 62,
  },
  {
    id: "5",
    name: "فيصل القحطاني",
    email: "faisal@university.edu",
    university: "جامعة الإمام",
    status: "suspended",
    joinDate: "2023-07-05",
    servicesCount: 2,
    hoursBalance: 15,
  },
];

// Mock transactions data
const TRANSACTIONS_DATA = [
  {
    id: "TX-001",
    provider: "أحمد محمد",
    recipient: "سارة العتيبي",
    service: "مساعدة في مشروع برمجي",
    hours: 5,
    date: "2025-04-15",
    status: "completed",
  },
  {
    id: "TX-002",
    provider: "نورة السالم",
    recipient: "فيصل القحطاني",
    service: "تصميم عرض تقديمي",
    hours: 2,
    date: "2025-04-12",
    status: "completed",
  },
  {
    id: "TX-003",
    provider: "خالد الزهراني",
    recipient: "أحمد محمد",
    service: "مراجعة بحث علمي",
    hours: 3,
    date: "2025-04-10",
    status: "disputed",
  },
  {
    id: "TX-004",
    provider: "سارة العتيبي",
    recipient: "نورة السالم",
    service: "ترجمة مقال",
    hours: 4,
    date: "2025-04-08",
    status: "pending",
  },
  {
    id: "TX-005",
    provider: "فيصل القحطاني",
    recipient: "خالد الزهراني",
    service: "تدريس الإحصاء",
    hours: 6,
    date: "2025-04-05",
    status: "completed",
  },
];

// Mock reports data
const REPORTS_DATA = [
  {
    id: "R-001",
    reporter: "أحمد محمد",
    reportedUser: "فيصل القحطاني",
    reason: "محتوى غير لائق في الرسائل",
    date: "2025-04-14",
    status: "pending",
  },
  {
    id: "R-002",
    reporter: "سارة العتيبي",
    reportedUser: "خالد الزهراني",
    reason: "عدم الالتزام بشروط الخدمة المتفق عليها",
    date: "2025-04-10",
    status: "investigating",
  },
  {
    id: "R-003",
    reporter: "نورة السالم",
    reportedUser: "أحمد محمد",
    reason: "عدم تقديم الخدمة بالجودة المطلوبة",
    date: "2025-04-05",
    status: "resolved",
  },
];

// Chart data
const USER_GROWTH_DATA = [
  { month: "يناير", users: 120 },
  { month: "فبراير", users: 150 },
  { month: "مارس", users: 200 },
  { month: "أبريل", users: 250 },
  { month: "مايو", users: 300 },
  { month: "يونيو", users: 380 },
];

const TRANSACTIONS_BY_CATEGORY = [
  { category: "برمجة", transactions: 120 },
  { category: "تصميم", transactions: 80 },
  { category: "ترجمة", transactions: 60 },
  { category: "تدريس", transactions: 90 },
  { category: "تحرير", transactions: 40 },
];

const SERVICE_STATUS_DATA = [
  { name: "نشطة", value: 65 },
  { name: "معلقة", value: 15 },
  { name: "منتهية", value: 20 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = USERS_DATA.filter(
    user =>
      user.name.includes(searchTerm) ||
      user.email.includes(searchTerm) ||
      user.university.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">لوحة تحكم الإدارة</h1>
          </div>
          <Button variant="outline">
            <Settings className="ml-2 h-4 w-4" />
            إعدادات النظام
          </Button>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium">إجمالي المعاملات</CardTitle>
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,876</div>
              <p className="text-xs text-muted-foreground">
                +8% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">البلاغات النشطة</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">
                -5% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">ساعات بنك الوقت</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,540</div>
              <p className="text-xs text-muted-foreground">
                +15% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="moderators" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="moderators">
              <UserCog className="h-4 w-4 mr-2" />
              إدارة المشرفين
            </TabsTrigger>
            <TabsTrigger value="withdrawals">طلبات السحب</TabsTrigger>
            <TabsTrigger value="payments">طلبات الشحن</TabsTrigger>
            <TabsTrigger value="dashboard">لوحة البيانات</TabsTrigger>
            <TabsTrigger value="users">المستخدمون</TabsTrigger>
            <TabsTrigger value="transactions">المعاملات</TabsTrigger>
            <TabsTrigger value="reports">البلاغات</TabsTrigger>
          </TabsList>
          
          {/* Moderators Management Tab */}
          <TabsContent value="moderators">
            <AdminUserManagement />
          </TabsContent>

          {/* Withdrawal Requests Tab */}
          <TabsContent value="withdrawals">
            <WithdrawalRequestsPanel />
          </TabsContent>

          {/* Payment Verification Tab */}
          <TabsContent value="payments">
            <PaymentVerificationPanel />
          </TabsContent>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>نمو المستخدمين</CardTitle>
                  <CardDescription>عدد المستخدمين الجدد شهرياً</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={USER_GROWTH_DATA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>المعاملات حسب التصنيف</CardTitle>
                  <CardDescription>توزيع المعاملات على التصنيفات المختلفة</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={TRANSACTIONS_BY_CATEGORY} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" />
                      <Tooltip />
                      <Bar dataKey="transactions" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>حالة الخدمات</CardTitle>
                  <CardDescription>توزيع الخدمات حسب الحالة</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={SERVICE_STATUS_DATA}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {SERVICE_STATUS_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>إدارة المستخدمين</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث عن مستخدم..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المستخدم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>الجامعة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>تاريخ الانضمام</TableHead>
                      <TableHead>الخدمات</TableHead>
                      <TableHead>رصيد الساعات</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.university}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`
                              ${user.status === "active" ? "bg-green-100 text-green-800" : ""}
                              ${user.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                              ${user.status === "suspended" ? "bg-red-100 text-red-800" : ""}
                            `}
                          >
                            {user.status === "active" && "نشط"}
                            {user.status === "pending" && "قيد التفعيل"}
                            {user.status === "suspended" && "موقوف"}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>{user.servicesCount}</TableCell>
                        <TableCell>{user.hoursBalance}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <User className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  السابق
                </Button>
                <div className="text-sm text-muted-foreground">
                  الصفحة 1 من 10
                </div>
                <Button variant="outline" size="sm">
                  التالي
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>المعاملات</CardTitle>
                <CardDescription>
                  قائمة بجميع المعاملات التي تمت على المنصة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم المعاملة</TableHead>
                      <TableHead>مقدم الخدمة</TableHead>
                      <TableHead>المستفيد</TableHead>
                      <TableHead>الخدمة</TableHead>
                      <TableHead>الساعات</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TRANSACTIONS_DATA.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">{tx.id}</TableCell>
                        <TableCell>{tx.provider}</TableCell>
                        <TableCell>{tx.recipient}</TableCell>
                        <TableCell>{tx.service}</TableCell>
                        <TableCell>{tx.hours}</TableCell>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`
                              ${tx.status === "completed" ? "bg-green-100 text-green-800" : ""}
                              ${tx.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                              ${tx.status === "disputed" ? "bg-red-100 text-red-800" : ""}
                            `}
                          >
                            {tx.status === "completed" && "مكتملة"}
                            {tx.status === "pending" && "قيد التنفيذ"}
                            {tx.status === "disputed" && "متنازع عليها"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  السابق
                </Button>
                <div className="text-sm text-muted-foreground">
                  الصفحة 1 من 5
                </div>
                <Button variant="outline" size="sm">
                  التالي
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>البلاغات</CardTitle>
                <CardDescription>
                  إدارة البلاغات المقدمة من المستخدمين
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم البلاغ</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>المبلغ عنه</TableHead>
                      <TableHead>سبب البلاغ</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {REPORTS_DATA.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{report.reporter}</TableCell>
                        <TableCell>{report.reportedUser}</TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`
                              ${report.status === "resolved" ? "bg-green-100 text-green-800" : ""}
                              ${report.status === "investigating" ? "bg-blue-100 text-blue-800" : ""}
                              ${report.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                            `}
                          >
                            {report.status === "resolved" && "تم الحل"}
                            {report.status === "investigating" && "قيد التحقيق"}
                            {report.status === "pending" && "قيد الانتظار"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  السابق
                </Button>
                <div className="text-sm text-muted-foreground">
                  الصفحة 1 من 3
                </div>
                <Button variant="outline" size="sm">
                  التالي
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
