import React from 'react';
import { Product } from '@core/data/supabase/products';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
import ProductTable from '../components/ProductTable';

async function getProducts(): Promise<Product[]> {
  const repository = SupabaseRepository();
  const products = await repository.products.getAllForBackoffice();
  return products;
}

async function ProductsList() {
  const products = await getProducts();

  return <ProductTable products={products} />;
}

export default ProductsList;
