import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/stores/auth"
import { extractApiError } from "@/services/api"

/**
 * Registration form component for new users
 */
export function RegisterForm() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const register = useAuthStore((state) => state.register)
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
    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"))
      setIsLoading(false)
      return
    }

    try {
      await register(email, username, password)
      navigate("/")
    } catch (error: any) {
      const apiError = extractApiError(error)
      setError(t(apiError.key) || t("registrationFailed"))
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
          id="username"
          name="username"
          type="text"
          placeholder={t("username")}
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
      <div className="space-y-2">
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder={t("confirmPassword")}
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
        {isLoading ? t("creatingAccount") : t("signUp")}
      </Button>
    </form>
  )
} 