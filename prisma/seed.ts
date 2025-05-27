import { PrismaClient, UserRole } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.attendance.deleteMany()
  await prisma.grade.deleteMany()
  await prisma.student.deleteMany()
  await prisma.class.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.guardian.deleteMany()
  await prisma.schoolUser.deleteMany()
  await prisma.municipalUser.deleteMany()
  await prisma.school.deleteMany()
  await prisma.municipality.deleteMany()
  await prisma.user.deleteMany()

  const password = await hash("senha123", 10)

  // Create Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      cpf: "12345678900",
      name: "Super Admin",
      password,
      role: UserRole.SUPER_ADMIN,
    },
  })

  // Create Support Users
  const supportN1 = await prisma.user.create({
    data: {
      cpf: "12345678901",
      name: "Suporte N1",
      password,
      role: UserRole.SUPPORT_N1,
      createdBy: superAdmin.id,
    },
  })

  const supportN2 = await prisma.user.create({
    data: {
      cpf: "12345678902",
      name: "Suporte N2",
      password,
      role: UserRole.SUPPORT_N2,
      createdBy: superAdmin.id,
    },
  })

  // Create Municipality
  const municipality = await prisma.municipality.create({
    data: {
      name: "São Paulo",
      state: "SP",
    },
  })

  // Create Municipal Users
  const municipalManager = await prisma.user.create({
    data: {
      cpf: "12345678903",
      name: "Gestor Municipal",
      password,
      role: UserRole.MUNICIPAL_MANAGER,
      createdBy: superAdmin.id,
      municipalUser: {
        create: {
          municipalityId: municipality.id,
        },
      },
    },
  })

  const municipalOperator = await prisma.user.create({
    data: {
      cpf: "12345678904",
      name: "Operador Municipal",
      password,
      role: UserRole.MUNICIPAL_OPERATOR,
      createdBy: municipalManager.id,
      municipalUser: {
        create: {
          municipalityId: municipality.id,
        },
      },
    },
  })

  // Create School
  const school = await prisma.school.create({
    data: {
      name: "Escola Municipal João da Silva",
      municipalityId: municipality.id,
    },
  })

  // Create School Users
  const director = await prisma.user.create({
    data: {
      cpf: "12345678905",
      name: "Diretor Escolar",
      password,
      role: UserRole.DIRECTOR,
      createdBy: municipalManager.id,
      schoolUser: {
        create: {
          schoolId: school.id,
        },
      },
    },
  })

  const secretary = await prisma.user.create({
    data: {
      cpf: "12345678906",
      name: "Secretário Escolar",
      password,
      role: UserRole.SECRETARY,
      createdBy: director.id,
      schoolUser: {
        create: {
          schoolId: school.id,
        },
      },
    },
  })

  // Create Teacher
  const teacher = await prisma.user.create({
    data: {
      cpf: "12345678907",
      name: "Professor Silva",
      password,
      role: UserRole.TEACHER,
      createdBy: director.id,
      teacherProfile: {
        create: {},
      },
      schoolUser: {
        create: {
          schoolId: school.id,
        },
      },
    },
  })

  // Create Guardian
  const guardian = await prisma.user.create({
    data: {
      cpf: "12345678908",
      name: "Responsável Santos",
      password,
      role: UserRole.GUARDIAN,
      createdBy: secretary.id,
      guardianProfile: {
        create: {},
      },
    },
  })

  // Create Student
  const student = await prisma.student.create({
    data: {
      name: "Aluno Santos",
      guardianId: (await prisma.guardian.findUnique({ where: { userId: guardian.id } }))!.id,
      dateOfBirth: new Date("2010-01-01"),
    },
  })

  // Create Class
  const class1 = await prisma.class.create({
    data: {
      name: "5º Ano A",
      schoolId: school.id,
      teacherId: (await prisma.teacher.findUnique({ where: { userId: teacher.id } }))!.id,
      year: 2024,
      students: {
        connect: { id: student.id },
      },
    },
  })

  // Create Grades
  await prisma.grade.create({
    data: {
      studentId: student.id,
      classId: class1.id,
      value: 8.5,
      type: "test",
      period: "1st quarter",
    },
  })

  // Create Attendance
  await prisma.attendance.create({
    data: {
      studentId: student.id,
      classId: class1.id,
      date: new Date(),
      status: "present",
    },
  })

  console.log("Database seeded with test users and data!")
  console.log("\nTest Users (all passwords are 'senha123'):")
  console.log("Super Admin CPF: 12345678900")
  console.log("Suporte N1 CPF: 12345678901")
  console.log("Suporte N2 CPF: 12345678902")
  console.log("Gestor Municipal CPF: 12345678903")
  console.log("Operador Municipal CPF: 12345678904")
  console.log("Diretor CPF: 12345678905")
  console.log("Secretário CPF: 12345678906")
  console.log("Professor CPF: 12345678907")
  console.log("Responsável CPF: 12345678908")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
