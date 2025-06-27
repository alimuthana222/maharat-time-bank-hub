
-- حذف القيود الموجودة التي تسبب المشكلة
ALTER TABLE public.marketplace_listings 
DROP CONSTRAINT IF EXISTS valid_listing_type;

ALTER TABLE public.marketplace_listings 
DROP CONSTRAINT IF EXISTS marketplace_listings_type_check;

-- إضافة القيود الصحيحة
ALTER TABLE public.marketplace_listings 
ADD CONSTRAINT marketplace_listings_type_check 
CHECK (type IN ('service', 'skill_exchange', 'consultation', 'course', 'project'));

ALTER TABLE public.marketplace_listings 
ADD CONSTRAINT marketplace_listings_listing_type_check 
CHECK (listing_type IN ('offer', 'request'));

-- التأكد من أن جميع الأعمدة المطلوبة موجودة
ALTER TABLE public.marketplace_listings 
ALTER COLUMN title SET NOT NULL,
ALTER COLUMN description SET NOT NULL,
ALTER COLUMN type SET NOT NULL,
ALTER COLUMN category SET NOT NULL,
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN hourly_rate SET NOT NULL;
