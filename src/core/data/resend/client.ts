import axios from "axios";

const resendClient = axios.create({
  baseURL: process.env.RESEND_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
  },
});

export default resendClient;
