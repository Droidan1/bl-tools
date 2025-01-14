import { supabase } from './supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET_NAME = 'inventory-photos';

export async function uploadBOLPhoto(photoDataUrl: string, bolNumber: string): Promise<string | null> {
  try {
    console.log('Starting photo upload process');
    
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

    console.log('Uploading file:', filename);

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }

    console.log('Upload successful, getting public URL');

    // Get public URL using Supabase's getPublicUrl method
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    console.log('Generated public URL:', publicUrl);
    
    // Ensure the URL is properly formatted
    const cleanUrl = new URL(publicUrl).toString();
    return cleanUrl;

  } catch (error) {
    console.error('Error uploading BOL photo:', error);
    throw error;
  }
}

export async function deletePhoto(photoPath: string): Promise<void> {
  try {
    console.log('Attempting to delete photo:', photoPath);
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([photoPath]);

    if (error) {
      console.error('Storage deletion error:', error);
      throw error;
    }

    console.log('Photo deleted successfully');
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
}