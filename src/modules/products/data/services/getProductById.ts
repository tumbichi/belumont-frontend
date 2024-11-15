import { supabase } from "../client";
import { productMap } from "../mappers/product.map";
import { Product } from "../products.repository";

export default async function getProductById(id: string): Promise<Product | null> {
  const { data } = await supabase.from("products").select().eq("id", id);

  return data && data.length > 0 ? productMap(data[0]) : null;
}
