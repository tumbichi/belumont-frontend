import { formatPrice } from '@core/utils/formatters/formatPrice';

interface PriceDisplayProps {
  /** Original product list price */
  productPrice?: number;
  /** Actual amount paid */
  amount?: number;
  /** Whether the payment provider is 'free' (100% promo code) */
  isFree?: boolean;
  /** Whether a promo code was applied to this payment */
  hasPromoCode?: boolean;
  /** Whether the payment was approved or order is completed/paid */
  isApproved?: boolean;
  /** Compact layout = inline side-by-side (table). Default = stacked (detail). */
  compact?: boolean;
}

/**
 * Renders the price of an order with visual treatment:
 * - If free (100% promo): "Gratuito" + original crossed out
 * - If discount + approved: original crossed out (muted) + actual paid (bold)
 * - Otherwise: just the amount or product price
 */
export function PriceDisplay({
  productPrice,
  amount,
  isFree = false,
  hasPromoCode = false,
  isApproved = false,
  compact = false,
}: PriceDisplayProps) {
  const showDiscount = hasPromoCode && isApproved && productPrice != null;

  if (isFree) {
    return compact ? (
      <span className="flex items-center gap-1.5">
        {productPrice != null && (
          <span className="text-xs text-muted-foreground line-through">
            {formatPrice(productPrice)}
          </span>
        )}
        <span className="text-sm font-semibold text-green-700">Gratuito</span>
      </span>
    ) : (
      <div className="space-y-0.5">
        {productPrice != null && (
          <div className="text-xs text-muted-foreground line-through">
            {formatPrice(productPrice)}
          </div>
        )}
        <div className="text-base font-semibold text-green-700">Gratuito</div>
      </div>
    );
  }

  if (showDiscount && amount != null) {
    return compact ? (
      <span className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground line-through">
          {formatPrice(productPrice!)}
        </span>
        <span className="text-sm font-semibold text-foreground">
          {formatPrice(amount)}
        </span>
      </span>
    ) : (
      <div className="space-y-0.5">
        <div className="text-xs text-muted-foreground line-through">
          {formatPrice(productPrice!)}
        </div>
        <div className="text-xl font-bold text-foreground">
          {formatPrice(amount)}
        </div>
      </div>
    );
  }

  // Default — just show amount or product price
  const displayPrice = amount ?? productPrice;
  if (displayPrice == null) {
    return <span className="text-muted-foreground text-sm">—</span>;
  }

  return compact ? (
    <span className="text-sm font-medium">{formatPrice(displayPrice)}</span>
  ) : (
    <div className="text-xl font-bold">{formatPrice(displayPrice)}</div>
  );
}
