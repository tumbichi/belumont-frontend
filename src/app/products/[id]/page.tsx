import Container from "@core/components/layouts/Container";
import { ProductsRepository } from "@core/data/supabase/products";
import ProductDetails from "../../../modules/products/components/ProductDetails";

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const productId = (await params).id;
  const product = await ProductsRepository().getByPathname(productId);

  return <Container>{product ? <ProductDetails product={product} /> : <div>Product not found</div>}</Container>;
}
