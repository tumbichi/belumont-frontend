import { NextRequest } from 'next/server';

interface InstagramEntry {
  id: string;
  time: number;
  messaging?: [];
  comments?: [];
  changes?: [];
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const hubChallenge = searchParams.get('hub.challenge');
  const hubMode = searchParams.get('hub.mode');
  const hubVerifyToken = searchParams.get('hub.verify_token');

  console.log('hubChallenge', hubChallenge);
  console.log('hubMode', hubMode);
  console.log('hubVerifyToken', hubVerifyToken);
  /*   console.log(
    'process.env.INSTAGRAM_VERIFY_TOKEN',
    process.env.INSTAGRAM_VERIFY_TOKEN
  ); */
  // request.

  console.log('request', request);
  const body = await request.json();
  console.log('body', body);

  if (body.object === 'instagram') {
    body.entry.forEach((entry: InstagramEntry) => {
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
    });
    /* body.entry.forEach((entry: { messaging: [] }) => {
      console.log('entry', entry);

      entry?.messaging.forEach((message) => {
        console.log('message', message);
      });
    }); */
  }

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
