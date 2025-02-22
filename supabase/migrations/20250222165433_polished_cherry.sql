-- Add authentication improvements to changelog
INSERT INTO changelog (version, date, type, message)
VALUES 
    ('1.8.6', CURRENT_DATE, 'changed', 'Improved authentication redirects to use unitain.net domain'),
    ('1.8.6', CURRENT_DATE, 'fixed', 'Enhanced email confirmation callback handling'),
    ('1.8.6', CURRENT_DATE, 'changed', 'Optimized session persistence and state management'),
    ('1.8.6', CURRENT_DATE, 'fixed', 'Improved error handling for authentication edge cases');

-- Add comments for documentation
COMMENT ON TABLE changelog IS 'Stores application changelog entries including authentication improvements';