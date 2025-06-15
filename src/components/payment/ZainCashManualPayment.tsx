import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, Copy, CheckCircle, Phone, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface ZainCashManualPaymentProps {
  amount: number;
  description: string;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

export function ZainCashManualPayment({ 
  amount, 
  description, 
  onSuccess, 
  onCancel 
}: ZainCashManualPaymentProps) {
  const { user } = useAuth();
  const [merchantInfo, setMerchantInfo] = useState<any>(null);
  const [zaincashPhone, setZaincashPhone] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    fetchMerchantInfo();
  }, []);

  const fetchMerchantInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('merchant_zaincash_info')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setMerchantInfo(data);
    } catch (error) {
      console.error('Error fetching merchant info:', error);
      toast.error("خطأ في جلب معلومات التاجر");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("تم نسخ الرقم");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("فشل في نسخ الرقم");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        toast.error("يرجى اختيار صورة صحيحة");
        return;
      }
      
      // التحقق من حجم الملف (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
        return;
      }
      
      setProofFile(file);
    }
  };

  const uploadProofImage = async (file: File): Promise<string> => {
    // إنشاء اسم ملف فريد مع معرف المستخدم
    const fileExt = file.name.split('.').pop();
    const fileName = `${user!.id}/payment-proof-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    
    console.log('Uploading file:', fileName);
    console.log('File size:', file.size);
    console.log('File type:', file.type);
    
    const { data, error } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`فشل في رفع الصورة: ${error.message}`);
    }

    console.log('Upload successful:', data);

    const { data: publicData } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  };

  const notifyAdmins = async (transactionId: string) => {
    try {
      // جلب جميع المشرفين والإداريين
      const { data: adminUsers, error } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('role', ['admin', 'owner', 'moderator']);

      if (error) {
        console.error('Error fetching admin users:', error);
        return;
      }

      // إرسال إشعار لكل مشرف
      for (const admin of adminUsers || []) {
        await supabase.rpc('send_notification', {
          _user_id: admin.user_id,
          _title: 'طلب شحن جديد',
          _body: `تم استلام طلب شحن جديد بقيمة ${amount.toLocaleString()} دينار عراقي عبر ZainCash يتطلب المراجعة`,
          _type: 'transaction',
          _related_id: transactionId,
          _related_type: 'charge_transaction'
        });
      }

      console.log('Admin notifications sent successfully');
    } catch (error) {
      console.error('Error sending admin notifications:', error);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!zaincashPhone || !transactionId || !proofFile) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    
    try {
      console.log('Starting payment submission...');
      console.log('User ID:', user.id);
      console.log('Amount:', amount);
      console.log('Phone:', zaincashPhone);
      console.log('Transaction ID:', transactionId);

      // رفع إثبات الدفع
      console.log('Uploading proof image...');
      const proofUrl = await uploadProofImage(proofFile);
      console.log('Proof uploaded successfully:', proofUrl);

      // إنشاء معاملة الشحن
      const transactionData = {
        user_id: user.id,
        amount,
        payment_method: 'zaincash_manual',
        status: 'pending',
        notes: description,
        zaincash_phone: zaincashPhone,
        zaincash_transaction_id: transactionId,
        payment_proof_url: proofUrl,
        manual_verification_status: 'pending',
        transaction_id: `ZAINCASH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      console.log('Creating transaction with data:', transactionData);

      const { data: transaction, error } = await supabase
        .from('charge_transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) {
        console.error('Transaction creation error:', error);
        throw new Error(`فشل في إنشاء المعاملة: ${error.message}`);
      }

      console.log('Transaction created successfully:', transaction);

      // إرسال إشعارات للمشرفين
      await notifyAdmins(transaction.transaction_id);

      toast.success("تم إرسال طلب الشحن بنجاح! سيتم مراجعته قريباً وتم إشعار الإدارة");
      onSuccess(transaction.transaction_id);

    } catch (error: any) {
      console.error('Error submitting payment:', error);
      toast.error(`خطأ في إرسال الطلب: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!merchantInfo) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            الدفع عبر ZainCash
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">معلومات التاجر:</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">اسم التاجر:</span>
                <span className="font-medium">{merchantInfo.zaincash_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">رقم ZainCash:</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-lg font-mono">
                    {merchantInfo.zaincash_phone}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(merchantInfo.zaincash_phone)}
                    className="h-8 w-8 p-0"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="text-center text-2xl font-bold text-green-600">
                {amount.toLocaleString()} د.ع
              </div>
            </div>
          </div>

          <Alert>
            <Phone className="h-4 w-4" />
            <AlertDescription>
              {merchantInfo.instructions}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label htmlFor="zaincash_phone">رقم هاتفك المرسل منه</Label>
              <Input
                id="zaincash_phone"
                type="tel"
                value={zaincashPhone}
                onChange={(e) => setZaincashPhone(e.target.value)}
                placeholder="07xxxxxxxxx"
                className="text-right"
                dir="rtl"
              />
            </div>

            <div>
              <Label htmlFor="transaction_id">رقم العملية من ZainCash</Label>
              <Input
                id="transaction_id"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="رقم العملية من تطبيق ZainCash"
                className="text-right"
                dir="rtl"
              />
            </div>

            <div>
              <Label htmlFor="proof_upload">إثبات الدفع (صورة)</Label>
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {proofFile ? proofFile.name : "اختر صورة إثبات الدفع"}
                </Button>
                {proofFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ تم اختيار الصورة: {proofFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={loading || !zaincashPhone || !transactionId || !proofFile}
              className="flex-1"
            >
              {loading ? "جارٍ الإرسال..." : "إرسال طلب الشحن"}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
