import { CreditCard, Banknote } from 'lucide-react';
import { PaymentEmbedded, PaymentProvider } from '@modules/orders/types';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { PriceDisplay } from './PriceDisplay';

const PROVIDER_LABELS: Record<PaymentProvider, string> = {
  mercadopago: 'MercadoPago',
  free: 'Gratuito',
};

const ProviderIcon = ({ provider }: { provider: PaymentProvider }) =>
  provider === 'mercadopago' ? (
    <CreditCard className="w-3.5 h-3.5" />
  ) : (
    <Banknote className="w-3.5 h-3.5" />
  );

interface PaymentSectionProps {
  payment: PaymentEmbedded | null;
  productPrice?: number;
}

export function PaymentSection({ payment, productPrice }: PaymentSectionProps) {
  if (!payment) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/30 px-4 py-3">
        <p className="text-sm text-muted-foreground text-center">
          Sin pago registrado
        </p>
      </div>
    );
  }

  const isFree = payment.provider === 'free';
  const hasPromoCode = !!payment.promo_codes;
  const isApproved = payment.status === 'approved';

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Receipt header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <ProviderIcon provider={payment.provider} />
          {PROVIDER_LABELS[payment.provider]}
        </div>
        <PaymentStatusBadge status={payment.status} />
      </div>

      {/* Price row */}
      <div className="px-4 py-3 flex flex-wrap items-end justify-between gap-2">
        <div className="text-xs text-muted-foreground">
          {isFree
            ? 'Con código 100%'
            : hasPromoCode
              ? 'Con descuento'
              : 'Monto final'}
        </div>
        <PriceDisplay
          productPrice={productPrice}
          amount={payment.amount}
          isFree={isFree}
          hasPromoCode={hasPromoCode}
          isApproved={isApproved}
        />
      </div>

      {/* Reference (MP only) */}
      {payment.provider === 'mercadopago' && payment.provider_id && (
        <div className="px-4 py-2 border-t bg-muted/20 flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">Referencia MP</span>
          <span className="font-mono text-xs text-muted-foreground break-all text-right max-w-[60%]">
            {payment.provider_id}
          </span>
        </div>
      )}
    </div>
  );
}
