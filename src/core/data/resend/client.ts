import { Resend } from 'resend';

const resendClient = new Resend(String(process.env.RESEND_API_KEY));

export default resendClient;
