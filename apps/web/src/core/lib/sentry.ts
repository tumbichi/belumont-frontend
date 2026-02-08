import * as Sentry from '@sentry/nextjs';

export type CriticalFlow =
  | 'payment-webhook'
  | 'order-creation'
  | 'product-delivery-email'
  | 'pack-delivery-email'
  | 'promo-validation'
  | 'mercadopago-payment-url'
  | 'instagram-webhook';

const FATAL_FLOWS: CriticalFlow[] = [
  'payment-webhook',
  'product-delivery-email',
  'pack-delivery-email',
];

/**
 * Captures a critical error with business flow context.
 * Use in API routes and services where an error = lost revenue or undelivered product.
 *
 * Fatal flows (payment-webhook, product-delivery-email, pack-delivery-email)
 * are tagged as 'fatal' severity so Sentry alerts fire immediately.
 */
export function captureCriticalError(
  error: unknown,
  flow: CriticalFlow,
  extra?: Record<string, unknown>,
) {
  Sentry.captureException(error, {
    level: FATAL_FLOWS.includes(flow) ? 'fatal' : 'error',
    tags: {
      flow,
      critical: 'true',
    },
    extra: {
      ...extra,
      timestamp: new Date().toISOString(),
    },
  });
}
