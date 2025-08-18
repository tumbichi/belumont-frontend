import SupabaseRepository from '@core/data/supabase/supabase.repository';
import { Product } from '@core/data/supabase/products/products.repository';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@soybelumont/ui/components/table';
import { formatPrice } from '@core/utils/formatters/formatPrice';

async function getProducts(): Promise<Product[]> {
  const repository = SupabaseRepository();
  const products = await repository.products.getAllForBackoffice();
  return products;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Productos</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Pathname</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{product.pathname}</TableCell>
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
