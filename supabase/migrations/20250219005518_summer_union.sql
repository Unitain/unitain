-- Create type for contact request status
DO $$ BEGIN
    CREATE TYPE contact_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop and recreate eligibility_checks table with proper schema
DROP TABLE IF EXISTS eligibility_checks CASCADE;

CREATE TABLE eligibility_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_eligible boolean,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT answers_not_empty CHECK (jsonb_typeof(answers) = 'object'),
  CONSTRAINT metadata_valid CHECK (jsonb_typeof(metadata) = 'object')
);

-- Create indexes for better performance
CREATE INDEX idx_eligibility_checks_user_id ON eligibility_checks(user_id);
CREATE INDEX idx_eligibility_checks_created_at ON eligibility_checks(created_at DESC);
CREATE INDEX idx_eligibility_checks_is_eligible ON eligibility_checks(is_eligible) WHERE is_eligible = true;

-- Enable RLS
ALTER TABLE eligibility_checks ENABLE ROW LEVEL SECURITY;

-- Create policies with proper permissions
CREATE POLICY "Users can create their own eligibility checks"
  ON eligibility_checks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own eligibility checks"
  ON eligibility_checks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop and recreate contact_requests table with proper schema
DROP TABLE IF EXISTS contact_requests CASCADE;

CREATE TABLE contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  message text CHECK (message IS NULL OR length(trim(message)) BETWEEN 10 AND 5000),
  status contact_status NOT NULL DEFAULT 'pending',
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

-- Add triggers
CREATE TRIGGER update_eligibility_checks_timestamp
  BEFORE UPDATE ON eligibility_checks
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_contact_requests_timestamp
  BEFORE UPDATE ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER track_contact_request_trigger
  BEFORE INSERT ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION track_contact_request();