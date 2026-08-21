import { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { Student, TodayWorkout, CoachMessage, UpcomingSession, BodyComposition, NextSession, WeeklyProgress, Achievement, RankingItem, StatsCard, MobileTab } from '@/features/student/types/student'
import { mockStudent, todayWorkout, weeklyProgress, achievements, ranking, coachMessage, upcomingSessions, bodyComposition, statsCards, nextSessions } from '@/features/student/utils/mockData.tsx'

interface StudentAppContextType {
  student: Student
  tab: MobileTab
  setTab: (tab: MobileTab) => void
  todayWorkout: TodayWorkout
  weeklyProgress: WeeklyProgress[]
  achievements: Achievement[]
  ranking: RankingItem[]
  coachMessage: CoachMessage
  upcomingSessions: UpcomingSession[]
  bodyComposition: BodyComposition[]
  statsCards: StatsCard[]
  nextSessions: NextSession[]
  routinesWithAssessment: any[]
  setRoutinesWithAssessment: (routines: any[]) => void
  workoutStarted: boolean
  setWorkoutStarted: (started: boolean) => void
}

const StudentAppContext = createContext<StudentAppContextType | undefined>(undefined)

export function StudentAppProvider(props: { children: ReactNode }) {
  const tab = useState<'home' | 'routines' | 'agenda' | 'profile'>('home')
  const workoutStarted = useState(false)
  const routinesWithAssessment = useState<any[]>([])

  const student = useMemo(() => mockStudent, [])
  const todayWorkoutData = useMemo(() => todayWorkout, [])
  const weeklyProgressData = useMemo(() => weeklyProgress, [])
  const achievementsData = useMemo(() => achievements, [])
  const rankingData = useMemo(() => ranking, [])
  const coachMessageData = useMemo(() => coachMessage, [])
  const upcomingSessionsData = useMemo(() => upcomingSessions, [])
  const bodyCompositionData = useMemo(() => bodyComposition, [])
  const statsCardsData = useMemo(() => statsCards, [])
  const nextSessionsData = useMemo(() => nextSessions, [])

  const value = useMemo(() => ({
    student: student[0],
    tab: tab[0],
    setTab: tab[1],
    todayWorkout: todayWorkoutData[0],
    weeklyProgress: weeklyProgressData[0],
    achievements: achievementsData[0],
    ranking: rankingData[0],
    coachMessage: coachMessageData[0],
    upcomingSessions: upcomingSessionsData[0],
    bodyComposition: bodyCompositionData[0],
    statsCards: statsCardsData[0],
    nextSessions: nextSessionsData[0],
    routinesWithAssessment: routinesWithAssessment[0],
    setRoutinesWithAssessment: routinesWithAssessment[1],
    workoutStarted: workoutStarted[0],
    setWorkoutStarted: workoutStarted[1],
  }), [tab[0], workoutStarted[0], routinesWithAssessment[0]])

  return React.createElement(
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