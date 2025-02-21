/*
  # Add changelog table and related functions

  1. New Tables
    - `changelog`
      - `id` (uuid, primary key)
      - `version` (text, required)
      - `date` (date, required)
      - `type` (text, enum: 'added', 'changed', 'fixed')
      - `message` (text, required)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `changelog` table
    - Add policies for authenticated users to read/write
    - Add validation functions for entry types

  3. Indexes
    - Version and date for efficient querying
    - Type for filtered queries
*/

-- Create type for changelog entry types
DO $$ BEGIN
    CREATE TYPE changelog_entry_type AS ENUM ('added', 'changed', 'fixed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create changelog table
CREATE TABLE changelog (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    version text NOT NULL CHECK (version ~* '^[0-9]+\.[0-9]+\.[0-9]+$'),
    date date NOT NULL DEFAULT CURRENT_DATE,
    type changelog_entry_type NOT NULL,
    message text NOT NULL CHECK (length(trim(message)) > 0),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT changelog_version_date_unique UNIQUE (version, date, message)
);

-- Create indexes
CREATE INDEX idx_changelog_version ON changelog(version);
CREATE INDEX idx_changelog_date ON changelog(date DESC);
CREATE INDEX idx_changelog_type ON changelog(type);

-- Enable RLS
ALTER TABLE changelog ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read changelog"
    ON changelog
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert changelog entries"
    ON changelog
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_changelog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_changelog_timestamp
    BEFORE UPDATE ON changelog
    FOR EACH ROW
    EXECUTE FUNCTION update_changelog_updated_at();

-- Create validation function
CREATE OR REPLACE FUNCTION validate_changelog_entry()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure version follows semver format
    IF NEW.version !~ '^[0-9]+\.[0-9]+\.[0-9]+$' THEN
        RAISE EXCEPTION 'Invalid version format. Must be semver (e.g., 1.0.0)';
    END IF;

    -- Ensure message is not empty
    IF length(trim(NEW.message)) = 0 THEN
        RAISE EXCEPTION 'Message cannot be empty';
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_changelog_entry
    BEFORE INSERT OR UPDATE ON changelog
    FOR EACH ROW
    EXECUTE FUNCTION validate_changelog_entry();

-- Add comments
COMMENT ON TABLE changelog IS 'Stores application changelog entries';
COMMENT ON COLUMN changelog.version IS 'Semantic version number (e.g., 1.0.0)';
COMMENT ON COLUMN changelog.type IS 'Type of change: added, changed, or fixed';
COMMENT ON COLUMN changelog.message IS 'Description of the change';