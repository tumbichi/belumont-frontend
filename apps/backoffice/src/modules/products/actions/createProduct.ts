'use server';

import { Product } from '@core/data/supabase/products';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { revalidatePath } from 'next/cache';
import { CreateProductInput } from '@core/data/supabase/products/services/createProduct';

export async function createProduct(data: CreateProductInput): Promise<Product> {
  console.log('[products] createProduct start', data);

  const repo = SupabaseRepository();

  // 1. Create Product
  const product = await repo.products.create(data);

  if (!product) {
    throw new Error('Failed to create product');
  }

  console.log('[products] createProduct completed', product);
  revalidatePath('/productos');
  return product;
}

