import { api } from '@/lib/api'
import type { AiRoutine, AiRoutineInput } from '@/modules/students/aiRoutineTypes'

export async function generarRutinaIA(input: AiRoutineInput): Promise<AiRoutine> {
  const { data } = await api.post<AiRoutine>('/rutinas/generar-ia', {
    nivelActividad: input.nivelActividad,
    objetivoTarjetas: input.objetivoTarjetas,
    objetivoDetalle: input.objetivoDetalle,
    peso: input.peso,
    estatura: input.estatura,
    imc: input.imc,
    grasaCorporal: input.grasaCorporal,
    masaMuscular: input.masaMuscular,
    presionArterial: input.presionArterial,
    resistenciaMuscular: input.resistenciaMuscular,
    antecedentesSalud: input.antecedentesSalud,
    observacionesEntrenador: input.observacionesEntrenador,
    diasDisponibles: input.diasDisponibles,
    observacionesFinales: input.observacionesFinales,
  })
  return data
}
