import React, { useEffect, useState, useRef } from 'react';
import { X, Clock, Github, ArrowUp, ChevronDown } from 'lucide-react';
import { MaterialCard } from './MaterialCard';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../lib/utils';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';
import semver from 'semver';

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

const SCROLL_THRESHOLD = 100;
const ENTRIES_PER_PAGE = 10;

export function ChangelogPopup({ isOpen, onClose }: ChangelogPopupProps) {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [hasMoreEntries, setHasMoreEntries] = useState(true);
  const [page, setPage] = useState(1);
  const { i18n } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);
  const loadingRef = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

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
          .order('version', { ascending: false })
          .range(0, ENTRIES_PER_PAGE - 1);

        if (fetchError) throw fetchError;

        if (mounted.current) {
          setEntries(data || []);
          setHasMoreEntries((data?.length || 0) === ENTRIES_PER_PAGE);
        }

        // Restore scroll position
        try {
          const storedPosition = localStorage.getItem('changelog_scroll_position');
          if (storedPosition && contentRef.current) {
            contentRef.current.scrollTop = parseInt(storedPosition, 10);
          }
        } catch (err) {
          console.warn('Failed to read scroll position:', err);
        }
      } catch (err) {
        console.error('Failed to fetch changelog:', err);
        if (mounted.current) {
          setError('Failed to load changelog. Please try again.');
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    fetchChangelog();
  }, [isOpen]);

  const loadMoreEntries = async () => {
    if (loadingRef.current) return;
    
    try {
      loadingRef.current = true;
      const { data, error: fetchError } = await supabase
        .from('changelog')
        .select('*')
        .order('date', { ascending: false })
        .order('version', { ascending: false })
        .range(page * ENTRIES_PER_PAGE, (page + 1) * ENTRIES_PER_PAGE - 1);

      if (fetchError) throw fetchError;

      if (mounted.current) {
        setEntries(prev => {
          // Filter out any duplicates
          const newEntries = data || [];
          const existingIds = new Set(prev.map(e => e.id));
          const uniqueNewEntries = newEntries.filter(e => !existingIds.has(e.id));
          return [...prev, ...uniqueNewEntries];
        });
        setHasMoreEntries((data?.length || 0) === ENTRIES_PER_PAGE);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error('Failed to load more entries:', err);
      toast.error('Failed to load more entries. Please try again.');
    } finally {
      loadingRef.current = false;
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setScrollPosition(scrollTop);
    setShowScrollButtons(scrollTop > SCROLL_THRESHOLD);

    // Save scroll position
    try {
      localStorage.setItem('changelog_scroll_position', scrollTop.toString());
    } catch (err) {
      console.warn('Failed to save scroll position:', err);
    }

    // Check if we're near the bottom to load more
    if (scrollHeight - scrollTop - clientHeight < 100 && hasMoreEntries && !loading && !loadingRef.current) {
      loadMoreEntries();
    }
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const scrollToBottom = async () => {
    // First load all entries if not loaded
    while (hasMoreEntries && !loadingRef.current) {
      await loadMoreEntries();
    }

    // Then scroll to bottom
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Group entries by version and date
  const groupedEntries = entries.reduce((acc, entry) => {
    const key = `${entry.version}-${entry.date}`;
    if (!acc[key]) {
      acc[key] = {
        version: entry.version,
        date: entry.date,
        entries: []
      };
    }
    acc[key].entries.push(entry);
    return acc;
  }, {} as Record<string, { version: string; date: string; entries: ChangelogEntry[] }>);

  if (!isOpen) return null;

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
          <h2 id="changelog-title" className="text-xl font-semibold flex items-center gap-2 text-blue-600">
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
          ref={contentRef}
          className="overflow-y-auto overscroll-contain p-6 space-y-8 relative"
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
          ) : entries.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              No changelog entries found.
            </div>
          ) : (
            <>
              {Object.values(groupedEntries).map(({ version, date, entries }) => (
                <div key={`${version}-${date}`} className="border-b border-gray-200 last:border-0 pb-8 last:pb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      v{version}
                    </span>
                    <time 
                      dateTime={date}
                      className="text-sm text-gray-500"
                    >
                      {formatDate(date, i18n.language)}
                    </time>
                  </div>

                  <div className="space-y-3">
                    {entries.map((entry) => (
                      <div 
                        key={entry.id || nanoid()}
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
              ))}
              {hasMoreEntries && (
                <div className="text-center pt-4">
                  <button
                    onClick={loadMoreEntries}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    disabled={loadingRef.current}
                  >
                    {loadingRef.current ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Scroll Buttons */}
        {showScrollButtons && (
          <div className="absolute right-4 bottom-20 flex flex-col gap-2">
            <button
              onClick={scrollToTop}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={scrollToBottom}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Scroll to bottom"
            >
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

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