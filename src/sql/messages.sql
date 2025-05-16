
-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users NOT NULL,
  receiver_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see messages they sent or received
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT messages they sent or received
CREATE POLICY "Users can view their own messages" 
  ON public.messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Create policy that allows users to INSERT messages if they are the sender
CREATE POLICY "Users can send messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Create policy that allows users to UPDATE messages they received (to mark as read)
CREATE POLICY "Users can update received messages" 
  ON public.messages 
  FOR UPDATE
  USING (auth.uid() = receiver_id);

-- Add function to update last_seen in profiles table
CREATE OR REPLACE FUNCTION public.update_user_last_seen()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET last_seen = now()
  WHERE id = auth.uid();
  RETURN NEW;
END;
$$;

-- Create trigger to update last_seen whenever a message is sent
CREATE TRIGGER update_sender_last_seen
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_last_seen();

-- Add last_seen column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE;
