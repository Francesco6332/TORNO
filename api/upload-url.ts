import crypto from 'node:crypto';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

interface UploadUrlRequest {
  fileName?: string;
  contentType?: string;
  folder?: string;
}

interface VercelRequest {
  method?: string;
  body?: UploadUrlRequest | string;
  headers?: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status: (statusCode: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

const MAX_UPLOAD_SIZE_MB = 8;
const UPLOAD_EXPIRES_SECONDS = 300;

const firstDefined = (...values: Array<string | undefined>) =>
  values.find((value) => value && value.trim())?.trim() || '';

const hmac = (key: crypto.BinaryLike | crypto.KeyObject, value: string) =>
  crypto.createHmac('sha256', key).update(value).digest();

const sha256Hex = (value: string) => crypto.createHash('sha256').update(value).digest('hex');

const encodePath = (value: string) => value.split('/').map(encodeURIComponent).join('/');

const getSignatureKey = (secret: string, dateStamp: string, region: string) => {
  const dateKey = hmac(`AWS4${secret}`, dateStamp);
  const regionKey = hmac(dateKey, region);
  const serviceKey = hmac(regionKey, 's3');
  return hmac(serviceKey, 'aws4_request');
};

const getSpacesHost = (bucket: string, region: string, endpoint = '') => {
  const normalizedEndpoint = endpoint.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');

  if (!normalizedEndpoint) {
    return `${bucket}.${region}.digitaloceanspaces.com`;
  }

  return normalizedEndpoint.includes(bucket)
    ? normalizedEndpoint
    : `${bucket}.${normalizedEndpoint}`;
};

const parseBody = (body: UploadUrlRequest | string | undefined): UploadUrlRequest => {
  if (!body) return {};
  return typeof body === 'string' ? JSON.parse(body) as UploadUrlRequest : body;
};

const getAuthTokenFromHeader = (authorizationHeader: string | string[] | undefined) => {
  const value = Array.isArray(authorizationHeader) ? authorizationHeader[0] : authorizationHeader;
  if (!value) return '';
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || '';
};

const verifyFirebaseToken = async (token: string) => {
  if (!getApps().length) {
    initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
    });
  }

  return getAuth().verifyIdToken(token);
};

const sanitizeFileName = (fileName: string) => {
  const [name = 'image', extension = 'jpg'] = fileName.split('.').reduce<[string, string | undefined]>(
    (result, segment, index, parts) => {
      if (index === parts.length - 1 && parts.length > 1) {
        return [result[0], segment];
      }

      return [`${result[0]}-${segment}`.replace(/^-/, ''), result[1]];
    },
    ['', undefined]
  );

  const safeName = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'image';
  const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'jpg';

  return `${safeName}.${safeExtension}`;
};

const createPresignedPutUrl = ({
  accessKey,
  bucket,
  contentType,
  key,
  region,
  secret,
  spacesEndpoint,
}: {
  accessKey: string;
  bucket: string;
  contentType: string;
  key: string;
  region: string;
  secret: string;
  spacesEndpoint?: string;
}) => {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const host = getSpacesHost(bucket, region, spacesEndpoint);
  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const signedHeaders = 'content-type;host;x-amz-acl';
  const canonicalUri = `/${encodePath(key)}`;
  const queryParams = new URLSearchParams({
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${accessKey}/${credentialScope}`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(UPLOAD_EXPIRES_SECONDS),
    'X-Amz-SignedHeaders': signedHeaders,
  });
  const canonicalQueryString = queryParams.toString().replace(/\+/g, '%20');
  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-acl:public-read\n`;
  const canonicalRequest = [
    'PUT',
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    'UNSIGNED-PAYLOAD',
  ].join('\n');
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join('\n');
  const signature = crypto
    .createHmac('sha256', getSignatureKey(secret, dateStamp, region))
    .update(stringToSign)
    .digest('hex');

  queryParams.set('X-Amz-Signature', signature);

  return `https://${host}${canonicalUri}?${queryParams.toString().replace(/\+/g, '%20')}`;
};

export default function handler(request: VercelRequest, response: VercelResponse) {
  const allowedOrigins = [
    'https://torno1.vercel.app',
    'http://localhost:5173',
  ];
  const origin = Array.isArray(request.headers?.origin) ? request.headers.origin[0] : request.headers?.origin;
  response.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin || '') ? origin || '' : allowedOrigins[0]);
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    response.status(204).json({});
    return;
  }

  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = getAuthTokenFromHeader(request.headers?.authorization);

  if (!token) {
    response.status(401).json({ error: 'Missing authorization token' });
    return;
  }

  const accessKey = firstDefined(
    process.env.DO_SPACES_KEY,
    process.env.DO_SPACES_ACCESS_KEY,
    process.env.DO_SPACES_ACCESS_KEY_ID,
    process.env.AWS_ACCESS_KEY_ID
  );
  const secret = firstDefined(
    process.env.DO_SPACES_SECRET,
    process.env.DO_SPACES_SECRET_KEY,
    process.env.DO_SPACES_SECRET_ACCESS_KEY,
    process.env.AWS_SECRET_ACCESS_KEY
  );
  const bucket = firstDefined(
    process.env.DO_SPACES_BUCKET,
    process.env.SPACES_BUCKET,
    process.env.VITE_DO_SPACES_BUCKET
  );
  const region = firstDefined(
    process.env.DO_SPACES_REGION,
    process.env.SPACES_REGION,
    process.env.VITE_DO_SPACES_REGION
  ) || 'nyc3';
  const spacesEndpoint = firstDefined(
    process.env.DO_SPACES_ENDPOINT,
    process.env.SPACES_ENDPOINT,
    process.env.VITE_DO_SPACES_ENDPOINT
  );
  const cdnEndpoint = firstDefined(
    process.env.DO_SPACES_CDN_ENDPOINT,
    process.env.SPACES_CDN_ENDPOINT,
    process.env.VITE_DO_SPACES_CDN_ENDPOINT
  );

  if (!accessKey || !secret || !bucket) {
    response.status(500).json({
      code: 'spaces_not_configured',
      error: 'DigitalOcean Spaces is not configured',
      missing: [
        !accessKey ? 'DO_SPACES_KEY' : '',
        !secret ? 'DO_SPACES_SECRET' : '',
        !bucket ? 'DO_SPACES_BUCKET' : '',
      ].filter(Boolean),
    });
    return;
  }

  try {
    await verifyFirebaseToken(token);

    const { contentType = '', fileName = '', folder = 'uploads' } = parseBody(request.body);

    if (!contentType.startsWith('image/')) {
      response.status(400).json({ error: 'Only image uploads are allowed' });
      return;
    }

    const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, '').replace(/^\/+|\/+$/g, '') || 'uploads';
    const key = `${safeFolder}/${crypto.randomUUID()}-${sanitizeFileName(fileName)}`;
    const uploadUrl = createPresignedPutUrl({
      accessKey,
      bucket,
      contentType,
      key,
      region,
      secret,
      spacesEndpoint,
    });
    const publicBaseUrl = cdnEndpoint
      ? cdnEndpoint.replace(/\/+$/, '')
      : `https://${bucket}.${region}.digitaloceanspaces.com`;

    response.status(200).json({
      key,
      maxSizeMb: MAX_UPLOAD_SIZE_MB,
      publicUrl: `${publicBaseUrl}/${encodePath(key)}`,
      uploadUrl,
    });
  } catch {
    response.status(400).json({ error: 'Invalid upload request' });
  }
}
