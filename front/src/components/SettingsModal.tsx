import { useTranslation } from 'react-i18next';
import { Cross2Icon } from '@radix-ui/react-icons';
import { authService } from '../services/auth';
import { useState } from 'react';
import { FlagIcon } from './FlagIcon';

/**
 * Props for the SettingsModal component
 */
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal component for application settings
 * 
 * @param props - Component properties
 * @returns JSX element containing the settings modal
 */
export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { t, i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
   * Changes the application language and stores the preference
   * 
   * @param language - The language code to switch to
   */
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('preferredLanguage', language);
    setDropdownOpen(false);
  };

  /**
   * Handles user logout
   */
  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/[0.08] rounded-lg transition-colors"
        >
          <Cross2Icon className="w-4 h-4 text-white/60" />
        </button>

        <h2 className="text-xl text-white/90 font-medium mb-6">{t('settings')}</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-white/60 mb-3">{t('language')}</h3>
            <div className="relative">
              <button
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] transition-colors text-white text-left"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FlagIcon langCode={currentLanguage.code} className="w-5 h-3.5" />
                <span className="flex-grow">{currentLanguage.name}</span>
                <span className={`transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-[#252525] rounded-lg shadow-lg border border-white/10 py-1 z-10">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-white/[0.07] transition-colors ${
                        i18n.language.startsWith(lang.code) ? 'text-white bg-white/[0.05]' : 'text-white/80'
                      }`}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      <FlagIcon langCode={lang.code} className="w-5 h-3.5" />
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white/60 mb-3">{t('account')}</h3>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors text-sm"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 