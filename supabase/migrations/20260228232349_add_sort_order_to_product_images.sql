-- Add sort_order column to product_images for explicit gallery ordering
ALTER TABLE public.product_images
ADD COLUMN sort_order integer NOT NULL DEFAULT 0;

-- Backfill existing rows: assign sort_order based on current alphabetical ordering
-- (preserves the existing display order)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY resource_url ASC) - 1 AS rn
  FROM public.product_images
)
UPDATE public.product_images pi
SET sort_order = ranked.rn
FROM ranked
WHERE pi.id = ranked.id;

-- Create an index for efficient ordering queries
CREATE INDEX idx_product_images_sort_order ON public.product_images (product_id, sort_order);
