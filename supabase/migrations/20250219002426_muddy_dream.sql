/*
  # Add contact form functionality

  1. New Tables
    - `contact_requests`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `message` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `contact_requests` table
    - Add policy for authenticated users to create contact requests
    - Add policy for authenticated users to view their own contact requests
*/

-- Create contact_requests table
CREATE TABLE contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes
CREATE INDEX idx_contact_requests_email ON contact_requests(email);
CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at DESC);

-- Enable RLS
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create contact requests"
  ON contact_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own contact requests"
  ON contact_requests
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Create updated_at trigger
CREATE TRIGGER update_contact_requests_updated_at
  BEFORE UPDATE ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();