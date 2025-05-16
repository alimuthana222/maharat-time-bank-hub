
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('message', 'system', 'event', 'transaction', 'report')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  related_id TEXT,
  related_type TEXT
);

-- Add Row Level Security (RLS) to ensure users can only see their own notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to UPDATE (mark as read) their own notifications
CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create a function to send notifications
CREATE OR REPLACE FUNCTION public.send_notification(
  _user_id UUID,
  _title TEXT,
  _body TEXT,
  _type TEXT DEFAULT 'system',
  _related_id TEXT DEFAULT NULL,
  _related_type TEXT DEFAULT NULL
) RETURNS UUID 
LANGUAGE plpgsql
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

-- Create trigger to send notification when a report status changes
CREATE OR REPLACE FUNCTION public.handle_report_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
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

-- Create trigger on content_reports table
CREATE TRIGGER on_report_status_change
  AFTER UPDATE OF status ON public.content_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_report_status_change();
