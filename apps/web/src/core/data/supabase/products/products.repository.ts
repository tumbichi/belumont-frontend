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
  updated_at: Date;
}

export interface ProductWithDownload extends Product {
  download_url: string | null;
}

/** BundleItem with download_url - for server-side use only (e.g., sending emails) */
export interface BundleItem {
  id: string;
  bundle_id: string;
  product_id: string;
  sort_order: number | null;
  product: ProductWithDownload;
}

/** BundleItem without download_url - safe for client-side use */
export interface BundleItemPublic {
  id: string;
  bundle_id: string;
  product_id: string;
  sort_order: number | null;
  product: Product;
}

export interface ProductsRepositoryReturn {
  getAll: (filters?: { active?: boolean }) => Promise<Product[]>;
  getById: (id: string) => Promise<ProductWithDownload | null>;
  getByPathname: (pathname: string) => Promise<Product | null>;
  getBundleItems: {
    (bundleId: string, options: { includeDownloadUrl: true }): Promise<BundleItem[]>;
    (bundleId: string, options?: { includeDownloadUrl?: false }): Promise<BundleItemPublic[]>;
  };
}

export const ProductsRepository = (): ProductsRepositoryReturn => ({
  getAll: getActiveProducts,
  getById: getProductById,
  getByPathname: getProductByPathname,
  getBundleItems: getBundleItems,
});
