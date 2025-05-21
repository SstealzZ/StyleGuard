import { Link } from "react-router-dom"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { useTranslation } from "react-i18next"

/**
 * Registration page component
 */
export function RegisterPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#1e1e1e]">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white/90">StyleGuard</h2>
          <p className="mt-2 text-sm text-white/60">
            {t("createAccount")}
          </p>
        </div>

        <RegisterForm />

        <div className="text-center text-sm">
          <span className="text-white/60">{t("alreadyHaveAccount")} </span>
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-400 font-medium hover:underline"
          >
            {t("signIn")}
          </Link>
        </div>
      </div>
    </div>
  )
} 