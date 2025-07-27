import instagramClient from '../client';

export default async function replyComment(
  commentId: string,
  message: string
) {
  const response = await instagramClient.post(
    `${process.env.INSTAGRAM_GRAPH_API_MESSAGES_PATH}`,
    {
      recipient: {
        comment_id: commentId,
      },
      message: {
        text: message,
      },
    }
  );

  return response.data;
}
