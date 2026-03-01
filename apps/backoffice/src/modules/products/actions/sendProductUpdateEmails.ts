'use server';

import sendTemplateEmail from '@modules/emails/actions/send-template-email';
import { ProductBuyer } from './getProductBuyers';

interface SendNotificationEmailsParams {
  productName: string;
  downloadUrl: string;
  buyers: ProductBuyer[];
}

interface SendNotificationEmailsResult {
  success: boolean;
  totalSent: number;
  totalFailed: number;
}

/**
 * Sends product-update-delivery emails directly via Resend SDK.
 * Previously proxied through the web app — now uses the backoffice
 * email module for a fully decoupled flow.
 */
export default async function sendProductUpdateEmails({
  productName,
  downloadUrl,
  buyers,
}: SendNotificationEmailsParams): Promise<SendNotificationEmailsResult> {
  return sendTemplateEmail({
    templateId: 'product-update-delivery',
    recipients: buyers.map((b) => ({ name: b.name, email: b.email })),
    variables: { productName, downloadLink: downloadUrl },
  });
}
