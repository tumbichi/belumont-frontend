import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  sendDefaultPii: true,

  // Logging: enable structured logs via Sentry.logger.*
  enableLogs: true,

  // Performance: dynamic sampling based on route criticality
  tracesSampler: ({ name, inheritOrSampleWith }) => {
    // Always drop tunnel/health noise
    if (name.includes('/monitoring') || name.includes('/health')) return 0;

    // Critical checkout flow — 100% in prod
    if (name.includes('/checkout') || name.includes('/payment')) return 1.0;

    // Default: 100% in dev, 20% in prod
    return inheritOrSampleWith(
      process.env.NODE_ENV === 'development' ? 1.0 : 0.2,
    );
  },

  // Session replay: capture 5% of normal sessions, 100% on error
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
    // Capture console.warn and console.error as structured Sentry Logs
    Sentry.consoleLoggingIntegration({
      levels: ['warn', 'error'],
    }),
  ],

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

  // Ignore noisy client-side errors that we can't control
  ignoreErrors: [
    'ResizeObserver loop',
    'ResizeObserver loop completed with undelivered notifications',
    'Network request failed',
    'Load failed',
    'ChunkLoadError',
    'Loading chunk',
    'Failed to fetch',
    'AbortError',
  ],
});

// Hook into App Router navigation transitions
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
