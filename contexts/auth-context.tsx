"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type AuthState, signIn as authSignIn, signUp as authSignUp } from "@/lib/auth"

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, name: string) => Promise<boolean>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    const user = await authSignIn(email, password)
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
      return true
    }

    setAuthState((prev) => ({ ...prev, isLoading: false }))
    return false
  }

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    const user = await authSignUp(email, password, name)
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
      return true
    }

    setAuthState((prev) => ({ ...prev, isLoading: false }))
    return false
  }

  const signOut = () => {
    localStorage.removeItem("user")
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  return <AuthContext.Provider value={{ ...authState, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
