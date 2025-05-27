import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const studentId = searchParams.get("studentId")
  const classId = searchParams.get("classId")
  const type = searchParams.get("type")

  try {
    switch (type) {
      case "report-card": {
        // Get student's grades and attendance for all classes
        const grades = await prisma.grade.findMany({
          where: { studentId: Number(studentId) },
          include: {
            class: true,
          },
        })

        const attendance = await prisma.attendance.findMany({
          where: { studentId: Number(studentId) },
          include: {
            class: true,
          },
        })

        // Calculate statistics
        const gradesByClass = grades.reduce((acc, grade) => {
          if (!acc[grade.classId]) {
            acc[grade.classId] = {
              className: grade.class.name,
              subject: grade.class.subject,
              grades: [],
              average: 0,
            }
          }
          acc[grade.classId].grades.push(grade.value)
          return acc
        }, {} as Record<number, { className: string; subject: string; grades: number[]; average: number }>)

        // Calculate averages
        Object.values(gradesByClass).forEach((classData) => {
          classData.average =
            classData.grades.reduce((sum, grade) => sum + grade, 0) / classData.grades.length
        })

        // Calculate attendance percentage
        const attendanceByClass = attendance.reduce((acc, record) => {
          if (!acc[record.classId]) {
            acc[record.classId] = {
              total: 0,
              present: 0,
            }
          }
          acc[record.classId].total++
          if (record.status === "PRESENT") {
            acc[record.classId].present++
          }
          return acc
        }, {} as Record<number, { total: number; present: number }>)

        return NextResponse.json({
          grades: gradesByClass,
          attendance: attendanceByClass,
        })
      }

      case "class-report": {
        // Get all grades and attendance for a specific class
        const grades = await prisma.grade.findMany({
          where: { classId: Number(classId) },
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        })

        const attendance = await prisma.attendance.findMany({
          where: { classId: Number(classId) },
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        })

        // Calculate statistics per student
        const studentStats = grades.reduce((acc, grade) => {
          const studentId = grade.studentId
          if (!acc[studentId]) {
            acc[studentId] = {
              name: grade.student.user.name,
              grades: [],
              average: 0,
              attendance: {
                total: 0,
                present: 0,
              },
            }
          }
          acc[studentId].grades.push(grade.value)
          return acc
        }, {} as Record<number, { name: string; grades: number[]; average: number; attendance: { total: number; present: number } }>)

        // Add attendance data
        attendance.forEach((record) => {
          const studentId = record.studentId
          if (studentStats[studentId]) {
            studentStats[studentId].attendance.total++
            if (record.status === "PRESENT") {
              studentStats[studentId].attendance.present++
            }
          }
        })

        // Calculate final averages
        Object.values(studentStats).forEach((student) => {
          student.average =
            student.grades.reduce((sum, grade) => sum + grade, 0) / student.grades.length
        })

        return NextResponse.json(studentStats)
      }

      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Report generation error:", error)
    return NextResponse.json(
      { error: "Error generating report" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
