import getActiveProducts from './services/getAllProducts';
import getAllProductsForBackoffice from './services/getAllProductsForBackoffice';
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
  active: boolean;
}

import getBestSellingProducts, {
  BestSellingProduct,
} from './services/getBestSellingProducts';

// ... (imports)

export interface ProductsRepositoryReturn {
  getAll: (filters?: { active: boolean }) => Promise<Product[]>;
  getAllForBackoffice: () => Promise<Product[]>;
  getById: (id: string) => Promise<(Product & { download_url: string }) | null>;
  getByPathname: (pathname: string) => Promise<Product | null>;
  getBestSelling: (limit?: number) => Promise<BestSellingProduct[]>;
}

export const ProductsRepository = (): ProductsRepositoryReturn => ({
  getAll: getActiveProducts,
  getAllForBackoffice: getAllProductsForBackoffice,
  getById: getProductById,
  getByPathname: getProductByPathname,
  getBestSelling: getBestSellingProducts,
});
