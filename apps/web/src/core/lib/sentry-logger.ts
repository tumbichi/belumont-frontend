import * as Sentry from '@sentry/nextjs';

import { AppError } from './errors/app-error';
import { captureCriticalError } from './sentry';
import type { CriticalFlow } from './sentry';

// ─── Logging Helpers ─────────────────────────────────────────────────────────
// Typed wrappers over Sentry.logger.* that enforce consistent attribute naming.
// All attributes must be string | number | boolean (Sentry restriction).

type LogAttributes = Record<string, string | number | boolean>;

/**
 * Log a business event with structured attributes.
 * Prefer "wide events" — one log with all context — over many small logs.
 */
export const logger = {
  trace: (message: string, attrs?: LogAttributes) =>
    Sentry.logger.trace(message, attrs),

  debug: (message: string, attrs?: LogAttributes) =>
    Sentry.logger.debug(message, attrs),

  info: (message: string, attrs?: LogAttributes) =>
    Sentry.logger.info(message, attrs),

  warn: (message: string, attrs?: LogAttributes) =>
    Sentry.logger.warn(message, attrs),

  error: (message: string, attrs?: LogAttributes) =>
    Sentry.logger.error(message, attrs),

  fatal: (message: string, attrs?: LogAttributes) =>
    Sentry.logger.fatal(message, attrs),

  /** Tagged template for parameterized, searchable messages */
  fmt: Sentry.logger.fmt,
} as const;

// ─── Tracing Helpers ─────────────────────────────────────────────────────────

interface SpanOptions {
  name: string;
  op: string;
  attributes?: Record<string, string | number | boolean>;
}

/**
 * Wrap an async operation in a Sentry span with automatic start/end.
 * Child spans created inside the callback are automatically nested.
 *
 * @example
 * const user = await trace({ name: 'getUser', op: 'db.query' }, () =>
 *   db.users.findUnique({ where: { id } })
 * );
 */
export async function trace<T>(
  options: SpanOptions,
  fn: () => Promise<T> | T,
): Promise<T> {
  return Sentry.startSpan(options, fn);
}

/**
 * Set per-request attributes on the isolation scope.
 * These are automatically attached to all logs and spans within this request.
 * Use in API route handlers for request-level context.
 */
export function setRequestAttributes(
  attrs: Record<string, string | number | boolean>,
) {
  Sentry.getIsolationScope().setAttributes(attrs);
}

/**
 * Log + capture a critical business error with tracing context.
 * Logs a structured Sentry log entry AND captures the exception via
 * captureCriticalError (with fatal/error severity based on flow).
 */
export function logCriticalError(
  error: unknown,
  flow: CriticalFlow,
  extra?: Record<string, unknown>,
) {
  const errorMessage =
    error instanceof Error ? error.message : 'Unknown error';

  // If the error is an AppError, surface its structured details automatically
  const errorDetails = error instanceof AppError ? error.details : undefined;

  logger.error(`Critical error in ${flow}`, {
    flow,
    errorMessage,
    ...errorDetails,
    ...extra,
  });

  captureCriticalError(error, flow, extra);
}
