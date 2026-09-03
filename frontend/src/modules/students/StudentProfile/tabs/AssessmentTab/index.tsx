import { useIsMobile } from '@/shared/components/ui/use-mobile'

import { motion } from 'motion/react'
import { AssessmentDashboard } from './components/AssessmentDashboard'
import { AssessmentList } from './components/AssessmentList'
import type { Dispatch, SetStateAction } from 'react'
import type { AssessmentItem } from '@/services/valoracion.service'
import type { ValuationForm } from '@/modules/students/StudentProfileData'

interface Props {
  canCreateValuation: boolean
  pagedAssessments: AssessmentItem[]
  totalAssessments: number
  ultimaRutina: string
  proximaValoracion: string | null
  assessmentPage: number
  setAssessmentPage: Dispatch<SetStateAction<number>>
  assessmentTotalPages: number
  assessmentCurrentPage: number
  assessmentPageNumbers: number[]
  setValuationStep: Dispatch<SetStateAction<number>>
  setValuationSuccess: (v: boolean) => void
  setValuationViewMode: (v: boolean) => void
  setValuationForm: Dispatch<SetStateAction<ValuationForm>>
  setShowNewValuationModal: (v: boolean) => void
  setSelectedAssessment: (v: AssessmentItem) => void
  setShowAssessmentOptions: (v: boolean) => void
}

export function AssessmentTab({
  canCreateValuation,
  pagedAssessments,
  totalAssessments,
  ultimaRutina,
  proximaValoracion,
  setAssessmentPage,
  assessmentTotalPages,
  assessmentCurrentPage,
  assessmentPageNumbers,
  setValuationStep,
  setValuationSuccess,
  setValuationViewMode,
  setValuationForm,
  setShowNewValuationModal,
  setSelectedAssessment,
  setShowAssessmentOptions,
}: Props) {
  const isMobile = useIsMobile()
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`max-w-[1200px] mx-auto ${isMobile ? 'space-y-3 px-2' : 'space-y-4'}`}
    >
      <AssessmentDashboard
        canCreateValuation={canCreateValuation}
        totalAssessments={totalAssessments}
        ultimaRutina={ultimaRutina}
        proximaValoracion={proximaValoracion}
        setValuationStep={setValuationStep}
        setValuationSuccess={setValuationSuccess}
        setValuationViewMode={setValuationViewMode}
        setValuationForm={setValuationForm}
        setShowNewValuationModal={setShowNewValuationModal}
      />

      <AssessmentList
        pagedAssessments={pagedAssessments}
        totalAssessments={totalAssessments}
        setAssessmentPage={setAssessmentPage}
        assessmentTotalPages={assessmentTotalPages}
        assessmentCurrentPage={assessmentCurrentPage}
        assessmentPageNumbers={assessmentPageNumbers}
        setSelectedAssessment={setSelectedAssessment}
        setShowAssessmentOptions={setShowAssessmentOptions}
      />
    </motion.div>
  )
}
