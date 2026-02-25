import Container from '@soybelumont/ui/layouts/container';
import { ProductsRepository } from '@core/data/supabase/products';
import ProductDetail from '../../../modules/products/components/ProductDetail';
import Error from '../error';

interface ProductDetailsPageProps {
  params: Promise<{ pathname: string }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const productPathname = (await params).pathname;
  const productsRepo = ProductsRepository();
  const product = await productsRepo.getByPathname(productPathname);

  if (!product) {
    return <Error />;
  }

  // If it's a bundle, fetch the bundle items (without download_url for client safety)
  const bundleItems =
    product.product_type === 'bundle'
      ? await productsRepo.getBundleItems(product.id)
      : [];

  return (
    <Container>
      <ProductDetail product={product} bundleItems={bundleItems} />
    </Container>
  );
}
