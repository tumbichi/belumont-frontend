import {
  CreateEmailOptions,
  CreateEmailResponse,
  CreateBatchResponse,
} from 'resend';
import sendEmail from './services/sendEmail';
import sendBatchEmails from './services/sendBatchEmails';

export type SendEmailBody = CreateEmailOptions;

interface ResendRepository {
  sendEmail: (body: SendEmailBody) => Promise<CreateEmailResponse>;
  sendBatchEmails: (emails: SendEmailBody[]) => Promise<CreateBatchResponse>;
}

const ResendRepository = (): ResendRepository => ({
  sendEmail,
  sendBatchEmails,
});

export default ResendRepository;
