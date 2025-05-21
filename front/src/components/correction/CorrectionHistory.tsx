import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCorrectionStore } from "@/stores/correction"
import { useTranslation } from "react-i18next"

/**
 * Correction history component displaying list of corrections with selection functionality
 */
export function CorrectionHistory() {
  const { t } = useTranslation()
  const {
    corrections,
    selectedCorrection,
    isLoading,
    getErrorMessage,
    isOllamaError,
    fetchCorrections,
    deleteCorrection,
    selectCorrection,
  } = useCorrectionStore()

  useEffect(() => {
    fetchCorrections()
  }, [fetchCorrections])

  /**
   * Gère la sélection d'une correction
   * 
   * @param id - ID de la correction à sélectionner
   * @param event - Événement de clic
   */
  const handleCorrectionSelect = (id: number, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    console.log(`Sélection de la correction ${id}`)
    selectCorrection(id)
  }

  if (isLoading) {
    return <div className="text-center">{t('loading')}</div>
  }

  const errorMessage = getErrorMessage()
  const hasOllamaError = isOllamaError()
  
  if (errorMessage) {
    return (
      <div className="space-y-2">
        <div className="text-destructive">{errorMessage}</div>
        {hasOllamaError && (
          <div className="text-xs text-muted-foreground">{t('ollamaHint')}</div>
        )}
      </div>
    )
  }

  if (corrections.length === 0) {
    return <div className="text-center text-muted-foreground">{t('recentCorrections')} (0)</div>
  }

  return (
    <div className="space-y-4">
      {corrections.map((correction) => (
        <div
          key={correction.id}
          className={`border rounded-lg p-4 space-y-2 cursor-pointer transition-colors ${
            selectedCorrection?.id === correction.id
              ? "border-primary bg-primary/5"
              : "hover:bg-accent/5"
          }`}
          onClick={(e) => handleCorrectionSelect(correction.id, e)}
          data-correction-id={correction.id}
        >
          <div className="flex justify-between items-start">
            <div className="text-sm text-muted-foreground">
              {new Date(correction.created_at).toLocaleString()}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                deleteCorrection(correction.id)
              }}
            >
              {t('delete')}
            </Button>
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-sm font-medium">{t('originalText')}:</div>
              <div className="text-sm whitespace-pre-wrap">{correction.original_text}</div>
            </div>
            <div>
              <div className="text-sm font-medium">{t('correctedText')}:</div>
              <div className="text-sm whitespace-pre-wrap">{correction.corrected_text}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 