import { Activity, BarChart2, Calendar, FileText, Target, Dumbbell, Trophy, User, Flame, Zap, Heart, Star } from 'lucide-react'
import { AiRoutine, RoutineRow } from '@/modules/students/aiRoutineTypes'
import type { Student as ProfileStudent, AssessmentItem, ValuationForm } from '@/modules/students/StudentProfileData'

export interface Student {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  gender: 'M' | 'F'
  avatar: string
  goal: string
  risk: 'low' | 'medium' | 'high'
  adherence: number
}

export interface RoutineWithAssessment {
  routine: AiRoutine
  assessment: AssessmentItem
  progress: {
    completedSessions: number
    totalSessions: number
    lastSession: string | null
    adherence: number
  }
}

export interface Achievement {
  name: string
  icon: React.ReactNode
  unlocked: boolean
  description: string
  color: string
}

export interface WeeklyProgress {
  day: string
  done: boolean
}

export interface RankingItem {
  position: number
  name: string
  faculty: string
  score: number
  isUser?: boolean
}

export interface TodayWorkout {
  name: string
  duration: string
  exercises: number
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  completed: number
  exercises_list: {
    name: string
    sets: string
    done: boolean
  }[]
}

export type MobileTab = 'home' | 'routines' | 'agenda' | 'profile'

export interface CoachMessage {
  text: string
  highlight?: string
  highlightColor?: string
}

export interface UpcomingSession {
  name: string
  date: string
}

export interface BodyComposition {
  label: string
  value: string
  change: string
  color: string
}

export interface StatsCard {
  label: string
  value: string
  icon: React.ReactNode
  color: string
}

export interface NextSession {
  name: string
  date: string
}

export interface ExerciseRow {
  name: string
  sets: string
  reps: string
  rest: string
  weight: string
  muscle: string
  secondaryMuscle?: string
  level?: string
  instructions: string
}

export interface RoutineProgress {
  completedSessions: number
  totalSessions: number
  adherence: number
  lastSession: string | null
}

export interface StudentRoutine {
  id: string
  name: string
  duration: string
  frequency: string
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  focus: string
  current?: boolean
  rows: ExerciseRow[]
  assessmentNum: number
  progress: RoutineProgress
}

export interface AgendaSlot {
  time: string
  taken: boolean
}

export interface DayAvailability {
  date: Date
  isHoliday: boolean
  holidayName?: string
  isCoachDay: boolean
  slots: AgendaSlot[]
}