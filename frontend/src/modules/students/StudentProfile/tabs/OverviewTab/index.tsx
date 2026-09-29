import { GeneralInfoCard } from './components/GeneralInfoCard'
import { ContactCard } from './components/ContactCard'
import { AcademicInfoCard } from './components/AcademicInfoCard'
import { StudentCenterSection } from './components/StudentCenterSection'
import { CurrentMetricsCard } from './components/CurrentMetricsCard'
import { PhysicalGoalCard } from './components/PhysicalGoalCard'
import { AcudienteCard } from './components/AcudienteCard'
import { IdentityAccessCard } from '@/modules/students/components/IdentityAccessCard'
import type { Student } from '@/modules/students/StudentProfileData'
import { esEstudiante } from '@/modules/students/StudentProfileData'
import { useIsMobile } from '@/shared/components/ui/use-mobile'
import { useMemo } from 'react'
import { isMinor as isMinorHelper } from '@/lib/dateUtils'

interface Props {
  student: Student
  imc: string
  objetivo: string
  onShowInfo: () => void
  onUpdate: (patch: Partial<Student>) => void
}

export function OverviewTab({ student, imc, objetivo, onShowInfo, onUpdate }: Props) {
  const isMobile = useIsMobile()
  const esAlumno = esEstudiante(student)
  const mostrarAcudiente = useMemo(
    () => esAlumno && (isMinorHelper(student.birthDate) || Boolean(student.acudiente)),
    [esAlumno, student.birthDate, student.acudiente],
  )
  const mostrarObjetivo = useMemo(
    () => (student.valoraciones ?? 0) > 0 || Boolean(student.goal?.trim()),
    [student.valoraciones, student.goal],
  )

  if (isMobile) {
    return (
      <div className="space-y-4">
        <StudentCenterSection student={student} onShowInfo={onShowInfo} />
        {mostrarObjetivo && <PhysicalGoalCard student={student} />}
        {mostrarAcudiente && <AcudienteCard student={student} />}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:gap-2">
      <div className="grid gap-2 grid-cols-1 lg:grid-cols-3 lg:grid-rows-3 lg:grid-flow-dense">
        {mostrarAcudiente ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:col-start-1 lg:row-start-1">
            <GeneralInfoCard student={student} />
            <AcudienteCard student={student} />
          </div>
        ) : (
          <GeneralInfoCard student={student} className="lg:col-start-1 lg:row-start-1" />
        )}
        <ContactCard student={student} className="lg:col-start-1 lg:row-start-2" />
        <AcademicInfoCard student={student} className="lg:col-start-1 lg:row-start-3" />

        <StudentCenterSection student={student} onShowInfo={onShowInfo} className="lg:col-start-2 lg:row-start-1 lg:row-span-3" />

        <IdentityAccessCard student={student} onUpdate={onUpdate} className="lg:col-start-3 lg:row-start-1" />
        <CurrentMetricsCard student={student} imc={imc} className="lg:col-start-3 lg:row-start-2" />
        {mostrarObjetivo && <PhysicalGoalCard student={student} objetivo={objetivo} className="lg:col-start-3 lg:row-start-3" />}
      </div>
    </div>
  )
}
