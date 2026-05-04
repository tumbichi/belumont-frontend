import PatisserieList from '@modules/patisserie/features/PatisserieList';
import { Button } from '@soybelumont/ui/components/button';
import { BookPlus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function PasteleriaPage() {
  const t = await getTranslations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('PATISSERIE.TITLE')}</h1>
        <Link href="/pasteleria/crear">
          <Button>
            <BookPlus />
            {t('PATISSERIE.CREATE_PRODUCT')}
          </Button>
        </Link>
      </div>
      <div className="border rounded-lg">
        <PatisserieList />
      </div>
    </div>
  );
}
