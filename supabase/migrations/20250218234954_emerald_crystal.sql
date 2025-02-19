/*
  # Create eligibility checks table and security policies

  1. New Tables
    - `eligibility_checks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `answers` (jsonb)
      - `is_eligible` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `eligibility_checks` table
    - Add policies for authenticated users to:
      - Create their own checks
      - View their own checks
      - Update their own checks

  3. Triggers
    - Add trigger for updating `updated_at` timestamp
*/

-- Drop existing table if it exists to ensure clean state
DROP TABLE IF EXISTS eligibility_checks;

-- Create the eligibility_checks table
CREATE TABLE eligibility_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_eligible boolean,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE eligibility_checks ENABLE ROW LEVEL SECURITY;

-- Create policies
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

CREATE POLICY "Users can update their own eligibility checks"
  ON eligibility_checks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

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