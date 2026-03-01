export interface ResendEmail {
  id: string;
  to: string[];
  from: string;
  subject: string;
  created_at: string;
  last_event: string;
}

export interface ListEmailsOptions {
  limit?: number;
  after?: string;
  before?: string;
}

export interface ResendEmailListResponse {
  data: ResendEmail[];
  has_more?: boolean;
}

export type EmailStatus =
  | 'delivered'
  | 'sent'
  | 'bounced'
  | 'complained'
  | 'opened'
  | 'clicked';

export const EMAIL_STATUS_LIST: EmailStatus[] = [
  'delivered',
  'sent',
  'bounced',
  'complained',
  'opened',
  'clicked',
];
