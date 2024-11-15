import Container from "@core/components/layouts/Container";
import ProductDetails from "../../../modules/products/components/ProductDetails";
import getProductById from "../../../modules/products/data/services/getProductById";

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const productId = (await params).id;
  const product = await getProductById(productId);

  return <Container>{product ? <ProductDetails product={product} /> : <div>Product not found</div>}</Container>;
}
