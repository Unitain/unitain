/*
  # Test changelog entries

  1. Test Data
    - Add sample changelog entries for testing
    - Include different types of changes
    - Use real version numbers

  2. Security
    - Maintain existing RLS policies
    - No additional permissions needed
*/

-- Insert test changelog entries
INSERT INTO changelog (version, type, message, date)
VALUES
  ('1.8.3', 'added', 'Added multi-language support', CURRENT_DATE),
  ('1.8.3', 'fixed', 'Fixed timezone detection', CURRENT_DATE),
  ('1.8.3', 'changed', 'Updated authentication flow', CURRENT_DATE);

-- Create function to check changelog entries
CREATE OR REPLACE FUNCTION check_changelog_entries(p_version text)
RETURNS TABLE (
  version text,
  type changelog_entry_type,
  message text,
  date date
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.version, c.type, c.message, c.date
  FROM changelog c
  WHERE c.version = p_version
  ORDER BY c.date DESC, c.type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;