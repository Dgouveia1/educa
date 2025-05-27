"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  BookOpen,
  Users,
  School,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react"

interface User {
  name: string
  role: string
  permissions: string[]
  municipalityName?: string
  schoolName?: string
}

const roleIcons = {
  SUPER_ADMIN: Settings,
  SUPPORT_N1: Settings,
  SUPPORT_N2: Settings,
  MUNICIPAL_MANAGER: Building2,
  MUNICIPAL_OPERATOR: Building2,
  DIRECTOR: School,
  COORDINATOR: School,
  SECRETARY: School,
  TEACHER: BookOpen,
  GUARDIAN: Users,
}

const roleLabels = {
  SUPER_ADMIN: "Super Admin",
  SUPPORT_N1: "Suporte N1",
  SUPPORT_N2: "Suporte N2",
  MUNICIPAL_MANAGER: "Gestor Municipal",
  MUNICIPAL_OPERATOR: "Operador Municipal",
  DIRECTOR: "Diretor",
  COORDINATOR: "Coordenador",
  SECRETARY: "Secretário",
  TEACHER: "Professor",
  GUARDIAN: "Responsável",
}

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (!user) return null

  const RoleIcon = roleIcons[user.role as keyof typeof roleIcons] || Settings

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-200 ease-in-out
          w-64 bg-white border-r border-gray-200 flex flex-col
        `}
      >
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <RoleIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-600">{roleLabels[user.role as keyof typeof roleLabels]}</p>
            </div>
          </div>
          {(user.municipalityName || user.schoolName) && (
            <div className="mt-3 text-sm text-gray-600">
              {user.municipalityName && <p>{user.municipalityName}</p>}
              {user.schoolName && <p>{user.schoolName}</p>}
            </div>
          )}
        </div>

        {/* Navigation items based on role */}
        <nav className="flex-1 p-4 space-y-1">
          {/* Navigation items will be added based on user role */}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {children}
      </main>
    </div>
  )
}
