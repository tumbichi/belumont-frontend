import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@soybelumont/ui/components/card';
import { StuckPaidOrder } from '../types';

interface AlertCardProps {
  orders: StuckPaidOrder[];
}

export function AlertCard({ orders }: AlertCardProps) {
  return (
    <Card className="border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <CardTitle className="text-sm font-semibold text-amber-800 dark:text-amber-400">
          Órdenes sin gestionar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-amber-700 dark:text-amber-400 mb-3">
          {orders.length} orden{orders.length > 1 ? 'es' : ''} llevan más de 10
          minutos en PAID
        </p>
        <ul className="space-y-1.5">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex items-center justify-between text-xs"
            >
              <span className="font-mono text-muted-foreground truncate max-w-[120px]">
                {order.id.slice(0, 8)}…
              </span>
              <span className="text-muted-foreground">
                hace {order.minutesElapsed} min
              </span>
              <Link
                href={`/ordenes/${order.id}`}
                className="text-amber-700 hover:underline font-medium dark:text-amber-400"
              >
                Ver orden →
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
