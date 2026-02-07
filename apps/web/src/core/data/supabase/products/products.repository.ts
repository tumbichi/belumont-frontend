import getActiveProducts from './services/getAllProducts';
import getProductById from './services/getProductById';
import getProductByPathname from './services/getProductByPathname';
import getBundleItems from './services/getBundleItems';

export type ProductType = 'single' | 'bundle';

export interface Product {
  id: string;
  name: string;
  price: number;
  pathname: string;
  image_url: string;
  thumbnail_url: string;
  product_images?: string[];
  description: string | null;
  product_type: ProductType;
  created_at: Date;
}

export interface ProductWithDownload extends Product {
  download_url: string | null;
}

export interface BundleItem {
  id: string;
  bundle_id: string;
  product_id: string;
  sort_order: number | null;
  product: ProductWithDownload;
}

export interface ProductsRepositoryReturn {
  getAll: (filters?: { active: boolean }) => Promise<Product[]>;
  getById: (id: string) => Promise<ProductWithDownload | null>;
  getByPathname: (pathname: string) => Promise<Product | null>;
  getBundleItems: (bundleId: string) => Promise<BundleItem[]>;
}

export const ProductsRepository = (): ProductsRepositoryReturn => ({
  getAll: getActiveProducts,
  getById: getProductById,
  getByPathname: getProductByPathname,
  getBundleItems: getBundleItems,
});
