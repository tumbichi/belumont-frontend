import { Suspense } from 'react';
import { Plus, ShoppingCart, Tag } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button } from '@soybelumont/ui/components/button';
import { PeriodFilter } from '../schemas/periodFilter.schema';
import { ResolvedDateRange } from '../types';
import { PeriodSelector } from '../components/PeriodSelector';
import { PeriodInfo } from '../components/PeriodInfo';
import { AlertCardSection } from './AlertCardSection';
import { KpiSection, KpiSectionSkeleton } from './KpiSection';
import { BestSellersSection } from './BestSellersSection';

interface DashboardPageProps {
  period: PeriodFilter;
  dateRange: ResolvedDateRange;
  previousDateRange: ResolvedDateRange;
  totalUsers: number;
}

export async function DashboardPage({
  period,
  dateRange,
  previousDateRange,
  totalUsers,
}: DashboardPageProps) {
  const t = await getTranslations();

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold">Hola, Belu 👋</h1>
        <p className="text-sm text-muted-foreground">
          {t('DASHBOARD.SUBTITLE')}
        </p>
      </div>

      {/* Alert card — only renders if there are stuck orders */}
      <Suspense fallback={null}>
        <AlertCardSection />
      </Suspense>

      {/* Period selector + date range info */}
      <div className="space-y-1.5">
        <PeriodSelector
          activePeriod={period.period}
          customFrom={
            period.period === 'custom'
              ? (period as { period: 'custom'; from: string; to: string }).from
              : undefined
          }
          customTo={
            period.period === 'custom'
              ? (period as { period: 'custom'; from: string; to: string }).to
              : undefined
          }
        />
        <PeriodInfo
          dateRange={dateRange}
          previousDateRange={previousDateRange}
        />
      </div>

      {/* KPI cards */}
      <Suspense fallback={<KpiSectionSkeleton />}>
        <KpiSection
          dateRange={dateRange}
          previousDateRange={previousDateRange}
          totalUsers={totalUsers}
        />
      </Suspense>

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

      {/* Best sellers */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          {t('DASHBOARD.BEST_SELLING_PRODUCTS')}
        </h2>
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground">Cargando...</div>
          }
        >
          <BestSellersSection dateRange={dateRange} />
        </Suspense>
      </div>
    </div>
  );
}
