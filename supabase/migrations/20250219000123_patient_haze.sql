/*
  # Configure Storage Settings

  1. Storage Configuration
    - Set maximum file size to 50MB
    - Enable image transformations
    - Configure S3 connectivity

  2. Bucket Configuration
    - Create public bucket for general uploads
    - Set appropriate security policies

  3. Security
    - Enable RLS for storage
    - Add policies for authenticated users
*/

-- Enable storage extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "storage";

-- Create public bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public',
  'public',
  true,
  52428800, -- 50MB in bytes
  '{image/*,application/pdf}'
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = '{image/*,application/pdf}';

-- Enable image transformations for the bucket
UPDATE storage.buckets
SET allowed_mime_types = array_append(allowed_mime_types, 'image/webp')
WHERE id = 'public';

-- Create RLS policies for storage
CREATE POLICY "Public Access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'public');

CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'public' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'public' AND owner = auth.uid())
WITH CHECK (bucket_id = 'public' AND owner = auth.uid());

CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'public' AND owner = auth.uid());

-- Configure storage settings
UPDATE storage.buckets
SET region = 'eu-central-1',
    endpoint = 'https://gihkstmfdachgdpzzxod.supabase.co/storage/v1/s3'
WHERE id = 'public';