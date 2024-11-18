import getAllProducts from "./services/getAllProducts";
import getProductById from "./services/getProductById";

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string | null;
  created_at: Date;
}

export interface ProductsRepositoryReturn {
  getAll: () => Promise<Product[]>;
  getById: (id: string) => Promise<Product | null>;
}

export const ProductsRepository = (): ProductsRepositoryReturn => ({
  getAll: getAllProducts,
  getById: getProductById,
});
