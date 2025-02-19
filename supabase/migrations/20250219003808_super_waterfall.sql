/*
  # Secure Contact Form Implementation

  1. Changes
    - Add rate limiting
    - Add input validation
    - Add request tracking
    - Improve security constraints

  2. Security
    - Enable RLS
    - Add rate limiting
    - Add input validation
    - Add request tracking
*/

-- Create rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(
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

-- Add rate limiting trigger
CREATE OR REPLACE FUNCTION enforce_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT check_rate_limit(NEW.email) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.'
      USING HINT = 'Wait a while before submitting another request';
  END IF;
  RETURN NEW;
END;
$$;

-- Create request tracking function
CREATE OR REPLACE FUNCTION track_contact_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Store request metadata
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

-- Update contact_requests table with enhanced security
ALTER TABLE contact_requests
ADD COLUMN IF NOT EXISTS ip_hash text,
ADD COLUMN IF NOT EXISTS request_count int DEFAULT 1,
ADD CONSTRAINT valid_name CHECK (length(trim(name)) BETWEEN 2 AND 100),
ADD CONSTRAINT valid_message CHECK (
  message IS NULL OR length(trim(message)) BETWEEN 10 AND 5000
);

-- Create rate limiting trigger
DROP TRIGGER IF EXISTS enforce_rate_limit_trigger ON contact_requests;
CREATE TRIGGER enforce_rate_limit_trigger
  BEFORE INSERT ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION enforce_rate_limit();

-- Create request tracking trigger
DROP TRIGGER IF EXISTS track_contact_request_trigger ON contact_requests;
CREATE TRIGGER track_contact_request_trigger
  BEFORE INSERT ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION track_contact_request();

-- Update RLS policies with enhanced security
DROP POLICY IF EXISTS "Anyone can create contact requests" ON contact_requests;
CREATE POLICY "Anyone can create contact requests"
  ON contact_requests
  FOR INSERT
  TO public
  WITH CHECK (
    status = 'pending' AND
    check_rate_limit(email)
  );

-- Create index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_contact_requests_rate_limit 
ON contact_requests(email, created_at)
WHERE created_at > NOW() - INTERVAL '1 day';