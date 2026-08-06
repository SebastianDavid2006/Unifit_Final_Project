export type ConfigKey = 'areas' | 'cargos'

const STORAGE_KEYS: Record<ConfigKey, string> = {
  areas: 'unifit_config_areas_v1',
  cargos: 'unifit_config_cargos_v1',
}

const DEFAULT: Record<ConfigKey, string[]> = {
  areas: ['Ingeniería', 'Ciencias de la Salud', 'Ciencias Sociales', 'Arte y Diseño', 'Administración', 'Otras'],
  cargos: ['Estudiante', 'Egresado', 'Docente', 'Administrativo'],
}

export function loadConfigItems(key: ConfigKey): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[key])
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.every(i => typeof i === 'string')) {
        return parsed
      }
    }
  } catch { /* fallback to defaults */ }
  return [...DEFAULT[key]]
}

export function saveConfigItems(key: ConfigKey, items: string[]) {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(items))
  } catch { /* storage unavailable */ }
}

export function resetConfigItems(key: ConfigKey) {
  try {
    localStorage.removeItem(STORAGE_KEYS[key])
  } catch { /* storage unavailable */ }
}
