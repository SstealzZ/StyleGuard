import { create } from "zustand"
import { correctionService } from "@/services/api"
import i18n from 'i18next'

/**
 * Interface representing API error response
 * Duplicated here to avoid import issues
 */
interface ApiErrorResponse {
  key: string;
  isOllamaError?: boolean;
}

/**
 * Correction interface representing a text correction entry
 */
interface Correction {
  id: number
  original_text: string
  corrected_text: string
  created_at: string
  user_id: number
}

/**
 * Error information structure
 */
interface ErrorInfo {
  key: string
  details?: string
  isOllamaError?: boolean
}

/**
 * Correction store state interface
 */
interface CorrectionState {
  corrections: Correction[]
  selectedCorrection: Correction | null
  isLoading: boolean
  errorInfo: ErrorInfo | null
  fetchCorrections: () => Promise<void>
  submitCorrection: (text: string) => Promise<Correction>
  deleteCorrection: (id: number) => Promise<void>
  selectCorrection: (id: number) => Promise<void>
  setSelectedCorrection: (correction: Correction | null) => void
  clearError: () => void
  clearSelectedCorrection: () => void
  getErrorMessage: () => string | null
  isOllamaError: () => boolean
}

/**
 * Error handler for store actions
 * 
 * @param error - The error object
 * @param defaultMessageKey - i18n key for the default error message
 * @returns Error information object
 */
const handleError = (error: unknown, defaultMessageKey: string): ErrorInfo => {
  console.error(i18n.t(defaultMessageKey), error);
  
  // Check for API errors
  if (error && typeof error === 'object' && 'key' in error) {
    const apiError = error as ApiErrorResponse;
    return {
      key: apiError.key,
      isOllamaError: apiError.isOllamaError
    };
  }
  
  // Standard errors
  if (error instanceof Error) {
    return {
      key: defaultMessageKey,
      details: error.message
    };
  }
  
  return { key: defaultMessageKey };
};

/**
 * Correction store for managing text corrections
 */
export const useCorrectionStore = create<CorrectionState>((set, get) => ({
  corrections: [],
  selectedCorrection: null,
  isLoading: false,
  errorInfo: null,

  clearError: () => set({ errorInfo: null }),

  getErrorMessage: () => {
    const errorInfo = get().errorInfo;
    
    if (!errorInfo) {
      return null;
    }
    
    // For Ollama errors, just return the translated key
    if (errorInfo.isOllamaError) {
      return i18n.t(errorInfo.key);
    }
    
    // For other errors, combine the message with details if available
    const message = i18n.t(errorInfo.key);
    return errorInfo.details ? `${message}: ${errorInfo.details}` : message;
  },

  isOllamaError: () => {
    const errorInfo = get().errorInfo;
    return !!errorInfo?.isOllamaError;
  },

  clearSelectedCorrection: () => {
    console.log("Clearing selected correction");
    set({ 
      selectedCorrection: null,
      errorInfo: null
    });
  },

  setSelectedCorrection: (correction) => {
    console.log("Setting selected correction manually:", correction);
    set({ selectedCorrection: correction });
  },

  fetchCorrections: async () => {
    set({ isLoading: true, errorInfo: null });
    
    try {
      console.log("Fetching corrections from API");
      const corrections = await correctionService.getUserCorrections();
      console.log("Fetched corrections:", corrections);
      set({ corrections, errorInfo: null });
    } catch (error) {
      set({ 
        errorInfo: handleError(error, "errorLoadingCorrections") 
      });
    } finally {
      set({ isLoading: false });
    }
  },

  submitCorrection: async (text: string) => {
    set({ isLoading: true, errorInfo: null });
    
    try {
      console.log("Submitting correction text:", text);
      const newCorrection = await correctionService.createCorrection(text);
      console.log("New correction created:", newCorrection);
      
      // Update store with new correction
      set((state) => ({
        corrections: [newCorrection, ...state.corrections],
        selectedCorrection: newCorrection,
        errorInfo: null
      }));
      
      return newCorrection;
    } catch (error) {
      const errorInfo = handleError(error, "errorCreatingCorrection");
      set({ errorInfo });
      
      const errorMessage = get().getErrorMessage();
      throw new Error(errorMessage || i18n.t('unexpectedError'));
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCorrection: async (id: number) => {
    set({ isLoading: true, errorInfo: null });
    
    try {
      await correctionService.deleteCorrection(id);
      
      set((state) => ({
        corrections: state.corrections.filter((c) => c.id !== id),
        selectedCorrection: state.selectedCorrection?.id === id ? null : state.selectedCorrection,
        errorInfo: null
      }));
    } catch (error) {
      const errorInfo = handleError(error, "errorDeletingCorrection");
      set({ errorInfo });
      
      const errorMessage = get().getErrorMessage();
      throw new Error(errorMessage || i18n.t('unexpectedError'));
    } finally {
      set({ isLoading: false });
    }
  },

  selectCorrection: async (id: number) => {
    set({ isLoading: true, errorInfo: null });
    console.log(`Selecting correction with ID: ${id}`);
    
    try {
      // First check if we already have this correction in the store
      const existingCorrection = get().corrections.find(c => c.id === id);
      
      if (existingCorrection) {
        console.log("Found correction in local state:", existingCorrection);
        set({ selectedCorrection: existingCorrection, errorInfo: null, isLoading: false });
        return;
      }
      
      // If not, fetch it from the API
      console.log("Correction not found locally, fetching from API");
      const correction = await correctionService.getCorrection(id);
      
      if (correction) {
        console.log("Received correction from API:", correction);
        set({ selectedCorrection: correction, errorInfo: null });
      } else {
        console.error("API returned no correction for ID:", id);
        set({ errorInfo: { key: "correctionNotFound" } });
      }
    } catch (error) {
      console.error("Error selecting correction:", error);
      set({ 
        errorInfo: handleError(error, "errorLoadingCorrection") 
      });
    } finally {
      set({ isLoading: false });
    }
  }
})) 