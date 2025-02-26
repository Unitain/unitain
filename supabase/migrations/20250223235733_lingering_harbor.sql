-- Insert new changelog entries for version 1.8.9
INSERT INTO changelog (version, date, type, message)
VALUES 
    -- Button & UI Improvements
    ('1.8.9', CURRENT_DATE, 'changed', 'Enhanced button styling and layout consistency across all components'),
    ('1.8.9', CURRENT_DATE, 'changed', 'Improved mobile responsiveness for buttons and forms'),
    ('1.8.9', CURRENT_DATE, 'fixed', 'Fixed button overlap issues on mobile devices'),
    ('1.8.9', CURRENT_DATE, 'fixed', 'Corrected button proportions and spacing in eligibility checker'),
    
    -- Chat UI Enhancements
    ('1.8.9', CURRENT_DATE, 'changed', 'Optimized chat interface layout and responsiveness'),
    ('1.8.9', CURRENT_DATE, 'changed', 'Enhanced chat input field and send button proportions'),
    ('1.8.9', CURRENT_DATE, 'fixed', 'Fixed chat message alignment and spacing'),
    
    -- File Upload Improvements
    ('1.8.9', CURRENT_DATE, 'fixed', 'Resolved file upload authorization issues'),
    ('1.8.9', CURRENT_DATE, 'changed', 'Improved file upload progress indication'),
    ('1.8.9', CURRENT_DATE, 'added', 'Enhanced upload status notifications in chat'),
    
    -- Download Guide Improvements
    ('1.8.9', CURRENT_DATE, 'fixed', 'Fixed duplicate download guide components'),
    ('1.8.9', CURRENT_DATE, 'changed', 'Improved download guide card layout and spacing'),
    
    -- General Improvements
    ('1.8.9', CURRENT_DATE, 'fixed', 'Enhanced timezone detection reliability'),
    ('1.8.9', CURRENT_DATE, 'changed', 'Improved overall component spacing and alignment')
ON CONFLICT ON CONSTRAINT changelog_version_date_unique DO NOTHING;

-- Add comment for documentation
COMMENT ON TABLE changelog IS 'Stores application changelog entries including version 1.8.9 UI improvements';