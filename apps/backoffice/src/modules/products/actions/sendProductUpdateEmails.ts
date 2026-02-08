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
  const resendApiUrl = process.env.RESEND_API_URL;

  if (!resendApiUrl) {
    throw new Error('RESEND_API_URL environment variable is not set');
  }

  const response = await fetch(
    `${resendApiUrl}/api/resend/send-email-product-update`,
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
