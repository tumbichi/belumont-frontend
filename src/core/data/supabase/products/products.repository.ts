import getAllProducts from './services/getAllProducts';
import getProductById from './services/getProductById';
import getProductByPathname from './services/getProductByPathname';

export interface Product {
  id: string;
  name: string;
  price: number;
  pathname: string;
  image_url: string;
  description: string | null;
  created_at: Date;
}

export interface ProductsRepositoryReturn {
  getAll: () => Promise<Product[]>;
  getById: (id: string) => Promise<(Product & { download_url: string }) | null>;
  getByPathname: (pathname: string) => Promise<Product | null>;
}

export const ProductsRepository = (): ProductsRepositoryReturn => ({
  getAll: getAllProducts,
  getById: getProductById,
  getByPathname: getProductByPathname,
});
