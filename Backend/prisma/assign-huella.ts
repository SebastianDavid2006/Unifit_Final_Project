import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function assignHuella(email: string, forcedSlot?: number) {
  // 1. Buscar usuario por email
  const user = await prisma.usuario.findUnique({
    where: { email_contacto: email },
    select: { id_usuario: true, primer_nombre: true, primer_apellido: true, estado: true }
  })
  if (!user) {
    console.error(`❌ Usuario no encontrado: ${email}`)
    process.exit(1)
  }

  // 2. Verificar huella existente
  const existing = await prisma.huella.findUnique({ where: { id_usuario: user.id_usuario } })

  if (existing?.activo) {
    console.log(`⚠️ ${user.primer_nombre} ${user.primer_apellido} ya tiene huella activa (slot ${existing.indice_sensor})`)
    return
  }

  // 3. Determinar slot
  let slot = forcedSlot
  if (!slot) {
    if (existing?.indice_sensor) {
      slot = existing.indice_sensor
    } else {
      const ocupados = await prisma.huella.findMany({
        where: { activo: true },
        select: { indice_sensor: true }
      })
      const ocupadosSet = new Set(ocupados.map(h => h.indice_sensor))
      slot = 1
      while (ocupadosSet.has(slot)) slot++
      if (slot > 250) throw new Error('No hay slots disponibles (max 250)')
    }
  }

  // 4. Activar huella (upsert directo - admin)
  await prisma.huella.upsert({
    where: { id_usuario: user.id_usuario },
    update: { indice_sensor: slot, activo: true, paso_enrolamiento: null },
    create: { id_usuario: user.id_usuario, indice_sensor: slot, activo: true }
  })

  console.log(`✅ Huella activada: ${user.primer_nombre} ${user.primer_apellido} (slot ${slot})`)
}

const email = process.argv[2]
const slotArg = process.argv.find(a => a.startsWith('--slot='))?.split('=')[1]

if (!email) {
  console.error('Uso: npx tsx prisma/assign-huella.ts <email> [--slot=N]')
  process.exit(1)
}

assignHuella(email, slotArg ? parseInt(slotArg) : undefined)
  .catch(e => { console.error('❌ Error:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())