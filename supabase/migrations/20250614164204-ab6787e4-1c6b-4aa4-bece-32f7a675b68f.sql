
-- Add listing_type column to marketplace_listings table to distinguish between offers and requests
ALTER TABLE public.marketplace_listings 
ADD COLUMN listing_type TEXT DEFAULT 'offer';

-- Add a check constraint to ensure only valid values
ALTER TABLE public.marketplace_listings 
ADD CONSTRAINT listing_type_check CHECK (listing_type IN ('offer', 'request'));

-- Update the default value for existing records to be 'offer'
UPDATE public.marketplace_listings 
SET listing_type = 'offer' 
WHERE listing_type IS NULL;
