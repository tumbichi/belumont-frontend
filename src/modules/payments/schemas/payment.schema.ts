import { z } from 'zod';

const paymentSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});

export type PaymentSchema = z.infer<typeof paymentSchema>;

export default paymentSchema;
