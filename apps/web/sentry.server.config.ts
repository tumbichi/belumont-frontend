import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Only send PII and local variables outside production to avoid capturing
  // emails, tokens, request bodies or payment data in Sentry events.
  sendDefaultPii: process.env.NODE_ENV !== 'production',

  // Attach local variable values to stack frames — dev only to prevent
  // leaking sensitive locals (session tokens, order data, etc.) in prod.
  includeLocalVariables: process.env.NODE_ENV !== 'production',

  // Logging: enable structured logs via Sentry.logger.*
  enableLogs: true,

  // Performance: dynamic sampling based on route criticality
  tracesSampler: ({ name, inheritOrSampleWith }) => {
    // Always drop health/monitoring noise
    if (name.includes('/monitoring') || name.includes('/health')) return 0;

    // Critical business flows — always sample
    if (
      name.includes('/api/orders') ||
      name.includes('/api/payment') ||
      name.includes('/api/resend')
    ) {
      return 1.0;
    }

    // Promo validation — moderate sampling
    if (name.includes('/api/promos')) return 0.5;

    // Default: 100% in dev, 30% in prod
    return inheritOrSampleWith(
      process.env.NODE_ENV === 'development' ? 1.0 : 0.3,
    );
  },

  // Filter noisy logs in production (trace/debug are dev-only)
  beforeSendLog: (log) => {
    if (
      process.env.NODE_ENV === 'production' &&
      (log.level === 'debug' || log.level === 'trace')
    ) {
      return null;
    }
    return log;
  },
});
