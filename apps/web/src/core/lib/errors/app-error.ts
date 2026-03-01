/**
 * Base class for all application errors.
 * Extends native Error with HTTP status code, machine-readable error code,
 * and optional structured details for Sentry context.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    // Removes the constructor frame from the stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
