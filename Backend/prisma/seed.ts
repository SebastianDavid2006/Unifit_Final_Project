import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from '../src/utils/prisma'

const PROGRAMAS = [
  { nombre: 'Tecnología en Entrenamiento Deportivo', universidad: 'uni_colombia' as const, tipo_programa: 'tecnico' as const },
  { nombre: 'Administración de Empresas', universidad: 'uni_colombia' as const, tipo_programa: 'profesional' as const },
  { nombre: 'Ingeniería de Software', universidad: 'uni_colombia' as const, tipo_programa: 'profesional' as const },
  { nombre: 'Ingeniería Agropecuaria', universidad: 'uni_bogota' as const, tipo_programa: 'profesional' as const },
  { nombre: 'Ingeniería en Inteligencia Artificial y Ciencia de Datos', universidad: 'uni_bogota' as const, tipo_programa: 'profesional' as const },
]

const CARGOS = [
  'Coordinador de Bienestar',
  'Entrenador Principal',
  'Entrenador Asistente',
  'Director Deportivo',
]

const AREAS = [
  'Bienestar Universitario',
  'Gimnasio',
  'Deportes',
  'Administración',
]

async function seedAdmin(): Promise<void> {
  const documento = 'admin'

  const existe = await prisma.usuario.findUnique({ where: { documento } })

  if (existe) {
    console.log('Admin: ya existe, omitiendo.')
    return
  }

  const passwordHash = await bcrypt.hash('admin123', 10)

  await prisma.usuario.create({
    data: {
      documento,
      tipo_documento: 'CC',
      primer_nombre: 'Administrador',
      primer_apellido: 'Sistema',
      email_contacto: 'admin@unifit.edu.co',
      genero: 'otro',
      rol: 'admin',
      tipo_usuario: 'administrativo',
      estado: 'activo',
      password_hash: passwordHash,
      debe_cambiar_password: false,
    },
  })

  console.log('Admin creado: documento=admin / password=admin123')
}

async function seedCatalogos(): Promise<void> {
  for (const programa of PROGRAMAS) {
    const existe = await prisma.programa.findUnique({
      where: { nombre_universidad: { nombre: programa.nombre, universidad: programa.universidad } },
    })
    if (!existe) {
      await prisma.programa.create({ data: programa })
    }
  }
  console.log(`Programas: ${PROGRAMAS.length} asegurados.`)

  for (const nombre of CARGOS) {
    const existe = await prisma.cargo.findUnique({ where: { nombre } })
    if (!existe) {
      await prisma.cargo.create({ data: { nombre } })
    }
  }
  console.log(`Cargos: ${CARGOS.length} asegurados.`)

  for (const nombre of AREAS) {
    const existe = await prisma.area.findUnique({ where: { nombre } })
    if (!existe) {
      await prisma.area.create({ data: { nombre } })
    }
  }
  console.log(`Áreas: ${AREAS.length} aseguradas.`)
}

async function main(): Promise<void> {
  await seedAdmin()
  await seedCatalogos()
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())