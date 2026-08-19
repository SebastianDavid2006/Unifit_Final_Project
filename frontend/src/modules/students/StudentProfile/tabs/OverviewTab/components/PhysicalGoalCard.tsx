import { TrophyView } from '@/assets/models/ui/objects/trophy/TrophyModel'
import type { Student } from '@/modules/students/StudentProfileData'

interface PhysicalGoalCardProps {
  student: Student
}

export function PhysicalGoalCard({ student }: PhysicalGoalCardProps) {
  return (
    <div className="rounded-[28px] p-5 relative overflow-hidden cursor-default" style={{ gridColumn: '3', gridRow: '3', background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,185,0,0.05), rgba(255,215,0,0.08))' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(110deg, transparent 25%, rgba(255,215,0,0.15) 37%, rgba(255,255,255,0.4) 50%, rgba(255,215,0,0.15) 63%, transparent 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s ease-in-out infinite',
      }} />
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(212,175,55,0.5)' }} />
          <div className="w-8 h-8 flex-shrink-0"><TrophyView /></div>
          <p className="text-lg font-extrabold capitalize" style={{ color: '#B8860B' }}>Objetivo físico</p>
        </div>
        <div className="rounded-2xl p-4" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <p className="text-sm font-bold leading-relaxed" style={{ color: '#B8860B' }}>{student.goal}</p>
        </div>
      </div>
    </div>
  )
}
