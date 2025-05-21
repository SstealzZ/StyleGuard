import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { authService } from "@/services/auth"
import { setAuthToken } from "@/services/api"

/**
 * User interface representing authenticated user data
 */
interface User {
  id: number
  email: string
  username: string
}

/**
 * Authentication data interface
 */
interface AuthData {
  access_token: string
  refresh_token: string
  user: User
}

/**
 * Authentication store state interface
 */
interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  setAuthData: (data: AuthData) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearState: () => void
}

/**
 * Authentication store with persistence
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuthData: (data: AuthData) => {
        setAuthToken(data.access_token)
        set({
          token: data.access_token,
          refreshToken: data.refresh_token,
          user: data.user,
          isAuthenticated: true,
          error: null,
        })
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          const authData = await authService.login({
            username: email,
            password,
          })
          get().setAuthData(authData)
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to login" })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (email: string, username: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          await authService.register({
            email,
            username,
            password,
          })
          const authData = await authService.login({
            username: email,
            password,
          })
          get().setAuthData(authData)
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to register" })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null })
          await authService.logout()
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to logout" })
        } finally {
          setAuthToken("")
          set({
            token: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      clearState: () => {
        setAuthToken("")
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
) 