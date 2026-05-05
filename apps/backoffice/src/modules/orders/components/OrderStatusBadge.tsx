import { Badge } from '@soybelumont/ui/components/badge';
import { OrderStatus } from '@modules/orders/types';

const colorMap: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  paid: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const labelMap: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge className={`${colorMap[status]} border font-medium`}>
      {labelMap[status]}
    </Badge>
  );
}
