import { NextRequest } from 'next/server';
import { instagramBodySchema } from './instagram.schema';
import { InstagramRepository } from '@core/data/instagram/instagram.repository';
import { logger, trace, logCriticalError } from '@core/lib/sentry-logger';

export async function POST(request: NextRequest) {
  return trace(
    { name: 'POST /api/meta/instagram', op: 'http.server' },
    async () => {
      try {
        const body = await request.json();

        const validatedBody = instagramBodySchema.safeParse(body);

        if (!validatedBody.success) {
          logger.warn('Instagram webhook: body not handled', {
            errorCount: validatedBody.error.errors.length,
          });
        }

        const recipeMessage: {
          message: string;
          instagramCommentId: string | null;
          instagramUsername: string | null;
        } = {
          message:
            '¡Hola! 😊 Gracias por tu mensaje. Si querés conseguir mi recetario, te dejo el link para que lo compres directamente desde la web: \n \n https://www.soybelumont.com/recetarios/recetario-para-fiestas-saludables \n \n ¡Espero que te inspire a cocinar cosas ricas! 🧑‍🍳✨',
          instagramCommentId: null,
          instagramUsername: null,
        };

        validatedBody.data?.entry.forEach((entry) => {
          if ('messaging' in entry) {
            entry.messaging.forEach((event) => {
              if (event.message) {
                if (event.message.is_echo) {
                  logger.debug('Instagram: sent message event');
                } else {
                  logger.debug('Instagram: received message event');
                }
              } else {
                if (event.reaction) {
                  logger.debug('Instagram: reaction event');
                }
              }
            });
          } else {
            if ('changes' in entry) {
              entry.changes.forEach((event) => {
                if (event.field === 'comments' && 'text' in event.value) {
                  const { text, from } = event.value;

                  if (text.toUpperCase().includes('RECETARIO')) {
                    recipeMessage.instagramCommentId = event.value.id;
                    recipeMessage.instagramUsername = from.username;
                  }
                }
              });
            }
          }
        });

        if (recipeMessage.instagramCommentId) {
          try {
            await trace(
              { name: 'replyInstagramComment', op: 'http.client' },
              () =>
                InstagramRepository().replyComment(
                  recipeMessage.instagramCommentId!,
                  recipeMessage.message,
                ),
            );

            logger.info('Instagram recipe reply sent', {
              username: recipeMessage.instagramUsername ?? 'unknown',
              commentId: recipeMessage.instagramCommentId,
            });
          } catch (error) {
            logCriticalError(error, 'instagram-webhook', {
              instagramCommentId: recipeMessage.instagramCommentId ?? 'unknown',
              instagramUsername: recipeMessage.instagramUsername ?? 'unknown',
            });
          }
        }

        return Response.json({ received: true });
      } catch (error) {
        logCriticalError(error, 'instagram-webhook');

        return Response.json(
          { message: 'Internal server error' },
          { status: 500 },
        );
      }
    },
  );
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const hubChallenge = searchParams.get('hub.challenge');
  const hubMode = searchParams.get('hub.mode');
  const hubVerifyToken = searchParams.get('hub.verify_token');

  const expectedToken = process.env.INSTAGRAM_VERIFY_TOKEN;

  if (
    hubMode === 'subscribe' &&
    hubVerifyToken !== null &&
    hubVerifyToken === expectedToken
  ) {
    return new Response(hubChallenge, { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}
