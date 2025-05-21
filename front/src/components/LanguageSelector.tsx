import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { FlagIcon } from './FlagIcon';

/**
 * Language selector component that allows users to switch between available languages
 * 
 * @returns JSX element containing language selection dropdown
 */
export const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Changes the application language and stores the preference
   * 
   * @param language - The language code to switch to
   */
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('preferredLanguage', language);
    setIsOpen(false);
  };

  /**
   * Initialize language from stored preference or browser default
   */
  useEffect(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [i18n]);

  /**
   * Available languages with their display names
   */
  const languages = [
    { code: 'fr', name: t('languageNames.fr') },
    { code: 'en', name: t('languageNames.en') },
    { code: 'es', name: t('languageNames.es') },
    { code: 'de', name: t('languageNames.de') },
    { code: 'it', name: t('languageNames.it') },
    { code: 'ru', name: t('languageNames.ru') },
    { code: 'pl', name: t('languageNames.pl') }
  ];

  /**
   * Get current language object
   */
  const currentLanguage = languages.find(lang => 
    i18n.language.startsWith(lang.code)
  ) || languages[0];

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="absolute top-4 right-4 z-20">
      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-sm transition-colors text-white"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <FlagIcon langCode={currentLanguage.code} className="w-4 h-3" />
          <span className="text-sm font-medium">{currentLanguage.name}</span>
          <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-36 bg-[#1e1e1e]/95 backdrop-blur-md rounded-lg shadow-lg border border-white/10 py-1 text-sm">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`flex items-center gap-3 w-full px-3 py-1.5 text-left hover:bg-white/[0.07] transition-colors ${
                  i18n.language.startsWith(lang.code) ? 'text-white bg-white/[0.05]' : 'text-white/80'
                }`}
                onClick={() => changeLanguage(lang.code)}
              >
                <FlagIcon langCode={lang.code} className="w-4 h-3" />
                <span className="text-sm">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 