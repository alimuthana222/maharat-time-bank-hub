
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { PaymentStatusIndicator } from "@/components/payment/PaymentStatusIndicator";
import { 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  Wallet,
  Filter,
  Download,
  Phone
} from "lucide-react";
import { toast } from "sonner";

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  currency: string;
  created_at: string;
  payer_id: string;
  receiver_id: string;
}

interface ChargeTransaction {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  notes: string;
  created_at: string;
  manual_verification_status?: string;
}

export function DashboardTransactions() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [charges, setCharges] = useState<ChargeTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      // جلب المدفوعات
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .or(`payer_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (paymentsError) throw paymentsError;

      // جلب معاملات الشحن
      const { data: chargesData, error: chargesError } = await supabase
        .from('charge_transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (chargesError) throw chargesError;

      setPayments(paymentsData || []);
      setCharges(chargesData || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error("حدث خطأ في جلب المعاملات");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'wallet':
        return Wallet;
      case 'mastercard':
        return CreditCard;
      case 'zaincash_manual':
        return Phone;
      default:
        return ArrowDownRight;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'wallet':
        return 'المحفظة';
      case 'mastercard':
        return 'ماستر كارد';
      case 'zaincash_manual':
        return 'ZainCash يدوي';
      case 'admin_credit':
        return 'شحن من الإدارة';
      default:
        return method;
    }
  };

  const getTransactionStatus = (transaction: ChargeTransaction) => {
    if (transaction.payment_method === 'zaincash_manual') {
      switch (transaction.manual_verification_status) {
        case 'pending':
          return { text: 'قيد المراجعة', color: 'orange' };
        case 'verified':
          return { text: 'مقبول', color: 'green' };
        case 'rejected':
          return { text: 'مرفوض', color: 'red' };
        default:
          return { text: transaction.status, color: 'gray' };
      }
    }
    return { text: transaction.status, color: 'gray' };
  };

  const formatAmount = (amount: number, currency: string = 'IQD') => {
    return `${amount.toLocaleString()} ${currency === 'IQD' ? 'د.ع' : currency}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">المعاملات المالية</h2>
          <p className="text-muted-foreground">تاريخ جميع معاملاتك المالية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            تصفية
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">جميع المعاملات</TabsTrigger>
          <TabsTrigger value="payments">المدفوعات</TabsTrigger>
          <TabsTrigger value="charges">الشحن</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                جميع المعاملات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {/* عرض معاملات الشحن */}
                  {charges.map((charge) => {
                    const PaymentIcon = getPaymentMethodIcon(charge.payment_method);
                    const statusInfo = getTransactionStatus(charge);
                    return (
                      <div key={`charge-${charge.id}`} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-green-100 text-green-600">
                            <PaymentIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">شحن رصيد</div>
                            <div className="text-sm text-muted-foreground">
                              {getPaymentMethodText(charge.payment_method)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(charge.created_at).toLocaleDateString('ar-SA')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            +{formatAmount(charge.amount)}
                          </div>
                          <Badge variant="outline" className={`text-${statusInfo.color}-600`}>
                            {statusInfo.text}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}

                  {/* عرض المدفوعات */}
                  {payments.map((payment) => {
                    const isIncoming = payment.receiver_id === user?.id;
                    const PaymentIcon = getPaymentMethodIcon(payment.payment_method);
                    
                    return (
                      <div key={`payment-${payment.id}`} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${isIncoming ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {isIncoming ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="font-medium">
                              {isIncoming ? 'استلام دفعة' : 'إرسال دفعة'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {getPaymentMethodText(payment.payment_method)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(payment.created_at).toLocaleDateString('ar-SA')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
                            {isIncoming ? '+' : '-'}{formatAmount(payment.amount, payment.currency)}
                          </div>
                          <PaymentStatusIndicator status={payment.status} size="sm" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>المدفوعات</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {payments.map((payment) => {
                    const isIncoming = payment.receiver_id === user?.id;
                    
                    return (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${isIncoming ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {isIncoming ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="font-medium">
                              {isIncoming ? 'استلام دفعة' : 'إرسال دفعة'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(payment.created_at).toLocaleDateString('ar-SA')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
                            {isIncoming ? '+' : '-'}{formatAmount(payment.amount, payment.currency)}
                          </div>
                          <PaymentStatusIndicator status={payment.status} size="sm" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charges" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>معاملات الشحن</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {charges.map((charge) => {
                    const PaymentIcon = getPaymentMethodIcon(charge.payment_method);
                    const statusInfo = getTransactionStatus(charge);
                    
                    return (
                      <div key={charge.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-green-100 text-green-600">
                            <PaymentIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">شحن رصيد</div>
                            <div className="text-sm text-muted-foreground">
                              {charge.notes || getPaymentMethodText(charge.payment_method)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(charge.created_at).toLocaleDateString('ar-SA')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            +{formatAmount(charge.amount)}
                          </div>
                          <Badge variant="outline" className={`text-${statusInfo.color}-600`}>
                            {statusInfo.text}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
