/*
  # Add Version History Entry for 1.8.6

  1. Changes
    - Adds version history entry for 1.8.6
    - Documents key updates and improvements
    - Maintains consistent formatting with existing entries

  2. Details
    - Version: 1.8.6
    - Release Date: Current date
    - Type: Multiple (changed, fixed)
    - Includes authentication improvements and bug fixes
*/

-- Insert version history entry for 1.8.6
INSERT INTO changelog (version, date, type, message)
VALUES 
    ('1.8.6', CURRENT_DATE, 'changed', 'Enhanced authentication session handling and persistence'),
    ('1.8.6', CURRENT_DATE, 'changed', 'Improved sign-in success messaging'),
    ('1.8.6', CURRENT_DATE, 'changed', 'Optimized session refresh mechanism'),
    ('1.8.6', CURRENT_DATE, 'fixed', 'Improved session expiration handling'),
    ('1.8.6', CURRENT_DATE, 'fixed', 'Enhanced authentication state management'),
    ('1.8.6', CURRENT_DATE, 'fixed', 'Fixed authentication callback notifications')
ON CONFLICT ON CONSTRAINT changelog_version_date_unique DO NOTHING;

-- Add comment for documentation
COMMENT ON TABLE changelog IS 'Stores application changelog entries including version 1.8.6 authentication improvements';