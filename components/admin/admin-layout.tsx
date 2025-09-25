"use client"

import type React from "react"
import { AdminSidebar } from "./admin-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
