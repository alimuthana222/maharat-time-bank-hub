
-- Create events table for real event management
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  organizer_id UUID REFERENCES auth.users NOT NULL,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  is_online BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event registrations table
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  UNIQUE(event_id, user_id)
);

-- Create posts table for real community features
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users NOT NULL,
  category TEXT,
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create post likes table
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create post comments table
CREATE TABLE public.post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin actions log table
CREATE TABLE public.admin_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users NOT NULL,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system settings table
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create university data table for Iraqi universities
CREATE TABLE public.universities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  city TEXT NOT NULL,
  country TEXT DEFAULT 'العراق',
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert Iraqi universities
INSERT INTO public.universities (name_ar, name_en, city) VALUES
('جامعة بغداد', 'University of Baghdad', 'بغداد'),
('الجامعة المستنصرية', 'Al-Mustansiriyah University', 'بغداد'),
('الجامعة التكنولوجية', 'University of Technology', 'بغداد'),
('جامعة البصرة', 'University of Basrah', 'البصرة'),
('جامعة الموصل', 'University of Mosul', 'الموصل'),
('جامعة الكوفة', 'University of Kufa', 'النجف'),
('جامعة كربلاء', 'University of Kerbala', 'كربلاء'),
('جامعة بابل', 'University of Babylon', 'الحلة'),
('جامعة الأنبار', 'University of Anbar', 'الرمادي'),
('جامعة تكريت', 'University of Tikrit', 'تكريت'),
('جامعة ديالى', 'University of Diyala', 'بعقوبة'),
('جامعة كركوك', 'University of Kirkuk', 'كركوك'),
('جامعة السليمانية', 'University of Sulaimani', 'السليمانية'),
('جامعة دهوك', 'University of Duhok', 'دهوك'),
('جامعة صلاح الدين', 'University of Salahaddin', 'أربيل');

-- Enable RLS on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update their events" ON public.events FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Organizers can delete their events" ON public.events FOR DELETE USING (auth.uid() = organizer_id);

-- RLS Policies for event registrations
CREATE POLICY "Users can view their registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their registrations" ON public.event_registrations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can cancel their registrations" ON public.event_registrations FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for community posts
CREATE POLICY "Anyone can view posts" ON public.community_posts FOR SELECT USING (NOT is_hidden);
CREATE POLICY "Users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update their posts" ON public.community_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete their posts" ON public.community_posts FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for post likes
CREATE POLICY "Users can view likes" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Users can like posts" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike posts" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for post comments
CREATE POLICY "Anyone can view comments" ON public.post_comments FOR SELECT USING (NOT is_hidden);
CREATE POLICY "Users can create comments" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update their comments" ON public.post_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete their comments" ON public.post_comments FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for admin actions (admin only)
CREATE POLICY "Admins can view all actions" ON public.admin_actions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can log actions" ON public.admin_actions FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for system settings (admin/owner only)
CREATE POLICY "Admins can view settings" ON public.system_settings FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Admins can update settings" ON public.system_settings FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner'));

-- RLS Policies for universities (public read, admin write)
CREATE POLICY "Anyone can view universities" ON public.universities FOR SELECT USING (true);
CREATE POLICY "Admins can manage universities" ON public.universities FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner'));

-- Create functions for real-time updates
CREATE OR REPLACE FUNCTION public.increment_post_likes() RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.community_posts 
  SET likes_count = likes_count + 1 
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.decrement_post_likes() RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.community_posts 
  SET likes_count = likes_count - 1 
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.increment_post_comments() RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.community_posts 
  SET comments_count = comments_count + 1 
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.decrement_post_comments() RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.community_posts 
  SET comments_count = comments_count - 1 
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.increment_event_attendees() RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.events 
  SET current_attendees = current_attendees + 1 
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.decrement_event_attendees() RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.events 
  SET current_attendees = current_attendees - 1 
  WHERE id = OLD.event_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER on_like_added AFTER INSERT ON public.post_likes FOR EACH ROW EXECUTE FUNCTION public.increment_post_likes();
CREATE TRIGGER on_like_removed AFTER DELETE ON public.post_likes FOR EACH ROW EXECUTE FUNCTION public.decrement_post_likes();
CREATE TRIGGER on_comment_added AFTER INSERT ON public.post_comments FOR EACH ROW EXECUTE FUNCTION public.increment_post_comments();
CREATE TRIGGER on_comment_removed AFTER DELETE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION public.decrement_post_comments();
CREATE TRIGGER on_registration_added AFTER INSERT ON public.event_registrations FOR EACH ROW EXECUTE FUNCTION public.increment_event_attendees();
CREATE TRIGGER on_registration_removed AFTER DELETE ON public.event_registrations FOR EACH ROW EXECUTE FUNCTION public.decrement_event_attendees();

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, description) VALUES
('site_name', '"منصة تبادل المهارات"', 'اسم الموقع'),
('site_description', '"منصة لتبادل المهارات والمعرفة بين طلاب الجامعات العراقية"', 'وصف الموقع'),
('default_country', '"العراق"', 'البلد الافتراضي'),
('supported_countries', '["العراق", "السعودية", "الأردن", "لبنان", "سوريا"]', 'البلدان المدعومة'),
('time_bank_enabled', 'true', 'تفعيل نظام بنك الوقت'),
('events_enabled', 'true', 'تفعيل نظام الفعاليات'),
('community_enabled', 'true', 'تفعيل المجتمع'),
('marketplace_enabled', 'true', 'تفعيل السوق');

-- Enable real-time for tables
ALTER TABLE public.events REPLICA IDENTITY FULL;
ALTER TABLE public.event_registrations REPLICA IDENTITY FULL;
ALTER TABLE public.community_posts REPLICA IDENTITY FULL;
ALTER TABLE public.post_likes REPLICA IDENTITY FULL;
ALTER TABLE public.post_comments REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments;
