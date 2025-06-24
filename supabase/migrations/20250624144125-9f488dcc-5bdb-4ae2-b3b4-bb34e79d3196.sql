
-- إصلاح قيود قاعدة البيانات للسماح بالقيم الصحيحة
ALTER TABLE public.marketplace_listings 
DROP CONSTRAINT IF EXISTS marketplace_listings_type_check;

-- إضافة القيد الصحيح الذي يتطابق مع القيم المستخدمة في التطبيق
ALTER TABLE public.marketplace_listings 
ADD CONSTRAINT marketplace_listings_type_check 
CHECK (type IN ('service', 'skill_exchange', 'consultation', 'course', 'project'));
