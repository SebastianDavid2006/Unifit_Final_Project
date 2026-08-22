import { StudentCenterSection } from './components/StudentCenterSection'
import { PhysicalGoalCard } from './components/PhysicalGoalCard'
import { IdentityAccessCard } from '@/modules/students/components/IdentityAccessCard'
import { CurrentMetricsCard } from './components/CurrentMetricsCard'
import type { Student } from '@/modules/students/StudentProfileData'
import { useIsMobile } from '@/shared/components/ui/use-mobile'

interface Props {
  student: Student
  imc: string
  onShowInfo: () => void
  onUpdate: (patch: Partial<Student>) => void
}

export function OverviewTab({ student, imc, onShowInfo, onUpdate }: Props) {
  const isMobile = useIsMobile()
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        <StudentCenterSection student={student} onShowInfo={onShowInfo} />
        <PhysicalGoalCard student={student} />
      </div>
    )
  }
  
  return (
    <div className="grid gap-4 sm:gap-2">
      <div className="grid gap-2 grid-cols-1 lg:grid-cols-3 lg:grid-rows-3 lg:grid-flow-dense">
        <StudentCenterSection student={student} onShowInfo={onShowInfo} className="lg:col-start-2 lg:row-start-1 lg:row-span-3" />
        
        <IdentityAccessCard student={student} onUpdate={onUpdate} className="lg:col-start-3 lg:row-start-1" />
        <CurrentMetricsCard student={student} imc={imc} className="lg:col-start-3 lg:row-start-2" />
        <PhysicalGoalCard student={student} className="lg:col-start-3 lg:row-start-3" />
      </div>
    </div>
  )
}
