import z from 'zod';

export const productDetails = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  pathname: z.string().min(1, 'URL pathname is required'),
  description: z.string().nullable().optional(),
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

export type ProductDetailsInput = z.infer<typeof productDetails>;
// export type ProductDetailsOutput = z.output<typeof productDetails>;
