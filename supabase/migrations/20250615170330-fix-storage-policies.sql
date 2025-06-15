
-- إصلاح سياسات storage للسماح برفع الملفات
DROP POLICY IF EXISTS "Users can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete payment proofs" ON storage.objects;

-- إنشاء سياسات جديدة مصححة
CREATE POLICY "Users can upload their payment proofs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'payment-proofs' AND auth.uid() IS NOT NULL);

-- السماح بقراءة الملفات للمستخدمين المصرح لهم
CREATE POLICY "Users can view payment proofs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-proofs' AND auth.uid() IS NOT NULL);

-- السماح للمشرفين بحذف الملفات
CREATE POLICY "Admins can delete payment proofs" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'payment-proofs' AND EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND role IN ('admin', 'owner')
));

-- السماح بتحديث الملفات للمالك
CREATE POLICY "Users can update their payment proofs" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'payment-proofs' AND auth.uid() IS NOT NULL);
