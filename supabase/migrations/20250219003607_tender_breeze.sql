/*
  # Fix Contact Form and Session Handling

  1. Changes
    - Recreate contact_requests table with proper schema
    - Add better constraints and validation
    - Improve RLS policies
    - Add proper indexes

  2. Security
    - Enable RLS
    - Add policies for public form submission
    - Add policies for authenticated users
*/

-- Drop and recreate contact_requests table with proper schema
DROP TABLE IF EXISTS contact_requests;

CREATE TABLE contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) > 0),
  email text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT message_length CHECK (
    CASE WHEN message IS NOT NULL THEN length(trim(message)) > 0 ELSE true END
  )
);

-- Create indexes for better performance
CREATE INDEX idx_contact_requests_email ON contact_requests(email);
CREATE INDEX idx_contact_requests_status ON contact_requests(status);
CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at DESC);

-- Enable RLS
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create contact requests"
  ON contact_requests
  FOR INSERT
  TO public
  WITH CHECK (status = 'pending');

CREATE POLICY "Users can view their own requests"
  ON contact_requests
  FOR SELECT
  TO public
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

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