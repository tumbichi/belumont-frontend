import { supabase } from "../client";
import { productMap } from "../mappers/product.map";
import { Product } from "../products.repository";

export default async function getAllProducts(): Promise<Product[]> {
  const { data } = await supabase.from("products").select();

  if (!data) {
    return [];
  }

  return data.map((product) => productMap(product));
}
