import { GeneralInfoCard } from './components/GeneralInfoCard'
import { ContactCard } from './components/ContactCard'
import { AcademicInfoCard } from './components/AcademicInfoCard'
import { StudentCenterSection } from './components/StudentCenterSection'
import { CurrentMetricsCard } from './components/CurrentMetricsCard'
import { PhysicalGoalCard } from './components/PhysicalGoalCard'
import { IdentityAccessCard } from '@/modules/students/components/IdentityAccessCard'
import type { Student } from '@/modules/students/StudentProfileData'

interface Props {
  student: Student
  imc: string
  onShowInfo: () => void
  onUpdate: (patch: Partial<Student>) => void
}

export function OverviewTab({ student, imc, onShowInfo, onUpdate }: Props) {
  return (
    <div className="grid gap-2 items-stretch" style={{ gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: 'auto auto auto' }}>
      <GeneralInfoCard student={student} />
      <StudentCenterSection student={student} onShowInfo={onShowInfo} />
      <IdentityAccessCard student={student} onUpdate={onUpdate} gridColumn="3" gridRow="1" />
      <ContactCard student={student} />
      <CurrentMetricsCard student={student} imc={imc} />
      <AcademicInfoCard student={student} />
      <PhysicalGoalCard student={student} />
    </div>
  )
}
