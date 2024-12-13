import instagramClient from '../client';

export default async function sendMessageTo(
  instagramUserId: string,
  message: string
) {
  const response = await instagramClient.post(
    `${process.env.INSTAGRAM_GRAPH_API_MESSAGES_PATH}`,
    {
      recipient: {
        id: instagramUserId,
      },
      message: {
        text: message,
      },
    }
  );

  return response.data;
}
