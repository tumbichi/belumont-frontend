import z from 'zod';

export const productDetails = z.object({
  name: z.string().min(1, 'El nombre del producto es requerido'),
  price: z.number().min(0, 'El precio debe ser un número positivo'),
  pathname: z.string().min(1, 'La ruta es requerida'),
  description: z.string().nullable().optional(),
  product_type: z.enum(['single', 'bundle']).optional().default('single'),
});

export const createProductFormSchema = productDetails.extend({
  coverImage: z.any().optional(),
  pdfFile: z.any().optional(),
});

export const coverImageSchema = z.object({
  coverImage: z.string().url('Cover image must be a valid URL'),
});

export const thumbnailImageSchema = z.object({
  thumbnailImage: z.string().url('Thumbnail image must be a valid URL'),
});

export const galleryImagesSchema = z.object({
  galleryImages: z.array(z.string().url()).optional(),
});

export const pdfSchema = z.object({
  pdf: z.string().url('PDF must be a valid URL'),
});

export type ProductDetailsInput = z.input<typeof productDetails>;
export type CreateProductFormInput = z.input<typeof createProductFormSchema>;
// export type ProductDetailsOutput = z.infer<typeof productDetails>;
