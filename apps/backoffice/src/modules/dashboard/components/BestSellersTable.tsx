import Link from 'next/link';
import { Badge } from '@soybelumont/ui/components/badge';
import { Card } from '@soybelumont/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@soybelumont/ui/components/table';
import { BestSellingProductRow } from '../types';
import { EmptyBestSellers } from './EmptyBestSellers';

interface BestSellersTableProps {
  rows: BestSellingProductRow[];
  periodLabel: string;
}

export function BestSellersTable({ rows, periodLabel }: BestSellersTableProps) {
  if (rows.length === 0) {
    return <EmptyBestSellers periodLabel={periodLabel} />;
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">#</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead className="w-24 text-center">Tipo</TableHead>
            <TableHead className="w-20 text-right">Ventas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.product_id}>
              <TableCell className="text-muted-foreground tabular-nums">
                {index + 1}
              </TableCell>
              <TableCell>
                <Link
                  href={`/productos/${row.product_id}`}
                  className="font-medium hover:text-primary hover:underline"
                >
                  {row.product_name}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={
                    row.product_type === 'bundle' ? 'bundle' : 'secondary'
                  }
                >
                  {row.product_type === 'bundle' ? 'Pack' : 'Individual'}
                </Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.sales_count}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
