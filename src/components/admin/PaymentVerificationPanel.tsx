
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  Phone, 
  CreditCard,
  ExternalLink 
} from "lucide-react";

interface PendingPayment {
  id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  zaincash_phone?: string;
  zaincash_transaction_id?: string;
  payment_proof_url?: string;
  notes?: string;
  created_at: string;
  user_profiles?: {
    username: string;
    full_name: string;
  };
}

export function PaymentVerificationPanel() {
  const { user, isAdmin } = useAuth();
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isAdmin()) {
      fetchPendingPayments();
    }
  }, [isAdmin]);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('charge_transactions')
        .select(`
          *,
          user_profiles:profiles(username, full_name)
        `)
        .eq('payment_method', 'zaincash_manual')
        .eq('manual_verification_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingPayments(data || []);
    } catch (error: any) {
      console.error('Error fetching pending payments:', error);
      toast.error(`خطأ في جلب المدفوعات: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (paymentId: string, status: 'verified' | 'rejected') => {
    if (!user) return;

    setProcessing(true);
    try {
      const updates: any = {
        manual_verification_status: status,
        verified_by: user.id,
        verified_at: new Date().toISOString(),
        verification_notes: verificationNotes
      };

      if (status === 'verified') {
        updates.status = 'completed';
      } else {
        updates.status = 'failed';
      }

      const { error: updateError } = await supabase
        .from('charge_transactions')
        .update(updates)
        .eq('id', paymentId);

      if (updateError) throw updateError;

      // إذا تم قبول المدفوعة، إضافة الرصيد للمستخدم
      if (status === 'verified') {
        const payment = pendingPayments.find(p => p.id === paymentId);
        if (payment) {
          const { error: balanceError } = await supabase.rpc('update_user_balance_with_source', {
            _user_id: payment.user_id,
            _amount: payment.amount,
            _transaction_type: 'deposit',
            _source: 'zaincash_manual'
          });

          if (balanceError) throw balanceError;
        }
      }

      toast.success(`تم ${status === 'verified' ? 'قبول' : 'رفض'} المدفوعة بنجاح`);
      setSelectedPayment(null);
      setVerificationNotes("");
      fetchPendingPayments();

    } catch (error: any) {
      console.error('Error processing verification:', error);
      toast.error(`خطأ في معالجة التحقق: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (!isAdmin()) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            المدفوعات المعلقة للتحقق ({pendingPayments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : pendingPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>لا توجد مدفوعات معلقة للتحقق</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingPayments.map((payment) => (
                <Card key={payment.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">
                            {payment.user_profiles?.username || 'مستخدم غير معروف'}
                          </span>
                          <Badge variant="outline">ZainCash</Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>المبلغ: <span className="font-medium text-green-600">{payment.amount.toLocaleString()} د.ع</span></div>
                          <div>رقم المرسل: <span className="font-mono">{payment.zaincash_phone}</span></div>
                          <div>رقم العملية: <span className="font-mono">{payment.zaincash_transaction_id}</span></div>
                          <div>التاريخ: {new Date(payment.created_at).toLocaleDateString('ar-SA')}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          مراجعة
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>مراجعة المدفوعة</DialogTitle>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">المستخدم:</span>
                  <p>{selectedPayment.user_profiles?.full_name || selectedPayment.user_profiles?.username}</p>
                </div>
                <div>
                  <span className="font-medium">المبلغ:</span>
                  <p className="text-green-600 font-bold">{selectedPayment.amount.toLocaleString()} د.ع</p>
                </div>
                <div>
                  <span className="font-medium">رقم المرسل:</span>
                  <p className="font-mono">{selectedPayment.zaincash_phone}</p>
                </div>
                <div>
                  <span className="font-medium">رقم العملية:</span>
                  <p className="font-mono">{selectedPayment.zaincash_transaction_id}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">التاريخ:</span>
                  <p>{new Date(selectedPayment.created_at).toLocaleString('ar-SA')}</p>
                </div>
                {selectedPayment.notes && (
                  <div className="col-span-2">
                    <span className="font-medium">ملاحظات:</span>
                    <p>{selectedPayment.notes}</p>
                  </div>
                )}
              </div>

              {selectedPayment.payment_proof_url && (
                <div>
                  <span className="font-medium block mb-2">إثبات الدفع:</span>
                  <div className="border rounded-lg p-4">
                    <img 
                      src={selectedPayment.payment_proof_url} 
                      alt="إثبات الدفع"
                      className="max-w-full h-auto rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => window.open(selectedPayment.payment_proof_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      فتح في علامة تبويب جديدة
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <label className="font-medium block mb-2">ملاحظات التحقق:</label>
                <Textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="اكتب ملاحظاتك حول هذه المدفوعة..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleVerification(selectedPayment.id, 'verified')}
                  disabled={processing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {processing ? "جارٍ المعالجة..." : "قبول وإضافة الرصيد"}
                </Button>
                <Button
                  onClick={() => handleVerification(selectedPayment.id, 'rejected')}
                  disabled={processing}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  رفض المدفوعة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
