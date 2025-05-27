"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, GraduationCap, LogOut } from "lucide-react"

interface Grade {
  subject: string
  bimester1: number | null
  bimester2: number | null
  bimester3: number | null
  bimester4: number | null
  average: number | null
}

interface Attendance {
  date: string
  subject: string
  status: "present" | "absent" | "late"
}

export default function StudentDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [grades, setGrades] = useState<Grade[]>([
    {
      subject: "Mathematics",
      bimester1: 8.5,
      bimester2: 7.0,
      bimester3: null,
      bimester4: null,
      average: 7.75,
    },
    {
      subject: "Portuguese",
      bimester1: 9.0,
      bimester2: 8.5,
      bimester3: null,
      bimester4: null,
      average: 8.75,
    },
  ])
  const [attendance, setAttendance] = useState<Attendance[]>([
    { date: "2024-03-01", subject: "Mathematics", status: "present" },
    { date: "2024-03-01", subject: "Portuguese", status: "present" },
    { date: "2024-02-29", subject: "Mathematics", status: "absent" },
    { date: "2024-02-29", subject: "Portuguese", status: "late" },
  ])

  useEffect(() => {
    // Check if user is student
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }
    const userData = JSON.parse(user)
    if (userData.role !== "STUDENT") {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  const getStatusColor = (status: Attendance["status"]) => {
    switch (status) {
      case "present":
        return "text-green-600"
      case "absent":
        return "text-red-600"
      case "late":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Subjects</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Grade</p>
                  <p className="text-2xl font-bold text-gray-900">8.25</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">85%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle>Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Subject</th>
                        <th className="text-center p-2">1st Bim</th>
                        <th className="text-center p-2">2nd Bim</th>
                        <th className="text-center p-2">3rd Bim</th>
                        <th className="text-center p-2">4th Bim</th>
                        <th className="text-center p-2">Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((grade, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 font-medium">{grade.subject}</td>
                          <td className="text-center p-2">{grade.bimester1 ?? "-"}</td>
                          <td className="text-center p-2">{grade.bimester2 ?? "-"}</td>
                          <td className="text-center p-2">{grade.bimester3 ?? "-"}</td>
                          <td className="text-center p-2">{grade.bimester4 ?? "-"}</td>
                          <td className="text-center p-2 font-medium">{grade.average}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendance.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border-b">
                      <div>
                        <p className="font-medium">{record.subject}</p>
                        <p className="text-sm text-gray-600">{record.date}</p>
                      </div>
                      <span className={`font-medium ${getStatusColor(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
