/*
  # Create eligibility check tables

  1. New Tables
    - `eligibility_checks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `answers` (jsonb)
      - `is_eligible` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `eligibility_checks` table
    - Add policies for users to:
      - Create their own eligibility checks
      - Read their own eligibility checks
*/

CREATE TABLE IF NOT EXISTS eligibility_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_eligible boolean,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE eligibility_checks ENABLE ROW LEVEL SECURITY;

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