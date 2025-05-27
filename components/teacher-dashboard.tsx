"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradeEditor } from "./grade-editor"
import { AttendanceTracker } from "./attendance-tracker"
import { BookOpen, Users, FileText, BarChart3, LogOut, Menu } from "lucide-react"

interface TeacherDashboardProps {
  teacherName: string
  onLogout: () => void
}

export function TeacherDashboard({ teacherName, onLogout }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState("grades")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const students = [
    { id: "1", name: "Ana Silva Santos" },
    { id: "2", name: "Bruno Costa Lima" },
    { id: "3", name: "Carla Oliveira Souza" },
    { id: "4", name: "Diego Ferreira Alves" },
    { id: "5", name: "Eduarda Martins Rocha" },
  ]

  const classes = [
    { id: "1", name: "4º Ano A", subject: "Matemática", students: 25 },
    { id: "2", name: "4º Ano B", subject: "Matemática", students: 23 },
    { id: "3", name: "5º Ano A", subject: "Matemática", students: 27 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Sistema Escolar</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Olá, {teacherName}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Turmas</p>
                  <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Alunos</p>
                  <p className="text-2xl font-bold text-gray-900">75</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendências</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Média Geral</p>
                  <p className="text-2xl font-bold text-gray-900">7.8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="grades">Notas</TabsTrigger>
            <TabsTrigger value="attendance">Frequência</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="classes">Turmas</TabsTrigger>
          </TabsList>

          <TabsContent value="grades" className="space-y-6">
            <GradeEditor subject="Matemática" className="4º Ano A" />
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <AttendanceTracker className="4º Ano A" students={students} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    Boletim Individual
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    Relatório de Turma
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Users className="w-6 h-6 mb-2" />
                    Lista de Frequência
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <BookOpen className="w-6 h-6 mb-2" />
                    Diário de Classe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Turmas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classes.map((classItem) => (
                    <div key={classItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{classItem.name}</h3>
                        <p className="text-sm text-gray-600">{classItem.subject}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">{classItem.students} alunos</Badge>
                        <Button size="sm">Acessar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
