import Link from 'next/link';
import { ExternalLink, User, Package, Clock } from 'lucide-react';
import { Separator } from '@soybelumont/ui/components/separator';
import { OrderWithDetails } from '@modules/orders/types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentSection } from './PaymentSection';
import { PromoCodeSection } from './PromoCodeSection';
import { PriceDisplay } from './PriceDisplay';
import { MpDetailLoader } from './MpDetailLoader';
import formatDatetime from '@core/utils/formatters/formatDate';

interface OrderDetailPanelProps {
  order: OrderWithDetails;
}

export function OrderDetailPanel({ order }: OrderDetailPanelProps) {
  const payment = order.payments;
  const promoCode = payment?.promo_codes ?? null;
  const isFree = payment?.provider === 'free';
  const hasPromoCode = !!promoCode;
  const isApproved =
    payment?.status === 'approved' ||
    order.status === 'completed' ||
    order.status === 'paid';

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* ── HERO: Status + Price ────────────────────────────────── */}
      <div className="px-5 pt-4 pb-5 space-y-3">
        {/* Status badge — hero element */}
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Price — the key financial fact */}
        <PriceDisplay
          productPrice={order.products?.price}
          amount={payment?.amount}
          isFree={isFree}
          hasPromoCode={hasPromoCode}
          isApproved={isApproved}
        />

        {/* Timestamps — muted, small */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>
            {formatDatetime(
              order.created_at instanceof Date
                ? order.created_at
                : new Date(order.created_at)
            )}
          </span>
        </div>
      </div>

      <Separator />

      {/* ── CLIENT ──────────────────────────────────────────────── */}
      <div className="px-5 py-4 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <User className="w-3 h-3" />
          Cliente
        </div>
        {order.users ? (
          <div>
            <div className="font-semibold text-sm">{order.users.name}</div>
            <div className="text-xs text-muted-foreground">
              {order.users.email}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Sin información</p>
        )}
      </div>

      <Separator />

      {/* ── PRODUCT ─────────────────────────────────────────────── */}
      <div className="px-5 py-4 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <Package className="w-3 h-3" />
          Producto
        </div>
        {order.products ? (
          <div>
            <div className="font-semibold text-sm">{order.products.name}</div>
            <div className="text-xs text-muted-foreground capitalize">
              {order.products.product_type}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Sin información</p>
        )}
      </div>

      <Separator />

      {/* ── PAYMENT ─────────────────────────────────────────────── */}
      <div className="px-5 py-4 space-y-3">
        <PaymentSection
          payment={payment ?? null}
          productPrice={order.products?.price}
        />
      </div>

      {/* ── PROMO CODE ──────────────────────────────────────────── */}
      {promoCode && (
        <>
          <div className="px-5 pb-4">
            <PromoCodeSection promoCode={promoCode} />
          </div>
        </>
      )}

      {/* ── MP ON-DEMAND DETAIL ─────────────────────────────────── */}
      {payment?.provider === 'mercadopago' && payment.provider_id && (
        <>
          <Separator />
          <div className="px-5 py-4 space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Detalle externo
            </p>
            <MpDetailLoader providerId={payment.provider_id} />
          </div>
        </>
      )}

      {/* ── REFERENCE / FOOTER ──────────────────────────────────── */}
      <Separator />
      <div className="px-5 py-4 space-y-2">
        <p className="text-xs text-muted-foreground/70 font-medium uppercase tracking-wide">
          Referencia
        </p>
        <p className="font-mono text-xs text-muted-foreground break-all">
          {order.id}
        </p>
        <div className="text-xs text-muted-foreground">
          Actualizado:{' '}
          {formatDatetime(
            order.updated_at instanceof Date
              ? order.updated_at
              : new Date(order.updated_at)
          )}
        </div>
      </div>

      {/* ── LINK TO FULL PAGE ───────────────────────────────────── */}
      <div className="px-5 pb-6 mt-auto">
        <Link
          href={`/ordenes/${order.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Ver detalle completo
        </Link>
      </div>
    </div>
  );
}
