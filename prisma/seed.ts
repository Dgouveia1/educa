import { PrismaClient, Role, AttendanceStatus } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.attendance.deleteMany()
  await prisma.grade.deleteMany()
  await prisma.class.deleteMany()
  await prisma.student.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const adminPassword = await bcrypt.hash("senha123", 10)
  const teacherPassword = await bcrypt.hash("senha123", 10)
  const studentPassword = await bcrypt.hash("senha123", 10)

  const admin = await prisma.user.create({
    data: {
      name: "Diretor Admin",
      email: "diretor@escola.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  })

  const teacher1 = await prisma.user.create({
    data: {
      name: "Maria Silva",
      email: "maria.silva@escola.com",
      password: teacherPassword,
      role: Role.TEACHER,
    },
  })

  const teacher2 = await prisma.user.create({
    data: {
      name: "João Santos",
      email: "joao.santos@escola.com",
      password: teacherPassword,
      role: Role.TEACHER,
    },
  })

  const student1 = await prisma.user.create({
    data: {
      name: "Ana Aluna",
      email: "ana.aluna@escola.com",
      password: studentPassword,
      role: Role.STUDENT,
    },
  })

  const student2 = await prisma.user.create({
    data: {
      name: "Pedro Aluno",
      email: "pedro.aluno@escola.com",
      password: studentPassword,
      role: Role.STUDENT,
    },
  })

  // Create teachers
  await prisma.teacher.create({
    data: {
      userId: teacher1.id,
    },
  })

  await prisma.teacher.create({
    data: {
      userId: teacher2.id,
    },
  })

  // Create students
  await prisma.student.create({
    data: {
      userId: student1.id,
    },
  })

  await prisma.student.create({
    data: {
      userId: student2.id,
    },
  })

  // Create classes
  const class1 = await prisma.class.create({
    data: {
      name: "4º Ano A",
      subject: "Matemática",
      teacherId: teacher1.id,
    },
  })

  const class2 = await prisma.class.create({
    data: {
      name: "5º Ano B",
      subject: "Português",
      teacherId: teacher2.id,
    },
  })

  // Connect students to classes
  await prisma.student.update({
    where: { userId: student1.id },
    data: {
      classes: {
        connect: [{ id: class1.id }, { id: class2.id }],
      },
    },
  })

  await prisma.student.update({
    where: { userId: student2.id },
    data: {
      classes: {
        connect: [{ id: class1.id }],
      },
    },
  })

  // Create grades
  await prisma.grade.createMany({
    data: [
      { studentId: student1.id, classId: class1.id, bimester: 1, value: 8.5 },
      { studentId: student1.id, classId: class1.id, bimester: 2, value: 7.0 },
      { studentId: student2.id, classId: class1.id, bimester: 1, value: 9.0 },
      { studentId: student2.id, classId: class1.id, bimester: 2, value: 8.5 },
    ],
  })

  // Create attendance
  await prisma.attendance.createMany({
    data: [
      { studentId: student1.id, classId: class1.id, date: new Date("2023-06-01"), status: AttendanceStatus.PRESENT },
      { studentId: student1.id, classId: class1.id, date: new Date("2023-06-02"), status: AttendanceStatus.ABSENT },
      { studentId: student2.id, classId: class1.id, date: new Date("2023-06-01"), status: AttendanceStatus.LATE },
      { studentId: student2.id, classId: class1.id, date: new Date("2023-06-02"), status: AttendanceStatus.PRESENT },
    ],
  })

  console.log("Database seeded successfully.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
