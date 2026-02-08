'use server';

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
  results: {
    email: string;
    success: boolean;
    error?: string;
  }[];
}

export default async function sendProductUpdateEmails({
  productName,
  downloadUrl,
  buyers,
}: SendNotificationEmailsParams): Promise<SendNotificationEmailsResult> {
  const webAppUrl = process.env.WEB_APP_URL;

  if (!webAppUrl) {
    throw new Error('WEB_APP_URL environment variable is not set');
  }

  const response = await fetch(
    `${webAppUrl}/api/resend/send-email-product-update`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName,
        downloadUrl,
        buyers: buyers.map((b) => ({ name: b.name, email: b.email })),
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error || `Failed to send emails: ${response.statusText}`
    );
  }

  return response.json();
}
