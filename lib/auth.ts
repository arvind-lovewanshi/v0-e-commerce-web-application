export type UserRole = "admin" | "vendor" | "user"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock authentication - in production, this would connect to your database
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@ecommerce.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "vendor@ecommerce.com",
    name: "Vendor User",
    role: "vendor",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    email: "user@ecommerce.com",
    name: "Regular User",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export async function signIn(email: string, password: string): Promise<User | null> {
  // Mock authentication logic
  const user = mockUsers.find((u) => u.email === email)
  if (user && password === "password") {
    return user
  }
  return null
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  role: UserRole = "user",
): Promise<User | null> {
  // Mock sign up logic
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockUsers.push(newUser)
  return newUser
}

export function getRedirectPath(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin"
    case "vendor":
      return "/vendor"
    case "user":
      return "/shop"
    default:
      return "/"
  }
}
