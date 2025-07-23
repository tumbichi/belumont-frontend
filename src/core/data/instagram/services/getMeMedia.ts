import instagramClient from '../client';
import { InstagramMedia } from '../instagram.repository';

export default async function getMeMedia(): Promise<{ data: InstagramMedia[] }> {
  const response = await instagramClient.get<{ data: InstagramMedia[] }>(
    `${process.env.INSTAGRAM_GRAPH_API_MEDIA_PATH}?fields=id,media_type,media_url,username,timestamp,thumbnail_url,caption,permalink`
  );

  return response.data;
}
