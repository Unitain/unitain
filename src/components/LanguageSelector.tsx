import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, getLanguageName, type SupportedLanguages } from '../lib/i18n';
import { cn } from '../lib/utils';

const languages: Array<{ code: SupportedLanguages; id: number }> = [
  { id: 1, code: 'en' },
  { id: 2, code: 'de' },
  { id: 3, code: 'nl' }
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { currentLanguage, changeLanguage } = useLanguage();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = async (langCode: SupportedLanguages) => {
    await changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        // className="flex border items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        className="rounded-md border-black flex border items-center gap-2 px-3 py-2 text-sm"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-controls="language-menu"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">
          {getLanguageName(currentLanguage, true)}
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
          {languages.map(({ id, code }) => (
            <button
              key={id}
              onClick={() => handleLanguageChange(code)}
              className={cn(
                'w-full text-left px-4 py-2 text-sm transition-colors',
                currentLanguage === code
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
              role="menuitem"
              aria-current={currentLanguage === code}
            >
              <span className="font-medium">{getLanguageName(code, true)}</span>
              <span className="ml-2 text-gray-500">({getLanguageName(code)})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}