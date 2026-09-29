import { motion } from 'motion/react'
import DetailCard from '../../../components/DetailCard'
import FieldList from '../../../components/FieldList'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { TelephoneView } from '@/assets/models/ui/objects/telephone/TelephoneModel'
import { LockView } from '@/assets/models/ui/objects/lock/LockModel'
import { CalendarView } from '@/assets/models/ui/objects/calendar/CalendarModel'
import { RED, BLUE } from '../../../data'
import coach2Gif from '@/assets/illustrations/characters/coach_2/animated/coach_2.gif'
import { formatDateES } from '@/lib/dateUtils'

const SIN_DATO = 'No registrado'

function valorOPlaceholder(valor?: string | null): string {
  const texto = (valor ?? '').trim()
  return texto.length > 0 ? texto : SIN_DATO
}

function fechaOPlaceholder(fecha?: string | null): string {
  const iso = (fecha ?? '').trim()
  if (!iso) return SIN_DATO
  return valorOPlaceholder(formatDateES(iso, { day: '2-digit', month: 'short', year: 'numeric' }))
}

interface TrainerGridProps {
  trainer: any
  onShowInfo: () => void
}

export function TrainerGrid({ trainer, onShowInfo }: TrainerGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="w-full">
        <div className="grid gap-2 items-stretch" style={{ gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: '1fr 1fr 1fr' }}>
          <DetailCard gridColumn="1" gridRow="2" accent={RED} title="Información General" model={<StudentCardView />}>
            <FieldList fields={[
              { key: 'document', label: 'Documento', value: valorOPlaceholder(trainer.document) },
              { key: 'birthDate', label: 'Fecha de nacimiento', value: fechaOPlaceholder(trainer.birthDate) },
              { key: 'gender', label: 'Género', value: valorOPlaceholder(trainer.gender) },
            ]} />
          </DetailCard>

          <TrainerAvatarSection trainer={trainer} onShowInfo={onShowInfo} />

          <DetailCard gridColumn="1" gridRow="3" accent={RED} title="Contacto" model={<TelephoneView />}>
            <FieldList fields={[
              { key: 'email', label: 'Email', value: valorOPlaceholder(trainer.email) },
              { key: 'phone', label: 'Teléfono', value: valorOPlaceholder(trainer.phone) },
            ]} labelMb={1} itemPb={8} />
          </DetailCard>

          <DetailCard gridColumn="3" gridRow="3" accent={BLUE} title="Acceso" model={<LockView />}>
            <div className="flex flex-col">
              <div className="flex flex-col" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: 6 }}>
                <p className="text-xs" style={{ marginBottom: 0.5, color: 'rgba(0,0,0,0.5)' }}>Rol</p>
                <p className="text-base font-semibold" style={{ color: '#0D1B2A' }}>{trainer.role === 'admin' ? 'Administrador' : 'Entrenador'}</p>
              </div>
              <div className="flex flex-col" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: 6 }}>
                <p className="text-xs" style={{ marginBottom: 0.5, color: 'rgba(0,0,0,0.5)' }}>Estado</p>
                <span className="inline-flex items-center self-start px-3 py-1 rounded-full text-sm font-bold text-white" style={{ background: trainer.status === 'active' ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'linear-gradient(135deg, #F43843, #D0202C)' }}>
                  {trainer.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </DetailCard>

          <DetailCard gridColumn="3" gridRow="2" accent={BLUE} title="Fechas clave" model={<CalendarView />}>
            <FieldList fields={[
              { key: 'joinedAt', label: 'Miembro desde', value: valorOPlaceholder(trainer.joinedAt) },
            ]} />
          </DetailCard>
        </div>
      </div>
    </motion.div>
  )
}

function TrainerAvatarSection({ trainer, onShowInfo }: { trainer: any; onShowInfo: () => void }) {
  return (
    <div className="flex flex-col items-center relative" style={{ gridColumn: '2', gridRow: '1 / 4', paddingTop: 16, alignSelf: 'stretch', overflow: 'visible' }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-lg mb-3 relative z-10" style={{
        background: trainer.status === 'active' ? 'linear-gradient(135deg, #30D158, #20A040)' : 'linear-gradient(135deg, #8E8E93, #636366)',
        fontSize: 26,
      }}>
        {trainer.avatar}
      </div>
      <h2 className="text-[#0D1B2A] text-2xl font-bold text-center mb-2 relative z-10">{trainer.name}</h2>
      <img
        src={coach2Gif}
        alt="coach"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-0 pointer-events-none"
        style={{
          height: '78%',
          width: 'auto',
          maxWidth: '680px',
          bottom: '-6%',
          objectFit: 'contain',
          objectPosition: 'bottom center',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)',
        }}
      />
      <button onClick={onShowInfo} className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3 z-20 px-6 py-2.5 rounded-2xl text-sm font-bold text-white cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl" style={{
        background: `
          radial-gradient(at 20% 20%, #F43843 0%, transparent 50%),
          radial-gradient(at 80% 15%, #1270B7 0%, transparent 50%),
          radial-gradient(at 50% 80%, #F1C827 0%, transparent 60%),
          radial-gradient(at 30% 60%, #F43843 0%, transparent 40%),
          radial-gradient(at 70% 70%, #1270B7 0%, transparent 40%),
          #F43843
        `,
        backgroundSize: '150% 150%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
      }}>
        Ver información
      </button>
    </div>
  )
}
