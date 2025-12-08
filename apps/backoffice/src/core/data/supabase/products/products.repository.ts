import getActiveProducts from './services/getAllProducts';
import getAllProductsForBackoffice from './services/getAllProductsForBackoffice';
import getProductById from './services/getProductById';
import getProductByPathname from './services/getProductByPathname';
import getBestSellingProducts, {
  BestSellingProduct,
} from './services/getBestSellingProducts';
import updateProduct from './services/updateProduct';
import createProduct, { CreateProductInput } from './services/createProduct';

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
  download_url: string;
}

type PublicProduct = Omit<Product, 'download_url'>;

export type UpdateProduct = Partial<
  Omit<Product, 'id' | 'created_at' | 'product_images'>
> & {
  product_images?: string[] | null;
};

// ... (imports)

export interface ProductsRepositoryReturn {
  getAll: (filters?: { active: boolean }) => Promise<Product[]>;
  getAllForBackoffice: () => Promise<Product[]>;
  getById: (id: string) => Promise<Product | null>;
  getByPathname: (pathname: string) => Promise<PublicProduct | null>;
  getBestSelling: (limit?: number) => Promise<BestSellingProduct[]>;
  update: (id: string, product: UpdateProduct) => Promise<Product>;
  create: (product: CreateProductInput) => Promise<Product>;
}

export const ProductsRepository = (): ProductsRepositoryReturn => ({
  getAll: getActiveProducts,
  getAllForBackoffice: getAllProductsForBackoffice,
  getById: getProductById,
  getByPathname: getProductByPathname,
  getBestSelling: getBestSellingProducts,
  update: updateProduct,
  create: createProduct,
});
