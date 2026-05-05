import Link from 'next/link';
import { ArrowLeft, User, Package, Clock, RefreshCw } from 'lucide-react';
import { Separator } from '@soybelumont/ui/components/separator';
import { OrderDetailExpanded } from '@modules/orders/types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { PromoCodeSection } from './PromoCodeSection';
import { PriceDisplay } from './PriceDisplay';
import { MpDetailLoader } from './MpDetailLoader';
import formatDatetime from '@core/utils/formatters/formatDate';

interface OrderDetailFullProps {
  order: OrderDetailExpanded;
}

const PROVIDER_LABELS: Record<string, string> = {
  mercadopago: 'MercadoPago',
  free: 'Gratuito',
};

function SectionLabel({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
  );
}

export function OrderDetailFull({ order }: OrderDetailFullProps) {
  const payment = order.payments;
  const promoCode = payment?.promo_codes ?? null;
  const isFree = payment?.provider === 'free';
  const hasPromoCode = !!promoCode;
  const isApproved =
    payment?.status === 'approved' ||
    order.status === 'completed' ||
    order.status === 'paid';

  const createdAt =
    order.created_at instanceof Date
      ? order.created_at
      : new Date(order.created_at);
  const updatedAt =
    order.updated_at instanceof Date
      ? order.updated_at
      : new Date(order.updated_at);

  return (
    <div className="max-w-2xl space-y-0">
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Status + Price + Date
      ════════════════════════════════════════════════════════════ */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        {/* Row 1: Status + Order ID */}
        <div className="flex items-start justify-between gap-4">
          <OrderStatusBadge status={order.status} />
          <span className="font-mono text-xs text-muted-foreground/70 text-right break-all max-w-[60%]">
            {order.id}
          </span>
        </div>

        {/* Row 2: Price — the hero fact */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total pagado</p>
          <PriceDisplay
            productPrice={order.products?.price}
            amount={payment?.amount}
            isFree={isFree}
            hasPromoCode={hasPromoCode}
            isApproved={isApproved}
          />
        </div>

        {/* Row 3: Timestamps */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Creado: {formatDatetime(createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3" />
            Actualizado: {formatDatetime(updatedAt)}
          </span>
        </div>
      </div>

      <div className="h-3" />

      {/* ═══════════════════════════════════════════════════════════
          TWO-COL: Client + Product
      ════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Client */}
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <SectionLabel icon={User} label="Cliente" />
          {order.users ? (
            <div>
              <div className="font-semibold text-base leading-tight">
                {order.users.name}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {order.users.email}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Sin información</p>
          )}
        </div>

        {/* Product */}
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <SectionLabel icon={Package} label="Producto" />
          {order.products ? (
            <div>
              <div className="font-semibold text-base leading-tight">
                {order.products.name}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5 capitalize">
                {order.products.product_type}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Sin información</p>
          )}
        </div>
      </div>

      <div className="h-3" />

      {/* ═══════════════════════════════════════════════════════════
          PAYMENT CARD — Receipt feel
      ════════════════════════════════════════════════════════════ */}
      {payment ? (
        <div className="rounded-xl border bg-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b">
            <h3 className="text-sm font-semibold">Pago</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {PROVIDER_LABELS[payment.provider] ?? payment.provider}
              </span>
              <PaymentStatusBadge status={payment.status} />
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-5 space-y-4">
            {/* Price breakdown */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Monto</p>
              <PriceDisplay
                productPrice={order.products?.price}
                amount={payment.amount}
                isFree={isFree}
                hasPromoCode={hasPromoCode}
                isApproved={isApproved}
              />
            </div>

            {/* Promo code */}
            {promoCode && (
              <>
                <Separator />
                <PromoCodeSection promoCode={promoCode} />
              </>
            )}

            {/* MP reference */}
            {payment.provider === 'mercadopago' && payment.provider_id && (
              <>
                <Separator />
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">
                    Referencia MP
                  </span>
                  <span className="font-mono text-xs text-muted-foreground break-all text-right">
                    {payment.provider_id}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">Sin pago registrado</p>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MP ON-DEMAND DETAIL
      ════════════════════════════════════════════════════════════ */}
      {payment?.provider === 'mercadopago' && payment.provider_id && (
        <>
          <div className="h-3" />
          <div className="rounded-xl border bg-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Detalle externo MercadoPago
            </h3>
            <MpDetailLoader providerId={payment.provider_id} />
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════
          BACK LINK
      ════════════════════════════════════════════════════════════ */}
      <div className="pt-6">
        <Link
          href="/ordenes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a órdenes
        </Link>
      </div>
    </div>
  );
}
