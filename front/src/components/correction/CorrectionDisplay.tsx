import { useEffect } from "react"
import { useCorrectionStore } from "@/stores/correction"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

/**
 * Component for displaying the selected correction in the main area
 * Shows original text on the left and corrected text on the right
 */
export function CorrectionDisplay() {
  const { t } = useTranslation()
  const { 
    selectedCorrection, 
    errorInfo,
    getErrorMessage,
    isOllamaError,
    isLoading,
    clearError 
  } = useCorrectionStore()

  // Clear error on unmount
  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-pulse text-lg">{t('loading')}</div>
      </div>
    )
  }

  const errorMessage = getErrorMessage()
  const hasOllamaError = isOllamaError()
  
  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center max-w-md">
          {hasOllamaError && (
            <div className="text-destructive font-medium mb-2">{t('connectionProblem')}</div>
          )}
          <div className="text-destructive mb-4">{errorMessage}</div>
          {hasOllamaError && (
            <div className="text-muted-foreground text-sm mb-4">{t('ollamaHint')}</div>
          )}
          <Button variant="outline" onClick={clearError}>
            {t('retry')}
          </Button>
        </div>
      </div>
    )
  }

  if (!selectedCorrection) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <h2 className="text-xl font-semibold mb-2">{t('enterText')}</h2>
        <p className="text-sm">{t('selectCorrectionDescription')}</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-2">
        {t('correction')} <span className="text-sm text-muted-foreground">({new Date(selectedCorrection.created_at).toLocaleString()})</span>
      </h2>
      
      <div className="flex flex-row gap-6 mb-8 h-[180px]">
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-1">{t('originalText')}</h3>
          <div className="bg-background rounded-lg p-3 border h-[calc(100%-1.75rem)] overflow-auto">
            <p className="whitespace-pre-wrap break-words text-sm">{selectedCorrection.original_text}</p>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-1">{t('correctedText')}</h3>
          <div className="bg-background rounded-lg p-3 border h-[calc(100%-1.75rem)] overflow-auto">
            <p className="whitespace-pre-wrap break-words text-sm">{selectedCorrection.corrected_text}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 