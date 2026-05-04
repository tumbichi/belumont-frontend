import PatisserieDetails from '@modules/patisserie/features/PatisserieDetails';
import { PatisserieSelectedProvider } from '@modules/patisserie/contexts/patisserie-selected-context';
import { PatisserieRepository } from '@core/data/supabase/patisserie';
import { PatisserieProduct } from '@modules/patisserie/types/patisserie.types';
import { Button } from '@soybelumont/ui/components/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

async function getProduct(id: string): Promise<PatisserieProduct | null> {
  const repository = PatisserieRepository();
  return repository.getById(id);
}

async function PasteleriaDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations();
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <PatisserieSelectedProvider product={product}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/pasteleria">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {t('PATISSERIE.PRODUCT_DETAILS')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('PATISSERIE.MANAGE_DETAILS')}
            </p>
          </div>
        </div>
        <PatisserieDetails />
      </div>
    </PatisserieSelectedProvider>
  );
}

export default PasteleriaDetailsPage;
