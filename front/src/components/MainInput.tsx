import { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useCorrectionStore } from '../stores/correction';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * Main input component for text correction with minimalist design and internationalization support
 * 
 * @returns JSX element containing the main input area
 */
export const MainInput = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();
  const { submitCorrection } = useCorrectionStore();

  /**
   * State for tracking focus on textarea
   */
  const [isFocused, setIsFocused] = useState(false);

  /**
   * Handles focus events on textarea
   */
  const handleFocus = () => setIsFocused(true);

  /**
   * Handles blur events on textarea
   */
  const handleBlur = () => setIsFocused(false);

  /**
   * Auto-focus the textarea when component mounts
   */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  /**
   * Handles keyboard shortcuts for text submission
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Soumettre avec Ctrl+Entrée ou Cmd+Entrée (toujours)
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
      
      // Soumettre avec Entrée uniquement si on n'est pas en train de taper dans le textarea
      if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey && 
          document.activeElement === textareaRef.current) {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inputText]);

  /**
   * Adjusts the textarea height based on content
   */
  useEffect(() => {
    const adjustTextareaHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 300); // Limite à 300px
        textarea.style.height = `${newHeight}px`;
      }
    };

    adjustTextareaHeight();
  }, [inputText]);

  /**
   * Handles textarea key press events
   * 
   * @param e - Keyboard event from textarea
   */
  const handleTextareaKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Soumettre le formulaire avec Entrée simple (sans modifier les touches)
    if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /**
   * Handles the submission of text for correction
   */
  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Utiliser le store pour soumettre la correction et obtenir la réponse
      const result = await submitCorrection(inputText);
      
      // Ne pas mettre à jour le texte ici, car nous allons être redirigés
      // vers la page de correction
    } catch (err) {
      console.error("Erreur lors de la correction:", err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Focuses the textarea when Ctrl+Enter is pressed
   */
  const focusTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  /**
   * Add event listener for Ctrl+Enter globally to focus textarea
   */
  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (document.activeElement !== textareaRef.current) {
          e.preventDefault();
          focusTextarea();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => window.removeEventListener('keydown', handleGlobalKeyPress);
  }, []);

  /**
   * Check if error is related to Ollama connection
   */
  const isOllamaError = error?.includes('Ollama') || false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col h-full bg-[#1e1e1e]/95 backdrop-blur-xl"
    >
      <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-5xl mx-auto w-full">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-2xl text-white/90 font-medium mb-8"
        >
          {t('enterText')}
        </motion.h1>
        
        <motion.div 
          className="w-full relative"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <motion.div 
            className="absolute inset-0 bg-white/[0.03] backdrop-blur-sm rounded-2xl" 
            initial={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}
            animate={{ 
              boxShadow: isFocused
                ? '0 0 0 1px rgba(59, 130, 246, 0.3), 0 0 0 4px rgba(59, 130, 246, 0.15)' 
                : '0 0 0 1px rgba(255, 255, 255, 0.05)',
              transition: { duration: 0.2 }
            }}
            whileTap={{
              boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.3), 0 0 0 4px rgba(59, 130, 246, 0.15)'
            }}
            onClick={focusTextarea}
          />
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleTextareaKeyPress}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full bg-transparent text-white/90 rounded-2xl px-6 py-4 pr-24 resize-none focus:outline-none focus:ring-0 min-h-[60px] placeholder-white/40 text-lg transition-all duration-200"
              placeholder={t('placeholder')}
              style={{ 
                height: 'auto', 
                minHeight: '60px', 
                maxHeight: '300px', 
                overflow: 'auto',
                paddingRight: '48px', // Espace pour le bouton
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
                outline: 'none',
                boxShadow: 'none'
              }}
              disabled={isLoading}
            />
            
            <div className="absolute right-2 bottom-[10px] flex items-center gap-2 z-10">
              <motion.button
                onClick={handleSubmit}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                className={`p-3 ${
                  isLoading 
                    ? 'bg-blue-500/40 cursor-not-allowed' 
                    : 'bg-blue-500/80 hover:bg-blue-500/90'
                } backdrop-blur-sm rounded-xl transition-colors flex items-center justify-center`}
                title={t('startCorrection')}
                disabled={isLoading}
                style={{ minWidth: '48px', minHeight: '48px' }}
              >
                {isLoading ? (
                  <LoadingSpinner size={24} />
                ) : (
                  <ArrowRightIcon className="h-5 w-5 text-white" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-6 ${isOllamaError ? 'bg-red-500/10' : ''} p-4 rounded-xl backdrop-blur-sm max-w-lg mx-auto`}
            >
              <div className="text-red-400 font-medium text-center mb-1">
                {isOllamaError ? t('connectionProblem') : t('error')}
              </div>
              <div className="text-white/80 text-sm text-center">
                {error}
              </div>
              {isOllamaError && (
                <div className="mt-3 text-white/60 text-xs text-center">
                  {t('ollamaHint')}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-4 text-white/40 text-sm cursor-pointer"
          onClick={focusTextarea}
        >
          {inputText ? `${inputText.length} caractères` : ""}
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="pb-10 pt-4 text-center text-white/30 text-sm"
      >
        {t('shortcutHint')}
      </motion.div>
    </motion.div>
  );
}; 