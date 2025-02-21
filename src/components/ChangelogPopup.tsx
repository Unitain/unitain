import React, { useEffect, useState } from 'react';
import { X, Clock, Github } from 'lucide-react';
import { MaterialCard } from './MaterialCard';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../lib/utils';
import { supabase } from '../lib/supabase';

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  type: 'added' | 'changed' | 'fixed';
  message: string;
}

interface ChangelogPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHANGE_TYPES = {
  added: { label: '✨ Feature', color: '#4ecdc4' },
  fixed: { label: '🔧 Fix', color: '#ff6b6b' },
  changed: { label: '⚡ Change', color: '#f39c12' }
} as const;

export function ChangelogPopup({ isOpen, onClose }: ChangelogPopupProps) {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;

    const fetchChangelog = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('changelog')
          .select('*')
          .order('date', { ascending: false })
          .order('version', { ascending: false });

        if (fetchError) throw fetchError;

        setEntries(data || []);

        // Restore scroll position
        try {
          const storedPosition = localStorage.getItem('changelog_scroll_position');
          if (storedPosition) {
            setScrollPosition(parseInt(storedPosition, 10));
          }
        } catch (err) {
          console.warn('Failed to read scroll position:', err);
        }
      } catch (err) {
        console.error('Failed to fetch changelog:', err);
        setError('Failed to load changelog. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchChangelog();
  }, [isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    try {
      localStorage.setItem('changelog_scroll_position', e.currentTarget.scrollTop.toString());
    } catch (error) {
      console.warn('Failed to save scroll position:', error);
    }
  };

  if (!isOpen) return null;

  const groupedEntries = entries.reduce((acc, entry) => {
    if (!acc[entry.version]) {
      acc[entry.version] = [];
    }
    acc[entry.version].push(entry);
    return acc;
  }, {} as Record<string, ChangelogEntry[]>);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="changelog-title"
    >
      <MaterialCard 
        className="w-full max-w-3xl max-h-[85vh] flex flex-col bg-white animate-in fade-in duration-200"
        elevation={4}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-xl">
          <h2 id="changelog-title" className="text-xl font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            What's New
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close changelog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="overflow-y-auto overscroll-contain p-6 space-y-8"
          style={{ maxHeight: '400px' }}
          onScroll={handleScroll}
        >
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-4">
              {error}
              <button
                onClick={() => window.location.reload()}
                className="block mx-auto mt-2 text-blue-600 hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : (
            Object.entries(groupedEntries).map(([version, versionEntries]) => (
              <div key={version} className="border-b border-gray-200 last:border-0 pb-8 last:pb-0">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    v{version}
                  </span>
                  <time 
                    dateTime={versionEntries[0].date}
                    className="text-sm text-gray-500"
                  >
                    {formatDate(versionEntries[0].date, i18n.language)}
                  </time>
                </div>

                <div className="space-y-3">
                  {versionEntries.map((entry) => (
                    <div 
                      key={entry.id}
                      className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${CHANGE_TYPES[entry.type].color}15`,
                          color: CHANGE_TYPES[entry.type].color
                        }}
                      >
                        {CHANGE_TYPES[entry.type].label}
                      </span>
                      <p className="text-gray-700 flex-1">{entry.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent p-4 flex justify-between items-center">
          <a
            href="https://github.com/Unitain/unitain/compare/main...staging"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>View on GitHub</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </MaterialCard>
    </div>
  );
}