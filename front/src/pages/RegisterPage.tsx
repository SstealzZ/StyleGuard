import { Link } from "react-router-dom"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { useTranslation } from "react-i18next"
import { LanguageSelector } from "@/components/LanguageSelector"

/**
 * Registration page component
 */
export function RegisterPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <LanguageSelector />
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">StyleGuard</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("createAccount")}
          </p>
        </div>

        <RegisterForm />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t("alreadyHaveAccount")} </span>
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            {t("signIn")}
          </Link>
        </div>
      </div>
    </div>
  )
} 