import SupabaseRepository from '@core/data/supabase/supabase.repository';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@soybelumont/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@soybelumont/ui/components/table';
import { Badge } from '@soybelumont/ui/components/badge';
import { formatPrice } from '@core/utils/formatters/formatPrice';
import { getTranslations } from 'next-intl/server';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Plus,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@soybelumont/ui/components/button';

async function getDashboardData() {
  const repository = SupabaseRepository();
  const [totalSales, totalOrders, totalUsers, bestSellingProducts] =
    await Promise.all([
      repository.orders.getTotalSales(),
      repository.orders.getTotal(),
      repository.users.getTotal(),
      repository.products.getBestSelling(),
    ]);

  return { totalSales, totalOrders, totalUsers, bestSellingProducts };
}

export default async function DashboardPage() {
  const t = await getTranslations();
  const { totalSales, totalOrders, totalUsers, bestSellingProducts } =
    await getDashboardData();

  const stats = [
    {
      label: t('DASHBOARD.TOTAL_SALES'),
      value: formatPrice(totalSales),
      icon: DollarSign,
      accent: true,
    },
    {
      label: t('DASHBOARD.ORDERS'),
      value: totalOrders,
      icon: ShoppingCart,
      accent: false,
    },
    {
      label: t('DASHBOARD.USERS'),
      value: totalUsers,
      icon: Users,
      accent: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold">Hola, Belu 👋</h1>
        <p className="text-sm text-muted-foreground">
          {t('DASHBOARD.SUBTITLE')}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className={stat.accent ? 'border-primary/30 bg-primary/5' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.accent ? 'text-primary' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href="/productos/new">
            <Plus className="mr-1.5 h-4 w-4" />
            {t('DASHBOARD.NEW_PRODUCT')}
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/promociones">
            <Tag className="mr-1.5 h-4 w-4" />
            {t('DASHBOARD.VIEW_PROMOS')}
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/ordenes">
            <ShoppingCart className="mr-1.5 h-4 w-4" />
            {t('DASHBOARD.VIEW_ORDERS')}
          </Link>
        </Button>
      </div>

      {/* Best selling products */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          {t('DASHBOARD.BEST_SELLING_PRODUCTS')}
        </h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('DASHBOARD.PRODUCT')}</TableHead>
                <TableHead className="w-24 text-center">{t('PRODUCTS.PRODUCT_TYPE')}</TableHead>
                <TableHead className="w-24 text-right">{t('DASHBOARD.SALES')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bestSellingProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Link
                      href={`/productos/${product.id}`}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={product.product_type === 'bundle' ? 'bundle' : 'secondary'}>
                      {product.product_type === 'bundle'
                        ? t('PRODUCTS.PRODUCT_TYPE_BUNDLE')
                        : t('PRODUCTS.PRODUCT_TYPE_SINGLE')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {product.sales}
                  </TableCell>
                </TableRow>
              ))}
              {bestSellingProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                    <Package className="mx-auto mb-2 h-8 w-8 opacity-40" />
                    {t('COMMON.NO_RESULTS')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
