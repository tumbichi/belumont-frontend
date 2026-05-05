import { z } from 'zod';

export const ORDER_STATUS_VALUES = [
  'pending',
  'paid',
  'completed',
  'cancelled',
] as const;

export const PAYMENT_STATUS_VALUES = [
  'pending',
  'approved',
  'authorized',
  'in_process',
  'in_mediation',
  'rejected',
  'cancelled',
  'refunded',
  'charged_back',
] as const;

export const orderFiltersSchema = z.object({
  status: z.array(z.enum(ORDER_STATUS_VALUES)).optional(),
  paymentStatus: z.array(z.enum(PAYMENT_STATUS_VALUES)).optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
  clientSearch: z.string().max(100).optional(),
  productId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  orderId: z.string().uuid().optional(),
});

export type OrderFilters = z.infer<typeof orderFiltersSchema>;
