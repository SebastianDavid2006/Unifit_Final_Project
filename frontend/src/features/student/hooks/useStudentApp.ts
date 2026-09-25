import { createContext, useContext, useState, ReactNode, useMemo, useEffect, createElement } from 'react'
import { Student, TodayWorkout, WeeklyProgress, MobileTab, StudentRoutine } from '@/features/student/types/student'
import { todayWorkout, weeklyProgress } from '@/features/student/utils/mockData.tsx'
import { getMiPerfil, type BackendUsuario } from '@/services/usuario.service'
import { getRutinasPorUsuario, type FrontendRutina } from '@/services/rutina.service'
import { getValoracionesPorUsuario, type AssessmentItem } from '@/services/valoracion.service'
import { mapDuracionBackToFront, mapNivelBackToFront, mapGrupoMuscularBackToFront } from '@/services/mapper'
import { getImageUrl } from '@/lib/config'

interface StudentAppContextType {
  student: Student | null
  tab: MobileTab
  setTab: (tab: MobileTab) => void
  todayWorkout: TodayWorkout
  weeklyProgress: WeeklyProgress[]
  studentRoutines: StudentRoutine[]
  assessments: AssessmentItem[]
  loadingRoutines: boolean
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

function mapBackendToStudentRoutine(r: FrontendRutina, index: number): StudentRoutine {
  const dias = [...new Set(r.ejercicios.map(e => e.dia_semana))]
  return {
    id: r.id,
    name: r.nombre,
    createdAt: r.fecha_creacion,
    duration: mapDuracionBackToFront(r.duracion) || '—',
    frequency: `${dias.length} ${dias.length === 1 ? 'día' : 'días'}/semana`,
    level: (mapNivelBackToFront(r.nivel) || 'Principiante') as StudentRoutine['level'],
    focus: '',
    current: index === 0,
    rows: r.ejercicios.map(e => ({
      name: e.nombre,
      sets: e.series != null ? String(e.series) : '',
      reps: e.repeticiones_min != null && e.repeticiones_max != null
        ? e.repeticiones_min === e.repeticiones_max
          ? String(e.repeticiones_min)
          : `${e.repeticiones_min}-${e.repeticiones_max}`
        : String(e.repeticiones_min ?? e.repeticiones_max ?? ''),
      rest: e.descanso != null ? `${e.descanso} s` : '',
      weight: '',
      muscle: e.grupos_musculares?.length ? mapGrupoMuscularBackToFront(e.grupos_musculares[0]) : 'General',
      groups: (e.grupos_musculares ?? []).map(mapGrupoMuscularBackToFront),
      instructions: e.observaciones || '',
      image: e.urlMultimedia ? getImageUrl(e.urlMultimedia) : '',
      machines: e.maquinas,
    })),
    assessmentNum: 0,
    progress: { completedSessions: 0, totalSessions: 0, adherence: 0, lastSession: null },
  }
}

export function StudentAppProvider(props: { children: ReactNode }) {
  const tab = useState<'home' | 'routines' | 'agenda' | 'profile'>('home')
  const workoutStarted = useState(false)
  const [student, setStudent] = useState<Student | null>(null)
  const [studentRoutines, setStudentRoutines] = useState<StudentRoutine[]>([])
  const [assessments, setAssessments] = useState<AssessmentItem[]>([])
  const [loadingRoutines, setLoadingRoutines] = useState(false)

  useEffect(() => {
    getMiPerfil()
      .then((u) => setStudent(mapBackendToStudent(u)))
      .catch(() => setStudent(null))
  }, [])

  useEffect(() => {
    if (!student?.id) return
    let active = true
    setLoadingRoutines(true)
    Promise.all([
      getRutinasPorUsuario(student.id),
      getValoracionesPorUsuario(student.id),
    ])
      .then(([rutinas, valoraciones]) => {
        if (!active) return
        setStudentRoutines(rutinas.map(mapBackendToStudentRoutine))
        setAssessments(valoraciones)
      })
      .catch(() => {
        if (!active) return
        setStudentRoutines([])
        setAssessments([])
      })
      .finally(() => {
        if (active) setLoadingRoutines(false)
      })
    return () => { active = false }
  }, [student?.id])

  const todayWorkoutData = useMemo(() => todayWorkout, [])
  const weeklyProgressData = useMemo(() => weeklyProgress, [])

  const value = useMemo(() => ({
    student,
    tab: tab[0],
    setTab: tab[1],
    todayWorkout: todayWorkoutData,
    weeklyProgress: weeklyProgressData,
    studentRoutines,
    assessments,
    loadingRoutines,
    workoutStarted: workoutStarted[0],
    setWorkoutStarted: workoutStarted[1],
  }), [student, tab[0], workoutStarted[0], studentRoutines, assessments, loadingRoutines])

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