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
    <div className="grid gap-4 sm:gap-2">
      <div className="grid gap-2 grid-cols-1 lg:grid-cols-3 lg:grid-rows-3 lg:grid-flow-dense">
        <GeneralInfoCard student={student} />
        <StudentCenterSection student={student} onShowInfo={onShowInfo} className="lg:col-span-2 lg:row-span-2" />
        <IdentityAccessCard student={student} onUpdate={onUpdate} className="lg:col-start-3 lg:row-start-1" />
        <ContactCard student={student} className="lg:row-start-3" />
        <CurrentMetricsCard student={student} imc={imc} className="lg:col-start-2 lg:row-start-3" />
        <AcademicInfoCard student={student} className="lg:col-start-3 lg:row-start-2" />
        <PhysicalGoalCard student={student} className="lg:col-start-3 lg:row-start-3" />
      </div>
    </div>
  )
}
