"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, Save } from "lucide-react"

interface Student {
  id: string
  name: string
  grades: {
    bimestre1: number | null
    bimestre2: number | null
    bimestre3: number | null
    bimestre4: number | null
  }
  average: number | null
  status: "Aprovado" | "Reprovado" | "Recuperação" | "Pendente"
}

interface GradeEditorProps {
  subject: string
  className: string
}

export function GradeEditor({ subject, className }: GradeEditorProps) {
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Ana Silva Santos",
      grades: { bimestre1: 8.5, bimestre2: 7.0, bimestre3: null, bimestre4: null },
      average: null,
      status: "Pendente",
    },
    {
      id: "2",
      name: "Bruno Costa Lima",
      grades: { bimestre1: 9.0, bimestre2: 8.5, bimestre3: null, bimestre4: null },
      average: null,
      status: "Pendente",
    },
    {
      id: "3",
      name: "Carla Oliveira Souza",
      grades: { bimestre1: 6.5, bimestre2: 7.5, bimestre3: null, bimestre4: null },
      average: null,
      status: "Pendente",
    },
    {
      id: "4",
      name: "Diego Ferreira Alves",
      grades: { bimestre1: 7.0, bimestre2: 6.0, bimestre3: null, bimestre4: null },
      average: null,
      status: "Pendente",
    },
    {
      id: "5",
      name: "Eduarda Martins Rocha",
      grades: { bimestre1: 9.5, bimestre2: 9.0, bimestre3: null, bimestre4: null },
      average: null,
      status: "Pendente",
    },
  ])

  const calculateAverage = (grades: Student["grades"]) => {
    const validGrades = Object.values(grades).filter((grade) => grade !== null) as number[]
    if (validGrades.length === 0) return null
    return validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length
  }

  const getStatus = (average: number | null): Student["status"] => {
    if (average === null) return "Pendente"
    if (average >= 7.0) return "Aprovado"
    if (average >= 5.0) return "Recuperação"
    return "Reprovado"
  }

  const updateGrade = (studentId: string, bimestre: keyof Student["grades"], value: string) => {
    const numValue = value === "" ? null : Number.parseFloat(value)
    if (numValue !== null && (numValue < 0 || numValue > 10)) return

    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          const newGrades = { ...student.grades, [bimestre]: numValue }
          const newAverage = calculateAverage(newGrades)
          return {
            ...student,
            grades: newGrades,
            average: newAverage,
            status: getStatus(newAverage),
          }
        }
        return student
      }),
    )
  }

  const getStatusColor = (status: Student["status"]) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800"
      case "Reprovado":
        return "bg-red-100 text-red-800"
      case "Recuperação":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{subject}</CardTitle>
            <p className="text-sm text-gray-600">{className}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2 text-left font-medium">Aluno</th>
                <th className="border border-gray-300 p-2 text-center font-medium">1º Bim</th>
                <th className="border border-gray-300 p-2 text-center font-medium">2º Bim</th>
                <th className="border border-gray-300 p-2 text-center font-medium">3º Bim</th>
                <th className="border border-gray-300 p-2 text-center font-medium">4º Bim</th>
                <th className="border border-gray-300 p-2 text-center font-medium">Média</th>
                <th className="border border-gray-300 p-2 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-medium">{student.name}</td>
                  {(["bimestre1", "bimestre2", "bimestre3", "bimestre4"] as const).map((bimestre) => (
                    <td key={bimestre} className="border border-gray-300 p-1">
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={student.grades[bimestre] ?? ""}
                        onChange={(e) => updateGrade(student.id, bimestre, e.target.value)}
                        className="w-full text-center border-0 focus:ring-1 focus:ring-blue-500"
                        placeholder="0.0"
                      />
                    </td>
                  ))}
                  <td className="border border-gray-300 p-2 text-center font-medium">
                    {student.average ? student.average.toFixed(1) : "-"}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
