import React from 'react';
import { PatisserieRepository } from '@core/data/supabase/patisserie';
import { PatisserieProduct } from '@modules/patisserie/types/patisserie.types';
import PatisserieTable from '../components/PatisserieTable';

async function getProducts(): Promise<PatisserieProduct[]> {
  const repository = PatisserieRepository();
  return repository.getAll();
}

async function PatisserieList() {
  const products = await getProducts();
  return <PatisserieTable products={products} />;
}

export default PatisserieList;
