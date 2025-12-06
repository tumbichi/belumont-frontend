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
import { formatPrice } from '@core/utils/formatters/formatPrice';
import { getTranslations } from 'next-intl/server';

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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('DASHBOARD.TITLE')}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('DASHBOARD.TOTAL_SALES')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalSales)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('DASHBOARD.ORDERS')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('DASHBOARD.USERS')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">{t('DASHBOARD.BEST_SELLING_PRODUCTS')}</h2>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('DASHBOARD.PRODUCT')}</TableHead>
                <TableHead>{t('DASHBOARD.SALES')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bestSellingProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
