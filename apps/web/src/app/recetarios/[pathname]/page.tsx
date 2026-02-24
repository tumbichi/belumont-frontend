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

  // If it's a bundle, fetch the bundle items
  const bundleItems =
    product.product_type === 'bundle'
      ? await productsRepo.getBundleItems(product.id)
      : [];

  // Strip download_url from bundle items before passing to client component
  const bundleItemsForDisplay = bundleItems.map((item) => {
    const { download_url, ...productForDisplay } = item.product;
    return {
      ...item,
      product: productForDisplay,
    };
  });

  return (
    <Container>
      <ProductDetail product={product} bundleItems={bundleItemsForDisplay} />
    </Container>
  );
}
