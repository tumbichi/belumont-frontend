import z from 'zod';

export const patisserieMetadataSchema = z.object({
  porciones: z.string().optional(),
  alergenos: z.string().optional(),
  dias_anticipacion: z.number().int().min(0).optional(),
});

export const patisserieDetails = z.object({
  name: z.string().min(2, 'PATISSERIE.VALIDATION.NAME_REQUIRED'),
  description: z.string().min(10, 'PATISSERIE.VALIDATION.DESCRIPTION_REQUIRED'),
  price: z.number().positive('PATISSERIE.VALIDATION.PRICE_POSITIVE'),
  pathname: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'PATISSERIE.VALIDATION.PATHNAME_FORMAT'),
  category: z.string().optional(),
  stock_status: z
    .enum(['available', 'on_request', 'out_of_stock'])
    .default('on_request'),
  active: z.boolean().default(true),
  metadata: patisserieMetadataSchema.optional(),
});

export type PatisserieDetailsInput = z.input<typeof patisserieDetails>;
