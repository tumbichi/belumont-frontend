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

interface ProductsRepositoryReturn {
  getAll: () => Promise<Product[]>;
  getById: (id: string) => Promise<Product | null>;
}

const ProductsRepository = (): ProductsRepositoryReturn => ({
  getAll: getAllProducts,
  getById: getProductById,
});

export default ProductsRepository;
