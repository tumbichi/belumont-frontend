'use server';

import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { R2_BUCKET_NAME, getR2Client } from '@core/data/r2-bucket/client';

const deleteFromR2 = async (fileKey: string) => {
  if (!R2_BUCKET_NAME) {
    throw new Error('Bucket name not configured');
  }

  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileKey,
  });

  try {
    await getR2Client().send(command);
    return;
  } catch (error) {
    console.error('Error deleting object from R2:', error);
    throw new Error('Failed to delete object from R2', { cause: error });
  }
};

export default deleteFromR2;
