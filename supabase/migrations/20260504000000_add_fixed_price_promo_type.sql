-- Agrega soporte para el tipo de descuento FIXED_PRICE al motor de promociones.
-- FIXED_PRICE establece un precio final exacto en lugar de restar un monto.

ALTER TABLE public.promo_code
  DROP CONSTRAINT IF EXISTS promo_code_discount_type_check;

ALTER TABLE public.promo_code
  ADD CONSTRAINT promo_code_discount_type_check
  CHECK (discount_type IN ('PERCENTAGE', 'FIXED', 'FIXED_PRICE'));
