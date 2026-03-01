import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { PromoCode } from '@core/data/supabase/promos/promos.repository';
import { getTranslations } from 'next-intl/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@soybelumont/ui/components/table';
import { Badge } from '@soybelumont/ui/components/badge';

async function getPromos(): Promise<PromoCode[]> {
  const repository = SupabaseRepository();
  const promos = await repository.promos.getAll();
  return promos;
}

export default async function PromosPage() {
  const t = await getTranslations();
  const promos = await getPromos();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('PROMOS.TITLE')}</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('PROMOS.CODE')}</TableHead>
              <TableHead>{t('PROMOS.DISCOUNT_TYPE')}</TableHead>
              <TableHead>{t('PROMOS.DISCOUNT_VALUE')}</TableHead>
              <TableHead>{t('PROMOS.USES')}</TableHead>
              <TableHead>{t('PROMOS.EXPIRES_AT')}</TableHead>
              <TableHead>{t('PROMOS.STATUS')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promos.length > 0 ? (
              promos.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium">{promo.code}</TableCell>
                  <TableCell className="text-muted-foreground">{promo.discount_type}</TableCell>
                  <TableCell className="text-muted-foreground">{promo.discount_value}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {promo.used_count} / {promo.max_uses || '∞'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {promo.expires_at ? new Date(promo.expires_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={promo.is_active ? 'active' : 'inactive'}>
                      {promo.is_active ? t('PROMOS.ACTIVE') : t('PROMOS.INACTIVE')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  {t('PROMOS.NO_PROMOS')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}