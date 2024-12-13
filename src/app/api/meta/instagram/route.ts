import { NextRequest } from 'next/server';
import { instagramBodySchema } from './instagram.schema';
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
    // Caso "default" para manejar un esquema inválido
    console.error(
      'Instragram body not handled',
      JSON.stringify(validatedBody.error, undefined, 2)
    );
    console.log('unhandled response', JSON.stringify(body, null, 2));
  }

  console.log('validatiedBody.data.object', validatedBody.data?.object);

  validatedBody.data?.entry.forEach((event) => {
    if ('messaging' in event) {
      // is a private message
      console.log('is a message event', JSON.stringify(event, null, 2));
    } else {
      if ('changes' in event) {
        // is a change
        console.log('is a change event', JSON.stringify(event, null, 2));
      }
    }
  });

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
