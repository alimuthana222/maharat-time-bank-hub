
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Download, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample transactions data
const transactions = [
  {
    id: "TX-001",
    date: "2025-04-15",
    type: "income",
    description: "مساعدة في مشروع تخرج",
    hours: 5,
    client: "سارة العتيبي",
  },
  {
    id: "TX-002",
    date: "2025-04-10",
    type: "expense",
    description: "مساعدة في تصميم قاعدة بيانات",
    hours: 3,
    client: "خالد محمد",
  },
  {
    id: "TX-003",
    date: "2025-04-05",
    type: "income",
    description: "تصميم عرض تقديمي",
    hours: 2,
    client: "نورة السالم",
  },
  {
    id: "TX-004",
    date: "2025-04-01",
    type: "income",
    description: "شرح مادة الإحصاء",
    hours: 8,
    client: "فهد العتيبي",
  },
  {
    id: "TX-005",
    date: "2025-03-20",
    type: "expense",
    description: "مساعدة في تحرير بحث",
    hours: 4,
    client: "هدى الزهراني",
  },
];

export function DashboardTransactions() {
  // Calculate summary
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.hours, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.hours, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">المعاملات المالية</h2>
        <div className="flex gap-2 items-center">
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-1" />
              <SelectValue placeholder="تصفية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="income">إيرادات</SelectItem>
              <SelectItem value="expense">مصروفات</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            تصدير
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalIncome} ساعة</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalExpense} ساعة</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">الرصيد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIncome - totalExpense} ساعة</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>سجل المعاملات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">رقم المعاملة</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead className="text-left">الساعات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    {transaction.type === "income" ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        إيرادات
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        مصروفات
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.client}</TableCell>
                  <TableCell className={`text-left ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "income" ? "+" : "-"}{transaction.hours} ساعة
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
