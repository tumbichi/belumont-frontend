import { z } from 'zod';

export const PERIOD_PRESETS = [
  'today',
  'this_week',
  'this_month',
  'last_7_days',
  'last_30_days',
  'all_time',
  'custom',
] as const;

export type PeriodPreset = (typeof PERIOD_PRESETS)[number];

export const periodFilterSchema = z.union([
  z.object({
    period: z.enum(PERIOD_PRESETS).default('this_month'),
    from: z.undefined(),
    to: z.undefined(),
  }),
  z.object({
    period: z.literal('custom'),
    from: z.string().date(),
    to: z.string().date(),
  }),
]);

export type PeriodFilter = z.infer<typeof periodFilterSchema>;
