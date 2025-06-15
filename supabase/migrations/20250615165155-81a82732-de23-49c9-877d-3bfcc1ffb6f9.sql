
-- إنشاء bucket لحفظ إثباتات الدفع
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- إنشاء سياسة للسماح للمستخدمين برفع الملفات
CREATE POLICY "Users can upload payment proofs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- إنشاء سياسة للسماح بقراءة الملفات للجميع
CREATE POLICY "Anyone can view payment proofs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-proofs');

-- إنشاء سياسة للسماح للمشرفين بحذف الملفات إذا لزم الأمر
CREATE POLICY "Admins can delete payment proofs" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'payment-proofs' AND EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND role IN ('admin', 'owner')
));
