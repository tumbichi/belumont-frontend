import replyComment from './services/replyComment';
import getMeMedia from './services/getMeMedia';

export interface InstagramMedia {
  id: string;
  media_type: string;
  media_url: string;
  username: string;
  timestamp: string;
  thumbnail_url?: string;
  caption: string;
  permalink: string;
}

interface InstagramRepositoryReturn {
  replyComment: (
    instagramCommentId: string,
    message: string
  ) => Promise<{
    recipient_id: string;
    message_id: string;
  }>;

  getMeMedia: () => Promise<{ data: InstagramMedia[] }>;
}

export const InstagramRepository = (): InstagramRepositoryReturn => ({
  replyComment,
  getMeMedia,
});
