export type YesNo = 'si' | 'no'

export interface ParqDetail {
  id: string
  label: string
  placeholder?: string
}

export interface ParqQuestion {
  id: string
  kind: 'general' | 'gate' | 'sub'
  text: string
  note?: string
  detail?: ParqDetail
}

export interface ParqBlock {
  id: string
  title: string
  gate: ParqQuestion
  subs: ParqQuestion[]
}

export type ParqStepKind = 'general' | 'gate' | 'sub' | 'info-rec' | 'info-delay' | 'declaration'

export interface ParqStep {
  id: string
  kind: ParqStepKind
}

export const PARQ_GENERAL: ParqQuestion[] = [
  {
    id: 'g1',
    kind: 'general',
    text: '¿Alguna vez su médico le ha comunicado que tiene problemas cardíacos o hipertensión arterial?',
  },
  {
    id: 'g2',
    kind: 'general',
    text: '¿Siente usted dolor en el pecho en reposo, durante las actividades de la vida diaria O cuando realiza actividad física?',
  },
  {
    id: 'g3',
    kind: 'general',
    text: '¿Tiene usted problemas de equilibrio debido a mareos O ha sufrido pérdida de consciencia en los últimos 12 meses?',
    note: 'Por favor conteste NO si el mareo fue debido a una sobre hiperventilación (incluso durante el ejercicio vigoroso/intenso).',
  },
  {
    id: 'g4',
    kind: 'general',
    text: '¿Alguna vez le diagnosticaron otra enfermedad crónica (sin ser enfermedad cardíaca o hipertensión arterial)?',
    detail: { id: 'd_g4', label: 'PRECÍSELO POR FAVOR:', placeholder: 'Escriba la enfermedad crónica diagnosticada' },
  },
  {
    id: 'g5',
    kind: 'general',
    text: '¿Está usted tomando actualmente medicación para alguna enfermedad crónica?',
    detail: {
      id: 'd_g5',
      label: 'POR FAVOR DETALLE LAS ENFERMEDAD/ES Y LA MEDICACIÓN ASOCIADA A ELLA/S:',
      placeholder: 'Escriba la(s) enfermedad(es) y la(s) medicación(es)',
    },
  },
  {
    id: 'g6',
    kind: 'general',
    text: '¿Sufre usted actualmente (o ha sufrido en los últimos 12 meses) alguna lesión ósea, articular o de tejidos blandos (muscular, ligamentosa o tendinosa) que empeoraría al hacerse usted físicamente más activo?',
    note: 'Por favor, responda NO si tuvo algún problema en el pasado, pero que no limita su capacidad actual de estar físicamente activo.',
    detail: { id: 'd_g6', label: 'PRECÍSELO POR FAVOR:', placeholder: 'Describa la lesión' },
  },
  {
    id: 'g7',
    kind: 'general',
    text: '¿Alguna vez su médico le ha dicho que solo debe realizar actividad física bajo supervisión médica?',
  },
]

export const PARQ_BLOCKS: ParqBlock[] = [
  {
    id: 'b1',
    title: 'Artritis, Osteoporosis o Problemas de Columna',
    gate: {
      id: '1',
      kind: 'gate',
      text: '¿Sufre usted de artritis, osteoporosis o problemas de columna?',
    },
    subs: [
      {
        id: '1a',
        kind: 'sub',
        text: '¿Tiene problemas articulares dolorosos, fractura reciente o una fractura a causa de osteoporosis o cáncer, desplazamientos vertebrales (ej. espondilolistesis) y/o espondilolisis/defecto en la porción interarticular?',
      },
      {
        id: '1b',
        kind: 'sub',
        text: '¿Ha recibido tratamiento con corticoides inyectables o vía oral regularmente durante más de tres meses?',
      },
      {
        id: '1c',
        kind: 'sub',
        text: '¿Tiene dificultades para controlar los síntomas con medicación u otro tratamiento indicado por su médico?',
        note: 'Conteste NO si estos problemas no están siendo tratados con fármacos u otros medios.',
      },
    ],
  },
  {
    id: 'b2',
    title: 'Cáncer',
    gate: {
      id: '2',
      kind: 'gate',
      text: '¿Padece usted algún tipo de cáncer?',
    },
    subs: [
      {
        id: '2a',
        kind: 'sub',
        text: '¿Su diagnóstico de cáncer incluye algunos de estos cánceres: pulmonar/broncógeno, mieloma múltiple (cáncer de células plasmáticas), cabeza y/o cuello?',
      },
      {
        id: '2b',
        kind: 'sub',
        text: '¿Se encuentra actualmente en tratamiento con radioterapia o quimioterapia?',
      },
    ],
  },
  {
    id: 'b3',
    title: 'Enfermedad Cardiovascular o Cardíaca',
    gate: {
      id: '3',
      kind: 'gate',
      text: '¿Padece usted alguna enfermedad cardiovascular o cardíaca?',
      note: 'Esto incluye enfermedad coronaria, insuficiencia cardíaca, arritmias significativas.',
    },
    subs: [
      {
        id: '3a',
        kind: 'sub',
        text: '¿Tiene dificultades para controlar los síntomas con medicación u otro tratamiento indicado por su médico?',
        note: 'Conteste NO si estos problemas no están siendo tratados con fármacos u otros medios.',
      },
      {
        id: '3b',
        kind: 'sub',
        text: '¿Sufre de arritmia que requiere tratamiento médico?',
        note: 'Ej. fibrilación auricular, extrasístoles ventriculares.',
      },
      {
        id: '3c',
        kind: 'sub',
        text: '¿Sufre de insuficiencia cardíaca crónica?',
      },
      {
        id: '3d',
        kind: 'sub',
        text: '¿Le han diagnosticado una enfermedad coronaria (cardiovascular) y hace 2 meses o más que no participa en actividades físicas frecuentes?',
      },
    ],
  },
  {
    id: 'b4',
    title: 'Hipertensión Arterial',
    gate: {
      id: '4',
      kind: 'gate',
      text: '¿Tiene usted hipertensión arterial?',
    },
    subs: [
      {
        id: '4a',
        kind: 'sub',
        text: '¿Su presión arterial en reposo es igual o superior a 160/90 mmHg, con o sin medicación?',
        note: 'Conteste SI si desconoce su presión arterial de reposo.',
      },
      {
        id: '4b',
        kind: 'sub',
        text: '¿Tiene dificultades para controlar los síntomas con medicación u otro tratamiento indicado por su médico?',
        note: 'Conteste NO si estos problemas no están siendo tratados con fármacos u otros medios.',
      },
    ],
  },
  {
    id: 'b5',
    title: 'Enfermedad Metabólica',
    gate: {
      id: '5',
      kind: 'gate',
      text: '¿Tiene usted alguna enfermedad metabólica?',
      note: 'Esto incluye Diabetes tipo 1, Diabetes tipo 2, prediabetes.',
    },
    subs: [
      {
        id: '5a',
        kind: 'sub',
        text: '¿Tiene dificultades para mantener los niveles de glucosa en la sangre con la alimentación, fármacos u otro procedimiento indicado por su médico?',
      },
      {
        id: '5b',
        kind: 'sub',
        text: '¿Sufre con frecuencia de bajos niveles de glucosa en la sangre (hipoglicemia) después del ejercicio y/o durante las actividades de la vida diaria?',
        note: 'Los signos de hipoglicemia incluyen temblores, nerviosismo, irritabilidad, excesiva sudoración, mareos, confusión, dificultad para hablar, astenia física o somnolencia.',
      },
      {
        id: '5c',
        kind: 'sub',
        text: '¿Tiene signos o síntomas de complicaciones de la diabetes tales como enfermedad cardíaca o vascular y/o complicaciones que afecten a los riñones, los ojos o la sensibilidad de los pies y dedos de los pies?',
      },
      {
        id: '5d',
        kind: 'sub',
        text: '¿Sufre algún otro tipo de enfermedad metabólica (diabetes gestacional, enfermedad renal crónica o problemas hepáticos)?',
      },
      {
        id: '5e',
        kind: 'sub',
        text: '¿Tiene planeado realizar en el futuro inmediato lo que para usted es ejercicio inusualmente vigoroso o intenso?',
      },
    ],
  },
  {
    id: 'b6',
    title: 'Trastorno de Salud Mental o Problemas de Aprendizaje',
    gate: {
      id: '6',
      kind: 'gate',
      text: '¿Tiene usted algún trastorno de salud mental o problemas de aprendizaje?',
      note: 'Esto incluye enfermedad de Alzheimer, demencia, depresión, ansiedad, bulimia/anorexia, psicosis, discapacidad intelectual, síndrome de Down.',
    },
    subs: [
      {
        id: '6a',
        kind: 'sub',
        text: '¿Tiene dificultades para controlar su enfermedad con medicación u otro tratamiento indicado por su médico?',
        note: 'Conteste NO si no está recibiendo tratamiento farmacológico u otros tratamientos.',
      },
      {
        id: '6b',
        kind: 'sub',
        text: '¿Tiene Síndrome de Down Y problemas de espalda que afectan los nervios o los músculos?',
      },
    ],
  },
  {
    id: 'b7',
    title: 'Enfermedad Respiratoria',
    gate: {
      id: '7',
      kind: 'gate',
      text: '¿Tiene usted alguna enfermedad respiratoria?',
      note: 'Esto incluye enfermedad pulmonar obstructiva crónica, asma, hipertensión pulmonar.',
    },
    subs: [
      {
        id: '7a',
        kind: 'sub',
        text: '¿Alguna vez su médico le ha comentado que el oxígeno en su sangre es insuficiente en reposo o durante la actividad física y/o que se recomienda la oxigenoterapia complementaria?',
      },
      {
        id: '7b',
        kind: 'sub',
        text: '¿En caso de ser asmático, tiene usted síntomas actuales como opresión en el pecho, silbidos al respirar, esfuerzo respiratorio constante, tos persistente (más de 2 días a la semana) o ha necesitado medicación de rescate más de 2 veces la semana pasada?',
      },
      {
        id: '7c',
        kind: 'sub',
        text: '¿Su médico alguna vez le ha dicho que tiene la presión arterial alta en los vasos sanguíneos de sus pulmones?',
      },
      {
        id: '7d',
        kind: 'sub',
        text: '¿Tiene dificultades para controlar su enfermedad con medicación u otro tratamiento indicado por su médico?',
        note: 'Conteste NO si no está siendo tratado por esto con fármacos u otros medios.',
      },
    ],
  },
  {
    id: 'b8',
    title: 'Lesión Medular',
    gate: {
      id: '8',
      kind: 'gate',
      text: '¿Tiene usted una lesión medular (vertebral)?',
      note: 'Esto incluye tetraplejía y paraplejía.',
    },
    subs: [
      {
        id: '8a',
        kind: 'sub',
        text: '¿Habitualmente, muestra usted baja presión sanguínea en reposo lo suficientemente significativa como para causar mareos, aturdimiento y/o desmayos?',
      },
      {
        id: '8b',
        kind: 'sub',
        text: '¿Tiene dificultades para controlar su enfermedad con medicación u otro tratamiento indicado por su médico?',
        note: 'Conteste NO si no está siendo tratado por esto con fármacos u otros medios.',
      },
      {
        id: '8c',
        kind: 'sub',
        text: '¿Le ha indicado su médico que usted presenta ataques repentinos de presión arterial alta (conocida como disreflexia autonómica)?',
      },
    ],
  },
  {
    id: 'b9',
    title: 'Accidente Cerebrovascular / Trastorno Neurológico o Muscular',
    gate: {
      id: '9',
      kind: 'gate',
      text: '¿Ha sufrido usted un accidente cerebro vascular (ACV)?',
      note: 'Esto incluye el accidente isquémico transitorio (AIT) o evento cerebrovascular.',
    },
    subs: [
      {
        id: '9a',
        kind: 'sub',
        text: '¿Ha sufrido usted un accidente cerebro vascular o un trastorno neurológico o de los músculos en los últimos 6 meses?',
      },
      {
        id: '9b',
        kind: 'sub',
        text: '¿Tiene dificultades de movilidad o para caminar?',
      },
      {
        id: '9c',
        kind: 'sub',
        text: '¿Ha experimentado pérdida de conocimiento o síncope como resultado de una lesión en la cabeza en los 12 últimos meses o ha sido diagnosticado con una concusión o conmoción cerebral en los últimos 12 meses?',
      },
    ],
  },
  {
    id: 'b10',
    title: 'Otros Trastornos Médicos',
    gate: {
      id: '10',
      kind: 'gate',
      text: '¿Tiene algún otro trastorno médico no mencionado anteriormente o tiene dos o más trastornos médicos?',
    },
    subs: [
      {
        id: '10a',
        kind: 'sub',
        text: '¿Padece usted alguna enfermedad no considerada anteriormente, como epilepsia, problemas renales o enfermedades neurológicas?',
      },
      {
        id: '10b',
        kind: 'sub',
        text: '¿Padece usted en este momento dos o más enfermedades crónicas?',
        detail: {
          id: 'd_10b',
          label: 'POR FAVOR INDIQUE SUS ENFERMEDADES Y LOS FÁRMACOS CORRESPONDIENTES QUE ESTÉ TOMANDO:',
          placeholder: 'Escriba las enfermedades y los fármacos',
        },
      },
      {
        id: '10c',
        kind: 'sub',
        text: '¿Tiene dificultades de movilidad o para caminar?',
      },
    ],
  },
]

export const PARQ_RECOMMENDATIONS: string[] = [
  'Le recomendamos que consulte a un profesional cualificado del ejercicio para que le ayude a desarrollar un plan de actividad física seguro y eficaz que satisfaga sus necesidades de salud.',
  'Le animamos a que comience despacio y progrese gradualmente – 20 a 60 minutos de actividad física de intensidad baja o moderada, 3 a 5 días por semana, incluyendo ejercicios aeróbicos y de fortalecimiento muscular.',
  'A medida que avanza, debe ponerse como meta acumular 150 minutos o más semanales de actividad física de intensidad moderada.',
  'Si usted tiene más de 45 años y NO está acostumbrado a realizar ejercicio vigoroso o de máxima intensidad, consulte con un profesional de salud cualificado en temas de ejercicio antes de realizar ese tipo de esfuerzos.',
]

export const PARQ_DELAY: string[] = [
  'Padece una afección temporal como resfriado o fiebre. Conviene esperar a que esté recuperado.',
  'Usted está embarazada - consulte a su profesional de la salud, su médico de referencia, profesional cualificado del ejercicio, y/o complete el ePARmed-X+ antes de empezar cualquier cambio en su actividad física habitual.',
  'Su salud cambia – consulte con su médico u otro profesional de salud cualificado en temas de ejercicio antes de seguir con cualquier programa de actividad física.',
]

export const PARQ_DECLARATION_TEXT =
  '"Yo, el abajo firmante, declara haber leído y comprendido el mencionado cuestionario. Estoy de acuerdo en que la presente declaración para realizar actividad física tiene una validez de 12 meses a partir de la fecha en la que se completó el cuestionario y queda invalidada si hay cambios en mi salud. Autorizo al gimnasio/club a guardar una copia de este cuestionario para uso interno. En cuyo caso la entidad estará obligada a respetar la confidencialidad de dicho documento, en cumplimiento de la ley en vigor."'

const QUESTION_INDEX: Record<string, ParqQuestion> = {}
PARQ_GENERAL.forEach(q => { QUESTION_INDEX[q.id] = q })
PARQ_BLOCKS.forEach(b => {
  QUESTION_INDEX[b.gate.id] = b.gate
  b.subs.forEach(s => { QUESTION_INDEX[s.id] = s })
})

export function getParqQuestion(id: string): ParqQuestion | undefined {
  return QUESTION_INDEX[id]
}

export function buildParqSequence(answers: Record<string, YesNo>): ParqStep[] {
  const steps: ParqStep[] = []
  PARQ_GENERAL.forEach(q => steps.push({ id: q.id, kind: 'general' }))
  const hasYes = PARQ_GENERAL.some(q => answers[q.id] === 'si')
  if (hasYes) {
    PARQ_BLOCKS.forEach(block => {
      steps.push({ id: block.gate.id, kind: 'gate' })
      if (answers[block.gate.id] === 'si') {
        block.subs.forEach(s => steps.push({ id: s.id, kind: 'sub' }))
      }
    })
  }
  steps.push({ id: 'rec', kind: 'info-rec' })
  steps.push({ id: 'delay', kind: 'info-delay' })
  steps.push({ id: 'decl', kind: 'declaration' })
  return steps
}

export function parqPendingCount(
  answers: Record<string, YesNo>,
  details: Record<string, string>,
  sequence: ParqStep[],
): number {
  let pending = 0
  for (const step of sequence) {
    if (step.kind !== 'general' && step.kind !== 'gate' && step.kind !== 'sub') continue
    const q = QUESTION_INDEX[step.id]
    const answer = answers[step.id]
    if (answer !== 'si' && answer !== 'no') {
      pending++
      continue
    }
    if (answer === 'si' && q?.detail && !(details[q.detail.id]?.trim())) {
      pending++
    }
  }
  return pending
}
