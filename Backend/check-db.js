require('dotenv/config')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const programas = await prisma.programa.findMany({ take: 3 })
  const cargos = await prisma.cargo.findMany({ take: 3 })
  const areas = await prisma.area.findMany({ take: 3 })
  console.log('PROGRAMAS:', JSON.stringify(programas, null, 2))
  console.log('CARGOS:', JSON.stringify(cargos, null, 2))
  console.log('AREAS:', JSON.stringify(areas, null, 2))
}
main().finally(() => prisma.$disconnect())