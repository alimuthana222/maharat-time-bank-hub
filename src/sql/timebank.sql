
-- Create or update time_bank_balances view
CREATE OR REPLACE VIEW public.time_bank_balances AS
SELECT 
  u.id AS user_id,
  u.username,
  COALESCE(SUM(CASE WHEN t.recipient_id = u.id AND t.status = 'approved' THEN t.hours ELSE 0 END), 0) AS hours_earned,
  COALESCE(SUM(CASE WHEN t.provider_id = u.id AND t.status = 'approved' THEN t.hours ELSE 0 END), 0) AS hours_spent,
  COALESCE(SUM(CASE WHEN (t.provider_id = u.id OR t.recipient_id = u.id) AND t.status = 'pending' THEN t.hours ELSE 0 END), 0) AS hours_pending
FROM 
  public.profiles u
LEFT JOIN 
  public.time_bank_transactions t ON (u.id = t.provider_id OR u.id = t.recipient_id)
GROUP BY 
  u.id, u.username;
  
-- Function to notify transaction status changes
CREATE OR REPLACE FUNCTION public.handle_timebank_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Send notification to provider about status change
  IF OLD.status != NEW.status THEN
    IF NEW.status = 'approved' THEN
      PERFORM public.send_notification(
        NEW.provider_id, 
        'تمت الموافقة على معاملتك', 
        CONCAT('تمت الموافقة على معاملتك البالغة ', NEW.hours, ' ساعات.'), 
        'transaction',
        NEW.id,
        'time_bank_transaction'
      );
      
      -- Also notify recipient
      PERFORM public.send_notification(
        NEW.recipient_id, 
        CONCAT('تم إضافة ', NEW.hours, ' ساعات إلى رصيدك'), 
        'تمت إضافة ساعات إلى رصيدك في بنك الوقت.', 
        'transaction',
        NEW.id,
        'time_bank_transaction'
      );
    ELSIF NEW.status = 'rejected' THEN
      PERFORM public.send_notification(
        NEW.provider_id, 
        'تم رفض معاملتك', 
        CONCAT('تم رفض معاملتك البالغة ', NEW.hours, ' ساعات.'), 
        'transaction',
        NEW.id,
        'time_bank_transaction'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on time_bank_transactions table
CREATE TRIGGER on_timebank_status_change
  AFTER UPDATE OF status ON public.time_bank_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_timebank_status_change();

-- Send notification when a new transaction is created
CREATE OR REPLACE FUNCTION public.handle_new_timebank_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Send notification to recipient about new transaction
  PERFORM public.send_notification(
    NEW.recipient_id, 
    'لديك معاملة جديدة في بنك الوقت', 
    CONCAT('تم استلام معاملة جديدة بقيمة ', NEW.hours, ' ساعات.'), 
    'transaction',
    NEW.id,
    'time_bank_transaction'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new time bank transactions
CREATE TRIGGER on_new_timebank_transaction
  AFTER INSERT ON public.time_bank_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_timebank_transaction();

-- Add Row Level Security to time_bank_transactions
ALTER TABLE IF EXISTS public.time_bank_transactions ENABLE ROW LEVEL SECURITY;

-- Allow users to view transactions they are involved in
CREATE POLICY "Users can view their own transactions" ON public.time_bank_transactions
  FOR SELECT
  USING (auth.uid() = provider_id OR auth.uid() = recipient_id);

-- Allow users to insert transactions where they are the provider
CREATE POLICY "Users can create transactions as provider" ON public.time_bank_transactions
  FOR INSERT
  WITH CHECK (auth.uid() = provider_id);

-- Allow recipients to update status
CREATE POLICY "Recipients can update transaction status" ON public.time_bank_transactions
  FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (NEW.status IN ('approved', 'rejected') AND OLD.status = 'pending');

-- Allow admins and moderators to update any transaction
CREATE POLICY "Admins and moderators can update any transaction" ON public.time_bank_transactions
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));
