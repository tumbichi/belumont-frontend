import type {
  CreateEmailOptions,
  CreateEmailResponse,
  CreateBatchResponse,
} from 'resend';
import sendEmail from './services/send-email';
import sendBatchEmails from './services/send-batch-emails';
import listEmails from './services/list-emails';
import type { ListEmailsOptions, ResendEmailListResponse } from './types';

export type SendEmailBody = CreateEmailOptions;

interface ResendRepositoryReturn {
  sendEmail: (body: SendEmailBody) => Promise<CreateEmailResponse>;
  sendBatchEmails: (emails: SendEmailBody[]) => Promise<CreateBatchResponse>;
  listEmails: (options?: ListEmailsOptions) => Promise<ResendEmailListResponse>;
}

const ResendRepository = (): ResendRepositoryReturn => ({
  sendEmail,
  sendBatchEmails,
  listEmails,
});

export default ResendRepository;
