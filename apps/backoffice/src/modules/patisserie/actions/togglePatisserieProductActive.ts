'use server';

import { PatisserieRepository } from '@core/data/supabase/patisserie';
import { revalidatePath } from 'next/cache';
import { PatisserieProduct } from '../types/patisserie.types';

export async function togglePatisserieProductActive(
  productId: string,
  active: boolean
): Promise<PatisserieProduct> {
  console.log(
    '[patisserie] togglePatisserieProductActive start',
    productId,
    active
  );
  const repo = PatisserieRepository();

  const productUpdated = await repo.toggleActive(productId, active);

  if (!productUpdated) {
    throw new Error('Failed to toggle patisserie product active status');
  }

  console.log(
    '[patisserie] togglePatisserieProductActive completed',
    productUpdated
  );
  revalidatePath('/pasteleria');
  return productUpdated;
}
