"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }
    const userData = JSON.parse(user)
    if (userData.role !== "ADMIN") {
      router.push("/")
    }
  }, [router])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, admin! Here you can manage users, settings, and more.</p>
    </div>
  )
}
