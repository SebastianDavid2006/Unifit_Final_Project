import { Building2, Briefcase, type LucideIcon } from 'lucide-react'
import type { ConfigKey } from '@/data/config/systemConfig'
import { BLUE } from './fields'

export type ApartadoConfig = {
  key: ConfigKey
  icon: LucideIcon
  title: string
  singular: string
  subtitle: string
  color: string
}

export const APARTADOS: ApartadoConfig[] = [
  {
    key: 'areas',
    icon: Building2,
    title: 'Áreas',
    singular: 'área',
    subtitle: 'Áreas de conocimiento o facultades',
    color: BLUE,
  },
  {
    key: 'cargos',
    icon: Briefcase,
    title: 'Cargos',
    singular: 'cargo',
    subtitle: 'Roles laborales dentro de la institución',
    color: BLUE,
  },
]
