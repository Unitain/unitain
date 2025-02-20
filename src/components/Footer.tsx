import React, { useMemo, useState, useRef, useCallback } from 'react';
import { VersionManager } from '../lib/version';
import packageJson from '../../package.json';
import { MessageSquare } from 'lucide-react';
import { ChangelogPopup } from './ChangelogPopup';

const CLICK_THRESHOLD = 1000; // 1 second between clicks
const REQUIRED_CLICKS = 5;

export function Footer() {
  const [showChangelog, setShowChangelog] = useState(false);
  const clickCount = useRef(0);
  const lastClickTime = useRef(0);
  
  const currentVersion = useMemo(() => {
    try {
      const versionManager = new VersionManager(packageJson.version);
      return versionManager.getCurrentVersion();
    } catch (error) {
      console.error('Failed to initialize version manager:', error);
      return packageJson.version;
    }
  }, []);

  const handleVersionClick = useCallback(() => {
    const now = Date.now();
    
    // Reset counter if too much time has passed since last click
    if (now - lastClickTime.current > CLICK_THRESHOLD) {
      clickCount.current = 0;
    }
    
    clickCount.current += 1;
    lastClickTime.current = now;

    // Show changelog after 5 rapid clicks
    if (clickCount.current >= REQUIRED_CLICKS) {
      clickCount.current = 0;
      setShowChangelog(true);
    }
  }, []);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const contactButton = document.querySelector('[data-contact-form]') as HTMLButtonElement;
    if (contactButton) {
      contactButton.click();
      return;
    }

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-gray-900 text-white flex items-center justify-between px-4 min-w-[320px] z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={handleVersionClick}
            className="text-sm hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1"
          >
            Version: {currentVersion}
          </button>
          <a 
            href="https://test.unitain.net/terms"
            className="text-sm text-white/80 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Use
          </a>
        </div>
        <button
          onClick={handleContactClick}
          className="flex items-center gap-2 text-sm text-white/80 hover:text-white focus:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 rounded-md px-2 py-1"
          aria-label="Contact us"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Contact</span>
        </button>
      </footer>

      <ChangelogPopup 
        isOpen={showChangelog}
        onClose={() => setShowChangelog(false)}
      />
    </>
  );
}