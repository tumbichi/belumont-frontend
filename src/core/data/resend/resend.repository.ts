import sendEmail from "./services/sendEmail";

interface AttachmentContent {
  filename: string;
  content: Buffer;
}

interface AttachmentPath {
  fileaneme: string;
  path: string;
}

export interface SendEmailBody {
  from: string;
  to: string;
  subject: string;
  html: string;
  attachments?: (AttachmentContent | AttachmentPath)[];
}

interface ResendRepository {
  sendEmail: (body: SendEmailBody) => Promise<void>;
}

const ResendRepository = () => ({
  sendEmail,
});

export default ResendRepository;
