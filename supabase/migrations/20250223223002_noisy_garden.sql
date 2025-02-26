-- Create vehicle_uploads bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle_uploads',
  'vehicle_uploads',
  false,
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Users can upload their own vehicle files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own vehicle files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own vehicle files" ON storage.objects;

-- Create upload policy for authenticated users
CREATE POLICY "Users can upload their own vehicle files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vehicle_uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create read policy for authenticated users
CREATE POLICY "Users can view their own vehicle files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'vehicle_uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create delete policy for authenticated users
CREATE POLICY "Users can delete their own vehicle files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'vehicle_uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);