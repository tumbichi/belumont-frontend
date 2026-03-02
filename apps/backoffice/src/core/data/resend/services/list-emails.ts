import type { ListEmailsOptions, ResendEmailListResponse } from '../types';

/**
 * Lists recent emails via the Resend REST API.
 * Supports cursor-based pagination via `after` / `before` IDs.
 * Max `limit` is 100 (Resend API constraint).
 */
export default async function listEmails(
  options: ListEmailsOptions = {}
): Promise<ResendEmailListResponse> {
  const apiKey = process.env.RESEND_API_KEY;
  const baseUrl = process.env.RESEND_API_URL ?? 'https://api.resend.com/emails';

  if (!apiKey) {
    return { data: [], has_more: false };
  }

  try {
    const params = new URLSearchParams();
    if (options.limit) params.set('limit', String(options.limit));
    if (options.after) params.set('after', options.after);
    if (options.before) params.set('before', options.before);

    const url = params.size > 0 ? `${baseUrl}?${params.toString()}` : baseUrl;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      return { data: [], has_more: false };
    }

    const result = await response.json();
    return {
      data: result?.data ?? [],
      has_more: result?.has_more ?? false,
    };
  } catch {
    return { data: [], has_more: false };
  }
}
