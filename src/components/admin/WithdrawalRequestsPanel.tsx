
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
  RefreshCw,
  AlertCircle
} from "lucide-react";

interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  zaincash_phone: string;
  notes?: string;
  status: string;
  created_at: string;
  profiles?: {
    username: string;
    full_name: string;
  };
}

export function WithdrawalRequestsPanel() {
  const { user, isAdmin, isOwner } = useAuth();
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isAdmin() || isOwner()) {
      fetchWithdrawalRequests();
    }
  }, [isAdmin, isOwner]);

  const fetchWithdrawalRequests = async () => {
    try {
      setLoading(true);
      
      const { data: requests, error: requestsError } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      const userIds = requests?.map(r => r.user_id) || [];
      if (userIds.length === 0) {
        setRequests([]);
        return;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const requestsWithProfiles = requests?.map(request => ({
        ...request,
        profiles: profiles?.find(profile => profile.id === request.user_id)
      })) || [];

      setRequests(requestsWithProfiles);
    } catch (error: any) {
      console.error('Error fetching withdrawal requests:', error);
      toast.error(`خطأ في جلب طلبات السحب: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId: string, action: 'approved' | 'rejected') => {
    if (!user) return;

    setProcessing(true);
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      const updates: any = {
        status: action,
        admin_id: user.id,
        admin_notes: adminNotes,
        processed_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('withdrawal_requests')
        .update(updates)
        .eq('id', requestId);

      if (updateError) throw updateError;

      // إذا تم رفض الطلب، إرجاع المبلغ للرصيد
      if (action === 'rejected') {
        const { error: balanceError } = await supabase.rpc('update_user_balance_with_source', {
          _user_id: request.user_id,
          _amount: request.amount,
          _transaction_type: 'deposit',
          _source: 'withdrawal_refund'
        });

        if (balanceError) throw balanceError;

        // تحرير المبلغ المحجوز
        const { data: balance } = await supabase
          .from('user_balances')
          .select('reserved_balance')
          .eq('user_id', request.user_id)
          .single();

        if (balance) {
          await supabase
            .from('user_balances')
            .update({
              reserved_balance: Math.max(0, (balance.reserved_balance || 0) - request.amount)
            })
            .eq('user_id', request.user_id);
        }
      } else if (action === 'approved') {
        // تحرير المبلغ المحجوز فقط (المبلغ تم خصمه مسبقاً)
        const { data: balance } = await supabase
          .from('user_balances')
          .select('reserved_balance')
          .eq('user_id', request.user_id)
          .single();

        if (balance) {
          await supabase
            .from('user_balances')
            .update({
              reserved_balance: Math.max(0, (balance.reserved_balance || 0) - request.amount)
            })
            .eq('user_id', request.user_id);
        }
      }

      // إرسال إشعار للمستخدم
      await supabase.rpc('send_notification', {
        _user_id: request.user_id,
        _title: action === 'approved' ? 'تم قبول طلب السحب' : 'تم رفض طلب السحب',
        _body: action === 'approved' 
          ? `تم قبول طلب سحب رصيدك بقيمة ${request.amount.toLocaleString()} دينار عراقي وسيتم التحويل قريباً`
          : `تم رفض طلب سحب رصيدك بقيمة ${request.amount.toLocaleString()} دينار عراقي وإرجاع المبلغ إلى رصيدك. ${adminNotes || ''}`,
        _type: 'transaction',
        _related_id: request.id,
        _related_type: 'withdrawal_request'
      });

      toast.success(`تم ${action === 'approved' ? 'قبول' : 'رفض'} طلب السحب بنجاح`);
      setSelectedRequest(null);
      setAdminNotes("");
      fetchWithdrawalRequests();

    } catch (error: any) {
      console.error('Error processing withdrawal request:', error);
      toast.error(`خطأ في معالجة الطلب: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (!isAdmin() && !isOwner()) {
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
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              طلبات السحب المعلقة
              {requests.length > 0 && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {requests.length}
                </Badge>
              )}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchWithdrawalRequests}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
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
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>لا توجد طلبات سحب معلقة</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">
                            {request.profiles?.username || 'مستخدم غير معروف'}
                          </span>
                          <Badge variant="outline">ZainCash</Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>المبلغ: <span className="font-medium text-green-600">{request.amount.toLocaleString()} د.ع</span></div>
                          <div>رقم ZainCash: <span className="font-mono">{request.zaincash_phone}</span></div>
                          <div>التاريخ: {new Date(request.created_at).toLocaleDateString('ar-SA')}</div>
                          {request.notes && <div>ملاحظات: {request.notes}</div>}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRequest(request)}
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

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>مراجعة طلب السحب</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">المستخدم:</span>
                  <p>{selectedRequest.profiles?.full_name || selectedRequest.profiles?.username}</p>
                </div>
                <div>
                  <span className="font-medium">المبلغ:</span>
                  <p className="text-green-600 font-bold">{selectedRequest.amount.toLocaleString()} د.ع</p>
                </div>
                <div>
                  <span className="font-medium">رقم ZainCash:</span>
                  <p className="font-mono">{selectedRequest.zaincash_phone}</p>
                </div>
                <div>
                  <span className="font-medium">التاريخ:</span>
                  <p>{new Date(selectedRequest.created_at).toLocaleString('ar-SA')}</p>
                </div>
                {selectedRequest.notes && (
                  <div className="col-span-2">
                    <span className="font-medium">ملاحظات المستخدم:</span>
                    <p>{selectedRequest.notes}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="font-medium block mb-2">ملاحظات الإدارة:</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="اكتب ملاحظاتك حول هذا الطلب..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleRequestAction(selectedRequest.id, 'approved')}
                  disabled={processing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {processing ? "جارٍ المعالجة..." : "قبول وتحويل المبلغ"}
                </Button>
                <Button
                  onClick={() => handleRequestAction(selectedRequest.id, 'rejected')}
                  disabled={processing}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  رفض الطلب
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
