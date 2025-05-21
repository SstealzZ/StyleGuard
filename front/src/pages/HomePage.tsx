import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { CorrectionForm } from "@/components/correction/CorrectionForm"
import { CorrectionHistory } from "@/components/correction/CorrectionHistory"
import { CorrectionDisplay } from "@/components/correction/CorrectionDisplay"
import { useAuthStore } from "@/stores/auth"
import { useEffect } from "react"
import { useCorrectionStore } from "@/stores/correction"
import { useTranslation } from "react-i18next"

/**
 * Home page component with text correction functionality
 */
export function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { selectedCorrection, fetchCorrections, getErrorMessage, clearError } = useCorrectionStore()

  /**
   * Charge les corrections au chargement de la page
   */
  useEffect(() => {
    console.log("HomePage mounted, fetching corrections")
    fetchCorrections()
  }, [fetchCorrections])

  /**
   * Affiche les informations de débogage
   */
  useEffect(() => {
    console.log("Selected correction:", selectedCorrection)
    const errorMessage = getErrorMessage()
    if (errorMessage) {
      console.error("Store error:", errorMessage)
    }
  }, [selectedCorrection, getErrorMessage])

  /**
   * Handles user logout
   */
  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold">StyleGuard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.username}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              {t('logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r p-4 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={() => {
                  clearError()
                  const mainContent = document.querySelector(".main-content")
                  if (mainContent) {
                    mainContent.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                {t('newCorrection')}
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{t('recentCorrections')}</h2>
              <CorrectionHistory />
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col main-content overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto pb-60">
            <CorrectionDisplay />
          </div>
          
          <div className="border-t p-4 bg-background sticky bottom-0 mt-auto shadow-lg z-50">
            <CorrectionForm />
          </div>
        </div>
      </main>

      {/* Débogage - À supprimer en production */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="p-2 text-xs text-muted-foreground border-t">
          <details>
            <summary>Infos débogage</summary>
            <div className="mt-2">
              <div>Correction sélectionnée: {selectedCorrection ? `ID: ${selectedCorrection.id}` : 'Aucune'}</div>
              {getErrorMessage() && <div className="text-destructive">Erreur: {getErrorMessage()}</div>}
            </div>
          </details>
        </div>
      )}
    </div>
  )
} 