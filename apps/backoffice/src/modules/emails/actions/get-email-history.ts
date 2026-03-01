'use server';

import ResendRepository from '@core/data/resend/resend.repository';
import type { ResendEmail } from '@core/data/resend/types';

export interface EmailHistoryResult {
  data: ResendEmail[];
  has_more: boolean;
}

export default async function getEmailHistory(
  limit = 100
): Promise<EmailHistoryResult> {
  const repository = ResendRepository();
  const result = await repository.listEmails({ limit });
  return { data: result.data, has_more: result.has_more ?? false };
}

export async function loadMoreEmails(afterId: string): Promise<EmailHistoryResult> {
  const repository = ResendRepository();
  const result = await repository.listEmails({ limit: 50, after: afterId });
  return { data: result.data, has_more: result.has_more ?? false };
}
