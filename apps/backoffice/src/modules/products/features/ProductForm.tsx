'use client';

import { Button } from '@soybelumont/ui/components/button';
import { Card } from '@soybelumont/ui/components/card';
import { Input } from '@soybelumont/ui/components/input';
import { Label } from '@soybelumont/ui/components/label';
import { Textarea } from '@soybelumont/ui/components/textarea';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  productDetails,
  ProductDetailsInput,
} from '../schemas/createProduct.schema';

interface ProductFormProps {
  product: ProductDetailsInput;
  onSubmitAction: (updatedProduct: ProductDetailsInput) => void;
}

export function ProductForm({ product, onSubmitAction }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductDetailsInput>({
    resolver: zodResolver(productDetails),
    defaultValues: {
      name: product.name,
      price: product.price,
      pathname: product.pathname,
      description: product.description,
    },
  });

  const handleError: SubmitErrorHandler<ProductDetailsInput> = (errors) => {
    console.error('Form errors:', errors);
  };

  return (
    <Card className="p-6">
      <form
        className="space-y-6"
        onSubmit={handleSubmit((data) => onSubmitAction(data), handleError)}
      >
        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            placeholder="Enter product name"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Pathname */}
          <div className="space-y-2">
            <Label htmlFor="pathname">URL Pathname</Label>
            <Input
              id="pathname"
              placeholder="product-url-slug"
              {...register('pathname')}
            />
            {errors.pathname && (
              <p className="text-sm text-red-500">{errors.pathname.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter product description"
            rows={5}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
