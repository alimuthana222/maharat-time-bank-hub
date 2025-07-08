-- Update notification function to use SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.send_notification(
  _user_id UUID,
  _title TEXT,
  _body TEXT,
  _type TEXT DEFAULT 'system',
  _related_id TEXT DEFAULT NULL,
  _related_type TEXT DEFAULT NULL
) RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, body, type, related_id, related_type)
  VALUES (_user_id, _title, _body, _type, _related_id, _related_type)
  RETURNING id INTO _notification_id;
  
  RETURN _notification_id;
END;
$$;

-- Update trigger functions to use SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_report_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Send notification to reporter about status change
  IF OLD.status != NEW.status THEN
    IF NEW.status = 'resolved' THEN
      PERFORM public.send_notification(
        NEW.reporter_id, 
        'تم قبول بلاغك', 
        'تم مراجعة بلاغك والموافقة عليه واتخاذ الإجراء المناسب.', 
        'report',
        NEW.id,
        'content_report'
      );
    ELSIF NEW.status = 'rejected' THEN
      PERFORM public.send_notification(
        NEW.reporter_id, 
        'تم رفض بلاغك', 
        'تم مراجعة بلاغك ورفضه. لمزيد من المعلومات، يرجى التواصل مع الإدارة.', 
        'report',
        NEW.id,
        'content_report'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_new_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create the triggers if they don't exist
DROP TRIGGER IF EXISTS on_booking_created ON public.bookings;
CREATE TRIGGER on_booking_created
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_booking();