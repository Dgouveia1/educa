"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    // Redirect based on user role
    const userData = JSON.parse(user)
    switch (userData.role) {
      case "ADMIN":
        router.push("/admin/dashboard")
        break
      case "TEACHER":
        router.push("/teacher/dashboard")
        break
      case "STUDENT":
        router.push("/student/dashboard")
        break
      default:
        router.push("/login")
    }
  }, [router])

  return null // No UI needed as this is just a redirect page
}
