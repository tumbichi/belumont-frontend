import { Badge } from '@soybelumont/ui/components/badge';
import { PaymentStatus } from '@modules/orders/types';

type ColorClass = string;

const colorMap: Record<PaymentStatus, ColorClass> = {
  approved: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_process: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  authorized: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_mediation: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  charged_back: 'bg-red-100 text-red-800 border-red-200',
  refunded: 'bg-purple-100 text-purple-800 border-purple-200',
};

const labelMap: Record<PaymentStatus, string> = {
  approved: 'Aprobado',
  pending: 'Pendiente',
  in_process: 'En proceso',
  authorized: 'Autorizado',
  in_mediation: 'En mediación',
  rejected: 'Rechazado',
  cancelled: 'Cancelado',
  charged_back: 'Contracargo',
  refunded: 'Reembolsado',
};

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const color = colorMap[status] ?? 'bg-gray-100 text-gray-800 border-gray-200';
  const label = labelMap[status] ?? status;
  return <Badge className={`${color} border font-medium`}>{label}</Badge>;
}
