interface SignedUploadResponse {
  key: string;
  maxSizeMb: number;
  publicUrl: string;
  uploadUrl: string;
}

interface UploadErrorResponse {
  error?: string;
  missing?: string[];
}

const getUploadErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body = await response.json() as UploadErrorResponse;
    const missing = body.missing?.length ? ` Missing: ${body.missing.join(', ')}` : '';

    return `${body.error || 'Unable to prepare image upload.'}${missing}`;
  } catch {
    return 'Unable to prepare image upload.';
  }
};

export const imageUploadService = {
  async upload(file: File, folder: string): Promise<string> {
    const signedUrlResponse = await fetch('/api/upload-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentType: file.type,
        fileName: file.name,
        folder,
      }),
    });

    if (!signedUrlResponse.ok) {
      throw new Error(await getUploadErrorMessage(signedUrlResponse));
    }

    const signedUpload = await signedUrlResponse.json() as SignedUploadResponse;
    const maxSizeBytes = signedUpload.maxSizeMb * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      throw new Error(`Image must be smaller than ${signedUpload.maxSizeMb}MB`);
    }

    const uploadResponse = await fetch(signedUpload.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
        'x-amz-acl': 'public-read',
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error('Image upload failed');
    }

    return signedUpload.publicUrl || signedUpload.key;
  },
};
