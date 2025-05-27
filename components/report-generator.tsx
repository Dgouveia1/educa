"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"

interface GradeData {
  className: string
  subject: string
  grades: number[]
  average: number
}

interface AttendanceData {
  total: number
  present: number
}

interface StudentStats {
  name: string
  grades: number[]
  average: number
  attendance: {
    total: number
    present: number
  }
}

interface ReportGeneratorProps {
  studentId?: number
  classId?: number
  type: "report-card" | "class-report"
  title: string
}

export function ReportGenerator({ studentId, classId, type, title }: ReportGeneratorProps) {
  const [data, setData] = useState<Record<string, GradeData | StudentStats> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const generateReport = async () => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams({
        type,
        ...(studentId && { studentId: studentId.toString() }),
        ...(classId && { classId: classId.toString() }),
      })

      const response = await fetch(`/api/reports?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate report")
      }

      setData(result)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = () => {
    if (!data) return

    const content = type === "report-card" ? generateReportCardContent() : generateClassReportContent()
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateReportCardContent = () => {
    if (!data) return ""

    let content = "BOLETIM ESCOLAR\n\n"
    Object.entries(data).forEach(([_, classData]) => {
      const gradeData = classData as GradeData
      content += `Disciplina: ${gradeData.subject}\n`
      content += `Turma: ${gradeData.className}\n`
      content += `Notas: ${gradeData.grades.join(", ")}\n`
      content += `Média: ${gradeData.average.toFixed(1)}\n\n`
    })
    return content
  }

  const generateClassReportContent = () => {
    if (!data) return ""

    let content = "RELATÓRIO DA TURMA\n\n"
    Object.entries(data).forEach(([_, studentData]) => {
      const stats = studentData as StudentStats
      content += `Aluno: ${stats.name}\n`
      content += `Notas: ${stats.grades.join(", ")}\n`
      content += `Média: ${stats.average.toFixed(1)}\n`
      content += `Frequência: ${((stats.attendance.present / stats.attendance.total) * 100).toFixed(1)}%\n\n`
    })
    return content
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-2">
            <Button onClick={generateReport} disabled={loading}>
              {loading ? "Gerando..." : "Gerar Relatório"}
            </Button>
            {data && (
              <Button variant="outline" onClick={downloadReport}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>

          {data && (
            <div className="mt-4 space-y-4">
              {type === "report-card" ? (
                // Report Card View
                <div className="space-y-4">
                  {Object.entries(data).map(([id, classData]) => {
                    const gradeData = classData as GradeData
                    return (
                      <div key={id} className="p-4 border rounded">
                        <h3 className="font-medium">{gradeData.subject}</h3>
                        <p className="text-sm text-gray-600">Turma: {gradeData.className}</p>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm font-medium">Notas</p>
                            <p className="text-sm">{gradeData.grades.join(", ")}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Média</p>
                            <p className="text-sm">{gradeData.average.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                // Class Report View
                <div className="space-y-4">
                  {Object.entries(data).map(([id, studentData]) => {
                    const stats = studentData as StudentStats
                    return (
                      <div key={id} className="p-4 border rounded">
                        <h3 className="font-medium">{stats.name}</h3>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm font-medium">Notas</p>
                            <p className="text-sm">{stats.grades.join(", ")}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Média</p>
                            <p className="text-sm">{stats.average.toFixed(1)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Frequência</p>
                            <p className="text-sm">
                              {((stats.attendance.present / stats.attendance.total) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
