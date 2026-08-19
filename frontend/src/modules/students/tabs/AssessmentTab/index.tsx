import { motion } from 'motion/react'
import { AssessmentDashboard } from './components/AssessmentDashboard'
import { AssessmentList } from './components/AssessmentList'
import type { Dispatch, SetStateAction } from 'react'
import { assessmentItems } from '@/modules/students/StudentProfileData'
import type { ValuationForm } from '@/modules/students/StudentProfileData'

type AssessmentItem = (typeof assessmentItems)[number]

interface Props {
  canCreateValuation: boolean
  pagedAssessments: AssessmentItem[]
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-[1200px] mx-auto space-y-4"
    >
      <AssessmentDashboard
        canCreateValuation={canCreateValuation}
        setValuationStep={setValuationStep}
        setValuationSuccess={setValuationSuccess}
        setValuationViewMode={setValuationViewMode}
        setValuationForm={setValuationForm}
        setShowNewValuationModal={setShowNewValuationModal}
      />

      <AssessmentList
        pagedAssessments={pagedAssessments}
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
