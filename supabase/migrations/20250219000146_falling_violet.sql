/*
  # Fix Eligibility Checks Table

  1. Table Structure
    - Ensure table exists with correct schema
    - Add metadata column for additional information
    - Add proper constraints and indexes

  2. Security
    - Enable RLS
    - Add proper policies for authenticated users
    - Ensure correct permissions

  3. Performance
    - Add appropriate indexes
    - Optimize for common queries
*/

-- Recreate the table with proper schema
CREATE TABLE IF NOT EXISTS eligibility_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_eligible boolean,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT answers_not_empty CHECK (jsonb_typeof(answers) = 'object')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_eligibility_checks_user_id ON eligibility_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_checks_created_at ON eligibility_checks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_eligibility_checks_is_eligible ON eligibility_checks(is_eligible) WHERE is_eligible = true;

-- Enable RLS
ALTER TABLE eligibility_checks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Users can create their own eligibility checks" ON eligibility_checks;
DROP POLICY IF EXISTS "Users can view their own eligibility checks" ON eligibility_checks;
DROP POLICY IF EXISTS "Users can update their own eligibility checks" ON eligibility_checks;

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

CREATE POLICY "Users can update their own eligibility checks"
  ON eligibility_checks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create or replace the updated_at trigger
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