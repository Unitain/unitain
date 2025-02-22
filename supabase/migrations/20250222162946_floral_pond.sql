/*
  # Authentication Flow Enhancement

  1. Changes
    - Enhanced authentication flow with improved redirect handling
    - Added email confirmation callback page
    - Improved session management and user experience

  2. Details
    - Added AuthCallback component for handling email confirmations
    - Enhanced redirect URL management
    - Improved error handling and user feedback
    - Added utility functions for auth flow management
*/

INSERT INTO changelog (version, date, type, message)
VALUES 
    ('1.8.5', CURRENT_DATE, 'changed', 'Enhanced authentication flow with improved redirect handling'),
    ('1.8.5', CURRENT_DATE, 'added', 'Added email confirmation callback page'),
    ('1.8.5', CURRENT_DATE, 'changed', 'Improved session management and user experience'),
    ('1.8.5', CURRENT_DATE, 'fixed', 'Enhanced error handling in authentication process');