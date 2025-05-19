
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeBankTransaction } from "@/components/timebank/TimeBankTransaction";
import { Clock, PlusCircle } from "lucide-react";
import { TimeBankCard } from "@/components/timebank/TimeBankCard";

interface TimeBankTabsProps {
  isLoading?: boolean;
  onCreateTransaction?: () => void;
  showHeader?: boolean;
}

export function TimeBankTabs({
  isLoading = false,
  onCreateTransaction,
  showHeader = true,
}: TimeBankTabsProps) {

  // Sample transactions for demonstration
  const recentTransactions = [
    {
      id: "1",
      providerId: "user-1",
      recipientId: "user-2",
      hours: 2,
      status: "completed",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: "تدريس مادة الرياضيات لمدة ساعتين",
      provider: {
        name: "أحمد محمد",
        avatarUrl: "https://i.pravatar.cc/150?img=1"
      },
      recipient: {
        name: "سارة عبدالله",
        avatarUrl: "https://i.pravatar.cc/150?img=5"
      }
    },
    {
      id: "2",
      providerId: "user-3",
      recipientId: "user-1",
      hours: 1.5,
      status: "pending",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      description: "مساعدة في تصميم شعار للمشروع",
      provider: {
        name: "خالد العمري",
        avatarUrl: "https://i.pravatar.cc/150?img=3"
      },
      recipient: {
        name: "أحمد محمد",
        avatarUrl: "https://i.pravatar.cc/150?img=1"
      }
    },
    {
      id: "3",
      providerId: "user-1",
      recipientId: "user-4",
      hours: 3,
      status: "pending",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: "تطوير صفحة ويب بتقنية React",
      provider: {
        name: "أحمد محمد",
        avatarUrl: "https://i.pravatar.cc/150?img=1"
      },
      recipient: {
        name: "ليلى أحمد",
        avatarUrl: "https://i.pravatar.cc/150?img=9"
      }
    }
  ];

  const pendingTransactions = recentTransactions.filter(t => t.status === "pending");

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>نظام بنك الوقت</span>
            <Button onClick={onCreateTransaction} size="sm" className="h-8">
              <PlusCircle className="mr-1 h-4 w-4" />
              إضافة معاملة
            </Button>
          </CardTitle>
          <CardDescription>تبادل الوقت والمهارات مع الطلاب الآخرين</CardDescription>
        </CardHeader>
      )}
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">رصيدك في بنك الوقت</h3>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-2/3" />
              </div>
            ) : (
              <TimeBankCard hoursEarned={12} hoursSpent={8} pendingHours={3} />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">معلومات سريعة</h3>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-4/6" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">طلبات قيد الانتظار:</span>
                  <span className="font-medium">{pendingTransactions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">اجمالي الساعات المكتسبة:</span>
                  <span className="font-medium">12 ساعة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">اجمالي الساعات المستخدمة:</span>
                  <span className="font-medium">8 ساعات</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الرصيد الحالي:</span>
                  <span className="font-medium text-primary">4 ساعات</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <Tabs defaultValue="recent">
            <TabsList>
              <TabsTrigger value="recent">أحدث المعاملات</TabsTrigger>
              <TabsTrigger value="pending">قيد الانتظار {pendingTransactions.length > 0 && `(${pendingTransactions.length})`}</TabsTrigger>
            </TabsList>
            <TabsContent value="recent">
              {isLoading ? (
                <div className="space-y-4 mt-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="divide-y">
                  {recentTransactions.map(transaction => (
                    <TimeBankTransaction key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="pending">
              {isLoading ? (
                <div className="space-y-4 mt-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="divide-y">
                  {pendingTransactions.length > 0 ? (
                    pendingTransactions.map(transaction => (
                      <TimeBankTransaction key={transaction.id} transaction={transaction} />
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">لا توجد معاملات قيد الانتظار</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 bg-muted/20">
        <Button
          onClick={onCreateTransaction}
          variant="default"
          className="w-full"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          إضافة معاملة جديدة
        </Button>
      </CardFooter>
    </Card>
  );
}
