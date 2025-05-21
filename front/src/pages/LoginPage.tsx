import { Link } from "react-router-dom"
import { LoginForm } from "@/components/auth/LoginForm"
import { useTranslation } from "react-i18next"
import { LanguageSelector } from "@/components/LanguageSelector"

/**
 * Login page component
 */
export function LoginPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <LanguageSelector />
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">StyleGuard</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("signInToContinue")}
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t("noAccount")} </span>
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            {t("signUp")}
          </Link>
        </div>
      </div>
    </div>
  )
} 