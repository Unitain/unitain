import React, { useMemo } from 'react';
import { VersionManager } from '../lib/version';
import packageJson from '../../package.json';
import { MessageSquare } from 'lucide-react';

export function Footer() {
  const currentVersion = useMemo(() => {
    try {
      const versionManager = new VersionManager(packageJson.version);
      return versionManager.getCurrentVersion();
    } catch (error) {
      console.error('Failed to initialize version manager:', error);
      return packageJson.version;
    }
  }, []);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // First try to find and click the contact button in the CTA section
    const contactButton = document.querySelector('[data-contact-form]') as HTMLButtonElement;
    if (contactButton) {
      contactButton.click();
      return;
    }

    // Fallback: scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-10 bg-gray-900 text-white flex items-center justify-between px-4 min-w-[320px] z-50">
      <div className="text-sm">
        Version: {currentVersion}
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
  );
}