
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
    const fileName = `payment-proof-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${file.name.split('.').pop()}`;
    
    const { data, error } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(fileName);

    return publicData.publicUrl;
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
      // رفع إثبات الدفع
      const proofUrl = await uploadProofImage(proofFile);

      // إنشاء معاملة الشحن
      const { data: transaction, error } = await supabase
        .from('charge_transactions')
        .insert({
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
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("تم إرسال طلب الشحن بنجاح! سيتم مراجعته قريباً");
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
