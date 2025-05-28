"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calendar, Users, FileText, ClipboardList, AlertTriangle, BookOpen } from "lucide-react"
import Link from "next/link"

interface StudentAttendance {
  name: string
  attendance: number
}

interface QuarterlyAttendance {
  rate: number
  lowAttendanceStudents: StudentAttendance[]
}

interface Class {
  id: number
  name: string
  totalStudents: number
  attendanceRate: number
  averageGrade: number
  quarterlyAttendance: {
    rate: number
    lowAttendanceStudents: Array<{
      name: string
      attendance: number
    }>
  }
}

export default function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState<string>("1")
  const [classes, setClasses] = useState<Class[]>([
    {
      id: 1,
      name: "5º Ano A",
      totalStudents: 25,
      attendanceRate: 92,
      averageGrade: 7.8,
      quarterlyAttendance: {
        rate: 88,
        lowAttendanceStudents: [
          { name: "João Silva", attendance: 65 },
          { name: "Maria Santos", attendance: 70 }
        ]
      }
    },
    {
      id: 2,
      name: "6º Ano B",
      totalStudents: 28,
      attendanceRate: 88,
      averageGrade: 8.2,
      quarterlyAttendance: {
        rate: 85,
        lowAttendanceStudents: [
          { name: "Pedro Oliveira", attendance: 68 }
        ]
      }
    },
  ])

  const currentClass = classes.find(c => c.id.toString() === selectedClass)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Painel do Professor</h1>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione a turma" />
            </SelectTrigger>
            <SelectContent>
              {classes.map(classItem => (
                <SelectItem key={classItem.id} value={classItem.id.toString()}>
                  {classItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/teacher/diary">
            <Button variant="outline" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Diário de Classe
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
      </div>

      {currentClass && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                    <p className="text-2xl font-bold text-gray-900">{currentClass.totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Média da Turma</p>
                    <p className="text-2xl font-bold text-gray-900">{currentClass.averageGrade}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <ClipboardList className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Frequência do Bimestre</p>
                    <p className="text-2xl font-bold text-gray-900">{currentClass.quarterlyAttendance.rate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Low Attendance Alerts */}
          {currentClass.quarterlyAttendance.lowAttendanceStudents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Alunos com Baixa Frequência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentClass.quarterlyAttendance.lowAttendanceStudents.map(student => (
                    <Alert key={student.name} variant="warning">
                      <AlertTitle>{student.name}</AlertTitle>
                      <AlertDescription>
                        Frequência atual: {student.attendance}% (Abaixo do mínimo recomendado de 75%)
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Notas Lançadas</p>
                    <p className="text-sm text-gray-600">{currentClass.name} - Avaliação Bimestral</p>
                  </div>
                  <p className="text-sm text-gray-600">Hoje</p>
                </div>
                <div className="flex items-center gap-4 p-3 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Frequência Registrada</p>
                    <p className="text-sm text-gray-600">{currentClass.name} - Aula de Matemática</p>
                  </div>
                  <p className="text-sm text-gray-600">Ontem</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
