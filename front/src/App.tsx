import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuthStore } from "@/stores/auth"
import { useEffect, useState } from "react"
import { Sidebar } from './components/Sidebar';
import { MainInput } from './components/MainInput';
import { LanguageSelector } from './components/LanguageSelector';
import { authService } from "@/services/auth"
import { CorrectionDetailView } from "./components/CorrectionDetailView"
import { useCorrectionStore } from "./stores/correction"
import { LoadingSpinner } from "./components/LoadingSpinner"
import { useTranslation } from "react-i18next"

/**
 * Main application layout component
 */
const MainLayout = () => {
  const { selectedCorrection, clearSelectedCorrection, isLoading } = useCorrectionStore();
  const [showInput, setShowInput] = useState(true);
  const { t } = useTranslation();

  /**
   * Handles display switching between input and correction view
   */
  useEffect(() => {
    // Automatiquement afficher le détail de correction s'il en existe un
    if (selectedCorrection) {
      setShowInput(false);
    } else {
      // S'assurer que l'entrée est visible quand aucune correction n'est sélectionnée
      setShowInput(true);
    }

    // Écouter l'événement pour créer une nouvelle correction
    const handleClearMainInput = () => {
      clearSelectedCorrection();
      // Petit délai avant de montrer l'input pour permettre à l'animation de se terminer
      setTimeout(() => {
        setShowInput(true);
      }, 50);
    };

    window.addEventListener('clearMainInput', handleClearMainInput);
    return () => {
      window.removeEventListener('clearMainInput', handleClearMainInput);
    };
  }, [selectedCorrection, clearSelectedCorrection]);

  /**
   * Watch for changes in the loading state to detect when a new correction has been submitted
   */
  useEffect(() => {
    // Quand le chargement se termine et qu'une correction est sélectionnée,
    // basculer vers la vue de détail
    if (!isLoading && selectedCorrection) {
      setShowInput(false);
    }
  }, [isLoading, selectedCorrection]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex h-screen overflow-hidden bg-[#1e1e1e]"
    >
      <Sidebar />
      <div className="relative flex-1">
        <LanguageSelector />
        
        {/* Afficher conditionnellement l'entrée principale ou les détails de correction */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait" initial={false}>
            {showInput && !selectedCorrection ? (
              <MainInput key="input" />
            ) : (
              <motion.div
                key="correction-view"
                className="p-8 h-full overflow-y-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ 
                  duration: 0.3,
                  type: "spring",
                  damping: 25,
                  stiffness: 200
                }}
              >
                <CorrectionDetailView />
                
                {/* Bouton pour revenir à l'entrée */}
                <motion.button 
                  className="fixed bottom-8 right-8 bg-blue-500/80 hover:bg-blue-500/90 backdrop-blur-sm rounded-xl p-4 text-white/90 text-sm shadow-lg transition-all"
                  onClick={() => {
                    // Séquencer les actions avec un délai pour éviter les problèmes d'état
                    clearSelectedCorrection();
                    setTimeout(() => {
                      setShowInput(true);
                    }, 50);
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {t('newCorrection')}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay de chargement global */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <div className="bg-[#1e1e1e]/90 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
                  <LoadingSpinner size={60} />
                  <p className="mt-6 text-white/80 text-lg">{t('analyzing')}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Main application component that handles routing and authentication
 * 
 * @returns JSX element containing the complete application layout
 */
export const App = () => {
  const { isAuthenticated, token, logout } = useAuthStore();
  const { t } = useTranslation();

  /**
   * Effect to check authentication status on mount and token changes
   */
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          await authService.getCurrentUser();
        } catch (error) {
          // If token is invalid, logout
          logout();
        }
      }
    };

    checkAuth();
  }, [token, logout]);

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
};
