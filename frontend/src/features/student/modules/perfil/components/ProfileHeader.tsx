import type { Student } from '@/features/student/types/student'
import { GradientBorder, AMBER, GREEN } from '@/features/student/components/ui/fitness'
import { personalSections } from '../profileData'
import studentBoy from '@/assets/illustrations/characters/students/student_boy.webp'
import studentGirl from '@/assets/illustrations/characters/students/student_girl.webp'

interface ProfileHeaderProps {
  student: Student
}

export function ProfileHeader({ student }: ProfileHeaderProps) {
  const defaultPhoto = student.gender === 'M' ? studentBoy : studentGirl

  return (
    <GradientBorder radius={24}>
      <div className="relative overflow-hidden rounded-[23px]">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 120% at 100% 0%, rgba(230,57,70,0.2), transparent 55%), radial-gradient(70% 100% at 0% 100%, rgba(245,166,35,0.1), transparent 60%)' }} />
        <div className="relative flex flex-col sm:flex-row items-center gap-5 p-6 md:p-8">
          <div className="relative flex-shrink-0">
            <img
              src={defaultPhoto}
              alt={student.firstName}
              className="w-28 h-28 rounded-3xl object-cover object-top"
              style={{ border: '2px solid rgba(255,255,255,0.15)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
            />
          </div>

          <div className="text-center sm:text-left min-w-0">
            <h2 className="uppercase italic font-black text-white leading-tight" style={{ fontSize: 'clamp(20px, 3vw, 26px)' }}>{student.name}</h2>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 12.5, marginTop: 4 }}>
              {(() => {
                const acad = personalSections.find(s => s.title === 'Información académica')?.items || []
                return `${acad.find(p => p.label === 'Carrera')?.value} · Semestre ${acad.find(p => p.label === 'Semestre')?.value}`
              })()}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(48,209,88,0.1)', border: '1px solid rgba(48,209,88,0.25)', color: GREEN, fontSize: 10.5 }}>
                Objetivo: {student.goal}
              </span>
              <span className="px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.22)', color: AMBER, fontSize: 10.5 }}>
                Adherencia {student.adherence}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </GradientBorder>
  )
}
