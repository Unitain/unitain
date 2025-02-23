-- Add deployment verification to changelog
INSERT INTO changelog (version, date, type, message)
VALUES 
    ('1.8.7', CURRENT_DATE, 'fixed', 'Verified and deployed authentication redirect fixes'),
    ('1.8.7', CURRENT_DATE, 'changed', 'Optimized email confirmation flow'),
    ('1.8.7', CURRENT_DATE, 'fixed', 'Ensured consistent domain usage across auth redirects');

-- Add deployment verification comment
COMMENT ON TABLE changelog IS 'Stores application changelog entries including deployment verifications';