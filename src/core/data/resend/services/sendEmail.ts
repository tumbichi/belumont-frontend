import resendClient from "../client";
import { SendEmailBody } from "../resend.repository";

export default async function sendEmail(body: SendEmailBody) {
  await resendClient.post("", body);
}
