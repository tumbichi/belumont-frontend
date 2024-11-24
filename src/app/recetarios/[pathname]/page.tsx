import Container from '@core/components/layouts/Container';
import { ProductsRepository } from '@core/data/supabase/products';
import ProductDetails from '../../../modules/products/components/ProductDetails';
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
      <ProductDetails product={product} />
    </Container>
  );
}
