'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@soybelumont/ui/components/table';
import { formatPrice } from '@core/utils/formatters/formatPrice';
import formatDatetime from '@core/utils/formatters/formatDate';
import Image from 'next/image';
import { Button } from '@soybelumont/ui/components/button';
import { BookImageIcon } from 'lucide-react';
import { Product } from '@core/data/supabase/products';
import { useRouter } from 'next/navigation';

// interface Column<T extends object> {
//   title: string;
//   key: keyof T;
//   render?: (item: T) => React.ReactNode;
// }

interface ProductsListProps {
  products: Product[];
}
function ProductTable({ products }: ProductsListProps) {
  const router = useRouter();
  const isEmpty = products.length == 0;

  const goToDetails = (product: Product) => {
    router.push(`/productos/${product.id}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Portada</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Creado el</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!isEmpty ? (
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Image
                  src={product.thumbnail_url}
                  width={320}
                  height={192}
                  className="object-cover w- w-full aspect-[5/3] transition-opacity group-hover:opacity-100"
                  alt="Product Image"
                />
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.active ? 'Activo' : 'Inactivo'}
                </span>
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell>{product.pathname}</TableCell>
              <TableCell className="font-medium">
                {formatDatetime(product.created_at)}
              </TableCell>
              <TableCell className="space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    goToDetails(product);
                  }}
                >
                  <BookImageIcon />
                  Ver detalles
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={4}
              className="px-6 py-4 text-sm text-center text-gray-500"
            >
              No se encontraron productos.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default ProductTable;
