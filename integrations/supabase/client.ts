import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// For development/preview environments, fall back to these values if env vars aren't set
const fallbackUrl = 'https://jqmalkbmuwkpcfgkfhfq.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxbWFsa2JtdXdrcGNmZ2tmaGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MTM5NzgsImV4cCI6MjA1NDk4OTk3OH0.QzteL_SQVrS8tOfnmn_3yk7Znql690dZ-oKFAwkPHWA';

export const supabase = createClient(
  supabaseUrl || fallbackUrl,
  supabaseAnonKey || fallbackKey
);

/**
 * Uploads a file to Supabase Storage
 * 
 * @param file - The file to upload
 * @param bucket - The bucket name to store the file in
 * @returns Promise with the public URL and file path
 */
export const uploadFile = async (file: File, bucket = 'Documents'): Promise<{url: string, path: string}> => {
  const timestamp = new Date().getTime();
  const fileExt = file.name.split('.').pop();
  const safeName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${safeName}_${timestamp}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);
    
  return { 
    url: publicUrl,
    path: data.path
  };
};

/**
 * Deletes a file from Supabase Storage
 * 
 * @param path - The path to the file to delete
 * @param bucket - The bucket name where the file is stored
 * @returns Promise with the deletion result
 */
export const deleteFile = async (path: string, bucket = 'Documents'): Promise<void> => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
    
  if (error) throw error;
}; 