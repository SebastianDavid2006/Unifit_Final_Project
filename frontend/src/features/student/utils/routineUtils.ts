import { AiRoutine } from '@/modules/students/aiRoutine'
import type { AssessmentItem } from '@/modules/students/StudentProfileData'
import { RoutineWithAssessment } from '@/features/student/types/student'

export function linkRoutineToAssessment(
  routine: AiRoutine,
  assessments: AssessmentItem[]
): AssessmentItem | undefined {
  return assessments.find(a => a.routine === routine.name)
}

export function buildRoutinesWithAssessments(
  routines: AiRoutine[],
  assessments: AssessmentItem[]
): RoutineWithAssessment[] {
  return routines.map(routine => {
    const assessment = linkRoutineToAssessment(routine, assessments)
    return {
      routine,
      assessment: assessment || assessments[0],
      progress: {
        completedSessions: Math.floor(Math.random() * 10),
        totalSessions: routine.rows.length,
        lastSession: null,
        adherence: Math.floor(Math.random() * 30) + 70,
      },
    }
  })
}

export function getAssessmentForRoutine(
  routineName: string,
  assessments: AssessmentItem[]
): AssessmentItem | undefined {
  return assessments.find(a => a.routine === routineName)
}

export function calculateAdherence(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

export function formatWeight(weight: string): string {
  const num = parseFloat(weight)
  return isNaN(num) ? weight : `${num} kg`
}