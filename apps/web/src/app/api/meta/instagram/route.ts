import { NextRequest } from 'next/server';
import { instagramBodySchema } from './instagram.schema';
import { InstagramRepository } from '@core/data/instagram/instagram.repository';
import { captureCriticalError } from '@core/lib/sentry';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedBody = instagramBodySchema.safeParse(body);

    if (!validatedBody.success) {
      console.warn(
        'Instragram body not handled',
        JSON.stringify(validatedBody.error, undefined, 2),
      );
      console.log('unhandled response', JSON.stringify(body, null, 2));
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
              console.log(
                'is a sent message event',
                JSON.stringify(event, null, 2),
              );
            } else {
              console.log(
                'is a received message event',
                JSON.stringify(event, null, 2),
              );
            }
          } else {
            if (event.reaction) {
              console.log(
                'is a reaction event',
                JSON.stringify(event, null, 2),
              );
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
        await InstagramRepository().replyComment(
          recipeMessage.instagramCommentId,
          recipeMessage.message,
        );
        console.log(
          `sent recipe link to ${recipeMessage.instagramUsername} success`,
        );
      } catch (error) {
        captureCriticalError(error, 'instagram-webhook', {
          instagramCommentId: recipeMessage.instagramCommentId,
          instagramUsername: recipeMessage.instagramUsername,
        });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    captureCriticalError(error, 'instagram-webhook');

    return Response.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const hubChallenge = searchParams.get('hub.challenge');
  const hubMode = searchParams.get('hub.mode');
  const hubVerifyToken = searchParams.get('hub.verify_token');

  // TODO: move verify token '$soybelumont' to env var (e.g. INSTAGRAM_VERIFY_TOKEN)
  if (hubMode === 'subscribe' && hubVerifyToken === '$soybelumont') {
    return new Response(hubChallenge, { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}
