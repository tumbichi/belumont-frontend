CREATE OR REPLACE FUNCTION get_best_selling_products(
  p_from        TIMESTAMPTZ,
  p_to          TIMESTAMPTZ,
  p_excluded_ids UUID[],
  p_limit       INT DEFAULT 5
)
RETURNS TABLE (
  product_id    UUID,
  product_name  TEXT,
  product_type  TEXT,
  sales_count   BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    o.product_id,
    p.name        AS product_name,
    p.product_type::TEXT,
    COUNT(*)      AS sales_count
  FROM orders o
  JOIN products p ON p.id = o.product_id
  JOIN payments pay ON pay.id = o.payment_id
  WHERE
    o.status = 'completed'
    AND o.updated_at >= p_from
    AND o.updated_at <= p_to
    AND (cardinality(p_excluded_ids) = 0 OR o.user_id != ALL(p_excluded_ids))
    AND pay.amount > 0
  GROUP BY o.product_id, p.name, p.product_type
  ORDER BY sales_count DESC
  LIMIT p_limit;
$$;
