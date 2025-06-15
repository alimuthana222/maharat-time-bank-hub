
-- إزالة دعم ZainCash وإضافة دعم Payoneer
ALTER TABLE public.payments 
DROP CONSTRAINT IF EXISTS payments_payment_method_check;

ALTER TABLE public.payments 
ADD CONSTRAINT payments_payment_method_check 
CHECK (payment_method IN ('wallet', 'mastercard', 'payoneer'));

-- إزالة أعمدة ZainCash
ALTER TABLE public.payments 
DROP COLUMN IF EXISTS zain_cash_transaction_id,
DROP COLUMN IF EXISTS phone_number;

-- إضافة أعمدة Payoneer
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS payoneer_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS payoneer_payer_id TEXT;

-- حذف جدول ZainCash إذا كان موجوداً
DROP TABLE IF EXISTS public.zain_cash_transactions;

-- إنشاء جدول معاملات Payoneer
CREATE TABLE IF NOT EXISTS public.payoneer_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  transaction_id TEXT UNIQUE NOT NULL,
  payer_id TEXT,
  recipient_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'payment', 'transfer')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  description TEXT,
  payoneer_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل RLS لجدول معاملات Payoneer
ALTER TABLE public.payoneer_transactions ENABLE ROW LEVEL SECURITY;

-- سياسات RLS لمعاملات Payoneer
CREATE POLICY "Users can view their own payoneer transactions" 
ON public.payoneer_transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payoneer transactions" 
ON public.payoneer_transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payoneer transactions" 
ON public.payoneer_transactions FOR UPDATE 
USING (auth.uid() = user_id);

-- إضافة فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_payoneer_transactions_user ON public.payoneer_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payoneer_transactions_status ON public.payoneer_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payoneer_transactions_transaction_id ON public.payoneer_transactions(transaction_id);

-- تحديث جدول charge_transactions لدعم Payoneer
ALTER TABLE public.charge_transactions 
DROP CONSTRAINT IF EXISTS charge_transactions_payment_method_check;

ALTER TABLE public.charge_transactions 
ADD CONSTRAINT charge_transactions_payment_method_check 
CHECK (payment_method IN ('mastercard', 'admin_credit', 'payoneer'));
