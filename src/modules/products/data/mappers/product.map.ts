import { Database } from "@core/types/supabase";
import { Product } from "../products.repository";

export const productMap = (product: Database["public"]["Tables"]["products"]["Row"]): Product => ({
  id: product.id,
  name: product.name,
  price: product.price,
  image_url: product.image_url,
  description: product.description,
  created_at: new Date(product.created_at),
});
