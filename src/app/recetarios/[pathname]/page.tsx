import Container from '@core/components/layouts/Container';
import { ProductsRepository } from '@core/data/supabase/products';
import ProductDetails from '../../../modules/products/components/ProductDetails';
import Error from '../error';

interface ProductDetailsPageProps {
  params: Promise<{ pathname: string }>;
  searchParams: Promise<{ payment_status?: 'pending' | 'failure' }>;
}

export default async function ProductDetailsPage({
  params,
  searchParams,
}: ProductDetailsPageProps) {
  const productPathname = (await params).pathname;
  const paymentStatus = (await searchParams).payment_status;
  console.log('paymentStatus', paymentStatus);
  const product = await ProductsRepository().getByPathname(productPathname);

  if (!product) {
    return <Error />;
  }

  return (
    <Container>
      <ProductDetails product={product} paymentStatus={paymentStatus} />
    </Container>
  );
}
