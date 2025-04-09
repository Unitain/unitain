import React, { useState, useEffect } from 'react';
import { Globe, MessageSquare, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import semver from 'semver';

function Footer() {
  // const { t } = useTranslation();
  const [showChangelog, setShowChangelog] = useState(false);
  const [lastShownVersion, setLastShownVersion] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string>('1.8.9'); // Default from package.json
  const [clickCount, setClickCount] = useState(0);
  const [hasNewChanges, setHasNewChanges] = useState(false);
  
  useEffect(() => {
    // Load last shown version from localStorage
    try {
      const storedVersion = localStorage.getItem('changelog_last_shown_version');
      setLastShownVersion(storedVersion);
      
      // Check if there are new changes to show
      checkForNewChanges(storedVersion);
    } catch (error) {
      console.warn('Failed to read changelog version from localStorage:', error);
    }
  }, []);

  const checkForNewChanges = async (storedVersion: string | null) => {
    try {
      // Get the latest version from the database
      const { data, error } = await supabase
        .from('changelog')
        .select('version')
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Failed to fetch latest version:', error);
        return;
      }

      const latestVersion = data?.version;
      
      if (latestVersion && storedVersion) {
        // Use semver for proper version comparison
        const hasChanges = semver.gt(latestVersion, storedVersion);
        setHasNewChanges(hasChanges);
        
        if (hasChanges) {
          console.log(`New changes available: ${storedVersion} → ${latestVersion}`);
        }
      } else if (latestVersion) {
        // No stored version, so there are new changes
        setHasNewChanges(true);
      }
    } catch (error) {
      console.error('Error checking for new changes:', error);
    }
  };

  const handleVersionClick = () => {
    // Increment click counter
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    // Show changelog on 3 clicks
    if (newCount >= 3) {
      setShowChangelog(true);
      setClickCount(0);
    }
  };

  const handleCloseChangelog = () => {
    setShowChangelog(false);
    
    // Mark current version as shown
    try {
      localStorage.setItem('changelog_last_shown_version', currentVersion);
      setLastShownVersion(currentVersion);
      setHasNewChanges(false);
    } catch (error) {
      console.error('Failed to update last shown version:', error);
    }
  };

  return (
    <footer className="bg-[#14161f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Unitain</h3>
            <p className="text-gray-400 text-sm">
              Professional vehicle tax exemption services for expats in Portugal.
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Available in multiple languages</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MessageSquare className="w-4 h-4" />
              <a href="mailto:support@unitain.net" className="hover:text-white transition-colors">
                support@unitain.net
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Data Protection
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Legal Notice
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleVersionClick}
                className="text-gray-400 text-sm hover:text-primary-400 transition-colors flex items-center gap-1"
                aria-label="View changelog"
              >
                <span>Version {currentVersion}</span>
                {hasNewChanges && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                  </span>
                )}
              </button>
              {clickCount > 0 && clickCount < 3 && (
                <span className="text-gray-600 text-xs">{3 - clickCount} more clicks for changelog</span>
              )}
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Unitain. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;