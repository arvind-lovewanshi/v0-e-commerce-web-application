"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { getRedirectPath } from "@/lib/auth"
import { LoginForm } from "@/components/auth/login-form"

export default function HomePage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const redirectPath = getRedirectPath(user.role)
      router.push(redirectPath)
    }
  }, [user, isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-balance">E-Commerce Platform</h1>
          <p className="text-muted-foreground mt-2 text-pretty">Professional multi-role commerce solution</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
