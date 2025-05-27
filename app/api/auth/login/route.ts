import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { cpf, password } = await request.json()

    // Validate CPF format
    const cpfNumbers = cpf.replace(/\D/g, "")
    if (cpfNumbers.length !== 11) {
      return NextResponse.json({ error: "CPF inválido" }, { status: 400 })
    }

    // Find user by CPF
    const user = await prisma.user.create({
      where: { cpf: cpfNumbers },
      include: {
        municipalUser: {
          include: {
            municipality: true,
          },
        },
        schoolUser: {
          include: {
            school: true,
          },
        },
        teacherProfile: true,
        guardianProfile: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 })
    }

    if (!user.active) {
      return NextResponse.json({ error: "Usuário inativo" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
    }

    // Create session data based on user role
    const sessionData = {
      id: user.id,
      cpf: user.cpf,
      name: user.name,
      role: user.role,
      permissions: getPermissionsByRole(user.role),
    }

    // Add role-specific data
    if (user.municipalUser) {
      sessionData.municipalityId = user.municipalUser.municipalityId
      sessionData.municipalityName = user.municipalUser.municipality.name
    }

    if (user.schoolUser) {
      sessionData.schoolId = user.schoolUser.schoolId
      sessionData.schoolName = user.schoolUser.school.name
    }

    // Generate JWT token
    const token = sign(sessionData, JWT_SECRET, { expiresIn: "1d" })

    // Return user data and token
    return NextResponse.json({
      token,
      user: {
        ...sessionData,
        password: undefined,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Erro ao realizar login" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

function getPermissionsByRole(role: string) {
  const permissions = {
    SUPER_ADMIN: [
      "manage_users",
      "manage_municipalities",
      "manage_schools",
      "manage_support",
      "impersonate_users",
    ],
    SUPPORT_N1: [
      "manage_teachers",
      "manage_directors",
      "manage_access",
      "impersonate_school_users",
    ],
    SUPPORT_N2: [
      "manage_users",
      "manage_municipalities",
      "manage_schools",
      "impersonate_users",
    ],
    MUNICIPAL_MANAGER: [
      "manage_schools",
      "manage_school_users",
      "view_municipal_data",
    ],
    MUNICIPAL_OPERATOR: ["view_municipal_data"],
    DIRECTOR: [
      "manage_school_users",
      "manage_students",
      "view_school_data",
      "update_student_info",
    ],
    COORDINATOR: [
      "manage_school_users",
      "manage_students",
      "view_school_data",
      "update_student_info",
    ],
    SECRETARY: ["manage_students", "update_student_info"],
    TEACHER: ["manage_classes", "manage_grades", "manage_attendance"],
    GUARDIAN: ["view_student_info"],
  }

  return permissions[role] || []
}
