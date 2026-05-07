import { Package } from 'lucide-react';

interface EmptyBestSellersProps {
  periodLabel: string;
}

export function EmptyBestSellers({ periodLabel }: EmptyBestSellersProps) {
  return (
    <div className="py-12 text-center text-muted-foreground">
      <Package className="mx-auto mb-3 h-10 w-10 opacity-30" />
      <p className="text-sm">No hubo ventas durante {periodLabel}</p>
    </div>
  );
}
