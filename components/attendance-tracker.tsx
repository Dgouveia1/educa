"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Save } from "lucide-react"

interface AttendanceRecord {
  studentId: string
  date: string
  status: "present" | "absent" | "late"
}

interface Student {
  id: string
  name: string
}

interface AttendanceTrackerProps {
  className: string
  students: Student[]
}

export function AttendanceTracker({ className, students }: AttendanceTrackerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent" | "late">>({})

  const updateAttendance = (studentId: string, status: "present" | "absent" | "late") => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }))
  }

  const getStatusColor = (status: "present" | "absent" | "late" | undefined) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "absent":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "late":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getStatusText = (status: "present" | "absent" | "late" | undefined) => {
    switch (status) {
      case "present":
        return "P"
      case "absent":
        return "F"
      case "late":
        return "A"
      default:
        return "-"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Controle de Frequência</CardTitle>
            <p className="text-sm text-gray-600">{className}</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
            <Button size="sm">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span>P - Presente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span>F - Falta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 rounded"></div>
              <span>A - Atraso</span>
            </div>
          </div>

          <div className="space-y-2">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{student.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-12 h-8 ${attendance[student.id] === "present" ? getStatusColor("present") : ""}`}
                    onClick={() => updateAttendance(student.id, "present")}
                  >
                    P
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-12 h-8 ${attendance[student.id] === "absent" ? getStatusColor("absent") : ""}`}
                    onClick={() => updateAttendance(student.id, "absent")}
                  >
                    F
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-12 h-8 ${attendance[student.id] === "late" ? getStatusColor("late") : ""}`}
                    onClick={() => updateAttendance(student.id, "late")}
                  >
                    A
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
