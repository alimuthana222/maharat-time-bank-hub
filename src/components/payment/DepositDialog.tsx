import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (transactionId: string) => void;
}

export function DepositDialog({ open, onOpenChange, onSuccess }: DepositDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    zaincash_phone: "",
    zaincash_transaction_id: "",
    notes: ""
  });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [merchantInfo, setMerchantInfo] = useState<any>(null);

  React.useEffect(() => {
    if (open) {
      fetchMerchantInfo();
    }
  }, [open]);

  const fetchMerchantInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("merchant_zaincash_info")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error) throw error;
      setMerchantInfo(data);
    } catch (error) {
      console.error("Error fetching merchant info:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("يرجى اختيار ملف صورة صحيح");
        return;
      }
      
      // التحقق من حجم الملف (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت");
        return;
      }
      
      setProofFile(file);
    }
  };

  const uploadProofFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!formData.amount || !formData.zaincash_phone || !formData.zaincash_transaction_id) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (!proofFile) {
      toast.error("يرجى رفع إثبات الدفع");
      return;
    }

    setLoading(true);
    try {
      // رفع ملف إثبات الدفع
      const proofUrl = await uploadProofFile(proofFile);

      // إنشاء طلب الشحن
      const { data, error } = await supabase
        .from("charge_transactions")
        .insert([{
          user_id: user.id,
          amount: parseFloat(formData.amount),
          payment_method: "zaincash_manual",
          zaincash_phone: formData.zaincash_phone,
          zaincash_transaction_id: formData.zaincash_transaction_id,
          payment_proof_url: proofUrl,
          notes: formData.notes || null,
          status: "pending",
          transaction_id: `CHG_${Date.now()}_${user.id.slice(0, 8)}`
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success("تم إرسال طلب الشحن بنجاح. سيتم مراجعته من قبل الإدارة");
      
      // إعادة تعيين النموذج
      setFormData({
        amount: "",
        zaincash_phone: "",
        zaincash_transaction_id: "",
        notes: ""
      });
      setProofFile(null);
      onOpenChange(false);
      
      onSuccess?.(data.id);
    } catch (error) {
      console.error("Error creating charge transaction:", error);
      toast.error("حدث خطأ أثناء إرسال طلب الشحن");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>شحن الرصيد - ZainCash</DialogTitle>
        </DialogHeader>
        
        {merchantInfo && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border">
            <h4 className="font-semibold text-blue-900 mb-2">معلومات التاجر</h4>
            <p className="text-sm text-blue-800">
              <strong>الاسم:</strong> {merchantInfo.zaincash_name}
            </p>
            <p className="text-sm text-blue-800">
              <strong>رقم ZainCash:</strong> {merchantInfo.zaincash_phone}
            </p>
            {merchantInfo.instructions && (
              <p className="text-sm text-blue-700 mt-2">
                <strong>التعليمات:</strong> {merchantInfo.instructions}
              </p>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">المبلغ (د.ع) *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="25000"
              min="1000"
              required
            />
          </div>

          <div>
            <Label htmlFor="zaincash_phone">رقم ZainCash الخاص بك *</Label>
            <Input
              id="zaincash_phone"
              value={formData.zaincash_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, zaincash_phone: e.target.value }))}
              placeholder="07901234567"
              required
            />
          </div>

          <div>
            <Label htmlFor="zaincash_transaction_id">رقم المعاملة في ZainCash *</Label>
            <Input
              id="zaincash_transaction_id"
              value={formData.zaincash_transaction_id}
              onChange={(e) => setFormData(prev => ({ ...prev, zaincash_transaction_id: e.target.value }))}
              placeholder="TXN123456789"
              required
            />
          </div>

          <div>
            <Label htmlFor="proof">إثبات الدفع (صورة) *</Label>
            <div className="mt-1">
              <Input
                id="proof"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              {proofFile && (
                <p className="text-sm text-green-600 mt-1">
                  تم اختيار: {proofFile.name}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">ملاحظات إضافية</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="أي ملاحظات إضافية..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              إرسال طلب الشحن
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
