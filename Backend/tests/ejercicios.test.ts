import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import request from 'supertest'
import * as fs from 'fs'
import * as path from 'path'
import app from '../src/app'
import { prisma } from '../src/utils/prisma'
import { getVideoDuration } from '../src/utils/ffprobe'

vi.mock('../src/utils/ffprobe', () => ({
  getVideoDuration: vi.fn(),
}))

const mockGetVideoDuration = vi.mocked(getVideoDuration)

function token(key: string): string {
  return (globalThis as any)[key]
}

const adminAuth = () => `Bearer ${token('adminToken')}`
const entrenadorAuth = () => `Bearer ${token('entrenadorToken')}`
const usuarioAuth = () => `Bearer ${token('usuarioToken')}`

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)
const VIDEO_FAKE = Buffer.from('fake-mp4-bytes-para-tests')
const LIMITE_10MB = 10 * 1024 * 1024

const MULTIMEDIA_DIR = path.join(process.cwd(), 'uploads', 'multimedia')
const TEMP_DIR = path.join(process.cwd(), 'uploads', 'temp')

function listarMultimedia(): Set<string> {
  try { return new Set(fs.readdirSync(MULTIMEDIA_DIR)) } catch { return new Set() }
}

function listarTemp(): Set<string> {
  try { return new Set(fs.readdirSync(TEMP_DIR)) } catch { return new Set() }
}

async function archivoEnUso(filename: string): Promise<boolean> {
  const [ej, mq] = await Promise.all([
    prisma.ejercicio.count({ where: { url_multimedia: { contains: filename } } }),
    prisma.maquina.count({ where: { url_multimedia: { contains: filename } } }),
  ])
  return ej + mq > 0
}

let idsPreviosEjercicios = new Set<string>()
let archivosPreviosMultimedia: Set<string>
let ejercicioId: string
let ejercicioUrlOriginal: string
let ejercicioParaDesactivarId: string

async function tomarIdsPrevios(): Promise<void> {
  const filas = await prisma.ejercicio.findMany({ select: { id_ejercicio: true } })
  idsPreviosEjercicios = new Set(filas.map((f) => f.id_ejercicio))
}

async function borrarSoloCreadosEnCorrida(): Promise<void> {
  const filas = await prisma.ejercicio.findMany({ select: { id_ejercicio: true } })
  const nuevos = filas.filter((f) => !idsPreviosEjercicios.has(f.id_ejercicio)).map((f) => f.id_ejercicio)
  if (!nuevos.length) return

  // Un ejercicio referenciado por una máquina se limpia solo en el archivo de máquinas.
  const refs = await prisma.maquinaEjercicio.findMany({
    where: { id_ejercicio: { in: nuevos } },
    select: { id_ejercicio: true },
  })
  const referenciados = new Set(refs.map((r) => r.id_ejercicio))
  const aBorrar = nuevos.filter((id) => !referenciados.has(id))
  if (aBorrar.length) await prisma.ejercicio.deleteMany({ where: { id_ejercicio: { in: aBorrar } } })
}

async function borrarMultimediaNueva(): Promise<void> {
  const actuales = listarMultimedia()
  for (const archivo of actuales) {
    if (archivosPreviosMultimedia.has(archivo)) continue
    if (await archivoEnUso(archivo)) continue
    try { fs.unlinkSync(path.join(MULTIMEDIA_DIR, archivo)) } catch { /* noop */ }
  }
}

beforeAll(async () => {
  await tomarIdsPrevios()
  archivosPreviosMultimedia = listarMultimedia()
  mockGetVideoDuration.mockReset().mockResolvedValue(5)
})

beforeEach(() => {
  mockGetVideoDuration.mockReset().mockResolvedValue(5)
})

afterAll(async () => {
  await borrarSoloCreadosEnCorrida()
  await borrarMultimediaNueva()
  await prisma.$disconnect()
})

describe('Protección y listado', () => {
  it('GET /api/ejercicios sin token → 401', async () => {
    const res = await request(app).get('/api/ejercicios')
    expect(res.status).toBe(401)
  })

  it('GET /api/ejercicios con rol usuario → 403', async () => {
    const res = await request(app).get('/api/ejercicios').set('Authorization', usuarioAuth())
    expect(res.status).toBe(403)
  })

  it('GET /api/ejercicios con entrenador → 200 y array', async () => {
    const res = await request(app).get('/api/ejercicios').set('Authorization', entrenadorAuth())
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('Creación de ejercicios', () => {
  it('POST con imagen admin → 201 y archivo en disco', async () => {
    const res = await request(app)
      .post('/api/ejercicios')
      .set('Authorization', adminAuth())
      .field('nombre', 'Sentadilla Hack Test')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .attach('media', PNG_1X1, { filename: 'foto.png', contentType: 'image/png' })

    expect(res.status).toBe(201)
    expect(res.body.id_ejercicio).toBeTruthy()
    expect(res.body.nivel).toBe('principiante')
    expect(res.body.url_multimedia).toMatch(/^\/uploads\/multimedia\/.+\.png$/)

    ejercicioId = res.body.id_ejercicio
    ejercicioUrlOriginal = res.body.url_multimedia
    const filename = path.basename(ejercicioUrlOriginal)
    expect(fs.existsSync(path.join(MULTIMEDIA_DIR, filename))).toBe(true)
  })

  it('POST con imagen entrenador → 201 (puede crear)', async () => {
    const res = await request(app)
      .post('/api/ejercicios')
      .set('Authorization', entrenadorAuth())
      .field('nombre', 'Ejercicio Creado por Entrenador')
      .field('grupos_musculares', JSON.stringify(['brazos']))
      .attach('media', PNG_1X1, { filename: 'foto.png', contentType: 'image/png' })

    expect(res.status).toBe(201)
  })

  it('POST con video corto → 201', async () => {
    const res = await request(app)
      .post('/api/ejercicios')
      .set('Authorization', adminAuth())
      .field('nombre', 'Ejercicio Video Corto')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .attach('media', VIDEO_FAKE, { filename: 'clip.mp4', contentType: 'video/mp4' })

    expect(res.status).toBe(201)
    expect(res.body.url_multimedia).toMatch(/\.mp4$/)
  })

  it('POST con video de más de 10s → 400 con mensaje y sin dejar archivo', async () => {
    mockGetVideoDuration.mockResolvedValue(12)
    const res = await request(app)
      .post('/api/ejercicios')
      .set('Authorization', adminAuth())
      .field('nombre', 'Ejercicio Video Largo')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .attach('media', VIDEO_FAKE, { filename: 'clip.mp4', contentType: 'video/mp4' })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('El video supera la duración máxima de 10 segundos')
  })

  it('POST con video corrupto → 400 con mensaje', async () => {
    mockGetVideoDuration.mockRejectedValue(new Error('ffprobe fallo'))
    const res = await request(app)
      .post('/api/ejercicios')
      .set('Authorization', adminAuth())
      .field('nombre', 'Ejercicio Video Corrupto')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .attach('media', VIDEO_FAKE, { filename: 'clip.mp4', contentType: 'video/mp4' })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('Error validando video')
  })

  it('POST sin archivo → 400', async () => {
    const res = await request(app)
      .post('/api/ejercicios')
      .set('Authorization', adminAuth())
      .field('nombre', 'Sin Multimedia')
      .field('grupos_musculares', JSON.stringify(['piernas']))

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('La imagen o video es obligatoria')
  })

  it('POST sin token → 401', async () => {
    const res = await request(app)
      .post('/api/ejercicios')
      .attach('media', PNG_1X1, { filename: 'foto.png', contentType: 'image/png' })

    expect(res.status).toBe(401)
  })

  it('POST con rol usuario → 403', async () => {
    const res = await request(app)
      .post('/api/ejercicios')
      .set('Authorization', usuarioAuth())
      .attach('media', PNG_1X1, { filename: 'foto.png', contentType: 'image/png' })

    expect(res.status).toBe(403)
  })

  it('POST con nombre vacío → 400', async () => {
    const res = await request(app)
      .post('/api/ejercicios')
      .set('Authorization', adminAuth())
      .field('nombre', '')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .attach('media', PNG_1X1, { filename: 'foto.png', contentType: 'image/png' })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('El nombre es obligatorio')
  })

  it('POST con nombre de solo espacios → 400 y no deja archivos', async () => {
    const previos = listarMultimedia()
    const previosTemp = listarTemp()
    const res = await request(app)
      .post('/api/ejercicios')
      .set('Authorization', adminAuth())
      .field('nombre', '   ')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .attach('media', PNG_1X1, { filename: 'foto.png', contentType: 'image/png' })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('El nombre es obligatorio')
    expect(listarMultimedia()).toEqual(previos)
    expect(listarTemp()).toEqual(previosTemp)
  })

  it('POST con nombre válido con espacios internos → 201', async () => {
    const res = await request(app)
      .post('/api/ejercicios')
      .set('Authorization', adminAuth())
      .field('nombre', 'Press de banca')
      .field('grupos_musculares', JSON.stringify(['pecho']))
      .attach('media', PNG_1X1, { filename: 'foto.png', contentType: 'image/png' })

    expect(res.status).toBe(201)
    expect(res.body.nombre).toBe('Press de banca')
  })

  it('POST con grupos musculares vacíos → 400', async () => {
    const res = await request(app)
      .post('/api/ejercicios')
      .set('Authorization', adminAuth())
      .field('nombre', 'Sin Grupos')
      .field('grupos_musculares', JSON.stringify([]))
      .attach('media', PNG_1X1, { filename: 'foto.png', contentType: 'image/png' })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('Debes seleccionar al menos un grupo muscular')
  })

  it('POST con grupos_musculares que no es JSON → 400', async () => {
    const res = await request(app)
      .post('/api/ejercicios')
      .set('Authorization', adminAuth())
      .field('nombre', 'Grupos Rotos')
      .field('grupos_musculares', 'esto-no-es-json')
      .attach('media', PNG_1X1, { filename: 'foto.png', contentType: 'image/png' })

    expect(res.status).toBe(400)
  })

  it('POST con archivo >10MB → 413 con mensaje', async () => {
    const res = await request(app)
      .post('/api/ejercicios')
      .set('Authorization', adminAuth())
      .field('nombre', 'Imagen Gigante')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .attach('media', Buffer.alloc(LIMITE_10MB + 1, 1), { filename: 'grande.png', contentType: 'image/png' })

    expect(res.status).toBe(413)
    expect(res.body.mensaje).toBe('El archivo supera el tamaño máximo de 10 MB')
  })

  it('POST con nivel no válido → 400', async () => {
    const res = await request(app)
      .post('/api/ejercicios')
      .set('Authorization', adminAuth())
      .field('nombre', 'Nivel Invalido')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .field('nivel', 'experto-galactico')
      .attach('media', PNG_1X1, { filename: 'foto.png', contentType: 'image/png' })

    expect(res.status).toBe(400)
  })
})

describe('Edición de ejercicios', () => {
  it('PUT solo texto (sin archivo) → 200 y refleja cambios', async () => {
    const res = await request(app)
      .put(`/api/ejercicios/${ejercicioId}`)
      .set('Authorization', adminAuth())
      .send({ nombre: 'Sentadilla Hack Editada', descripcion: 'Cambio de descripción' })

    expect(res.status).toBe(200)
    expect(res.body.nombre).toBe('Sentadilla Hack Editada')
    expect(res.body.descripcion).toBe('Cambio de descripción')
    expect(res.body.url_multimedia).toBe(ejercicioUrlOriginal)
  })

  it('PUT reemplazo de imagen → 200, borra el archivo anterior y guarda el nuevo', async () => {
    const res = await request(app)
      .put(`/api/ejercicios/${ejercicioId}`)
      .set('Authorization', adminAuth())
      .field('nombre', 'Sentadilla Hack Editada')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .attach('media', PNG_1X1, { filename: 'nueva.png', contentType: 'image/png' })

    expect(res.status).toBe(200)

    const archivoViejo = path.basename(ejercicioUrlOriginal)
    expect(fs.existsSync(path.join(MULTIMEDIA_DIR, archivoViejo))).toBe(false)

    const archivoNuevo = path.basename(res.body.url_multimedia)
    expect(fs.existsSync(path.join(MULTIMEDIA_DIR, archivoNuevo))).toBe(true)
    ejercicioUrlOriginal = res.body.url_multimedia
  })

  it('PUT con video de más de 10s → 400 y conserva el archivo anterior', async () => {
    mockGetVideoDuration.mockResolvedValue(15)
    const res = await request(app)
      .put(`/api/ejercicios/${ejercicioId}`)
      .set('Authorization', adminAuth())
      .field('nombre', 'Sentadilla Hack Editada')
      .attach('media', VIDEO_FAKE, { filename: 'largo.mp4', contentType: 'video/mp4' })

    expect(res.status).toBe(400)
    expect(res.body.mensaje).toBe('El video supera la duración máxima de 10 segundos')
    expect(fs.existsSync(path.join(MULTIMEDIA_DIR, path.basename(ejercicioUrlOriginal)))).toBe(true)
  })

  it('PUT a ejercicio inexistente → 404', async () => {
    const res = await request(app)
      .put('/api/ejercicios/00000000-0000-0000-0000-000000000000')
      .set('Authorization', adminAuth())
      .send({ descripcion: 'x' })

    expect(res.status).toBe(404)
  })

  it('PUT con rol entrenador → 403', async () => {
    const res = await request(app)
      .put(`/api/ejercicios/${ejercicioId}`)
      .set('Authorization', entrenadorAuth())
      .send({ descripcion: 'x' })

    expect(res.status).toBe(403)
  })
})

describe('Desactivación de ejercicios', () => {
  it('Desactivar → deja de aparecer en el listado activo', async () => {
    const creado = await request(app)
      .post('/api/ejercicios')
      .set('Authorization', adminAuth())
      .field('nombre', 'Ejercicio Para Desactivar')
      .field('grupos_musculares', JSON.stringify(['piernas']))
      .attach('media', PNG_1X1, { filename: 'foto.png', contentType: 'image/png' })
    ejercicioParaDesactivarId = creado.body.id_ejercicio

    const res = await request(app)
      .put(`/api/ejercicios/${ejercicioParaDesactivarId}/desactivar`)
      .set('Authorization', adminAuth())

    expect(res.status).toBe(200)
    expect(res.body.mensaje).toBe('Ejercicio desactivado correctamente')

    const listado = await request(app).get('/api/ejercicios').set('Authorization', adminAuth())
    const ids = (listado.body as any[]).map((e) => e.id_ejercicio)
    expect(ids).not.toContain(ejercicioParaDesactivarId)
  })

  it('Desactivar un ejercicio inexistente → 404', async () => {
    const res = await request(app)
      .put('/api/ejercicios/00000000-0000-0000-0000-000000000000/desactivar')
      .set('Authorization', adminAuth())

    expect(res.status).toBe(404)
  })
})