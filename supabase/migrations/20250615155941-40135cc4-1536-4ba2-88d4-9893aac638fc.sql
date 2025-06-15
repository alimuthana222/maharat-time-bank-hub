
-- إزالة جدول معاملات Zain Cash إذا كان موجوداً
DROP TABLE IF EXISTS public.zain_cash_transactions CASCADE;

-- تحديث جدول الدفعات لإزالة مراجع Zain Cash
ALTER TABLE public.payments 
DROP COLUMN IF EXISTS zain_cash_transaction_id,
DROP COLUMN IF EXISTS phone_number;

-- تحديث قيود payment_method لإزالة zain_cash
ALTER TABLE public.payments 
DROP CONSTRAINT IF EXISTS payments_payment_method_check;

ALTER TABLE public.payments 
ADD CONSTRAINT payments_payment_method_check 
CHECK (payment_method IN ('wallet', 'mastercard'));

-- إنشاء bucket للملفات إذا لم يكن موجوداً
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads',
  'uploads',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain']
) ON CONFLICT (id) DO NOTHING;

-- سياسات storage للرفع والعرض
DO $$ 
BEGIN
  -- التحقق من وجود السياسة قبل إنشائها
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view uploads'
  ) THEN
    CREATE POLICY "Anyone can view uploads" ON storage.objects
    FOR SELECT USING (bucket_id = 'uploads');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload files'
  ) THEN
    CREATE POLICY "Authenticated users can upload files" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'uploads' AND
      auth.role() = 'authenticated'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update own files'
  ) THEN
    CREATE POLICY "Users can update own files" ON storage.objects
    FOR UPDATE USING (
      bucket_id = 'uploads' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete own files'
  ) THEN
    CREATE POLICY "Users can delete own files" ON storage.objects
    FOR DELETE USING (
      bucket_id = 'uploads' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;
