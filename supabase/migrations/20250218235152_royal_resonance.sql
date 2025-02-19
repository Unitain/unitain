/*
  # Fix database setup and ensure table exists

  1. Changes
    - Ensure eligibility_checks table exists with correct schema
    - Add proper indexes for performance
    - Update RLS policies for better security

  2. Security
    - Maintain RLS policies
    - Add index on user_id for better query performance
    - Add validation checks for answers

  3. Performance
    - Add indexes for commonly queried fields
    - Add check constraints for data validation
*/

-- Ensure the table exists with correct schema
CREATE TABLE IF NOT EXISTS eligibility_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_eligible boolean,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT answers_not_empty CHECK (jsonb_array_length(answers::jsonb) > 0)
);

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_eligibility_checks_user_id ON eligibility_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_checks_created_at ON eligibility_checks(created_at DESC);

-- Enable RLS
ALTER TABLE eligibility_checks ENABLE ROW LEVEL SECURITY;

-- Recreate policies to ensure they exist
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can create their own eligibility checks" ON eligibility_checks;
  DROP POLICY IF EXISTS "Users can view their own eligibility checks" ON eligibility_checks;
  DROP POLICY IF EXISTS "Users can update their own eligibility checks" ON eligibility_checks;

  -- Create new policies
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
END $$;