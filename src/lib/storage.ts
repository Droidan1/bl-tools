import { supabase } from './supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET_NAME = 'inventory-photos';

export async function uploadBOLPhoto(photoDataUrl: string, bolNumber: string): Promise<string | null> {
  try {
    // Convert base64 to blob
    const response = await fetch(photoDataUrl);
    const blob = await response.blob();

    // Check file size
    if (blob.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 5MB limit');
    }

    // Generate unique filename
    const timestamp = new Date().getTime();
    const filename = `bol/${timestamp}-${bolNumber}.jpg`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage error:', error);
      throw error;
    }

    // Get public URL - using getPublicUrl instead of constructing URL manually
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading BOL photo:', error);
    throw error;
  }
}

export async function deletePhoto(photoPath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([photoPath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
}