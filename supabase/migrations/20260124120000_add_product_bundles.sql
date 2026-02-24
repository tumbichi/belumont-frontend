-- Migration: Add Product Bundles Support
-- Description: Allows products to be bundles containing multiple child products

-- 1. Hacer download_url nullable (para bundles que no tienen download propio)
ALTER TABLE products 
ALTER COLUMN download_url DROP NOT NULL;

-- 2. Agregar columna product_type a products
ALTER TABLE products 
ADD COLUMN product_type TEXT DEFAULT 'single' NOT NULL
CHECK (product_type IN ('single', 'bundle'));

-- 3. Crear tabla de items del bundle
CREATE TABLE product_bundle_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bundle_id, product_id)
);

-- 4. Constraint: un bundle no puede contenerse a sí mismo
ALTER TABLE product_bundle_items
ADD CONSTRAINT bundle_cannot_contain_itself 
CHECK (bundle_id != product_id);

-- 5. Comentarios
COMMENT ON TABLE product_bundle_items IS 'Items que componen un bundle de productos';
COMMENT ON COLUMN products.product_type IS 'Tipo de producto: single (individual) o bundle (pack)';

-- 6. RLS Policies para product_bundle_items
ALTER TABLE product_bundle_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for anon" ON product_bundle_items
FOR SELECT TO anon USING (true);

CREATE POLICY "Enable read access for service role" ON product_bundle_items
FOR SELECT TO service_role USING (true);

CREATE POLICY "Enable insert for service role" ON product_bundle_items
FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON product_bundle_items
FOR UPDATE TO service_role USING (true);

CREATE POLICY "Enable delete for service role" ON product_bundle_items
FOR DELETE TO service_role USING (true);

-- 7. Índices para performance
CREATE INDEX idx_bundle_items_bundle_id ON product_bundle_items(bundle_id);
CREATE INDEX idx_bundle_items_product_id ON product_bundle_items(product_id);
