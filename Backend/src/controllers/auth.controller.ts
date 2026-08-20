import { z } from 'zod'
import type { Request, Response } from 'express'
import { cambiarPassword, login } from '../services/auth.service'
import { registrarUsuario } from '../services/usuario.service'
import { registrarSchema } from './usuario.controller'
import { responderErrorPrisma } from '../utils/prisma-errors'

const loginSchema = z.object({
  email_contacto: z.string().email(),
  password: z.string().min(1),
})

const cambiarPasswordSchema = z.object({
  password_nueva: z.string().min(8),
})

export async function iniciarSesion(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  const resultado = await login(parsed.data)
  res.json({ token: resultado.token, usuario: resultado.usuario })
}

export async function cambiarContrasena(req: Request, res: Response): Promise<void> {
  const parsed = cambiarPasswordSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  await cambiarPassword(req.usuario!.id_usuario, parsed.data.password_nueva)
  res.json({ mensaje: 'Contraseña actualizada correctamente' })
}

export async function registroWeb(req: Request, res: Response): Promise<void> {
  const parsed = registrarSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ mensaje: 'Datos inválidos', errores: parsed.error.flatten() })
    return
  }

  try {
    const usuario = await registrarUsuario(parsed.data)
    res.status(201).json({
      id_usuario: usuario.id_usuario,
      estado: usuario.estado,
      mensaje: 'Registro exitoso. Tu contraseña temporal es tu número de documento.',
    })
  } catch (error) {
    if (!responderErrorPrisma(error, res)) throw error
  }
}