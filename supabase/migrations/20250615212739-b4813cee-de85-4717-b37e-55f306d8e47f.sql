
-- أولاً، دعنا نرى ما هي قيم payment_method الموجودة
-- ثم نقوم بتحديثها قبل تطبيق القيود

-- تحديث جميع المعاملات من mastercard إلى zaincash_manual أولاً
UPDATE public.charge_transactions 
SET payment_method = 'zaincash_manual' 
WHERE payment_method = 'mastercard';

UPDATE public.payments 
SET payment_method = 'zaincash_manual' 
WHERE payment_method = 'mastercard';

-- الآن إزالة القيود القديمة وإضافة الجديدة
ALTER TABLE public.payments 
DROP CONSTRAINT IF EXISTS payments_payment_method_check;

ALTER TABLE public.charge_transactions 
DROP CONSTRAINT IF EXISTS charge_transactions_payment_method_check;

-- إضافة القيود الجديدة
ALTER TABLE public.payments 
ADD CONSTRAINT payments_payment_method_check 
CHECK (payment_method IN ('wallet', 'zaincash_manual'));

ALTER TABLE public.charge_transactions 
ADD CONSTRAINT charge_transactions_payment_method_check 
CHECK (payment_method IN ('admin_credit', 'zaincash_manual'));
