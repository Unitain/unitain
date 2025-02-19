/*
  # Create eligibility checks table

  1. New Tables
    - `eligibility_checks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `answers` (jsonb)
      - `is_eligible` (boolean)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Indexes
    - Index on user_id for faster lookups
    - Index on created_at for chronological queries

  3. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create the eligibility_checks table
CREATE TABLE IF NOT EXISTS eligibility_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_eligible boolean,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_eligibility_checks_user_id ON eligibility_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_checks_created_at ON eligibility_checks(created_at DESC);

-- Enable Row Level Security
ALTER TABLE eligibility_checks ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_eligibility_checks_updated_at
  BEFORE UPDATE ON eligibility_checks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();