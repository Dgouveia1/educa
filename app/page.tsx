"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { TeacherDashboard } from "@/components/teacher-dashboard"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [teacherName, setTeacherName] = useState("")

  const handleLogin = (cpf: string, password: string) => {
    // Simular autenticação
    setTeacherName("Prof. Maria Silva")
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setTeacherName("")
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <TeacherDashboard teacherName={teacherName} onLogout={handleLogout} />
}
