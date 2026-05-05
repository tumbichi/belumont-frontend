'use client';

import { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import { Button } from '@soybelumont/ui/components/button';
import { getMpPaymentDetail } from '@modules/orders/actions/get-mp-payment-detail';
import { MpPaymentDetail } from '@modules/orders/types';

interface MpDetailLoaderProps {
  providerId: string;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function MpDetailCard({ detail }: { detail: MpPaymentDetail }) {
  return (
    <div className="rounded-md border bg-muted/30 p-4 space-y-3 text-sm">
      <div className="flex items-center gap-2 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
        <CreditCard className="w-3.5 h-3.5" />
        Detalle MercadoPago
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
        <span className="text-muted-foreground whitespace-nowrap">
          Estado MP
        </span>
        <span className="font-medium min-w-0">{detail.status}</span>

        <span className="text-muted-foreground whitespace-nowrap">Detalle</span>
        <span className="min-w-0">{detail.status_detail}</span>

        <span className="text-muted-foreground whitespace-nowrap">Monto</span>
        <span className="min-w-0">
          ${detail.transaction_amount?.toLocaleString('es-AR')}
        </span>

        <span className="text-muted-foreground whitespace-nowrap">
          Método de pago
        </span>
        <span className="min-w-0">{detail.payment_method_id}</span>

        <span className="text-muted-foreground whitespace-nowrap">Tipo</span>
        <span className="min-w-0">{detail.payment_type_id}</span>

        {detail.installments > 1 && (
          <>
            <span className="text-muted-foreground whitespace-nowrap">
              Cuotas
            </span>
            <span className="min-w-0">{detail.installments}</span>
          </>
        )}

        {detail.date_approved && (
          <>
            <span className="text-muted-foreground whitespace-nowrap">
              Aprobado
            </span>
            <span className="min-w-0">{formatDate(detail.date_approved)}</span>
          </>
        )}

        {detail.payer?.email && (
          <>
            <span className="text-muted-foreground whitespace-nowrap">
              Email pagador
            </span>
            <span className="min-w-0 break-all">{detail.payer.email}</span>
          </>
        )}

        {detail.card?.last_four_digits && (
          <>
            <span className="text-muted-foreground whitespace-nowrap">
              Tarjeta
            </span>
            <span className="min-w-0">
              **** **** **** {detail.card.last_four_digits}
              {detail.card.cardholder?.name
                ? ` — ${detail.card.cardholder.name}`
                : ''}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export function MpDetailLoader({ providerId }: MpDetailLoaderProps) {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<MpPaymentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleLoad() {
    setLoading(true);
    setError(null);
    const result = await getMpPaymentDetail(providerId);
    if (result.ok) {
      setDetail(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  if (detail) {
    return <MpDetailCard detail={detail} />;
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-xs text-destructive">Error al cargar: {error}</p>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleLoad}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
            Cargando...
          </>
        ) : (
          <>
            <CreditCard className="w-3.5 h-3.5 mr-2" />
            Ver detalle MP
          </>
        )}
      </Button>
    </div>
  );
}
