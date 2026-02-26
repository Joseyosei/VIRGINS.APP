import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';

import crypto from 'crypto';

const BUCKET = process.env.AWS_S3_BUCKET || 'virgins-app-media';
const REGION = process.env.AWS_REGION || 'us-east-1';

const isConfigured = () =>
  process.env.AWS_ACCESS_KEY_ID &&
  !process.env.AWS_ACCESS_KEY_ID.startsWith('replace') &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  !process.env.AWS_SECRET_ACCESS_KEY.startsWith('replace');

let s3Client: S3Client | null = null;

const getClient = () => {
  if (!isConfigured()) return null;
  if (!s3Client) {
    s3Client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  return s3Client;
};

export const uploadFile = async (
  buffer: Buffer,
  key: string,
  mimeType: string
): Promise<string> => {
  const client = getClient();
  if (!client) {
    console.log(`[S3 STUB] Would upload: ${key} (${buffer.length} bytes, ${mimeType})`);
    return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
  }
  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  }));
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
};

export const deleteFile = async (key: string): Promise<void> => {
  const client = getClient();
  if (!client) {
    console.log(`[S3 STUB] Would delete: ${key}`);
    return;
  }
  await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
};

export const getSignedUrl = async (key: string, expiresIn = 3600): Promise<string> => {
  const client = getClient();
  if (!client) return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return awsGetSignedUrl(client, command, { expiresIn });
};

export const buildPhotoKey = (userId: string, ext = 'jpg') =>
  `photos/${userId}/${crypto.randomUUID()}.${ext}`;

export const buildVideoKey = (userId: string, ext = 'mp4') =>
  `videos/${userId}/${crypto.randomUUID()}.${ext}`;

export const buildIdKey = (userId: string, ext = 'jpg') =>
  `ids/${userId}/${crypto.randomUUID()}.${ext}`;

export const keyFromUrl = (url: string): string => {
  try {
    const u = new URL(url);
    return u.pathname.replace(/^\//, '');
  } catch {
    return url;
  }
};
