
-- إنشاء جدول معاملات Zain Cash
CREATE TABLE public.zain_cash_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  transaction_id TEXT UNIQUE NOT NULL,
  phone_number TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'payment')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تحديث جدول الدفعات ليدعم Zain Cash
ALTER TABLE public.payments 
DROP COLUMN IF EXISTS stripe_payment_intent_id,
ADD COLUMN zain_cash_transaction_id TEXT,
ADD COLUMN phone_number TEXT;

-- تحديث عمود payment_method ليقبل zain_cash فقط
ALTER TABLE public.payments 
DROP CONSTRAINT IF EXISTS payments_payment_method_check;

ALTER TABLE public.payments 
ADD CONSTRAINT payments_payment_method_check 
CHECK (payment_method = 'zain_cash');

-- تفعيل RLS لجدول معاملات Zain Cash
ALTER TABLE public.zain_cash_transactions ENABLE ROW LEVEL SECURITY;

-- سياسات RLS لمعاملات Zain Cash
CREATE POLICY "Users can view their own zain cash transactions" 
ON public.zain_cash_transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own zain cash transactions" 
ON public.zain_cash_transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own zain cash transactions" 
ON public.zain_cash_transactions FOR UPDATE 
USING (auth.uid() = user_id);

-- إنشاء جدول أرصدة المستخدمين
CREATE TABLE public.user_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users UNIQUE NOT NULL,
  balance DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  reserved_balance DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل RLS لجدول الأرصدة
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;

-- سياسات RLS للأرصدة
CREATE POLICY "Users can view their own balance" 
ON public.user_balances FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own balance" 
ON public.user_balances FOR UPDATE 
USING (auth.uid() = user_id);

-- إنشاء trigger لإنشاء رصيد تلقائي للمستخدمين الجدد
CREATE OR REPLACE FUNCTION public.create_user_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_balances (user_id, balance, reserved_balance)
  VALUES (NEW.id, 0.00, 0.00);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_balance
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_balance();

-- إنشاء دالة لتحديث الرصيد
CREATE OR REPLACE FUNCTION public.update_user_balance(
  _user_id UUID,
  _amount DECIMAL(10,2),
  _transaction_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF _transaction_type = 'deposit' THEN
    UPDATE public.user_balances 
    SET balance = balance + _amount,
        updated_at = now()
    WHERE user_id = _user_id;
  ELSIF _transaction_type = 'withdrawal' OR _transaction_type = 'payment' THEN
    UPDATE public.user_balances 
    SET balance = balance - _amount,
        updated_at = now()
    WHERE user_id = _user_id AND balance >= _amount;
    
    IF NOT FOUND THEN
      RETURN FALSE; -- رصيد غير كافي
    END IF;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- إضافة فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_zain_cash_transactions_user ON public.zain_cash_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_zain_cash_transactions_status ON public.zain_cash_transactions(status);
CREATE INDEX IF NOT EXISTS idx_user_balances_user ON public.user_balances(user_id);
