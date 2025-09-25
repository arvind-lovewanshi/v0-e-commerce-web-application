"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getVendors, updateVendorStatus } from "@/lib/data"
import type { Vendor } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Store, Package, ShoppingCart } from "lucide-react"

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadVendors() {
      const vendorData = await getVendors()
      setVendors(vendorData)
      setLoading(false)
    }
    loadVendors()
  }, [])

  const handleStatusChange = async (vendorId: string, newStatus: "active" | "pending" | "suspended") => {
    const success = await updateVendorStatus(vendorId, newStatus)
    if (success) {
      setVendors(vendors.map((vendor) => (vendor.id === vendorId ? { ...vendor, status: newStatus } : vendor)))
      toast({
        title: "Status updated",
        description: "Vendor status has been successfully updated",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to update vendor status",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "pending":
        return "secondary"
      case "suspended":
        return "destructive"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Vendor Management</h1>
          <p className="text-muted-foreground text-pretty">Manage vendor accounts and business operations</p>
        </div>

        <div className="grid gap-6">
          {vendors.map((vendor) => (
            <Card key={vendor.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
                      <Store className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle>{vendor.businessName}</CardTitle>
                      <CardDescription>
                        {vendor.name} • {vendor.email}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(vendor.status)}>{vendor.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>{vendor.totalProducts}</strong> Products
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>{vendor.totalOrders}</strong> Orders
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">Joined {vendor.createdAt.toLocaleDateString()}</div>
                </div>

                <div className="flex gap-2 mt-4">
                  {vendor.status !== "active" && (
                    <Button size="sm" onClick={() => handleStatusChange(vendor.id, "active")}>
                      Approve
                    </Button>
                  )}
                  {vendor.status !== "suspended" && (
                    <Button size="sm" variant="destructive" onClick={() => handleStatusChange(vendor.id, "suspended")}>
                      Suspend
                    </Button>
                  )}
                  {vendor.status !== "pending" && (
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(vendor.id, "pending")}>
                      Set Pending
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
