import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Performance: 30% in prod for server-side (more valuable for API routes)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.3 : 1.0,

  // Don't send errors in development
  beforeSend(event) {
    if (process.env.NODE_ENV === 'development') return null;
    return event;
  },
});
