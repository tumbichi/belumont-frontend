const MP_BASE_URL =
  process.env.MERCADOPAGO_API_URL ?? 'https://api.mercadopago.com';
const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN ?? '';

export async function mpFetch<T>(path: string): Promise<T> {
  const url = `${MP_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    // Disable Next.js cache — MP data is always fresh
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`MercadoPago API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
