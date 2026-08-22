import { motion } from 'motion/react'
import type { Student } from '@/modules/students/StudentProfileData'
import { useIsMobile } from '@/shared/components/ui/use-mobile'

interface StudentCenterSectionProps {
  student: Student
  onShowInfo: () => void
  className?: string
}

export function StudentCenterSection({ student, onShowInfo, className = '' }: StudentCenterSectionProps) {
  const isMobile = useIsMobile()
  return (
    <div className={`relative ${className}`} style={{ height: '100%', overflow: 'visible' }}>
      {!isMobile ? (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 24, position: 'relative' }}>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-lg mb-4 relative z-10"
            style={{
              background: student.risk === 'high'
                ? 'linear-gradient(135deg, #FF3B30, #D32F2F)'
                : student.risk === 'medium'
                ? 'linear-gradient(135deg, #FF9500, #E68600)'
                : 'linear-gradient(135deg, #30D158, #20A040)',
              fontSize: 26,
            }}
          >
            {student.avatar}
          </div>
          <h2 className="text-[#0D1B2A] text-2xl font-bold text-center mb-6 relative z-10">
            {[student.firstName, student.secondName, student.lastName, student.secondLastName].filter(Boolean).join(' ')}
          </h2>
          <div className="absolute left-0 right-0 top-0 bottom-0 z-0 pointer-events-none" style={{ marginTop: 120, marginBottom: 90 }}>
            <video
              src="/student-body.webm"
              autoPlay loop muted playsInline preload="auto"
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: 'contain',
                filter: 'saturate(1.1)',
                maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onShowInfo}
            className="relative z-10 mt-auto mb-16 px-6 py-2.5 rounded-2xl text-sm font-bold text-white cursor-pointer transition-all duration-200 hover:shadow-xl"
            style={{
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
            }}
          >
            Ver información
          </motion.button>
        </div>
      ) : (
        <div className="flex flex-col items-center" style={{ paddingTop: 16 }}>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-lg mb-3 relative z-10"
            style={{
              background: student.risk === 'high'
                ? 'linear-gradient(135deg, #FF3B30, #D32F2F)'
                : student.risk === 'medium'
                ? 'linear-gradient(135deg, #FF9500, #E68600)'
                : 'linear-gradient(135deg, #30D158, #20A040)',
              fontSize: 26,
            }}
          >
            {student.avatar}
          </div>
          <h2 className="text-[#0D1B2A] text-2xl font-bold text-center mb-2 relative z-10">
            {[student.firstName, student.secondName, student.lastName, student.secondLastName].filter(Boolean).join(' ')}
          </h2>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onShowInfo}
            className="mt-4 w-full max-w-xs px-6 py-2.5 rounded-2xl text-sm font-bold text-white cursor-pointer transition-all duration-200 hover:shadow-xl"
            style={{
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
            }}
          >
            Ver información
          </motion.button>
        </div>
      )}
    </div>
  )
}
