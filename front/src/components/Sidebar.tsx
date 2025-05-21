import { useEffect, useState } from 'react';
import { PlusIcon, ChatBubbleIcon, GearIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { correctionService } from '../services/api';
import type { CorrectionResponse } from '../types/correction';
import { SettingsModal } from './SettingsModal';
import { useAuthStore } from '@/stores/auth';
import { useCorrectionStore } from '@/stores/correction';
import { motion } from 'framer-motion';

/**
 * Sidebar component displaying recent corrections and new correction button
 * 
 * @returns JSX element containing the sidebar navigation
 */
export const Sidebar = () => {
  const { t } = useTranslation();
  const [corrections, setCorrections] = useState<CorrectionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { setSelectedCorrection, selectedCorrection } = useCorrectionStore();

  /**
   * Loads user's correction history
   */
  const loadCorrections = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await correctionService.getUserCorrections(0, 10);
      setCorrections(data);
    } catch (err) {
      console.error('Failed to load corrections:', err);
      setError(err instanceof Error ? err.message : t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCorrections();
    }
  }, [isAuthenticated]);

  /**
   * Handles creating a new correction
   */
  const handleNewCorrection = () => {
    // Clear any existing text in the main input
    const event = new CustomEvent('clearMainInput');
    window.dispatchEvent(event);
    
    // Reload corrections list
    loadCorrections();
  };

  /**
   * Handles selecting a correction
   */
  const handleSelectCorrection = async (correction: CorrectionResponse) => {
    console.log('Selecting correction:', correction);
    
    // Set the correction directly in the store
    setSelectedCorrection(correction);
    
    // Dispatch an event to notify other components
    const event = new CustomEvent('correctionSelected', { 
      detail: { correctionId: correction.id } 
    });
    window.dispatchEvent(event);
  };

  /**
   * Formats a date string to a readable format
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  /**
   * Gets the user's initial for the avatar
   */
  const getUserInitial = () => {
    if (!user || !user.username) return 'U';
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <>
      <div className="w-[280px] bg-[#1e1e1e]/80 backdrop-blur-xl h-screen flex flex-col border-r border-white/[0.06]">
        <div className="p-4">
          <h2 className="text-white/90 text-xl font-medium px-2 mb-4">StyleGuard</h2>
          <button 
            className="w-full flex items-center gap-2 bg-white/[0.08] hover:bg-white/[0.12] transition-colors text-white/90 rounded-xl p-4 text-sm backdrop-blur-sm"
            onClick={handleNewCorrection}
          >
            <PlusIcon className="w-5 h-5" />
            <span>{t('newCorrection')}</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <div className="mb-4 px-3">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">{t('recentCorrections')}</h3>
          </div>
          
          {isLoading ? (
            <div className="text-center text-white/40 py-4">{t('loading')}</div>
          ) : error ? (
            <div className="text-center text-red-500/90 py-4">{error}</div>
          ) : (
            <div className="space-y-1">
              {corrections.map((correction) => (
                <div 
                  key={correction.id} 
                  className={`group px-3 py-3 hover:bg-white/[0.06] rounded-lg cursor-pointer transition-all ${
                    selectedCorrection?.id === correction.id ? 'bg-white/[0.08]' : ''
                  }`}
                  onClick={() => handleSelectCorrection(correction)}
                  data-correction-id={correction.id}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center backdrop-blur-sm">
                      <ChatBubbleIcon className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white/80 text-sm font-medium truncate">
                        {correction.original_text.substring(0, 30)}...
                      </h3>
                      <p className="text-white/40 text-xs">{formatDate(correction.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-9 h-9 rounded-lg bg-white/[0.08] flex items-center justify-center backdrop-blur-sm"
              >
                <span className="text-white/80 text-sm font-medium">{getUserInitial()}</span>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-white/80 text-sm font-medium truncate max-w-[140px]">
                  {user?.username || t('guest')}
                </span>
                <span className="text-white/40 text-xs">{t('free')}</span>
              </div>
            </div>
            <button 
              className="p-2 hover:bg-white/[0.08] rounded-lg transition-colors"
              onClick={() => setIsSettingsOpen(true)}
              title={t('settings')}
            >
              <GearIcon className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}; 