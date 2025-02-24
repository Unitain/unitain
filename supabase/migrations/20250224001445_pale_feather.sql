-- Insert changelog entries for version 1.8.9
INSERT INTO changelog (version, date, type, message)
VALUES 
    -- UI & Layout Improvements
    ('1.8.9', CURRENT_DATE, 'changed', 'Enhanced button layout and mobile responsiveness'),
    ('1.8.9', CURRENT_DATE, 'fixed', 'Resolved button overlap issues on mobile devices'),
    ('1.8.9', CURRENT_DATE, 'changed', 'Improved form layout and spacing consistency'),
    ('1.8.9', CURRENT_DATE, 'fixed', 'Fixed eligibility checker button alignment'),

    -- Chat Interface Enhancements
    ('1.8.9', CURRENT_DATE, 'changed', 'Optimized chat interface for better user experience'),
    ('1.8.9', CURRENT_DATE, 'added', 'Implemented real-time chat message updates'),
    ('1.8.9', CURRENT_DATE, 'fixed', 'Enhanced chat message display and formatting'),
    ('1.8.9', CURRENT_DATE, 'changed', 'Improved chat input field responsiveness'),

    -- File Management Improvements
    ('1.8.9', CURRENT_DATE, 'fixed', 'Resolved file upload authorization issues'),
    ('1.8.9', CURRENT_DATE, 'added', 'Enhanced file upload progress tracking'),
    ('1.8.9', CURRENT_DATE, 'changed', 'Improved file upload status notifications'),
    ('1.8.9', CURRENT_DATE, 'fixed', 'Fixed file download guide component issues'),

    -- General Enhancements
    ('1.8.9', CURRENT_DATE, 'changed', 'Enhanced overall component spacing and alignment'),
    ('1.8.9', CURRENT_DATE, 'fixed', 'Improved error handling and user feedback'),
    ('1.8.9', CURRENT_DATE, 'changed', 'Optimized mobile layout across all components');

-- Add documentation comment
COMMENT ON TABLE changelog IS 'Stores application changelog entries including version 1.8.9 UI and functionality improvements';