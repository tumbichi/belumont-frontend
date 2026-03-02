import resendClient from '../client';
import type { SendEmailBody } from '../resend.repository';

export default async function sendEmail(body: SendEmailBody) {
  return await resendClient.emails.send(body);
}
