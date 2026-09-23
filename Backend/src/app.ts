import 'dotenv/config'
import express, { type NextFunction, type Request, type Response } from 'express'
import path from 'path'
import cors from 'cors'
import morgan from 'morgan'
import multer from 'multer'
import apiRoutes from './routes'
import { HttpError } from './utils/HttpError'

const app = express()

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Manual security headers (replacing helmet)
app.use((req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin')
  res.header('Cross-Origin-Opener-Policy', 'same-origin')
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none')
  res.header('X-Content-Type-Options', 'nosniff')
  res.header('X-Frame-Options', 'SAMEORIGIN')
  res.header('X-XSS-Protection', '0')
  res.header('X-DNS-Prefetch-Control', 'off')
  res.header('X-Download-Options', 'noopen')
  res.header('X-Permitted-Cross-Domain-Policies', 'none')
  res.header('Referrer-Policy', 'no-referrer')
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  next()
})

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}))

app.use(morgan('dev'))
app.use(express.json())

app.use('/uploads',
  cors({
    origin: FRONTEND_URL,
    credentials: true
  }),
  (req, res, next) => {
    res.header('Cross-Origin-Resource-Policy', 'cross-origin')
    next()
  },
  express.static(path.join(process.cwd(), 'uploads')))

app.get('/health', (_req: Request, res: Response) => {
  res.json({ estado: 'ok', hora: new Date().toISOString() })
})

app.use('/api', apiRoutes)

app.use((_req: Request, res: Response) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' })
})

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ mensaje: error.message })
    return
  }

  if (error instanceof multer.MulterError) {
    const mensaje = error.code === 'LIMIT_FILE_SIZE'
      ? 'El archivo supera el tamaño máximo de 10 MB'
      : 'Archivo multimedia inválido'
    res.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ mensaje })
    return
  }

  console.error(error)
  res.status(500).json({ mensaje: 'Error interno del servidor' })
})

if (require.main === module) {
  const PORT = Number(process.env.PORT) || 3000
  app.listen(PORT, () => {
    console.log(`API UNIFIT escuchando en http://localhost:${PORT}`)
  })
}

export default app