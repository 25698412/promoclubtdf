import { createClient } from '@/lib/supabase/client';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/**
 * Upload a file to Cloudflare R2 via the edge function
 * @param file - The file to upload
 * @param folder - The folder path (e.g., 'avatars', 'businesses', 'promotions')
 * @returns The public URL of the uploaded file
 */
export async function uploadToR2(
  file: File,
  folder: string
): Promise<string> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Step 1: Get presigned URL from edge function
  const response = await fetch(`${SUPABASE_URL}/functions/v1/r2-upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      folder,
      filename: file.name,
      contentType: file.type,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error getting upload URL');
  }

  const { upload_url, public_url } = await response.json();

  // Step 2: Upload file directly to R2 using presigned URL
  const uploadResponse = await fetch(upload_url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error('Error uploading file to R2');
  }

  return public_url;
}

/**
 * Upload an image from a data URI or URL
 */
export async function uploadImageToR2(
  imageUri: string,
  folder: string,
  filename?: string
): Promise<string> {
  // Convert data URI or URL to File
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const ext = imageUri.split('.').pop()?.split('?')[0] || 'jpg';
  const name = filename || `${Date.now()}.${ext}`;
  const file = new File([blob], name, { type: blob.type || 'image/jpeg' });

  return uploadToR2(file, folder);
}

/**
 * Delete a file from R2 (via edge function - future implementation)
 */
export async function deleteFromR2(key: string): Promise<void> {
  // R2 delete would need another edge function
  // For now, files can be managed via the R2 dashboard
  console.log('Delete from R2:', key);
}
