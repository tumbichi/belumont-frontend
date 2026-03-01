import z from 'zod';

export const productDetails = z.object({
  name: z.string().min(1, 'PRODUCTS.VALIDATION.NAME_REQUIRED'),
  price: z.number().min(0, 'PRODUCTS.VALIDATION.PRICE_POSITIVE'),
  pathname: z.string().min(1, 'PRODUCTS.VALIDATION.PATHNAME_REQUIRED'),
  description: z.string().nullable().optional(),
  product_type: z.enum(['single', 'bundle']).optional().default('single'),
});

export type ProductDetailsInput = z.input<typeof productDetails>;
