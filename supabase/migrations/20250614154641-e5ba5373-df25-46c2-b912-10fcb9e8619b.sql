
-- إضافة جدول التقييمات والمراجعات
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID REFERENCES auth.users NOT NULL,
  reviewed_user_id UUID REFERENCES auth.users NOT NULL,
  service_id UUID,
  transaction_id UUID,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة جدول الحجوزات
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES auth.users NOT NULL,
  provider_id UUID REFERENCES auth.users NOT NULL,
  service_id UUID,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- بالدقائق
  total_hours INTEGER NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة جدول المدفوعات
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payer_id UUID REFERENCES auth.users NOT NULL,
  receiver_id UUID REFERENCES auth.users NOT NULL,
  booking_id UUID REFERENCES public.bookings,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة جدول التصنيفات
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES public.categories,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة التصنيفات الأساسية
INSERT INTO public.categories (name_ar, name_en, description, icon) VALUES
('برمجة وتطوير', 'Programming & Development', 'خدمات البرمجة وتطوير المواقع والتطبيقات', 'Code'),
('التصميم', 'Design', 'التصميم الجرافيكي وتصميم المواقع', 'Palette'),
('التدريس والتعليم', 'Teaching & Education', 'الدروس الخصوصية والتدريس', 'BookOpen'),
('الترجمة', 'Translation', 'خدمات الترجمة بين اللغات', 'Languages'),
('الكتابة والمحتوى', 'Writing & Content', 'كتابة المقالات والمحتوى', 'PenTool'),
('التسويق الرقمي', 'Digital Marketing', 'خدمات التسويق عبر الإنترنت', 'TrendingUp'),
('الاستشارات', 'Consulting', 'الاستشارات الأكاديمية والمهنية', 'Users'),
('أخرى', 'Others', 'خدمات أخرى متنوعة', 'Grid');

-- إضافة Storage bucket للملفات
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', false);

-- تفعيل RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- سياسات RLS للتقييمات
CREATE POLICY "Users can view all reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their bookings" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);

-- سياسات RLS للحجوزات
CREATE POLICY "Users can view their bookings" ON public.bookings FOR SELECT USING (auth.uid() = client_id OR auth.uid() = provider_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Providers can update booking status" ON public.bookings FOR UPDATE USING (auth.uid() = provider_id OR auth.uid() = client_id);

-- سياسات RLS للمدفوعات
CREATE POLICY "Users can view their payments" ON public.payments FOR SELECT USING (auth.uid() = payer_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can create payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = payer_id);

-- سياسات RLS للتصنيفات
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- سياسات Storage
CREATE POLICY "Users can upload their own avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view all avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload service images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'service-images');
CREATE POLICY "Anyone can view service images" ON storage.objects FOR SELECT USING (bucket_id = 'service-images');

-- إضافة أعمدة مفقودة للجداول الموجودة
ALTER TABLE public.marketplace_listings ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.marketplace_listings ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE public.marketplace_listings ADD COLUMN IF NOT EXISTS requirements TEXT;
ALTER TABLE public.marketplace_listings ADD COLUMN IF NOT EXISTS delivery_time INTEGER DEFAULT 1;

-- إضافة فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_user ON public.reviews(reviewed_user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_category ON public.marketplace_listings(category);

-- وظائف لحساب متوسط التقييمات
CREATE OR REPLACE FUNCTION public.get_user_rating(user_id UUID)
RETURNS DECIMAL(3,2)
LANGUAGE SQL
STABLE
AS $$
  SELECT COALESCE(AVG(rating::DECIMAL), 0)
  FROM public.reviews
  WHERE reviewed_user_id = user_id;
$$;

-- إضافة إشعارات للحجوزات
CREATE OR REPLACE FUNCTION public.notify_new_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.send_notification(
    NEW.provider_id,
    'حجز جديد',
    'لديك حجز جديد يتطلب الموافقة',
    'booking',
    NEW.id::text,
    'booking'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_booking
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_booking();
