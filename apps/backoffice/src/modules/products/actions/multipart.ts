'use server';

import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { R2_BUCKET_NAME, getR2Client } from '@core/data/r2-bucket/client';

const r2Client: S3Client = getR2Client();

export async function createMultipartUpload(
  fileName: string,
  contentType: string
): Promise<{ uploadId: string | undefined; filename: string }> {
  if (!R2_BUCKET_NAME) {
    throw new Error('Bucket name not configured');
  }

  // Generar un key único para el archivo
  const fileExtension = fileName.split('.').pop();
  const uniqueKey = `${crypto.randomUUID()}.${fileExtension}`;

  const command = new CreateMultipartUploadCommand({
    Bucket: R2_BUCKET_NAME,
    Key: uniqueKey,
    ContentType: contentType,
  });

  try {
    const response = await r2Client.send(command);
    return {
      uploadId: response.UploadId,
      filename: uniqueKey,
    };
  } catch (error) {
    console.error('Error creating multipart upload:', error);
    throw new Error('Failed to create multipart upload', { cause: error });
  }
}

export async function getSignedUrlForPart(
  key: string,
  uploadId: string,
  partNumber: number
) {
  if (!R2_BUCKET_NAME) {
    throw new Error('Bucket name not configured');
  }

  const command = new UploadPartCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
  });

  try {
    const signedUrl = await getSignedUrl(r2Client, command, {
      expiresIn: 60 * 5, // 5 minutes
      signableHeaders: new Set(['host']), // Solo firmar el header 'host'
    });
    return signedUrl;
  } catch (error) {
    console.error(`Error generating signed URL for part ${partNumber}:`, error);
    throw new Error(`Failed to generate signed URL for part ${partNumber}`, {
      cause: error,
    });
  }
}

export async function completeMultipartUpload(
  key: string,
  uploadId: string,
  parts: { ETag: string; PartNumber: number }[]
) {
  if (!R2_BUCKET_NAME) {
    throw new Error('Bucket name not configured');
  }

  const command = new CompleteMultipartUploadCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  });

  try {
    const response = await r2Client.send(command);

    // URL pública usando el custom domain
    const publicUrl = process.env.R2_PUBLIC_URL
      ? `https://${process.env.R2_PUBLIC_URL}/${key}`
      : response.Location;

    return publicUrl;
  } catch (error) {
    console.error('Error completing multipart upload:', error);
    throw new Error('Failed to complete multipart upload', { cause: error });
  }
}

export async function abortMultipartUpload(key: string, uploadId: string) {
  if (!R2_BUCKET_NAME) {
    throw new Error('Bucket name not configured');
  }

  const command = new AbortMultipartUploadCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    UploadId: uploadId,
  });

  try {
    await r2Client.send(command);
    return;
  } catch (error) {
    console.error('Error aborting multipart upload:', error);
    throw new Error('Failed to abort multipart upload', { cause: error });
  }
}
