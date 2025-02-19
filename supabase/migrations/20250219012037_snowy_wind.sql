-- Create contact_requests table with enhanced schema
CREATE TABLE IF NOT EXISTS contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  message text CHECK (message IS NULL OR length(trim(message)) BETWEEN 10 AND 5000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT metadata_valid CHECK (jsonb_typeof(metadata) = 'object')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_requests_email ON contact_requests(email);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at DESC);

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

-- Create policies
CREATE POLICY "Anyone can create contact requests"
  ON contact_requests
  FOR INSERT
  TO public
  WITH CHECK (
    status = 'pending' AND
    check_contact_rate_limit(email)
  );

CREATE POLICY "Public can view their own requests"
  ON contact_requests
  FOR SELECT
  TO public
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_requests_timestamp
  BEFORE UPDATE ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();