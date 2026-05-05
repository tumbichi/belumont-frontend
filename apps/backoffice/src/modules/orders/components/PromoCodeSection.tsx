import { Tag } from 'lucide-react';
import { Badge } from '@soybelumont/ui/components/badge';
import { PromoCodeEmbedded } from '@modules/orders/types';

const DISCOUNT_TYPE_LABELS: Record<string, string> = {
  PERCENTAGE: '%',
  FIXED: 'fijo',
  FIXED_PRICE: 'precio fijo',
};

function formatDiscount(promoCode: PromoCodeEmbedded): string {
  if (promoCode.discount_type === 'PERCENTAGE') {
    return `${promoCode.discount_value}% de descuento`;
  }
  return `$${promoCode.discount_value.toLocaleString('es-AR')} ${DISCOUNT_TYPE_LABELS[promoCode.discount_type] ?? ''}`.trim();
}

interface PromoCodeSectionProps {
  promoCode: PromoCodeEmbedded | null | undefined;
}

export function PromoCodeSection({ promoCode }: PromoCodeSectionProps) {
  if (!promoCode) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3 space-y-1.5">
      <div className="flex items-center gap-2">
        <Tag className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
        <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
          Código aplicado
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Badge
          variant="outline"
          className="font-mono text-sm bg-white border-amber-300 text-amber-900 px-2 py-0.5"
        >
          {promoCode.code}
        </Badge>
        <span className="text-sm text-amber-800 font-medium">
          {formatDiscount(promoCode)}
        </span>
      </div>
    </div>
  );
}
