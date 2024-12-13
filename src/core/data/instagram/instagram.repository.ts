import sendMessageTo from './services/sendMessageTo';

interface InstagramRepositoryReturn {
  sendMessageTo: (
    instagramUserId: string,
    message: string
  ) => Promise<{
    recipient_id: string;
    message_id: string;
  }>;
}

export const InstagramRepository = (): InstagramRepositoryReturn => ({
  sendMessageTo,
});
