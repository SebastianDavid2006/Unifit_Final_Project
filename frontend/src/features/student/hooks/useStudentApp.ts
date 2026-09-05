import { createContext, useContext, useState, ReactNode, useMemo, useEffect, createElement } from 'react'
import { Student, TodayWorkout, WeeklyProgress, MobileTab } from '@/features/student/types/student'
import { todayWorkout, weeklyProgress } from '@/features/student/utils/mockData.tsx'
import { getMiPerfil, type BackendUsuario } from '@/services/usuario.service'

interface StudentAppContextType {
  student: Student | null
  tab: MobileTab
  setTab: (tab: MobileTab) => void
  todayWorkout: TodayWorkout
  weeklyProgress: WeeklyProgress[]
  routinesWithAssessment: any[]
  setRoutinesWithAssessment: (routines: any[]) => void
  workoutStarted: boolean
  setWorkoutStarted: (started: boolean) => void
}

const StudentAppContext = createContext<StudentAppContextType | undefined>(undefined)

function mapBackendToStudent(u: BackendUsuario): Student {
  const buildName = `${u.primer_nombre} ${u.segundo_nombre ?? ''} ${u.primer_apellido} ${u.segundo_apellido ?? ''}`.replace(/\s+/g, ' ').trim()
  const avatar = `${(u.primer_nombre ?? '')[0] ?? ''}${(u.primer_apellido ?? '')[0] ?? ''}`.toUpperCase()

  return {
    id: u.id_usuario,
    name: buildName,
    firstName: u.primer_nombre,
    lastName: u.primer_apellido,
    email: u.email_contacto,
    gender: 'F',
    avatar,
    goal: 'Sin definir',
    adherence: 0,
  }
}

export function StudentAppProvider(props: { children: ReactNode }) {
  const tab = useState<'home' | 'routines' | 'agenda' | 'profile'>('home')
  const workoutStarted = useState(false)
  const routinesWithAssessment = useState<any[]>([])
  const [student, setStudent] = useState<Student | null>(null)

  useEffect(() => {
    getMiPerfil()
      .then((u) => setStudent(mapBackendToStudent(u)))
      .catch(() => setStudent(null))
  }, [])

  const todayWorkoutData = useMemo(() => todayWorkout, [])
  const weeklyProgressData = useMemo(() => weeklyProgress, [])

  const value = useMemo(() => ({
    student,
    tab: tab[0],
    setTab: tab[1],
    todayWorkout: todayWorkoutData,
    weeklyProgress: weeklyProgressData,
    routinesWithAssessment: routinesWithAssessment[0],
    setRoutinesWithAssessment: routinesWithAssessment[1],
    workoutStarted: workoutStarted[0],
    setWorkoutStarted: workoutStarted[1],
  }), [student, tab[0], workoutStarted[0], routinesWithAssessment[0]])

  return createElement(
    StudentAppContext.Provider,
    { value: value },
    props.children
  )
}

export function useStudentApp() {
  const context = useContext(StudentAppContext)
  if (!context) {
    throw new Error('useStudentApp must be used within a StudentAppProvider')
  }
  return context
}