import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../utils/prisma'
import { HttpError } from '../utils/HttpError'
import { usuarioPublico } from './usuario.service'

const SALT_ROUNDS = 10

export async function login(datos: { email_contacto: string; password: string }) {
  const usuario = await prisma.usuario.findUnique({
    where: { email_contacto: datos.email_contacto },
  })

  if (!usuario?.password_hash) {
    throw new HttpError(401, 'Credenciales inválidas')
  }

  const passwordValida = await bcrypt.compare(datos.password, usuario.password_hash)
  if (!passwordValida) {
    throw new HttpError(401, 'Credenciales inválidas')
  }

  const expiresIn = process.env.JWT_EXPIRES_IN ?? '8h'

  const token = jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      rol: usuario.rol,
      tipo_usuario: usuario.tipo_usuario,
      estado: usuario.estado,
      debe_cambiar_password: usuario.debe_cambiar_password,
    },
    process.env.JWT_SECRET!,
    { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] },
  )

  return { token, usuario: usuarioPublico(usuario) }
}

export async function cambiarPassword(idUsuario: string, passwordActual: string, passwordNueva: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: idUsuario },
    select: { password_hash: true },
  })

  if (!usuario) {
    throw new HttpError(404, 'Usuario no encontrado')
  }

  const passwordValida = await bcrypt.compare(passwordActual, usuario.password_hash)
  if (!passwordValida) {
    throw new HttpError(401, 'Contraseña actual incorrecta')
  }

  const passwordHash = await bcrypt.hash(passwordNueva, SALT_ROUNDS)

  await prisma.usuario.update({
    where: { id_usuario: idUsuario },
    data: {
      password_hash: passwordHash,
      debe_cambiar_password: false,
    },
  })
}