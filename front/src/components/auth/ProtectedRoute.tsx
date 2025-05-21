import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/stores/auth"

/**
 * Protected route component props interface
 */
interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Protected route component that redirects to login if user is not authenticated
 * 
 * @param props - Component properties
 * @returns Protected route or redirect to login
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
} 