import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "@/stores/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { extractApiError } from "@/services/api"

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
      const apiError = extractApiError(error)
      setError(t(apiError.key) || t("invalidCredentials"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm mx-auto">
      <div className="space-y-2">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t("email")}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Input
          id="password"
          name="password"
          type="password"
          placeholder={t("password")}
          required
          disabled={isLoading}
        />
      </div>
      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? t("loggingIn") : t("signIn")}
      </Button>
    </form>
  )
} 