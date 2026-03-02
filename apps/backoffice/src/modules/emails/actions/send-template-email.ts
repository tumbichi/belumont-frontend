'use server';

import ResendRepository from '@core/data/resend/resend.repository';
import ProductDelivery from '@soybelumont/email-templates/ProductDelivery';
import PackDelivery from '@soybelumont/email-templates/PackDelivery';
import ProductUpdateDelivery from '@soybelumont/email-templates/ProductUpdateDelivery';
import type { EmailRecipient, SendEmailResult } from '../types';
import type { EmailTemplateName } from '@soybelumont/email-templates/types';

interface SendTemplateEmailParams {
  templateId: EmailTemplateName;
  recipients: EmailRecipient[];
  variables: Record<string, unknown>;
}

function buildEmailComponent(
  templateId: EmailTemplateName,
  variables: Record<string, unknown>,
  recipientName: string
): React.ReactElement {
  switch (templateId) {
    case 'product-delivery':
      return ProductDelivery({
        productName: variables.productName as string,
        username: recipientName,
        downloadLink: variables.downloadLink as string,
      });
    case 'pack-delivery':
      return PackDelivery({
        packName: variables.packName as string,
        username: recipientName,
        items: variables.items as { name: string; downloadUrl: string }[],
      });
    case 'product-update-delivery':
      return ProductUpdateDelivery({
        productName: variables.productName as string,
        username: recipientName,
        downloadLink: variables.downloadLink as string,
      });
    default:
      throw new Error(`Unknown template: ${templateId}`);
  }
}

function getSubject(
  templateId: EmailTemplateName,
  variables: Record<string, unknown>
): string {
  const productName =
    (variables.productName as string) ||
    (variables.packName as string) ||
    'Producto';

  switch (templateId) {
    case 'product-delivery':
      return `${productName} | @soybelumont`;
    case 'pack-delivery':
      return `${productName} | @soybelumont`;
    case 'product-update-delivery':
      return `${productName} - Nueva versión disponible | @soybelumont`;
    default:
      return `@soybelumont`;
  }
}

export default async function sendTemplateEmail({
  templateId,
  recipients,
  variables,
}: SendTemplateEmailParams): Promise<SendEmailResult> {
  const repository = ResendRepository();
  const fromEmail = String(process.env.RESEND_FROM_EMAIL);
  const subject = getSubject(templateId, variables);

  try {
    if (recipients.length === 1) {
      const recipient = recipients[0]!;
      const emailComponent = buildEmailComponent(
        templateId,
        variables,
        recipient.name
      );

      const response = await repository.sendEmail({
        to: recipient.email,
        from: fromEmail,
        subject,
        react: emailComponent,
      });

      if (response.error) {
        return {
          success: false,
          totalSent: 0,
          totalFailed: 1,
          error: response.error.message,
        };
      }

      return { success: true, totalSent: 1, totalFailed: 0 };
    }

    // Batch send for multiple recipients
    const emails = recipients.map((recipient) => ({
      to: recipient.email,
      from: fromEmail,
      subject,
      react: buildEmailComponent(templateId, variables, recipient.name),
    }));

    const response = await repository.sendBatchEmails(emails);

    if (response.error) {
      return {
        success: false,
        totalSent: 0,
        totalFailed: recipients.length,
        error: response.error.message,
      };
    }

    return {
      success: true,
      totalSent: recipients.length,
      totalFailed: 0,
    };
  } catch (error) {
    return {
      success: false,
      totalSent: 0,
      totalFailed: recipients.length,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
