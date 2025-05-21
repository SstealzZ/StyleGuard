import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCorrectionStore } from '@/stores/correction';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from './LoadingSpinner';
import { ClipboardCopyIcon, CheckIcon } from "@radix-ui/react-icons";

/**
 * Component that displays the details of a selected correction
 * with original text on the left and corrected text on the right
 * 
 * @returns JSX element displaying correction details
 */
export const CorrectionDetailView = () => {
  const { t } = useTranslation();
  const { selectedCorrection, isLoading } = useCorrectionStore();
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  /**
   * Copies the corrected text to the clipboard and shows feedback
   */
  const copyToClipboard = () => {
    if (selectedCorrection) {
      navigator.clipboard.writeText(selectedCorrection.corrected_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * Effect to handle entrance animation
   */
  useEffect(() => {
    if (selectedCorrection) {
      // Reset d'abord l'état pour éviter les conflits d'animation
      setShowDetails(false);
      
      // Petit délai pour l'animation
      const timer = setTimeout(() => {
        setShowDetails(true);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      // Animation de sortie
      const timer = setTimeout(() => {
        setShowDetails(false);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [selectedCorrection]);

  /**
   * Effect to listen for selection events
   */
  useEffect(() => {
    const handleCorrectionSelected = (event: Event) => {
      console.log('Correction selected event received', (event as CustomEvent).detail);
    };

    window.addEventListener('correctionSelected', handleCorrectionSelected);
    return () => {
      window.removeEventListener('correctionSelected', handleCorrectionSelected);
    };
  }, []);

  /**
   * Container animation variants
   */
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: { 
        type: "spring",
        damping: 20,
        stiffness: 100,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  /**
   * Item animation variants
   */
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <LoadingSpinner size={60} />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-white/70"
        >
          {t('processingText')}
        </motion.p>
      </div>
    );
  }

  if (!selectedCorrection) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-full flex flex-col items-center justify-center text-white/40"
      >
        <div className="max-w-md text-center">
          <h2 className="text-xl font-medium mb-4">{t('selectCorrection')}</h2>
          <p>{t('selectCorrectionDescription')}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={showDetails ? "visible" : "hidden"}
      exit="exit"
      className="h-full flex flex-col pb-20"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-white/90 text-2xl font-medium mb-2">
          {t('correction')}
        </h2>
        <div className="text-white/40 text-sm">
          {new Date(selectedCorrection.created_at).toLocaleString()}
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-y-auto">
        <motion.div
          variants={itemVariants}
          className="flex-1 bg-white/[0.03] rounded-xl p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow"
        >
          <h3 className="text-white/60 text-sm font-medium mb-3">{t('originalText')}</h3>
          <div className="text-white/90 whitespace-pre-wrap break-words overflow-auto max-h-[600px]">
            {selectedCorrection.original_text}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="relative flex-1 bg-white/[0.03] rounded-xl p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow"
        >
          <h3 className="text-white/60 text-sm font-medium mb-3">{t('correctedText')}</h3>
          <div className="text-white/90 whitespace-pre-wrap break-words overflow-auto max-h-[600px]">
            {selectedCorrection.corrected_text}
          </div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${
              copied 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-white/10 text-white/70 hover:bg-white/15'
            } transition-colors backdrop-blur-sm`}
            onClick={copyToClipboard}
            title={t('copyText')}
          >
            {copied ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <ClipboardCopyIcon className="w-4 h-4" />
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}; 