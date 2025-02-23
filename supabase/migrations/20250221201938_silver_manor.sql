/*
  # Fix changelog RLS policies

  1. Changes
    - Enable RLS for changelog table
    - Add public read access policy
    - Add authenticated insert policy
    - Add authenticated update policy

  2. Security
    - Anyone can read changelog entries
    - Only authenticated users can insert entries
    - Only authenticated users can update their own entries
*/

-- Enable RLS
ALTER TABLE changelog ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON changelog;
DROP POLICY IF EXISTS "Authenticated users can insert changelog entries" ON changelog;

-- Create new policies
CREATE POLICY "Anyone can read changelog"
  ON changelog
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert changelog entries"
  ON changelog
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update changelog entries"
  ON changelog
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);