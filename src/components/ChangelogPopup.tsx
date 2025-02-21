import React, { useEffect, useState } from 'react';
import { X, Clock } from 'lucide-react';
import { MaterialCard } from './MaterialCard';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { formatDate } from '../lib/utils';
import packageJson from '../../package.json';

interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: 'feature' | 'fix' | 'performance' | 'docs';
    description: string;
  }[];
}

const CHANGE_TYPES = {
  feature: { label: '✨ Feature', color: '#4ecdc4' },
  fix: { label: '🔧 Fix', color: '#ff6b6b' },
  performance: { label: '⚡ Performance', color: '#f39c12' },
  docs: { label: '📝 Documentation', color: '#95a5a6' }
} as const;

interface ChangelogPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangelogPopup({ isOpen, onClose }: ChangelogPopupProps) {
  const [dontShowVersion, setDontShowVersion] = useState<string | null>(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      try {
        const storedVersion = localStorage.getItem('changelog_dont_show_version');
        setDontShowVersion(storedVersion);
      } catch (error) {
        console.warn('Failed to read changelog preferences:', error);
      }
    }
  }, [isOpen]);

  const handleDontShowAgain = () => {
    try {
      localStorage.setItem('changelog_dont_show_version', packageJson.version);
      setDontShowVersion(packageJson.version);
      onClose();
    } catch (error) {
      console.error('Failed to save changelog preferences:', error);
    }
  };

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
        <div className="overflow-y-auto overscroll-contain p-6 space-y-8">
          {Object.entries(changelog).map(([version, { date, changes }]) => (
            <div key={version} className="border-b border-gray-200 last:border-0 pb-8 last:pb-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  v{version}
                </span>
                <time 
                  dateTime={date}
                  className="text-sm text-gray-500"
                >
                  {formatDate(date, currentLanguage)}
                </time>
              </div>

              <div className="space-y-3">
                {changes.map((change, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${CHANGE_TYPES[change.type].color}15`,
                        color: CHANGE_TYPES[change.type].color
                      }}
                    >
                      {CHANGE_TYPES[change.type].label}
                    </span>
                    <p className="text-gray-700 flex-1">{change.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent p-4 flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={dontShowVersion === packageJson.version}
              onChange={handleDontShowAgain}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Don't show this version again
          </label>
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

const changelog: Record<string, { date: string; changes: ChangelogEntry['changes'] }> = {
  '1.8.0': {
    date: '2025-02-19',
    changes: [
      {
        type: 'feature',
        description: 'New PopOver component with customizable placement and animations'
      },
      {
        type: 'feature',
        description: 'Enhanced tooltip system with improved accessibility'
      },
      {
        type: 'performance',
        description: 'Improved DOM handling and error recovery in language system'
      },
      {
        type: 'performance',
        description: 'Enhanced timezone detection reliability'
      },
      {
        type: 'fix',
        description: 'Fixed potential null reference errors in DOM operations'
      },
      {
        type: 'fix',
        description: 'Resolved race conditions in timezone detection'
      }
    ]
  },
  '1.7.3': {
    date: '2025-02-19',
    changes: [
      {
        type: 'performance',
        description: 'Improved DOM handling and error recovery in language system'
      },
      {
        type: 'performance',
        description: 'Enhanced timezone detection reliability'
      },
      {
        type: 'fix',
        description: 'Fixed timing issues with document ready state'
      },
      {
        type: 'fix',
        description: 'Resolved race conditions in timezone detection'
      }
    ]
  }
};