'use server';

import { PatisserieRepository } from '@core/data/supabase/patisserie';
import { revalidatePath } from 'next/cache';
import { patisserieDetails } from '../schemas/createPatisserie.schema';
import {
  PatisserieProduct,
  CreatePatisserieInput,
} from '../types/patisserie.types';

export async function createPatisserieProduct(
  data: CreatePatisserieInput
): Promise<PatisserieProduct> {
  console.log('[patisserie] createPatisserieProduct start', data);

  // Validate input
  const validated = patisserieDetails.parse(data);

  const repo = PatisserieRepository();
  const product = await repo.create({
    ...validated,
    category: validated.category ?? null,
    metadata: validated.metadata ?? null,
    image_url: null,
    thumbnail_url: null,
  });

  if (!product) {
    throw new Error('Failed to create patisserie product');
  }

  console.log('[patisserie] createPatisserieProduct completed', product);
  revalidatePath('/pasteleria');
  return product;
}
