import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
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

  // Verifica que el hub.mode y hub.verify_token son válidos
  if (hubMode === 'subscribe' && hubVerifyToken === '$soybelumont') {
    return new Response(hubChallenge, { status: 200 });
  }

  // Responde con un error 403 si la verificación falla
  return new Response('Forbidden', { status: 403 });
}
