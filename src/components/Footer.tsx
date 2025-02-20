import React, { useMemo, useState, useRef, useCallback } from 'react';
import { VersionManager } from '../lib/version';
import packageJson from '../../package.json';
import { MessageSquare } from 'lucide-react';
import { ChangelogPopup } from './ChangelogPopup';
import { PopOver } from './PopOver';

const CLICK_THRESHOLD = 1000; // 1 second between clicks
const REQUIRED_CLICKS = 5;

export function Footer() {
  const [showChangelog, setShowChangelog] = useState(false);
  const clickCount = useRef(0);
  const lastClickTime = useRef(0);
  
  const currentVersion = useMemo(() => {
    try {
      const versionManager = new VersionManager('1.4.4');
      return versionManager.getCurrentVersion();
    } catch (error) {
      console.error('Failed to initialize version manager:', error);
      return '1.4.4';
    }
  }, []);

  const handleVersionClick = useCallback(() => {
    const now = Date.now();
    
    if (now - lastClickTime.current > CLICK_THRESHOLD) {
      clickCount.current = 0;
    }
    
    clickCount.current += 1;
    lastClickTime.current = now;

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
      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-blue-900 text-white flex items-center justify-between px-4 min-w-[320px] z-40">
        <div className="flex items-center gap-4">
          <PopOver
            trigger={
              <button
                onClick={handleVersionClick}
                className="text-sm hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-900 rounded px-1"
              >
                Version: {currentVersion}
              </button>
            }
            content={
              <div className="p-2 text-sm text-gray-600">
                Click 5 times to view changelog
              </div>
            }
            placement="top"
          />
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