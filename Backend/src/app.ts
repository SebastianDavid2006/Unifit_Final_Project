import 'dotenv/config'
import express, { type NextFunction, type Request, type Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import apiRoutes from './routes'
import { HttpError } from './utils/HttpError'

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

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

  console.error(error)
  res.status(500).json({ mensaje: 'Error interno del servidor' })
})

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, () => {
  console.log(`API UNIFIT escuchando en http://localhost:${PORT}`)
})

export default app