import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { KpiCard } from './KpiCard';

interface KpiGridProps {
  revenue: number;
  orders: number;
  avgTicket: number;
  totalUsers: number;
  period: string;
  comparison?: {
    revenuePct: number | null;
    ordersPct: number | null;
    avgTicketPct: number | null;
  };
}

function formatARS(value: number): string {
  return `$ ${value.toLocaleString('es-AR')}`;
}

export function KpiGrid({
  revenue,
  orders,
  avgTicket,
  totalUsers,
  period,
  comparison,
}: KpiGridProps) {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Ventas Totales"
        value={formatARS(revenue)}
        icon={DollarSign}
        accent
        comparison={
          comparison
            ? { percentage: comparison.revenuePct, label: period }
            : undefined
        }
      />
      <KpiCard
        label="Órdenes"
        value={orders}
        icon={ShoppingBag}
        comparison={
          comparison
            ? { percentage: comparison.ordersPct, label: period }
            : undefined
        }
      />
      <KpiCard
        label="Ticket Promedio"
        value={formatARS(avgTicket)}
        icon={TrendingUp}
        comparison={
          comparison
            ? { percentage: comparison.avgTicketPct, label: period }
            : undefined
        }
      />
      <KpiCard label="Usuarios" value={totalUsers} icon={Users} />
    </div>
  );
}
