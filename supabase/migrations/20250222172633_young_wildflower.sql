-- Add authentication and timezone fixes to changelog
INSERT INTO changelog (version, date, type, message)
VALUES 
    ('1.8.8', CURRENT_DATE, 'fixed', 'Fixed timezone detection and initialization'),
    ('1.8.8', CURRENT_DATE, 'changed', 'Enhanced authentication session persistence'),
    ('1.8.8', CURRENT_DATE, 'fixed', 'Improved error handling for authentication callbacks'),
    ('1.8.8', CURRENT_DATE, 'fixed', 'Resolved timezone attribute initialization issues');

-- Add implementation notes
COMMENT ON TABLE changelog IS 'Stores application changelog entries including timezone and authentication fixes';