"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Users,
  School,
  BookOpen,
  ClipboardList,
  Calendar,
  Settings,
  Building2,
  UserCog,
  GraduationCap,
  FileText,
} from "lucide-react"

interface NavigationItem {
  name: string
  href: string
  icon: any
  permission?: string
}

const navigationConfig: Record<string, NavigationItem[]> = {
  SUPER_ADMIN: [
    { name: "Municípios", href: "/admin/municipalities", icon: Building2, permission: "manage_municipalities" },
    { name: "Escolas", href: "/admin/schools", icon: School, permission: "manage_schools" },
    { name: "Usuários", href: "/admin/users", icon: Users, permission: "manage_users" },
    { name: "Suporte", href: "/admin/support", icon: UserCog, permission: "manage_support" },
    { name: "Configurações", href: "/admin/settings", icon: Settings },
  ],
  SUPPORT_N1: [
    { name: "Professores", href: "/support/teachers", icon: BookOpen, permission: "manage_teachers" },
    { name: "Diretores", href: "/support/directors", icon: School, permission: "manage_directors" },
    { name: "Acessos", href: "/support/access", icon: UserCog, permission: "manage_access" },
  ],
  SUPPORT_N2: [
    { name: "Municípios", href: "/support/municipalities", icon: Building2, permission: "manage_municipalities" },
    { name: "Escolas", href: "/support/schools", icon: School, permission: "manage_schools" },
    { name: "Usuários", href: "/support/users", icon: Users, permission: "manage_users" },
  ],
  MUNICIPAL_MANAGER: [
    { name: "Dashboard", href: "/municipal/dashboard", icon: Building2 },
    { name: "Escolas", href: "/municipal/schools", icon: School, permission: "manage_schools" },
    { name: "Usuários", href: "/municipal/users", icon: Users, permission: "manage_school_users" },
    { name: "Relatórios", href: "/municipal/reports", icon: FileText },
  ],
  MUNICIPAL_OPERATOR: [
    { name: "Dashboard", href: "/municipal/dashboard", icon: Building2 },
    { name: "Relatórios", href: "/municipal/reports", icon: FileText },
  ],
  DIRECTOR: [
    { name: "Dashboard", href: "/school/dashboard", icon: School },
    { name: "Professores", href: "/school/teachers", icon: BookOpen, permission: "manage_school_users" },
    { name: "Alunos", href: "/school/students", icon: GraduationCap, permission: "manage_students" },
    { name: "Turmas", href: "/school/classes", icon: Users },
    { name: "Relatórios", href: "/school/reports", icon: FileText },
  ],
  COORDINATOR: [
    { name: "Dashboard", href: "/school/dashboard", icon: School },
    { name: "Professores", href: "/school/teachers", icon: BookOpen },
    { name: "Alunos", href: "/school/students", icon: GraduationCap },
    { name: "Turmas", href: "/school/classes", icon: Users },
    { name: "Relatórios", href: "/school/reports", icon: FileText },
  ],
  SECRETARY: [
    { name: "Dashboard", href: "/school/dashboard", icon: School },
    { name: "Alunos", href: "/school/students", icon: GraduationCap, permission: "manage_students" },
    { name: "Turmas", href: "/school/classes", icon: Users },
    { name: "Relatórios", href: "/school/reports", icon: FileText },
  ],
  TEACHER: [
    { name: "Dashboard", href: "/teacher/dashboard", icon: BookOpen },
    { name: "Diário de Classe", href: "/teacher/diary", icon: ClipboardList },
    { name: "Frequência", href: "/teacher/attendance", icon: Calendar },
    { name: "Notas", href: "/teacher/grades", icon: FileText },
  ],
  GUARDIAN: [
    { name: "Dashboard", href: "/guardian/dashboard", icon: Users },
    { name: "Boletim", href: "/guardian/report-card", icon: FileText },
    { name: "Frequência", href: "/guardian/attendance", icon: Calendar },
  ],
}

interface RoleNavigationProps {
  role: string
  permissions: string[]
  onNavigate?: () => void
}

export function RoleNavigation({ role, permissions, onNavigate }: RoleNavigationProps) {
  const pathname = usePathname()
  const navigation = navigationConfig[role] || []

  return (
    <nav className="space-y-1">
      {navigation
        .filter((item) => !item.permission || permissions.includes(item.permission))
        .map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
    </nav>
  )
}
