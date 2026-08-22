export type FlatKey = 'areas' | 'cargos'

export const FLAT_REGISTERED: Record<FlatKey, Record<string, number>> = {
  areas: {
    'Ingeniería': 212,
    'Ciencias de la Salud': 169,
    'Ciencias Sociales': 152,
    'Arte y Diseño': 127,
    'Administración': 102,
    'Otras': 85,
  },
  cargos: {
    'Estudiante': 720,
    'Egresado': 85,
    'Docente': 25,
    'Administrativo': 17,
  },
}
