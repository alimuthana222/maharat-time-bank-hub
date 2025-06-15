
-- إنشاء جدول طلبات السحب
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount numeric NOT NULL CHECK (amount > 0),
    zaincash_phone text NOT NULL,
    notes text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    admin_id uuid REFERENCES auth.users(id),
    admin_notes text,
    processed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- إنشاء فهرس للاستعلامات السريعة
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON public.withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON public.withdrawal_requests(status);

-- تفعيل RLS
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- سياسة للمستخدمين لعرض طلباتهم فقط
CREATE POLICY "Users can view their own withdrawal requests" 
ON public.withdrawal_requests 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- سياسة للمستخدمين لإنشاء طلبات سحب
CREATE POLICY "Users can create withdrawal requests" 
ON public.withdrawal_requests 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- سياسة للإدارة لعرض جميع الطلبات
CREATE POLICY "Admins can view all withdrawal requests" 
ON public.withdrawal_requests 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'owner')
  )
);
