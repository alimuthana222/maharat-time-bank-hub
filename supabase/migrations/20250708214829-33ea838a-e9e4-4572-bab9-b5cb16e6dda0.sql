-- Add INSERT policy for notifications table to allow system functions to create notifications
CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Also add a policy to allow authenticated users to insert notifications
CREATE POLICY "Authenticated users can create notifications" 
ON public.notifications 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);