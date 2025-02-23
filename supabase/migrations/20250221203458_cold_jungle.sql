-- Drop and recreate changelog table with proper schema
DROP TABLE IF EXISTS changelog CASCADE;

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

-- Create indexes for better performance
CREATE INDEX idx_changelog_version ON changelog(version);
CREATE INDEX idx_changelog_date ON changelog(date DESC);
CREATE INDEX idx_changelog_type ON changelog(type);

-- Enable RLS
ALTER TABLE changelog ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Insert initial entries for version 1.8.5
INSERT INTO changelog (version, date, type, message)
VALUES 
    ('1.8.5', CURRENT_DATE, 'fixed', 'Fixed changelog fetching and error handling'),
    ('1.8.5', CURRENT_DATE, 'fixed', 'Improved timezone detection reliability'),
    ('1.8.5', CURRENT_DATE, 'changed', 'Enhanced error handling for database operations'),
    ('1.8.5', CURRENT_DATE, 'changed', 'Optimized authentication notifications')
ON CONFLICT DO NOTHING;