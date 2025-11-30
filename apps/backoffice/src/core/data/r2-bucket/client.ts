import { S3Client } from '@aws-sdk/client-s3';

let _r2Client: S3Client | null = null;

/**
 * Obtiene la instancia del cliente R2 (lazy initialization)
 * Solo se crea cuando se necesita en runtime del servidor
 */
export function getR2Client(): S3Client {
  if (_r2Client) {
    return _r2Client;
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Missing Cloudflare R2 credentials in environment variables'
    );
  }

  _r2Client = new S3Client({
    region: 'auto', // Cloudflare uses "auto" for the region
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return _r2Client;
}

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
