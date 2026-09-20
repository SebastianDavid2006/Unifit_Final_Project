import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function deleteUserByEmail(email: string) {
  const user = await prisma.usuario.findUnique({
    where: { email_contacto: email },
    select: { id_usuario: true }
  })

  if (!user) {
    console.log(`User with email ${email} not found`)
    return
  }

  const userId = user.id_usuario
  console.log(`Deleting user ${userId} (${email})...`)

  try {
    await prisma.$transaction(async (tx) => {
      // Delete all related records first
      
      await tx.agenda.deleteMany({ where: { id_usuario: userId } })
      console.log('  ✓ agenda (usuario) deleted')

      await tx.agenda.deleteMany({ where: { id_creador: userId } })
      console.log('  ✓ agenda (creador) deleted')

      await tx.valoracion.deleteMany({ where: { id_usuario: userId } })
      console.log('  ✓ valoracion (usuario) deleted')

      await tx.valoracion.deleteMany({ where: { id_creador: userId } })
      console.log('  ✓ valoracion (creador) deleted')

      await tx.rutina.deleteMany({ where: { id_usuario: userId } })
      console.log('  ✓ rutina (usuario) deleted')

      await tx.rutina.deleteMany({ where: { id_creador: userId } })
      console.log('  ✓ rutina (creador) deleted')

      await tx.asistencia.deleteMany({ where: { id_usuario: userId } })
      console.log('  ✓ asistencia deleted')

      await tx.huella.deleteMany({ where: { id_usuario: userId } })
      console.log('  ✓ huella deleted')

      await tx.aceptacionDocumento.deleteMany({ where: { id_usuario: userId } })
      console.log('  ✓ aceptacionDocumento (usuario) deleted')

      await tx.aceptacionDocumento.deleteMany({ where: { id_activador: userId } })
      console.log('  ✓ aceptacionDocumento (activador) deleted')

      await tx.cupo.deleteMany({ where: { id_creador: userId } })
      console.log('  ✓ cupo deleted')

      await tx.ejercicio.deleteMany({ where: { id_creador: userId } })
      console.log('  ✓ ejercicio deleted')

      await tx.maquina.deleteMany({ where: { id_creador: userId } })
      console.log('  ✓ maquina deleted')

      await tx.estudiante.deleteMany({ where: { id_usuario: userId } })
      await tx.profesor.deleteMany({ where: { id_usuario: userId } })
      await tx.administrativo.deleteMany({ where: { id_usuario: userId } })
      await tx.acudiente.deleteMany({ where: { id_usuario_acudido: userId } })
      console.log('  ✓ user type profiles deleted')

      // Finally delete the user
      await tx.usuario.delete({ where: { id_usuario: userId } })
      console.log('  ✓ usuario deleted')
    })

    console.log(`User ${email} deleted successfully!`)
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

const email = process.argv[2]

if (!email) {
  console.error('Usage: npx tsx prisma/delete-user.ts <email>')
  process.exit(1)
}

deleteUserByEmail(email)
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })