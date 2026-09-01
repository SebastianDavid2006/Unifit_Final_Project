import 'dotenv/config'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../src/utils/prisma'

const SEED_USERS = [
  { email: 'admin@unifit.edu.co', password: 'admin123', key: 'adminToken' },
  { email: 'entrenador@unifit.edu.co', password: 'entrenador123', key: 'entrenadorToken' },
  { email: 'directo@unifit.edu.co', password: 'directo123', key: 'usuarioToken' },
  { email: 'pendiente@unifit.edu.co', password: 'pendiente123', key: 'pendienteToken' },
  { email: 'inactivo@unifit.edu.co', password: 'inactivo123', key: 'inactivoToken' },
  { email: 'cambiar@unifit.edu.co', password: 'cambiar123', key: 'cambiarPassToken' },
]

async function generarToken(email: string, password: string): Promise<string> {
  const usuario = await prisma.usuario.findUnique({
    where: { email_contacto: email },
  })

  if (!usuario?.password_hash) {
    throw new Error(`Usuario ${email} no encontrado en seed`)
  }

  const passwordValida = await bcrypt.compare(password, usuario.password_hash)
  if (!passwordValida) {
    throw new Error(`Password incorrecta para ${email}`)
  }

  const token = jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      rol: usuario.rol,
      tipo_usuario: usuario.tipo_usuario,
      estado: usuario.estado,
      debe_cambiar_password: usuario.debe_cambiar_password,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' as jwt.SignOptions['expiresIn'] },
  )

  return token
}

beforeAll(async () => {
  for (const user of SEED_USERS) {
    const token = await generarToken(user.email, user.password)
    ;(globalThis as any)[user.key] = token
  }
})

afterAll(async () => {
  await prisma.$disconnect()
})
