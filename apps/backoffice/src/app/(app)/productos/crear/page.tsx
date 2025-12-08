import { CreateProduct } from '@modules/products/features/CreateProduct';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Producto | Belu Mont Backoffice',
  description: 'Crear un nuevo producto en el catálogo',
};

export default function CreateProductPage() {
  return <CreateProduct />;
}
