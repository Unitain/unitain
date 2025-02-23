/*
  # Add Vehicle Uploads Support

  1. New Storage Bucket
    - Creates a dedicated bucket for vehicle uploads
    - Configures proper permissions and file limits
    - Enables RLS policies for secure access

  2. Security
    - Enables RLS for the bucket
    - Creates policies for authenticated users
    - Restricts file types to documents and images
*/

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

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create upload policy for authenticated users
CREATE POLICY "Users can upload their own vehicle files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vehicle_uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create read policy for authenticated users
CREATE POLICY "Users can view their own vehicle files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'vehicle_uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create delete policy for authenticated users
CREATE POLICY "Users can delete their own vehicle files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'vehicle_uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);