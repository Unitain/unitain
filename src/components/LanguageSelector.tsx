import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { languages } from '../lib/i18n/translations';
import { cn } from '../lib/utils';

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as any);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-controls="language-menu"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">
          {languages.find(l => l.language === currentLanguage)?.nativeName}
        </span>
      </button>

      <div
        id="language-menu"
        role="menu"
        className={cn(
          'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition-all transform origin-top-right',
          'z-50',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        )}
      >
        <div className="py-1" role="none">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang.language)}
              className={cn(
                'w-full text-left px-4 py-2 text-sm transition-colors',
                currentLanguage === lang.language
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
              role="menuitem"
              aria-current={currentLanguage === lang.language}
            >
              <span className="font-medium">{lang.nativeName}</span>
              <span className="ml-2 text-gray-500">({lang.name})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}