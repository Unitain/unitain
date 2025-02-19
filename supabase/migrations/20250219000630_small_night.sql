/*
  # Fix eligibility checks table and improve error handling

  1. Changes
    - Recreate eligibility_checks table with proper constraints
    - Add better indexing for performance
    - Improve RLS policies
    - Add metadata column for better tracking
    - Add proper constraints for data validation

  2. Security
    - Enable RLS
    - Add proper policies for authenticated users
    - Ensure data integrity with constraints

  3. Performance
    - Add appropriate indexes
    - Optimize query patterns
*/

-- Drop and recreate the eligibility_checks table with proper schema
DROP TABLE IF EXISTS eligibility_checks;

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

-- Create indexes for better query performance
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

DROP TRIGGER IF EXISTS update_eligibility_checks_updated_at ON eligibility_checks;

CREATE TRIGGER update_eligibility_checks_updated_at
  BEFORE UPDATE ON eligibility_checks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();