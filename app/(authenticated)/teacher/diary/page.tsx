"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Save, Plus } from "lucide-react"

interface DiaryEntry {
  id: number
  classId: number
  date: string
  content: string
  activities: string
  homework: string
}

interface ClassInfo {
  id: number
  name: string
  entries: DiaryEntry[]
}

export default function TeacherDiary() {
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const [classes, setClasses] = useState<ClassInfo[]>([
    {
      id: 1,
      name: "5º Ano A",
      entries: [
        {
          id: 1,
          classId: 1,
          date: "2024-03-14",
          content: "Introdução à multiplicação de frações",
          activities: "Exercícios páginas 45-47",
          homework: "Resolver problemas 1-5 da página 48",
        },
      ],
    },
    {
      id: 2,
      name: "6º Ano B",
      entries: [],
    },
  ])
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    content: "",
    activities: "",
    homework: "",
  })
  const [isAddingEntry, setIsAddingEntry] = useState(false)

  const handleSaveEntry = async () => {
    if (!selectedClass) return

    try {
      // In a real application, this would be an API call
      const entry = {
        id: Math.random(),
        classId: selectedClass,
        ...newEntry,
      }

      setClasses((prev) =>
        prev.map((c) => {
          if (c.id === selectedClass) {
            return {
              ...c,
              entries: [...c.entries, entry],
            }
          }
          return c
        })
      )

      setNewEntry({
        date: new Date().toISOString().split("T")[0],
        content: "",
        activities: "",
        homework: "",
      })
      setIsAddingEntry(false)
    } catch (error) {
      console.error("Error saving entry:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Diário de Classe</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString("pt-BR")}</span>
        </div>
      </div>

      <Tabs
        value={selectedClass?.toString() || ""}
        onValueChange={(value) => setSelectedClass(Number(value))}
      >
        <TabsList>
          {classes.map((c) => (
            <TabsTrigger key={c.id} value={c.id.toString()}>
              {c.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {classes.map((classInfo) => (
          <TabsContent key={classInfo.id} value={classInfo.id.toString()}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Registros de Aula - {classInfo.name}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingEntry(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Registro
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {isAddingEntry && selectedClass === classInfo.id && (
                    <Card className="border-2 border-blue-200">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Data
                            </label>
                            <Input
                              type="date"
                              value={newEntry.date}
                              onChange={(e) =>
                                setNewEntry({ ...newEntry, date: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Conteúdo Ministrado
                            </label>
                            <Textarea
                              value={newEntry.content}
                              onChange={(e) =>
                                setNewEntry({ ...newEntry, content: e.target.value })
                              }
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Atividades Realizadas
                            </label>
                            <Textarea
                              value={newEntry.activities}
                              onChange={(e) =>
                                setNewEntry({ ...newEntry, activities: e.target.value })
                              }
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Tarefa de Casa
                            </label>
                            <Textarea
                              value={newEntry.homework}
                              onChange={(e) =>
                                setNewEntry({ ...newEntry, homework: e.target.value })
                              }
                              rows={2}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsAddingEntry(false)}
                            >
                              Cancelar
                            </Button>
                            <Button onClick={handleSaveEntry}>
                              <Save className="w-4 h-4 mr-2" />
                              Salvar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {classInfo.entries.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      Nenhum registro encontrado
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {classInfo.entries.map((entry) => (
                        <Card key={entry.id}>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium">
                                  {new Date(entry.date).toLocaleDateString("pt-BR")}
                                </h3>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-600">
                                  Conteúdo Ministrado
                                </h4>
                                <p className="mt-1">{entry.content}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-600">
                                  Atividades Realizadas
                                </h4>
                                <p className="mt-1">{entry.activities}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-600">
                                  Tarefa de Casa
                                </h4>
                                <p className="mt-1">{entry.homework}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
