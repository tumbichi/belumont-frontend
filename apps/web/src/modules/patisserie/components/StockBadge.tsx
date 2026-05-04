import { PatisserieProduct } from '../types/patisserie.types';

interface StockBadgeProps {
  status: PatisserieProduct['stock_status'];
}

const statusConfig = {
  available: {
    label: 'Disponible',
    className: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  },
  on_request: {
    label: 'A pedido',
    className: 'bg-amber-100 text-amber-700 border border-amber-200',
  },
  out_of_stock: {
    label: 'Sin stock',
    className: 'bg-gray-100 text-gray-500 border border-gray-200',
  },
} as const;

export function StockBadge({ status }: StockBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
