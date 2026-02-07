-- Migration: Add updated_at to products table
-- Description: Adds updated_at column to track when products were last modified

-- 1. Add updated_at column to products table
ALTER TABLE public.products 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL;

-- 2. Initialize updated_at with created_at for existing products
UPDATE public.products 
SET updated_at = created_at;

-- 3. Create function to auto-update updated_at on row update
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger to automatically update updated_at on products update
CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Add comment for documentation
COMMENT ON COLUMN public.products.updated_at IS 'Timestamp of when the product was last updated';
