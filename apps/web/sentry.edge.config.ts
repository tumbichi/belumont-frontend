import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,

  sendDefaultPii: process.env.NODE_ENV !== 'production',

  // Logging: enable structured logs via Sentry.logger.*
  enableLogs: true,

  // Performance: 100% in dev, 30% in prod
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.3 : 1.0,

  // Filter noisy logs in production
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
