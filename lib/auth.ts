import { PrismaClient, User } from "@prisma/client"
import { sign, verify } from "jsonwebtoken"
import { compare, hash } from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface UserSession {
  id: number
  email: string
  name: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

export function generateToken(user: UserSession): string {
  return sign(user, JWT_SECRET, { expiresIn: "1d" })
}

export function verifyToken(token: string): UserSession {
  try {
    return verify(token, JWT_SECRET) as UserSession
  } catch (error) {
    throw new Error("Invalid token")
  }
}

export async function authenticateUser(email: string, password: string): Promise<UserSession> {
  const prisma = new PrismaClient()

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new Error("User not found")
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      throw new Error("Invalid password")
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } finally {
    await prisma.$disconnect()
  }
}
