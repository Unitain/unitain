-- Insert changelog entries for versions 1.8.6-1.8.8

-- Version 1.8.6 entries
INSERT INTO changelog (version, date, type, message)
VALUES 
    -- Authentication Improvements
    ('1.8.6', '2025-02-22', 'changed', 'Enhanced authentication session handling and persistence'),
    ('1.8.6', '2025-02-22', 'changed', 'Improved sign-in success messaging'),
    ('1.8.6', '2025-02-22', 'changed', 'Optimized session refresh mechanism'),
    ('1.8.6', '2025-02-22', 'fixed', 'Improved session expiration handling'),
    ('1.8.6', '2025-02-22', 'fixed', 'Enhanced authentication state management'),
    ('1.8.6', '2025-02-22', 'fixed', 'Fixed authentication callback notifications');

-- Version 1.8.7 entries
INSERT INTO changelog (version, date, type, message)
VALUES 
    -- Authentication Deployment & Verification
    ('1.8.7', '2025-02-22', 'fixed', 'Verified and deployed authentication redirect fixes'),
    ('1.8.7', '2025-02-22', 'changed', 'Optimized email confirmation flow'),
    ('1.8.7', '2025-02-22', 'fixed', 'Ensured consistent domain usage across auth redirects'),
    ('1.8.7', '2025-02-22', 'changed', 'Enhanced authentication callback handling'),
    ('1.8.7', '2025-02-22', 'fixed', 'Improved error handling for authentication edge cases'),
    ('1.8.7', '2025-02-22', 'changed', 'Streamlined authentication redirect process');

-- Version 1.8.8 entries
INSERT INTO changelog (version, date, type, message)
VALUES 
    -- Timezone and Authentication Fixes
    ('1.8.8', '2025-02-22', 'fixed', 'Fixed timezone detection and initialization'),
    ('1.8.8', '2025-02-22', 'changed', 'Enhanced authentication session persistence'),
    ('1.8.8', '2025-02-22', 'fixed', 'Improved error handling for authentication callbacks'),
    ('1.8.8', '2025-02-22', 'fixed', 'Resolved timezone attribute initialization issues'),
    ('1.8.8', '2025-02-22', 'changed', 'Optimized timezone detection reliability'),
    ('1.8.8', '2025-02-22', 'fixed', 'Enhanced session management and error recovery');

-- Add documentation comment
COMMENT ON TABLE changelog IS 'Stores application changelog entries including versions 1.8.6-1.8.8 authentication and timezone improvements';