import { PatisserieRepository } from '@core/data/supabase/patisserie';
import { PatisserieDisclaimer } from '../components/PatisserieDisclaimer';
import { PatisserieCatalogClient } from './PatisserieCatalogClient';

export async function PatisserieCatalog() {
  const products = await PatisserieRepository().getAll();

  return (
    <>
      <PatisserieDisclaimer />
      <PatisserieCatalogClient products={products} />
    </>
  );
}
