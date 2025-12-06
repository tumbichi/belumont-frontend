import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { PromoCode } from '@core/data/supabase/promos/promos.repository';
import { getTranslations } from 'next-intl/server';

async function getPromos(): Promise<PromoCode[]> {
  const repository = SupabaseRepository();
  const promos = await repository.promos.getAll();
  return promos;
}

export default async function PromosPage() {
  const t = await getTranslations();
  const promos = await getPromos();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('PROMOS.TITLE')}</h1>
      <div className="border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {t('PROMOS.CODE')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {t('PROMOS.DISCOUNT_TYPE')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {t('PROMOS.DISCOUNT_VALUE')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {t('PROMOS.USES')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {t('PROMOS.EXPIRES_AT')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {t('PROMOS.STATUS')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {promos.length > 0 ? (
              promos.map((promo) => (
                <tr key={promo.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {promo.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promo.discount_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promo.discount_value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promo.used_count} / {promo.max_uses || '∞'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promo.expires_at ? new Date(promo.expires_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        promo.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {promo.is_active ? t('PROMOS.ACTIVE') : t('PROMOS.INACTIVE')}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {t('PROMOS.NO_PROMOS')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}