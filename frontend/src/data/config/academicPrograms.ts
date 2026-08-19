export const INSTITUCIONES = ['Universitaria de Colombia', 'Universitaria de Bogotá']

export const NIVELES_FORMACION = ['Técnicos', 'Profesionales', 'Especializaciones', 'Pregrado']

export function getNiveles(institution: string): string[] {
  if (institution === 'Universitaria de Bogotá') {
    return ['Pregrado']
  }
  return ['Técnicos', 'Profesionales', 'Especializaciones']
}

const DEFAULT_PROGRAMS: Record<string, Record<string, string[]>> = {
  'Universitaria de Colombia': {
    'Técnicos': [
      'Auxiliar Administrativo',
      'Cocina Nacional e Internacional',
      'Auxiliar en Clínica Veterinaria',
      'Animación 2D y 3D',
      'Diseño Gráfico',
      'Auxiliar Contable y Financiero',
      'Investigadores Criminalísticos y Judiciales',
      'Auxiliar en Enfermería',
      'Seguridad Ocupacional',
      'Auxiliar en Productos Interactivos y Digitales',
      'Auxiliar de Talento Humano',
      'Diseño, Confección y Mercadeo de Modas',
      'Conocimientos Académicos en Inglés y Francés',
      'Operaciones de Software y Redes de Cómputo',
    ],
    'Profesionales': [
      'Administración de Empresas',
      'Contaduría Pública',
      'Ingeniería Industrial',
      'Ingeniería de Software',
      'Medicina Veterinaria y Zootecnia',
      'Arquitectura',
      'Derecho',
      'Ingeniería de Sistemas',
      'Psicología',
    ],
    'Especializaciones': [
      'Derecho Administrativo y Contractual',
      'Gerencia de Empresas',
      'Derecho Penal y Criminalística',
      'Gerencia del Talento Humano',
    ],
  },
  'Universitaria de Bogotá': {
    'Pregrado': [
      'Ingeniería Agropecuaria',
      'Ingeniería en Inteligencia Artificial y Ciencia de Datos',
      'Ingeniería en Ciberseguridad y Gestión de Riesgos Digitales',
      'Ingeniería Civil',
    ],
  },
}

const STORAGE_KEY = 'unifit_programas_academicos_v2'

export function loadPrograms(): Record<string, Record<string, string[]>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, Record<string, string[]>>
      const merged: Record<string, Record<string, string[]>> = {}
      INSTITUCIONES.forEach(inst => {
        merged[inst] = {}
        getNiveles(inst).forEach(level => {
          merged[inst][level] = Array.isArray(parsed[inst]?.[level]) ? parsed[inst][level] : DEFAULT_PROGRAMS[inst]?.[level] ?? []
        })
      })
      return merged
    }
  } catch { /* fallback to defaults */ }
  return JSON.parse(JSON.stringify(DEFAULT_PROGRAMS))
}

export function savePrograms(programs: Record<string, Record<string, string[]>>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(programs))
  } catch { /* storage unavailable */ }
}

export function getPrograms(institution: string, level: string): string[] {
  return loadPrograms()[institution]?.[level] ?? []
}

export function resetPrograms() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch { /* storage unavailable */ }
}
