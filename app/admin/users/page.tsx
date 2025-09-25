"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUsers, updateUserRole } from "@/lib/data"
import type { User, UserRole } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadUsers() {
      const userData = await getUsers()
      setUsers(userData)
      setLoading(false)
    }
    loadUsers()
  }, [])

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const success = await updateUserRole(userId, newRole)
    if (success) {
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole, updatedAt: new Date() } : user)))
      toast({
        title: "Role updated",
        description: "User role has been successfully updated",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "vendor":
        return "default"
      case "user":
        return "secondary"
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
          <h1 className="text-3xl font-bold text-balance">User Management</h1>
          <p className="text-muted-foreground text-pretty">Manage user accounts and permissions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and manage all registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Joined {user.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                    <Select value={user.role} onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="vendor">Vendor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
