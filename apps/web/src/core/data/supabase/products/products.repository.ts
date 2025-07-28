import getActiveProducts from './services/getAllProducts';
import getProductById from './services/getProductById';
import getProductByPathname from './services/getProductByPathname';

export interface Product {
  id: string;
  name: string;
  price: number;
  pathname: string;
  image_url: string;
  thumbnail_url: string;
  product_images?: string[];
  description: string | null;
  created_at: Date;
}

export interface ProductsRepositoryReturn {
  getAll: (filters?: { active: boolean }) => Promise<Product[]>;
  getById: (id: string) => Promise<(Product & { download_url: string }) | null>;
  getByPathname: (pathname: string) => Promise<Product | null>;
}

export const ProductsRepository = (): ProductsRepositoryReturn => ({
  getAll: getActiveProducts,
  getById: getProductById,
  getByPathname: getProductByPathname,
});
