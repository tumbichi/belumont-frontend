import { CreateEmailOptions, CreateEmailResponse } from 'resend';
import sendEmail from './services/sendEmail';

export type SendEmailBody = CreateEmailOptions;

interface ResendRepository {
  sendEmail: (body: SendEmailBody) => Promise<CreateEmailResponse>;
}

const ResendRepository = () => ({
  sendEmail,
});

export default ResendRepository;
