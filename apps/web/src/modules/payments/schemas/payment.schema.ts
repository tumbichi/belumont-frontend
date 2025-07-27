import { z } from 'zod';

const paymentSchema = z.object({
  email: z
    .string({ message: 'COMMON.REQUIRED' })
    .email({ message: 'COMMON.INVALID_EMAIL' }),
  name: z.string({ message: 'COMMON.REQUIRED' }),
});

export type PaymentSchema = z.infer<typeof paymentSchema>;

export default paymentSchema;
