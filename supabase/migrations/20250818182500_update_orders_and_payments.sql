-- 1. Añadir nuevas columnas a la tabla de pagos
ALTER TABLE public.payments
ADD COLUMN amount NUMERIC NOT NULL DEFAULT 0,
ADD COLUMN promo_code_id UUID REFERENCES public.promo_code(id);

-- 2. Actualizar el monto de los pagos existentes basándose en el precio del producto en la orden
UPDATE public.payments p
SET amount = pr.price
FROM public.orders o
JOIN public.products pr ON o.product_id = pr.id
WHERE p.order_id = o.id;

-- 3. Añadir la columna payment_id a la tabla de ordenes
ALTER TABLE public.orders
ADD COLUMN payment_id UUID;

-- 4. Actualizar las ordenes existentes con el payment_id correspondiente
UPDATE public.orders o
SET payment_id = p.id
FROM public.payments p
WHERE p.order_id = o.id;

-- 5. Añadir la restricción de clave foránea para payment_id
ALTER TABLE public.orders
ADD CONSTRAINT orders_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id);

-- 6. Eliminar la columna order_id de la tabla de pagos
ALTER TABLE public.payments
DROP COLUMN order_id;
