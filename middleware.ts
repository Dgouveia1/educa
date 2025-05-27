import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Routes that don't require authentication
const publicRoutes = ["/login", "/register", "/forgot-password"]

// Role-based route access
const roleRoutes = {
  SUPER_ADMIN: ["/admin", "/support"],
  SUPPORT_N1: ["/support"],
  SUPPORT_N2: ["/support"],
  MUNICIPAL_MANAGER: ["/municipal"],
  MUNICIPAL_OPERATOR: ["/municipal"],
  DIRECTOR: ["/school"],
  COORDINATOR: ["/school"],
  SECRETARY: ["/school"],
  TEACHER: ["/teacher"],
  GUARDIAN: ["/guardian"],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check for authentication token
  const token = request.cookies.get("token")?.value

  if (!token) {
    return redirectToLogin(request)
  }

  try {
    // Verify and decode token
    const decoded = verify(token, JWT_SECRET) as {
      role: keyof typeof roleRoutes
      permissions: string[]
    }

    // Check role-based access
    const allowedRoutes = roleRoutes[decoded.role] || []
    const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route))

    if (!hasAccess) {
      // Redirect to appropriate dashboard based on role
      const dashboardRoute = allowedRoutes[0] || "/login"
      return NextResponse.redirect(new URL(dashboardRoute, request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // Token is invalid
    return redirectToLogin(request)
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("from", request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /fonts/ (inside public directory)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api|_next|fonts|favicon.ico|sitemap.xml).*)",
  ],
}
