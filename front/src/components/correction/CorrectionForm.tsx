import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useCorrectionStore } from "@/stores/correction"
import { useTranslation } from "react-i18next"

/**
 * Text correction form component
 */
export function CorrectionForm() {
  const { t } = useTranslation()
  const { 
    submitCorrection, 
    setSelectedCorrection, 
    clearError, 
    isLoading: storeLoading, 
    getErrorMessage,
    isOllamaError
  } = useCorrectionStore()
  
  const [text, setText] = useState("")
  const [localError, setLocalError] = useState<string | null>(null)

  // Nettoyer les erreurs quand le composant est démonté
  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!text.trim()) return

    setLocalError(null)
    clearError()

    try {
      console.log("Submitting correction form with text:", text)
      const newCorrection = await submitCorrection(text)
      console.log("Correction submitted successfully:", newCorrection)
      setText("")
      
      // Sélectionner la nouvelle correction directement
      setSelectedCorrection(newCorrection)
    } catch (error) {
      console.error("Error submitting correction:", error)
      setLocalError(t('unexpectedError'))
    }
  }

  const storeErrorMessage = getErrorMessage()
  const error = localError || storeErrorMessage
  const hasOllamaError = isOllamaError()

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="space-y-2">
        <Textarea
          placeholder={t('placeholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={storeLoading}
          rows={4}
          className="resize-none"
          data-testid="correction-textarea"
        />
      </div>
      {error && (
        <div className="space-y-1">
          <div className="text-sm text-destructive">{error}</div>
          {hasOllamaError && (
            <div className="text-xs text-muted-foreground">{t('ollamaHint')}</div>
          )}
        </div>
      )}
      <Button
        type="submit"
        disabled={storeLoading || !text.trim()}
        className="w-full"
        data-testid="submit-correction"
      >
        {storeLoading ? t('analyzing') : t('startCorrection')}
      </Button>
    </form>
  )
} 