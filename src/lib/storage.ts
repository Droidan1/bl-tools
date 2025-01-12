import { supabase } from './supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
    const filename = `${timestamp}-${bolNumber}.jpg`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('inventory-photos')
      .upload(`bol/${filename}`, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('inventory-photos')
      .getPublicUrl(`bol/${filename}`);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading BOL photo:', error);
    throw error;
  }
}