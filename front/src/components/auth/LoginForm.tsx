import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/stores/auth"

/**
 * Login form component for user authentication
 */
export function LoginForm() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const login = useAuthStore((state) => state.login)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await login(email, password)
      navigate("/")
    } catch (error) {
      setError(t("invalidCredentials"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm mx-auto">
      <div className="space-y-2">
        <input
          id="email"
          name="email"
          type="email"
          placeholder={t("email")}
          required
          disabled={isLoading}
          className="w-full px-4 py-2 bg-white/[0.08] border border-white/[0.08] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white/90 placeholder-white/40"
        />
      </div>
      <div className="space-y-2">
        <input
          id="password"
          name="password"
          type="password"
          placeholder={t("password")}
          required
          disabled={isLoading}
          className="w-full px-4 py-2 bg-white/[0.08] border border-white/[0.08] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white/90 placeholder-white/40"
        />
      </div>
      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? t("loggingIn") : t("signIn")}
      </button>
    </form>
  )
} 