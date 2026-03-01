'use client';

import { Card, CardContent } from '@soybelumont/ui/components/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@soybelumont/ui/components/form';
import {
  productDetails,
  ProductDetailsInput,
} from '../schemas/createProduct.schema';
import { updateProduct } from '../actions/updateProduct';
import { useProductSelected } from '../contexts/product-selected-context';
import { sonner } from '@soybelumont/ui/components/sonner';
import { useTranslations } from 'next-intl';
import { ProductFormContent } from '../components/ProductFormContent';

export function ProductForm() {
  const t = useTranslations();
  const { product, updateProduct: updateProductSelected } =
    useProductSelected();

  const form = useForm<ProductDetailsInput>({
    resolver: zodResolver(productDetails),
    defaultValues: {
      name: product.name,
      price: product.price,
      pathname: product.pathname,
      description: product.description,
      product_type: product.product_type,
    },
  });

  const handleSuccessSubmit = async (data: ProductDetailsInput) => {
    // Exclude product_type from updates — it should not be changed after creation
    const { product_type: _product_type, ...updateData } = data;
    try {
      const updatedProduct = await updateProduct(product.id, updateData);
      updateProductSelected(updatedProduct);
      form.reset({
        name: updatedProduct.name,
        price: updatedProduct.price,
        pathname: updatedProduct.pathname,
        description: updatedProduct.description,
        product_type: updatedProduct.product_type,
      });
      sonner.toast.success(t('PRODUCTS.PRODUCT_UPDATED_SUCCESS'), {
        dismissible: true,
      });
    } catch (error) {
      sonner.toast.error(t('PRODUCTS.PRODUCT_UPDATE_ERROR'), {
        dismissible: true,
        description:
          error instanceof Error ? error.message : JSON.stringify(error),
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSuccessSubmit)}
          >
            <ProductFormContent
              form={form}
              showProductType
              disableProductType
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
