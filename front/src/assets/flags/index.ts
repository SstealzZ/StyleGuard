/**
 * Flag URLs for each supported language
 * Using country flag SVGs from https://flagicons.lipis.dev/
 */
export const FLAGS = {
  fr: 'https://flagcdn.com/fr.svg',
  en: 'https://flagcdn.com/gb.svg',
  es: 'https://flagcdn.com/es.svg',
  de: 'https://flagcdn.com/de.svg',
  it: 'https://flagcdn.com/it.svg',
  ru: 'https://flagcdn.com/ru.svg',
  pl: 'https://flagcdn.com/pl.svg'
};

/**
 * Get flag URL by language code
 * 
 * @param langCode - Language code (fr, en, etc.)
 * @returns URL to flag image
 */
export const getFlagUrl = (langCode: string): string => {
  return FLAGS[langCode as keyof typeof FLAGS] || FLAGS.en;
}; 