import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from '../src/utils/prisma'

const SALT_ROUNDS = 10

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

interface SeedUsuario {
  documento: string
  primer_nombre: string
  primer_apellido: string
  email_contacto: string
  genero: 'masculino' | 'femenino' | 'otro'
  rol: 'admin' | 'entrenador' | 'usuario'
  tipo_usuario: 'estudiante' | 'profesor' | 'administrativo'
  estado: 'pendiente' | 'activo' | 'inactivo'
  password: string
  debe_cambiar_password: boolean
}

const USUARIOS: SeedUsuario[] = [
  {
    documento: 'admin',
    primer_nombre: 'Administrador',
    primer_apellido: 'Sistema',
    email_contacto: 'admin@unifit.edu.co',
    genero: 'otro',
    rol: 'admin',
    tipo_usuario: 'administrativo',
    estado: 'activo',
    password: 'admin123',
    debe_cambiar_password: false,
  },
  {
    documento: '10000001',
    primer_nombre: 'Carlos',
    primer_apellido: 'Entrenador',
    email_contacto: 'entrenador@unifit.edu.co',
    genero: 'masculino',
    rol: 'entrenador',
    tipo_usuario: 'profesor',
    estado: 'activo',
    password: 'entrenador123',
    debe_cambiar_password: false,
  },
  {
    documento: '10000002',
    primer_nombre: 'Laura',
    primer_apellido: 'Pendiente',
    email_contacto: 'pendiente@unifit.edu.co',
    genero: 'femenino',
    rol: 'usuario',
    tipo_usuario: 'estudiante',
    estado: 'pendiente',
    password: 'pendiente123',
    debe_cambiar_password: false,
  },
  {
    documento: '10000003',
    primer_nombre: 'Andrés',
    primer_apellido: 'CambiarPass',
    email_contacto: 'cambiar@unifit.edu.co',
    genero: 'masculino',
    rol: 'usuario',
    tipo_usuario: 'estudiante',
    estado: 'activo',
    password: 'cambiar123',
    debe_cambiar_password: true,
  },
  {
    documento: '10000004',
    primer_nombre: 'Valentina',
    primer_apellido: 'Directa',
    email_contacto: 'directo@unifit.edu.co',
    genero: 'femenino',
    rol: 'usuario',
    tipo_usuario: 'estudiante',
    estado: 'activo',
    password: 'directo123',
    debe_cambiar_password: false,
  },
  {
    documento: '10000005',
    primer_nombre: 'Roberto',
    primer_apellido: 'Inactivo',
    email_contacto: 'inactivo@unifit.edu.co',
    genero: 'masculino',
    rol: 'usuario',
    tipo_usuario: 'estudiante',
    estado: 'inactivo',
    password: 'inactivo123',
    debe_cambiar_password: false,
  },
]

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

async function seedUsuarios(): Promise<void> {
  const cargoAdmin = await prisma.cargo.findUnique({ where: { nombre: 'Director Deportivo' } })
  const areaAdmin = await prisma.area.findUnique({ where: { nombre: 'Administración' } })
  const cargoEntrenador = await prisma.cargo.findUnique({ where: { nombre: 'Entrenador Principal' } })
  const areaEntrenador = await prisma.area.findUnique({ where: { nombre: 'Gimnasio' } })
  const programa = await prisma.programa.findFirst({ where: { nombre: 'Ingeniería de Software' } })

  if (!cargoAdmin || !areaAdmin || !cargoEntrenador || !areaEntrenador || !programa) {
    throw new Error('Faltan catálogos base. Ejecutá seedCatalogos primero.')
  }

  for (const u of USUARIOS) {
    const existe = await prisma.usuario.findUnique({ where: { documento: u.documento } })
    if (existe) {
      console.log(`${u.email_contacto}: ya existe, omitiendo.`)
      continue
    }

    const passwordHash = await bcrypt.hash(u.password, SALT_ROUNDS)

    const usuario = await prisma.usuario.create({
      data: {
        documento: u.documento,
        tipo_documento: 'CC',
        primer_nombre: u.primer_nombre,
        primer_apellido: u.primer_apellido,
        email_contacto: u.email_contacto,
        genero: u.genero,
        rol: u.rol,
        tipo_usuario: u.tipo_usuario,
        estado: u.estado,
        password_hash: passwordHash,
        debe_cambiar_password: u.debe_cambiar_password,
      },
    })

    if (u.rol === 'admin') {
      await prisma.administrativo.create({
        data: {
          id_usuario: usuario.id_usuario,
          id_cargo: cargoAdmin.id_cargo,
          id_area: areaAdmin.id_area,
        },
      })
    } else if (u.rol === 'entrenador') {
      await prisma.profesor.create({
        data: {
          id_usuario: usuario.id_usuario,
          id_cargo: cargoEntrenador.id_cargo,
          id_area: areaEntrenador.id_area,
        },
      })
    } else {
      await prisma.estudiante.create({
        data: {
          id_usuario: usuario.id_usuario,
          id_programa: programa.id_programa,
        },
      })
    }

    console.log(`✓ ${u.email_contacto} (${u.rol}) — password: ${u.password}`)
  }
}

async function main(): Promise<void> {
  await seedCatalogos()
  await seedUsuarios()
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())