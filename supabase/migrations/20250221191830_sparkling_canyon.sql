/*
  # Sync Changelog Data

  1. New Entries
    - Adds missing changelog entries from version history
    - Ensures proper type categorization
    - Preserves chronological order
  
  2. Security
    - Maintains existing RLS policies
    - Uses ON CONFLICT to prevent duplicates
*/

-- Insert missing changelog entries
INSERT INTO changelog (version, date, type, message)
VALUES 
  -- Version 1.8.3 (2025-02-21)
  ('1.8.3', '2025-02-21', 'changed', 'Removed Google login integration for simplified authentication'),
  ('1.8.3', '2025-02-21', 'changed', 'Optimized authentication flow for improved performance'),
  ('1.8.3', '2025-02-21', 'changed', 'Enhanced mobile responsiveness across all login screens'),
  ('1.8.3', '2025-02-21', 'changed', 'Improved timezone detection reliability'),
  ('1.8.3', '2025-02-21', 'fixed', 'Fixed mobile layout issues with logout button'),
  ('1.8.3', '2025-02-21', 'fixed', 'Resolved horizontal scrolling issues on mobile devices'),
  ('1.8.3', '2025-02-21', 'fixed', 'Fixed email overflow in header on small screens'),
  ('1.8.3', '2025-02-21', 'fixed', 'Improved timezone initialization and synchronization'),

  -- Version 1.8.2 (2025-02-21)
  ('1.8.2', '2025-02-21', 'fixed', 'Fixed visual issues in the login modal interface'),
  ('1.8.2', '2025-02-21', 'fixed', 'Improved overall modal responsiveness'),
  ('1.8.2', '2025-02-21', 'fixed', 'Adjusted button alignment and spacing'),
  ('1.8.2', '2025-02-21', 'fixed', 'Updated input field styling for better user experience'),
  ('1.8.2', '2025-02-21', 'fixed', 'Fixed form validation visual feedback'),

  -- Version 1.8.1 (2025-02-20)
  ('1.8.1', '2025-02-20', 'added', 'Version control system with silent state transitions'),
  ('1.8.1', '2025-02-20', 'added', 'Changelog popover with scroll position memory'),
  ('1.8.1', '2025-02-20', 'added', 'Hidden click counter for version display'),
  ('1.8.1', '2025-02-20', 'changed', 'Improved version display UI'),
  ('1.8.1', '2025-02-20', 'changed', 'Enhanced changelog accessibility'),
  ('1.8.1', '2025-02-20', 'changed', 'Optimized version switching with background processing'),
  ('1.8.1', '2025-02-20', 'fixed', 'Timezone detection edge cases'),
  ('1.8.1', '2025-02-20', 'fixed', 'Scroll position persistence'),
  ('1.8.1', '2025-02-20', 'fixed', 'Version display click handling'),

  -- Version 1.8.0 (2025-02-19)
  ('1.8.0', '2025-02-19', 'added', 'New PopOver component with customizable placement and animations'),
  ('1.8.0', '2025-02-19', 'added', 'Enhanced tooltip system with improved accessibility'),
  ('1.8.0', '2025-02-19', 'changed', 'Improved DOM handling and error recovery in language system'),
  ('1.8.0', '2025-02-19', 'changed', 'Enhanced timezone detection reliability'),
  ('1.8.0', '2025-02-19', 'fixed', 'Fixed potential null reference errors in DOM operations'),
  ('1.8.0', '2025-02-19', 'fixed', 'Resolved race conditions in timezone detection')
ON CONFLICT ON CONSTRAINT changelog_version_date_unique DO NOTHING;