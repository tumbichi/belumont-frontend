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
  const product = await ProductsRepository().getByPathname(productPathname);

  if (!product) {
    return <Error />;
  }

  return (
    <Container>
      <ProductDetail product={product} />
    </Container>
  );
}
