export type { ResendEmail, EmailStatus } from '@core/data/resend/types';
export {
  EMAIL_STATUS_LIST,
} from '@core/data/resend/types';

import type { EmailTemplateName } from '@soybelumont/email-templates/types';

export type {
  EmailTemplateName,
  EmailTemplateInfo,
  ProductDeliveryProps,
  PackDeliveryProps,
  ProductUpdateDeliveryProps,
  DownloadItem,
} from '@soybelumont/email-templates/types';

export { EMAIL_TEMPLATES } from '@soybelumont/email-templates/types';

export interface EmailRecipient {
  name: string;
  email: string;
}

export interface SendTemplateEmailParams {
  templateId: EmailTemplateName;
  recipients: EmailRecipient[];
  variables: Record<string, unknown>;
}

export interface SendEmailResult {
  success: boolean;
  totalSent: number;
  totalFailed: number;
  error?: string;
}

export interface EmailStats {
  total: number;
  delivered: number;
  opened: number;
  bounced: number;
  complained: number;
  deliveryRate: number;
  openRate: number;
  sentToday: number;
  sentThisMonth: number;
}
