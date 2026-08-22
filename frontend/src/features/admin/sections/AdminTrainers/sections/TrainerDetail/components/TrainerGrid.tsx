import { motion } from 'motion/react'
import DetailCard from '../../../components/DetailCard'
import FieldList from '../../../components/FieldList'
import { StudentCardView } from '@/assets/models/ui/objects/student_card/StudentCardModel'
import { TelephoneView } from '@/assets/models/ui/objects/telephone/TelephoneModel'
import { LockView } from '@/assets/models/ui/objects/lock/LockModel'
import { CalendarView } from '@/assets/models/ui/objects/calendar/CalendarModel'
import { StethoscopeView } from '@/assets/models/ui/objects/stethoscope/StethoscopeModel'
import { RED, BLUE } from '../../../data'
import { gymTenure } from '../../../data'
import coach2Gif from '@/assets/illustrations/characters/coach_2/animated/coach_2.gif'
import { BLUE_GRAD, GREEN_BLUE_GRAD, GREEN } from '../../../data'

interface TrainerGridProps {
  trainer: any
  onShowInfo: () => void
  onShowFingerprint: () => void
}

export function TrainerGrid({ trainer, onShowInfo, onShowFingerprint }: TrainerGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="w-full">
        <div className="grid gap-2 items-stretch" style={{ gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: '1fr 1fr 1fr' }}>
          <DetailCard gridColumn="1" gridRow="1" accent={RED} title="Información General" model={<StudentCardView />}>
            <FieldList fields={[
              { key: 'document', label: 'Documento', value: trainer.document },
              { key: 'birthDate', label: 'Fecha de nacimiento', value: trainer.birthDate },
              { key: 'gender', label: 'Género', value: trainer.gender },
            ]} />
          </DetailCard>

          <TrainerAvatarSection trainer={trainer} onShowInfo={onShowInfo} />

          {/* Tarjeta Identidad y Acceso */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] p-5"
            style={{
              gridColumn: '3',
              gridRow: '1',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: 28,
              padding: 20,
            }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(18,112,183,0.3)' }} />
              <p className="text-lg font-extrabold capitalize" style={{ color: '#0D1B2A' }}>Identidad y acceso</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {/* Box Huella */}
              <TrainerFingerprintBox trainer={trainer} onClick={onShowFingerprint} />
            </div>
          </motion.div>

          <DetailCard gridColumn="1" gridRow="2" accent={RED} title="Contacto" model={<TelephoneView />}>
            <FieldList fields={[
              { key: 'email', label: 'Email', value: trainer.email },
              { key: 'phone', label: 'Teléfono', value: trainer.phone },
              { key: 'contactName', label: 'Contacto de emergencia', value: trainer.contactName },
              { key: 'contactPhone', label: 'Tel. contacto', value: trainer.contactPhone },
            ]} labelMb={1} itemPb={8} />
          </DetailCard>

          <DetailCard gridColumn="3" gridRow="3" accent={BLUE} title="Acceso y permisos" model={<LockView />}>
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

          <DetailCard gridColumn="1" gridRow="3" accent={RED} title="Información Médica" model={<StethoscopeView />}>
            <FieldList fields={[
              { key: 'eps', label: 'EPS', value: trainer.eps },
              { key: 'bloodType', label: 'Grupo sanguíneo', value: trainer.bloodType },
            ]} />
          </DetailCard>

          <DetailCard gridColumn="3" gridRow="2" accent={BLUE} title="Fechas clave" model={<CalendarView />}>
            <FieldList fields={[
              { key: 'joinedAt', label: 'Miembro desde', value: trainer.joinedAt },
              { key: 'tenure', label: 'Tiempo en el gym', value: gymTenure(trainer.joinedAt) },
              { key: 'lastAccess', label: 'Último acceso', value: trainer.lastAccess },
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
      <img src={coach2Gif} alt="coach" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[680px] z-0 pointer-events-none" style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)' }} />
      <button onClick={onShowInfo} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-6 py-2.5 rounded-2xl text-sm font-bold text-white cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl" style={{
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

function TrainerFingerprintBox({ trainer, onClick }: { trainer: any; onClick: () => void }) {
  const GREEN = '#22C55E'
  const GREEN_BLUE_GRAD = 'linear-gradient(135deg, #22C55E, #1270B7)'
  
  return (
    <div className="rounded-xl p-3 flex flex-col" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'rgba(0,0,0,0.4)' }}>Huella digital</p>
        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: trainer.huella ? 'rgba(34,197,94,0.12)' : 'rgba(0,0,0,0.05)', color: trainer.huella ? GREEN : 'rgba(0,0,0,0.35)' }}>
          {trainer.huella ? 'Capturada ✓' : 'Sin capturar'}
        </span>
      </div>
      <div className="flex items-center justify-center py-1 mb-2">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={trainer.huella ? GREEN : 'rgba(0,0,0,0.15)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 18a4 4 0 0 1 8 0" />
          <path d="M12 18V6" />
          <path d="M16 18a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <button onClick={onClick} className="self-center inline-flex items-center gap-1.5 px-4 py-1.5 rounded-3xl text-[10px] font-bold text-white cursor-pointer" style={{ background: GREEN_BLUE_GRAD, boxShadow: '0 4px 12px rgba(18,112,183,0.25)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 18a4 4 0 0 1 8 0" />
          <path d="M12 18V6" />
          <path d="M16 18a4 4 0 0 1-8 0" />
        </svg> {trainer.huella ? 'Actualizar huella' : 'Capturar huella'}
      </button>
    </div>
  )
}