import React, { useEffect, useRef } from 'react';
import { X, Clock, ExternalLink } from 'lucide-react';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { formatDate } from '../lib/utils';

interface ChangelogPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChangelogEntry {
  type: 'fix' | 'feature' | 'docs' | 'performance' | 'refactor';
  description: string;
  version: string;
  date: string;
}

const CHANGE_TYPES = {
  fix: { label: '🔧 Fix', color: '#ff6b6b' },
  feature: { label: '✨ Feature', color: '#4ecdc4' },
  docs: { label: '📝 Documentation', color: '#95a5a6' },
  performance: { label: '⚡ Performance', color: '#f39c12' },
  refactor: { label: '🔨 Refactor', color: '#3498db' }
} as const;

const changelog: ChangelogEntry[] = [
  // Version 1.7.3
  {
    type: 'performance',
    description: 'Improved DOM handling and error recovery in language system',
    version: '1.7.3',
    date: '2025-02-19'
  },
  {
    type: 'performance',
    description: 'Enhanced timezone detection reliability',
    version: '1.7.3',
    date: '2025-02-19'
  },
  {
    type: 'performance',
    description: 'Optimized document ready state handling',
    version: '1.7.3',
    date: '2025-02-19'
  },
  {
    type: 'fix',
    description: 'Fixed potential null reference errors in DOM operations',
    version: '1.7.3',
    date: '2025-02-19'
  },
  {
    type: 'fix',
    description: 'Improved error handling in language context',
    version: '1.7.3',
    date: '2025-02-19'
  },
  {
    type: 'fix',
    description: 'Fixed timing issues with document ready state',
    version: '1.7.3',
    date: '2025-02-19'
  },
  {
    type: 'fix',
    description: 'Resolved race conditions in timezone detection',
    version: '1.7.3',
    date: '2025-02-19'
  },
  // Version 1.7.0
  {
    type: 'feature',
    description: 'Dutch (Nederlands) language support',
    version: '1.7.0',
    date: '2025-02-19'
  },
  {
    type: 'feature',
    description: 'Language detection for Dutch users',
    version: '1.7.0',
    date: '2025-02-19'
  },
  {
    type: 'feature',
    description: 'Dutch translations for all UI elements',
    version: '1.7.0',
    date: '2025-02-19'
  },
  {
    type: 'feature',
    description: 'Dutch PayPal integration localization',
    version: '1.7.0',
    date: '2025-02-19'
  },
  {
    type: 'performance',
    description: 'Enhanced language selector UI with improved accessibility',
    version: '1.7.0',
    date: '2025-02-19'
  },
  {
    type: 'performance',
    description: 'Optimized language switching performance',
    version: '1.7.0',
    date: '2025-02-19'
  },
  {
    type: 'fix',
    description: 'Language selector dropdown positioning on mobile devices',
    version: '1.7.0',
    date: '2025-02-19'
  },
  {
    type: 'fix',
    description: 'Language persistence issues after page reload',
    version: '1.7.0',
    date: '2025-02-19'
  },
  // Version 1.6.0
  {
    type: 'feature',
    description: 'Comprehensive multilanguage support with English and German translations',
    version: '1.6.0',
    date: '2025-02-19'
  },
  {
    type: 'feature',
    description: 'GDPR-compliant cookie banner with granular consent options',
    version: '1.6.0',
    date: '2025-02-19'
  },
  {
    type: 'performance',
    description: 'Enhanced PayPal integration with improved error handling and localization',
    version: '1.6.0',
    date: '2025-02-19'
  },
  {
    type: 'fix',
    description: 'Language detection edge cases and cookie consent persistence',
    version: '1.6.0',
    date: '2025-02-19'
  },
  {
    type: 'docs',
    description: 'Added comprehensive documentation for multilanguage implementation',
    version: '1.6.0',
    date: '2025-02-19'
  }
];

export function ChangelogPopup({ isOpen, onClose }: ChangelogPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const groupedChangelog = changelog.reduce((acc, entry) => {
    if (!acc[entry.version]) {
      acc[entry.version] = {
        date: entry.date,
        entries: []
      };
    }
    acc[entry.version].entries.push(entry);
    return acc;
  }, {} as Record<string, { date: string; entries: ChangelogEntry[] }>);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="changelog-title"
    >
      <div
        ref={popupRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col relative animate-in fade-in duration-200"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-xl">
          <h2 id="changelog-title" className="text-xl font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Change Log
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close changelog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div 
          ref={contentRef}
          className="overflow-y-auto overscroll-contain p-6 space-y-8 scroll-smooth"
        >
          {Object.entries(groupedChangelog).map(([version, { date, entries }]) => (
            <div key={version} className="border-b border-gray-200 last:border-0 pb-8 last:pb-0">
              <h3 className="text-lg font-semibold flex items-center gap-3 mb-4">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  v{version}
                </span>
                <time 
                  dateTime={date}
                  className="text-sm font-normal text-gray-500"
                >
                  {formatDate(date, currentLanguage)}
                </time>
              </h3>

              <div className="space-y-3">
                {entries.map((entry, index) => (
                  <div 
                    key={index}
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
                    <p className="text-gray-700 flex-1">{entry.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent p-4">
          <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
            <a
              href="https://github.com/Unitain/Portuguese-Vehicle-Tax-Exemption-Checker/blob/main/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View full changelog on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}