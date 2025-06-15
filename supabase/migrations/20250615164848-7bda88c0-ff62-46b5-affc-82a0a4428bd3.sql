
-- إضافة دعم ZainCash اليدوي
ALTER TABLE public.payments 
DROP CONSTRAINT IF EXISTS payments_payment_method_check;

ALTER TABLE public.payments 
ADD CONSTRAINT payments_payment_method_check 
CHECK (payment_method IN ('wallet', 'mastercard', 'zaincash_manual', 'payoneer'));

-- إضافة أعمدة للدفع اليدوي
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS zaincash_phone TEXT,
ADD COLUMN IF NOT EXISTS zaincash_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
ADD COLUMN IF NOT EXISTS manual_verification_status TEXT DEFAULT 'pending' CHECK (manual_verification_status IN ('pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS verified_by UUID,
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- تحديث جدول charge_transactions لدعم ZainCash اليدوي
ALTER TABLE public.charge_transactions 
DROP CONSTRAINT IF EXISTS charge_transactions_payment_method_check;

ALTER TABLE public.charge_transactions 
ADD CONSTRAINT charge_transactions_payment_method_check 
CHECK (payment_method IN ('mastercard', 'admin_credit', 'zaincash_manual', 'payoneer'));

-- إضافة أعمدة للشحن اليدوي
ALTER TABLE public.charge_transactions 
ADD COLUMN IF NOT EXISTS zaincash_phone TEXT,
ADD COLUMN IF NOT EXISTS zaincash_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
ADD COLUMN IF NOT EXISTS manual_verification_status TEXT DEFAULT 'pending' CHECK (manual_verification_status IN ('pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS verified_by UUID,
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- إنشاء جدول لحفظ معلومات ZainCash للتجار
CREATE TABLE IF NOT EXISTS public.merchant_zaincash_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_name TEXT NOT NULL,
  zaincash_phone TEXT NOT NULL,
  zaincash_name TEXT NOT NULL,
  instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إدخال معلومات التاجر الافتراضية
INSERT INTO public.merchant_zaincash_info (merchant_name, zaincash_phone, zaincash_name, instructions) 
VALUES (
  'منصة المهارات الطلابية',
  '07901234567',
  'اسم التاجر',
  'يرجى إرسال المبلغ إلى رقم ZainCash المذكور ثم رفع صورة من إثبات الدفع'
) ON CONFLICT DO NOTHING;

-- إنشاء فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_payments_verification_status ON public.payments(manual_verification_status);
CREATE INDEX IF NOT EXISTS idx_charge_transactions_verification_status ON public.charge_transactions(manual_verification_status);
