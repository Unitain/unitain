import React, { useState, useEffect } from 'react';
import { Clock, MessageSquare } from 'lucide-react';
import { ChangelogPopup } from './ChangelogPopup';
import { supabase } from '../lib/supabase';

export function Footer() {
  const [showChangelog, setShowChangelog] = useState(false);
  const [currentVersion, setCurrentVersion] = useState('1.8.3'); // Fallback version
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLatestVersion = async () => {
      try {
        const { data, error } = await supabase
          .from('changelog')
          .select('version, date')
          .order('date', { ascending: false })
          .order('version', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        if (data) {
          setCurrentVersion(data.version);
        }
      } catch (error) {
        console.error('Failed to fetch latest version:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestVersion();
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
            disabled={loading}
          >
            <Clock className="w-4 h-4" />
            <span>
              {loading ? (
                <span className="inline-block w-16 bg-blue-800 animate-pulse rounded">
                  &nbsp;
                </span>
              ) : (
                `Version ${currentVersion}`
              )}
            </span>
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