'use server';

import { PatisserieRepository } from '@core/data/supabase/patisserie';
import { revalidatePath } from 'next/cache';
import { UpdatePatisserieInput } from '../types/patisserie.types';

export async function updatePatisserieProduct(
  id: string,
  updateData: UpdatePatisserieInput
): Promise<UpdatePatisserieInput> {
  if (Object.keys(updateData).length === 0) {
    throw new Error('No update data provided', {
      cause: 'NO_UPDATE_DATA',
    });
  }

  console.log('[patisserie] updatePatisserieProduct start', id, updateData);
  const repo = PatisserieRepository();

  const productUpdated = await repo.update(id, updateData);

  if (!productUpdated) {
    throw new Error('Failed to update patisserie product');
  }

  console.log('[patisserie] updatePatisserieProduct completed', productUpdated);
  revalidatePath('/pasteleria');
  return productUpdated;
}
