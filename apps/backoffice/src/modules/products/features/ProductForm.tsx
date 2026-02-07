'use client';

import { Card } from '@soybelumont/ui/components/card';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isValidating, isDirty, errors },
    reset,
  } = useForm<ProductDetailsInput>({
    resolver: zodResolver(productDetails),
    defaultValues: {
      name: product.name,
      price: product.price,
      pathname: product.pathname,
      description: product.description,
      product_type: product.product_type,
    },
  });

  const handleSucessSubmit = async (data: ProductDetailsInput) => {
    console.log('[ProductForm] Submitted data:', data);
    // Exclude product_type from updates - it should not be changed after creation
    const { product_type: _product_type, ...updateData } = data;
    try {
      const updatedProduct = await updateProduct(product.id, updateData);
      updateProductSelected(updatedProduct);
      reset({
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
      console.error('[ProductForm] Error updating product:', error);
      sonner.toast.error(t('PRODUCTS.PRODUCT_UPDATE_ERROR'), {
        dismissible: true,
        description: JSON.stringify(error),
      });
    }
  };

  const handleError: SubmitErrorHandler<ProductDetailsInput> = (errors) => {
    console.error('Form errors:', errors);
  };

  return (
    <Card className="p-6">
      <form
        className="space-y-6"
        onSubmit={handleSubmit(handleSucessSubmit, handleError)}
      >
        <ProductFormContent
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          isValidating={isValidating}
          isDirty={isDirty}
          watch={watch}
          setValue={setValue}
          showProductType={true}
          disableProductType={true}
        />
      </form>
    </Card>
  );
}
