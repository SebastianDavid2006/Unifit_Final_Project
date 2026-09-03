import { api } from '@/lib/api'
import {
  mapNivelActividadBackToFront, mapNivelActividadFrontToBack,
  mapObjetivosArrayBackToFront, mapObjetivosArrayFrontToBack,
  mapAntecedentesArrayBackToFront, mapAntecedentesArrayFrontToBack,
  mapDiasArrayBackToFront, mapDiasArrayFrontToBack,
} from './mapper'

export interface BackendValoracion {
  id_valoracion: string
  id_usuario: string
  id_creador: string
  fecha: string
  proxima_valoracion: string | null
  objetivos: string[]
  objetivo_detalle: string | null
  nivel_actividad: string
  tipo_antecedentes: string[]
  observaciones_antecedentes: string | null
  observaciones_finales: string | null
  dias_disponibles: string[]
  tipo: string
  activo: boolean
  usuario?: { id_usuario: string; primer_nombre: string; primer_apellido: string; documento: string }
  creador?: { id_usuario: string; primer_nombre: string; primer_apellido: string }
  datos_medicos?: { presion_arterial: string; edad_metabolica: number; agua_corporal: number; resistencia_muscular: number } | null
  medidas_corporales?: { peso: number; estatura: number; imc: number; grasa_corporal: number; masa_muscular: number; masa_magra: number; grasa_visceral: number } | null
}

export interface AssessmentItem {
  id: string
  num: number
  date: string
  next: string | null
  color: string
  type: string
  evaluador: string
  score: number
  routine: string
  nivelActividad: string
  objetivoTarjetas: string[]
  objetivoDetalle: string
  metrics: { label: string; value: string }[]
  estatura: string
  masaMagra: string
  grasaVisceral: string
  presionArterial: string
  edadMetabolica: string
  aguaCorporal: string
  resistenciaMuscular: string
  antecedentesSalud: string[]
  observacionesEntrenador: string
  diasDisponibles: string[]
  observacionesFinales: string
}

function formatScore(m: BackendValoracion): number {
  const med = m.medidas_corporales
  if (!med) return 50
  let score = 70
  if (med.imc >= 18.5 && med.imc <= 25) score += 10
  if (med.grasa_corporal < 25) score += 5
  if (med.masa_muscular > 30) score += 5
  const dm = m.datos_medicos
  if (dm && dm.resistencia_muscular > 30) score += 5
  return Math.min(score, 100)
}

function getColor(tipo: string): string {
  switch (tipo) {
    case 'actual': return '#1270B7'
    case 'inicial': return '#E63946'
    default: return '#FF9500'
  }
}

function mapBackendToFrontend(b: BackendValoracion, index: number): AssessmentItem {
  const med = b.medidas_corporales
  const dm = b.datos_medicos
  const evaluador = b.creador ? `${b.creador.primer_nombre} ${b.creador.primer_apellido}` : ''

  return {
    id: b.id_valoracion,
    num: index + 1,
    date: new Date(b.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    next: b.proxima_valoracion ? new Date(b.proxima_valoracion).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : null,
    color: getColor(b.tipo),
    type: b.tipo.charAt(0).toUpperCase() + b.tipo.slice(1),
    evaluador,
    score: formatScore(b),
    routine: '',
    nivelActividad: mapNivelActividadBackToFront(b.nivel_actividad),
    objetivoTarjetas: mapObjetivosArrayBackToFront(b.objetivos),
    objetivoDetalle: b.objetivo_detalle ?? '',
    metrics: med ? [
      { label: 'Peso', value: `${med.peso} kg` },
      { label: 'IMC', value: String(med.imc) },
      { label: 'Grasa Corporal', value: `${med.grasa_corporal}%` },
      { label: 'Masa Muscular', value: `${med.masa_muscular} kg` },
    ] : [],
    estatura: med ? `${med.estatura} m` : '',
    masaMagra: med ? `${med.masa_magra} kg` : '',
    grasaVisceral: med ? String(med.grasa_visceral) : '',
    presionArterial: dm?.presion_arterial ?? '',
    edadMetabolica: dm ? String(dm.edad_metabolica) : '',
    aguaCorporal: dm ? `${dm.agua_corporal}%` : '',
    resistenciaMuscular: dm ? `${dm.resistencia_muscular}` : '',
    antecedentesSalud: mapAntecedentesArrayBackToFront(b.tipo_antecedentes),
    observacionesEntrenador: b.observaciones_antecedentes ?? '',
    diasDisponibles: mapDiasArrayBackToFront(b.dias_disponibles),
    observacionesFinales: b.observaciones_finales ?? '',
  }
}

export async function getValoracionesPorUsuario(idUsuario: string): Promise<AssessmentItem[]> {
  const { data } = await api.get<BackendValoracion[]>(`/valoraciones/usuario/${idUsuario}`)
  return data.map((v, i) => mapBackendToFrontend(v, i))
}

export async function getValoraciones(): Promise<AssessmentItem[]> {
  const { data } = await api.get<BackendValoracion[]>('/valoraciones')
  return data.map((v, i) => mapBackendToFrontend(v, i))
}

export async function getValoracionPorId(id: string): Promise<AssessmentItem> {
  const { data } = await api.get<BackendValoracion>(`/valoraciones/${id}`)
  return mapBackendToFrontend(data, 0)
}

export interface CrearValoracionPayload {
  id_usuario: string
  nivel_actividad: string
  objetivos: string[]
  objetivo_detalle?: string
  tipo_antecedentes: string[]
  observaciones_antecedentes?: string
  observaciones_finales?: string
  dias_disponibles: string[]
  proxima_valoracion?: string
  medidas?: { peso: number; estatura: number; imc: number; grasa_corporal: number; masa_muscular: number; masa_magra: number; grasa_visceral: number }
  datos_medicos?: { presion_arterial: string; edad_metabolica: number; agua_corporal: number; resistencia_muscular: number }
}

export async function crearValoracion(form: {
  id_usuario: string
  nivelActividad: string
  objetivoTarjetas: string[]
  objetivoDetalle: string
  antecedentesSalud: string[]
  observacionesEntrenador: string
  diasDisponibles: string[]
  observacionesFinales: string
  peso: string; estatura: string; imc: string; grasaCorporal: string
  masaMuscular: string; masaMagra: string; grasaVisceral: string
  presionArterial: string; edadMetabolica: string; aguaCorporal: string; resistenciaMuscular: string
}) {
  const payload: CrearValoracionPayload = {
    id_usuario: form.id_usuario,
    nivel_actividad: mapNivelActividadFrontToBack(form.nivelActividad),
    objetivos: mapObjetivosArrayFrontToBack(form.objetivoTarjetas),
    objetivo_detalle: form.objetivoDetalle || undefined,
    tipo_antecedentes: mapAntecedentesArrayFrontToBack(form.antecedentesSalud),
    observaciones_antecedentes: form.observacionesEntrenador || undefined,
    observaciones_finales: form.observacionesFinales || undefined,
    dias_disponibles: mapDiasArrayFrontToBack(form.diasDisponibles),
  }

  if (form.peso) {
    payload.medidas = {
      peso: parseFloat(form.peso), estatura: parseFloat(form.estatura),
      imc: parseFloat(form.imc), grasa_corporal: parseFloat(form.grasaCorporal),
      masa_muscular: parseFloat(form.masaMuscular), masa_magra: parseFloat(form.masaMagra),
      grasa_visceral: parseFloat(form.grasaVisceral),
    }
  }

  if (form.presionArterial) {
    payload.datos_medicos = {
      presion_arterial: form.presionArterial,
      edad_metabolica: parseFloat(form.edadMetabolica),
      agua_corporal: parseFloat(form.aguaCorporal),
      resistencia_muscular: parseFloat(form.resistenciaMuscular),
    }
  }

  const { data } = await api.post('/valoraciones', payload)
  return data
}

export async function editarValoracion(id: string, form: Partial<CrearValoracionPayload>) {
  const { data } = await api.put(`/valoraciones/${id}`, form)
  return data
}

export async function desactivarValoracion(id: string) {
  await api.put(`/valoraciones/${id}/desactivar`)
}
