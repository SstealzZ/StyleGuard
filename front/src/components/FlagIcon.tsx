import { getFlagUrl } from '../assets/flags';

/**
 * Props for the FlagIcon component
 */
interface FlagIconProps {
  langCode: string;
  className?: string;
}

/**
 * Displays a country flag based on language code
 * 
 * @param props - Component properties
 * @returns JSX element containing a flag image
 */
export const FlagIcon = ({ langCode, className = '' }: FlagIconProps) => {
  return (
    <img
      src={getFlagUrl(langCode)}
      alt={`${langCode} flag`}
      className={`inline-block w-5 h-auto object-contain ${className}`}
      loading="lazy"
    />
  );
}; 