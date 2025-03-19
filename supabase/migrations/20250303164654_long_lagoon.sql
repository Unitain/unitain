/*
  # Create submission table

  1. New Tables
    - `submission`
      - `id` (uuid, primary key, references auth.users)
      - `document` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `payment_status` (text, default 'pending')
      - `submission_complete` (boolean, default false)
      - `guide_downloaded` (boolean, default false)
  2. Security
    - Enable RLS on `submission` table
    - Add policies for authenticated users to manage their own data
*/

-- Create submission table if it doesn't exist
CREATE TABLE IF NOT EXISTS submission (
  id uuid PRIMARY KEY REFERENCES auth.users,
  document text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  submission_complete boolean DEFAULT false,
  guide_downloaded boolean DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submission_payment_status ON submission(payment_status);
CREATE INDEX IF NOT EXISTS idx_submission_complete ON submission(submission_complete);

-- Enable RLS
ALTER TABLE submission ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own submissions"
  ON submission
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own submissions"
  ON submission
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own submissions"
  ON submission
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_submission_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_submission_updated_at
  BEFORE UPDATE ON submission
  FOR EACH ROW
  EXECUTE FUNCTION update_submission_updated_at();