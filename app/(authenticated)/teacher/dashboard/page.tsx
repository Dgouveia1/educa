"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, FileText, ClipboardList } from "lucide-react"

interface Class {
  id: number
  name: string
  totalStudents: number
  attendanceRate: number
  averageGrade: number
}

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<Class[]>([
    {
      id: 1,
      name: "5º Ano A",
      totalStudents: 25,
      attendanceRate: 92,
      averageGrade: 7.8,
    },
    {
      id: 2,
      name: "6º Ano B",
      totalStudents: 28,
      attendanceRate: 88,
      averageGrade: 8.2,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Painel do Professor</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString("pt-BR")}</span>
        </div>
      </div>

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
                <p className="text-2xl font-bold text-gray-900">53</p>
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
                <p className="text-sm font-medium text-gray-600">Média Geral</p>
                <p className="text-2xl font-bold text-gray-900">8.0</p>
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
                <p className="text-sm font-medium text-gray-600">Frequência Média</p>
                <p className="text-2xl font-bold text-gray-900">90%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Minhas Turmas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{classItem.name}</h3>
                    <p className="text-sm text-gray-600">{classItem.totalStudents} alunos</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="min-w-[100px]">
                      <p className="text-sm text-gray-600">Frequência</p>
                      <p className="font-medium text-gray-900">{classItem.attendanceRate}%</p>
                    </div>
                    <div className="min-w-[100px]">
                      <p className="text-sm text-gray-600">Média da Turma</p>
                      <p className="font-medium text-gray-900">{classItem.averageGrade}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                <p className="text-sm text-gray-600">5º Ano A - Avaliação Bimestral</p>
              </div>
              <p className="text-sm text-gray-600">Hoje</p>
            </div>
            <div className="flex items-center gap-4 p-3 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">Frequência Registrada</p>
                <p className="text-sm text-gray-600">6º Ano B - Aula de Matemática</p>
              </div>
              <p className="text-sm text-gray-600">Ontem</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
