"use client"

import type React from "react"
import { VendorSidebar } from "./vendor-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface VendorLayoutProps {
  children: React.ReactNode
}

export function VendorLayout({ children }: VendorLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <div className="flex h-screen bg-background">
        <VendorSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
