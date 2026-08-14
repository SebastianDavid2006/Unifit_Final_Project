import type { Trainer } from '@/data/trainers'
import DetailCard from '../components/DetailCard'
import FieldList from '../components/FieldList'
import { BLUE, RED } from '../data'

export default function TrainerDetail({ trainer }: { trainer: Trainer }) {
  return (
    <div className="p-8 pt-12 max-w-[1440px] mx-auto flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        <div className="grid gap-2 items-start" style={{ gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: 'auto auto auto' }}>
          <DetailCard gridColumn="1" gridRow="1" accent={RED} title="Información General">
            <FieldList fields={[
              { label: 'ID', value: `#${trainer.id}` },
              { label: 'Cargo', value: trainer.role === 'admin' ? 'Administrador' : 'Entrenador' },
              { label: 'Estado', value: trainer.status === 'active' ? 'Activo' : 'Inactivo' },
              { label: 'Ingresó', value: trainer.joinedAt },
            ]} />
          </DetailCard>

          <div className="flex flex-col items-center relative" style={{ gridColumn: '2', gridRow: '1 / 4', paddingTop: 16, alignSelf: 'stretch', overflow: 'visible' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-lg mb-3 relative z-10" style={{
              background: trainer.status === 'active' ? 'linear-gradient(135deg, #30D158, #20A040)' : 'linear-gradient(135deg, #8E8E93, #636366)',
              fontSize: 26,
            }}>
              {trainer.avatar}
            </div>
            <h2 className="text-[#0D1B2A] text-2xl font-bold text-center mb-2 relative z-10">{trainer.name}</h2>
            <p className="text-sm font-medium text-center relative z-10" style={{ color: 'rgba(0,0,0,0.4)' }}>{trainer.speciality}</p>
          </div>

          <DetailCard gridColumn="3" gridRow="1" accent={BLUE} title="Rendimiento">
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0" style={{ width: 96, height: 96 }}>
                <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                  <defs>
                    <linearGradient id="trainerScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#30D158" />
                      <stop offset="100%" stopColor="#00C7BE" />
                    </linearGradient>
                  </defs>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2.8" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#trainerScoreGrad)" strokeWidth="2.8" strokeLinecap="round" strokeDasharray={`${trainer.rating * 0.999} ${100 - trainer.rating * 0.999}`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-2xl font-extrabold" style={{ background: 'linear-gradient(90deg, #30D158, #00C7BE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{trainer.rating}%</p>
                </div>
              </div>
              <div className="flex flex-col flex-1 gap-3">
                {[
                  { label: 'Efectividad', value: trainer.rating, gradient: 'linear-gradient(90deg, #30D158, #00C7BE)' },
                  { label: 'Retención', value: Math.min(100, trainer.rating + 3), gradient: 'linear-gradient(90deg, #FF9500, #FFCC02)' },
                  { label: 'Carga laboral', value: Math.min(100, trainer.students * 3 + 10), gradient: 'linear-gradient(90deg, #FF6B8A, #FF375F)' },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] font-semibold" style={{ color: 'rgba(0,0,0,0.5)' }}>{m.label}</p>
                      <p className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>{m.value}%</p>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: 'rgba(0,0,0,0.05)' }}>
                      <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.gradient }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DetailCard>

          <DetailCard gridColumn="1" gridRow="2" accent={RED} title="Contacto">
            <FieldList fields={[
              { label: 'Email', value: trainer.email },
              { label: 'Teléfono', value: trainer.phone },
            ]} labelMb={1} itemPb={8} />
          </DetailCard>

          <DetailCard gridColumn="3" gridRow="2" accent={BLUE} title="Estadísticas">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Estudiantes', value: `${trainer.students}` },
                { label: 'Horario', value: trainer.schedule },
                { label: 'Antigüedad', value: trainer.joinedAt },
                { label: 'Evaluación', value: `${trainer.rating}/100` },
              ].map(m => (
                <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.02)' }}>
                  <p className="text-sm font-extrabold" style={{ color: '#0D1B2A' }}>{m.value}</p>
                  <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(0,0,0,0.35)' }}>{m.label}</p>
                </div>
              ))}
            </div>
          </DetailCard>

          <DetailCard gridColumn="1" gridRow="3" accent={RED} title="Horario">
            <FieldList fields={[
              { label: 'Jornada', value: trainer.schedule },
              { label: 'Días laborales', value: trainer.schedule.split(' ')[0] },
            ]} />
          </DetailCard>

          <div className="rounded-[28px] p-5 relative overflow-hidden transition-transform duration-200 hover:scale-[1.02]" style={{ gridColumn: '3', gridRow: '3', background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,185,0,0.05), rgba(255,215,0,0.08))' }}>
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'linear-gradient(110deg, transparent 25%, rgba(255,215,0,0.15) 37%, rgba(255,255,255,0.4) 50%, rgba(255,215,0,0.15) 63%, transparent 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s ease-in-out infinite',
            }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(212,175,55,0.5)' }} />
                <p className="text-lg font-extrabold capitalize" style={{ color: '#B8860B' }}>Certificaciones</p>
              </div>
              <div className="space-y-2">
                {trainer.certifications.map((cert, i) => (
                  <div key={i} className="rounded-2xl p-3" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <p className="text-sm font-bold" style={{ color: '#B8860B' }}>{cert}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
