import { NextRequest } from 'next/server';
import { instagramBodySchema } from './instagram.schema';
import { InstagramRepository } from '@core/data/instagram/instagram.repository';
// import { z } from 'zod';

/* interface InstagramBody {
  object: 'instagram';
} */

/* interface InstagramEntry {
  id: string;
  time: number;
  messaging?: [];
  comments?: [];
  changes?: [];
} */

/*   const changeEntrySchema = z.object({
    id: z.string(),
    time: z.number(),
    changes: z.array(),
  });

const bodySchema = z.object({
  object: z.literal('instagram'),
  entry: z.array(),
}); */

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Intentamos hacer el parse del payload
  const validatedBody = instagramBodySchema.safeParse(body);

  if (!validatedBody.success) {
    // Caso "default" para manejar un esquema inválido`
    console.error(
      'Instragram body not handled',
      JSON.stringify(validatedBody.error, undefined, 2)
    );
    console.log('unhandled response', JSON.stringify(body, null, 2));
  }

  console.log('validatiedBody.data.object', validatedBody.data?.object);

  const recipeMessage: {
    message: string;
    instagramUserId: string | null;
    instagramUsername: string | null;
  } = {
    // message: `Entrando a este link podes comprar el recetario: https://www.soybelumont.com/recetarios/recetario-para-fiestas-saludables`,
    message:
      '¡Hola! 😊 Gracias por tu mensaje. Si querés conseguir mi recetario, te dejo el link para que lo compres directamente desde la web: \n \n https://www.soybelumont.com/recetarios/recetario-para-fiestas-saludables \n \n ¡Espero que te inspire a cocinar cosas ricas! 🧑‍🍳✨',
    instagramUserId: null,
    instagramUsername: null,
  };

  validatedBody.data?.entry.forEach((entry) => {
    if ('messaging' in entry) {
      // is a private message
      console.log('is a messaging entry', JSON.stringify(entry, null, 2));

      entry.messaging.forEach((event) => {
        if (event.message) {
          console.log('is a message event', JSON.stringify(event, null, 2));
          if (event.message.is_echo) {
            console.log(
              'is a sent message event',
              JSON.stringify(event, null, 2)
            );
          } else {
            console.log(
              'is a received message event',
              JSON.stringify(event, null, 2)
            );
          }
        } else {
          if (event.reaction) {
            console.log('is a reaction event', JSON.stringify(event, null, 2));
          }
        }
      });
    } else {
      if ('changes' in entry) {
        // is a change
        console.log('is a change entry', JSON.stringify(entry, null, 2));

        entry.changes.forEach((event) => {
          console.log(
            `is a ${event.field} event`,
            JSON.stringify(event, null, 2)
          );

          if (event.field === 'comments' && 'text' in event.value) {
            const { text, from } = event.value;

            if (text.toUpperCase().includes('RECETARIO')) {
              console.log('Message include RECETARIO', text);
              recipeMessage.instagramUserId = from.id;
              recipeMessage.instagramUsername = from.username;
              /* InstagramRepository()
                .sendMessageTo(
                  from.id,
                  `Entrando a este link podes comprar el recetario: 
                  https://www.soybelumont.com/recetarios/recetario-para-fiestas-saludables
                `
                )
                .then(() => {
                  console.log(`sent recipe link to ${from.username} success`);
                }); */
            }
          }
        });
      }
    }
  });

  if (recipeMessage.instagramUserId) {
    // Enviar recetario por mensaje privado
    try {
      await InstagramRepository().sendMessageTo(
        recipeMessage.instagramUserId,
        recipeMessage.message
      );
      console.log(
        `sent recipe link to ${recipeMessage.instagramUsername} success`
      );
    } catch (error) {
      console.error('error sending recipe message', error);
    }
  }
  /*   if (body.object === 'instagram') {
    body.entry.forEach((entry: object) => {
      if ('messaging' in entry) {
        // is a private message
        console.log('is a message entry', JSON.stringify(entry, null, 2));
      } else {
        if ('comments' in entry) {
          // is a comment
          console.log('is a comment entry', JSON.stringify(entry, null, 2));
        } else if ('changes' in entry) {
          // is a change
          console.log('is a change entry', JSON.stringify(entry, null, 2));
        }
      }
    }); */
  /* body.entry.forEach((entry: { messaging: [] }) => {
      console.log('entry', entry);

      entry?.messaging.forEach((message) => {
        console.log('message', message);
      });
    }); 
  }*/

  // Verifica que el hub.mode y hub.verify_token son válidos
  // if (hubMode === 'subscribe' && hubVerifyToken === '$soybelumont') {
  return new Response(body, { status: 200 });
  // }

  // Responde con un error 403 si la verificación falla
  return new Response('Forbidden', { status: 403 });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const hubChallenge = searchParams.get('hub.challenge');
  const hubMode = searchParams.get('hub.mode');
  const hubVerifyToken = searchParams.get('hub.verify_token');

  console.log('hubChallenge', hubChallenge);
  console.log('hubMode', hubMode);
  console.log('hubVerifyToken', hubVerifyToken);

  // TODO: extract verify token from .env
  // Verifica que el hub.mode y hub.verify_token son válidos
  if (hubMode === 'subscribe' && hubVerifyToken === '$soybelumont') {
    return new Response(hubChallenge, { status: 200 });
  }

  // Responde con un error 403 si la verificación falla
  return new Response('Forbidden', { status: 403 });
}
