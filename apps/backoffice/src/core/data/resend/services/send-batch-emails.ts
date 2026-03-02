import resendClient from '../client';
import type { SendEmailBody } from '../resend.repository';

export default async function sendBatchEmails(emails: SendEmailBody[]) {
  return await resendClient.batch.send(emails);
}
