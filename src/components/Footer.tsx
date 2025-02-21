import React, { useState, useMemo } from 'react';
import { VersionManager } from '../lib/version';
import { Clock, MessageSquare } from 'lucide-react';
import { ChangelogPopup } from './ChangelogPopup';
import { PopOver } from './PopOver';

export function Footer() {
  const [showChangelog, setShowChangelog] = useState(false);
  
  const currentVersion = useMemo(() => {
    try {
      const versionManager = new VersionManager('1.8.1');
      return versionManager.getCurrentVersion();
    } catch (error) {
      console.error('Failed to initialize version manager:', error);
      return '1.8.1';
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
          <button
            onClick={() => setShowChangelog(true)}
            className="flex items-center gap-2 text-sm hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-900 rounded px-2 py-1"
          >
            <Clock className="w-4 h-4" />
            <span>Version {currentVersion}</span>
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