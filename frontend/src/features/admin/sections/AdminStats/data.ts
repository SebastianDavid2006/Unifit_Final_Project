import { INSTITUCIONES, getNiveles, getPrograms } from '@/data/config/academicPrograms'
import { CAREER_STATS } from '@/data/stats/careerStats'

export const BLUE = '#1270B7'
export const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #1A8CDB, #0D5F9E)'

export type CareerStat = (typeof CAREER_STATS)[number]

export const CAT_COLORS: Record<string, string> = {
  técnico: '#1270B7',
  profesional: '#30D158',
  especialización: '#BF5AF2',
}

export const NIVEL_OPTIONS = ['Técnico', 'Profesional', 'Especialización']
export const normalizeNivel = (cat: string) =>
  cat === 'técnico' ? 'Técnico' : cat === 'profesional' ? 'Profesional' : cat === 'especialización' ? 'Especialización' : cat

const programsByInstitution: Record<string, Set<string>> = {}
INSTITUCIONES.forEach(inst => {
  const s = new Set<string>()
  getNiveles(inst).forEach(lv => getPrograms(inst, lv).forEach(p => s.add(p)))
  programsByInstitution[inst] = s
})
export const institutionOf = (faculty: string) =>
  INSTITUCIONES.find(inst => programsByInstitution[inst]?.has(faculty)) ?? INSTITUCIONES[0]

export const PROGRAM_OPTIONS = [...new Set(
  INSTITUCIONES.flatMap(inst => getNiveles(inst).flatMap(lv => getPrograms(inst, lv))),
)]

export type EvolutionPoint = { mes: string; date: string; usuarios: number; asistencia: number }

export const evolutionData: EvolutionPoint[] = [
  { mes: 'Ene', date: '2026-01-15', usuarios: 380, asistencia: 2350 },
  { mes: 'Feb', date: '2026-02-15', usuarios: 415, asistencia: 2540 },
  { mes: 'Mar', date: '2026-03-15', usuarios: 450, asistencia: 2780 },
  { mes: 'Abr', date: '2026-04-15', usuarios: 495, asistencia: 3010 },
  { mes: 'May', date: '2026-05-15', usuarios: 545, asistencia: 3290 },
  { mes: 'Jun', date: '2026-06-15', usuarios: 595, asistencia: 3550 },
  { mes: 'Jul', date: '2026-07-15', usuarios: 660, asistencia: 3860 },
  { mes: 'Ago', date: '2026-08-15', usuarios: 720, asistencia: 4150 },
  { mes: 'Sep', date: '2026-09-15', usuarios: 775, asistencia: 4430 },
  { mes: 'Oct', date: '2026-10-15', usuarios: 805, asistencia: 4680 },
  { mes: 'Nov', date: '2026-11-15', usuarios: 830, asistencia: 4980 },
  { mes: 'Dic', date: '2026-12-15', usuarios: 847, asistencia: 5200 },
]

export type FilterCategory = 'institucion' | 'nivel' | 'programa'

export const FILTER_LABELS: Record<string, string> = {
  institucion: 'Institución',
  nivel: 'Nivel académico',
  programa: 'Programa',
}

export const FILTER_OPTIONS: Record<string, string[]> = {
  institucion: [...INSTITUCIONES],
  nivel: NIVEL_OPTIONS,
  programa: PROGRAM_OPTIONS,
}

export const emptyCareer = { faculty: '—', registered: 0, attendance: 0, color: BLUE }
