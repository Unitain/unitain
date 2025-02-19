/*
  # Create Contact Requests Table

  1. New Tables
    - `contact_requests`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `message` (text, required)
      - `status` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `contact_requests` table
    - Add policies for public access to create requests
    - Add rate limiting function
    - Add request tracking trigger

  3. Indexes
    - Email index for lookups
    - Status index for filtering
    - Created at index for sorting
*/

-- Drop existing table if it exists to ensure clean state
DROP TABLE IF EXISTS contact_requests CASCADE;

-- Create contact_requests table with enhanced schema
CREATE TABLE contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  message text NOT NULL CHECK (length(trim(message)) BETWEEN 10 AND 5000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT metadata_valid CHECK (jsonb_typeof(metadata) = 'object')
);

-- Create indexes for better performance
CREATE INDEX idx_contact_requests_email ON contact_requests(email);
CREATE INDEX idx_contact_requests_status ON contact_requests(status);
CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at DESC);

-- Enable RLS
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Create rate limiting function
CREATE OR REPLACE FUNCTION check_contact_rate_limit(
  p_email text,
  p_window_minutes int DEFAULT 60,
  p_max_requests int DEFAULT 5
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_count int;
BEGIN
  SELECT COUNT(*)
  INTO request_count
  FROM contact_requests
  WHERE email = p_email
    AND created_at > NOW() - (p_window_minutes || ' minutes')::interval;
    
  RETURN request_count < p_max_requests;
END;
$$;

-- Create request tracking function
CREATE OR REPLACE FUNCTION track_contact_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.metadata = jsonb_build_object(
    'ip_address', current_setting('request.headers', true)::jsonb->>'x-real-ip',
    'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent',
    'origin', current_setting('request.headers', true)::jsonb->>'origin',
    'timestamp', extract(epoch from now()),
    'request_id', gen_random_uuid()
  ) || COALESCE(NEW.metadata, '{}'::jsonb);
  
  RETURN NEW;
END;
$$;

-- Create policies
CREATE POLICY "Anyone can create contact requests"
  ON contact_requests
  FOR INSERT
  TO public
  WITH CHECK (
    status = 'pending' AND
    check_contact_rate_limit(email)
  );

CREATE POLICY "Users can view their own requests"
  ON contact_requests
  FOR SELECT
  TO public
  USING (
    CASE 
      WHEN auth.role() = 'authenticated' THEN
        email = auth.jwt() ->> 'email'
      ELSE
        false
    END
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_contact_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_requests_updated_at
  BEFORE UPDATE ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_requests_updated_at();

-- Create request tracking trigger
CREATE TRIGGER track_contact_request_trigger
  BEFORE INSERT ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION track_contact_request();