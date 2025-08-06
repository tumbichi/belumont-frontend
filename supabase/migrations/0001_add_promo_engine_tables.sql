CREATE TABLE public.promo_code (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    code text UNIQUE NOT NULL,
    discount_type text CHECK (discount_type IN ('PERCENTAGE', 'FIXED')) NOT NULL,
    discount_value numeric NOT NULL,
    applies_to_all boolean DEFAULT false NOT NULL,
    max_uses int,
    used_count int DEFAULT 0,
    expires_at timestamptz,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE public.promo_code_product (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    promo_code_id uuid REFERENCES public.promo_code(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION increment_promo_code_usage(promo_code_id_param uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.promo_code
  SET used_count = used_count + 1
  WHERE id = promo_code_id_param;
END;
$$ LANGUAGE plpgsql;
