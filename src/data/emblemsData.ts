import { Emblem } from '../types/game';

export const EMBLEMS_DATA: Emblem[] = [
  {
    id: 'emb_medico_humano',
    name: 'Emblema del Médico Humano',
    description: 'Reconoce la primacía de la dignidad humana y el respeto en el acto médico.',
    icon: '🩺',
    color: '#06b6d4', // cyan
    unlockCondition: 'Comienza tu andadura médica y supera el Capítulo 1 con éxito.',
    effect: '+5% de ganancia de XP en decisiones empáticas.',
    unlocked: true
  },
  {
    id: 'emb_empatia_clinica',
    name: 'Emblema de la Empatía',
    description: 'Capacidad de ponerse en el lugar del sufriente sin perder la templanza técnica.',
    icon: '❤️',
    color: '#f43f5e', // rose
    unlockCondition: 'Alcanza 20 puntos de Empatía en tus decisiones clínicas.',
    effect: 'Mayor tolerancia al estrés en entrevistas con pacientes difíciles.',
    unlocked: false
  },
  {
    id: 'emb_conocimiento_rigor',
    name: 'Emblema del Conocimiento',
    description: 'Sed incesante de verdad científica y medicina basada en la evidencia.',
    icon: '🧠',
    color: '#3b82f6', // blue
    unlockCondition: 'Alcanza 20 puntos de Conocimiento / Pensamiento Científico.',
    effect: 'Desbloquea opciones de diálogo analíticas avanzadas.',
    unlocked: false
  },
  {
    id: 'emb_comunicacion_asertiva',
    name: 'Emblema de la Comunicación',
    description: 'La palabra como instrumento terapéutico de consuelo y claridad.',
    icon: '🗣️',
    color: '#10b981', // emerald
    unlockCondition: 'Alcanza 20 puntos de Comunicación profesional.',
    effect: 'Reduce el riesgo de malentendidos con pacientes desconfiados.',
    unlocked: false
  },
  {
    id: 'emb_profesionalismo_etico',
    name: 'Emblema del Profesionalismo',
    description: 'Integridad moral inquebrantable, respeto al secreto médico y madurez.',
    icon: '⚕️',
    color: '#8b5cf6', // purple
    unlockCondition: 'Alcanza 20 puntos de Profesionalismo.',
    effect: 'Prestigio académico aumentado en la Facultad.',
    unlocked: false
  },
  {
    id: 'emb_vocacion_pura',
    name: 'Emblema de la Vocación',
    description: 'Firmeza en la elección profesional fundamentada en convicciones auténticas.',
    icon: '🧭',
    color: '#f59e0b', // amber
    unlockCondition: 'Supera el Capítulo 2 desentrañando tus motivaciones genuinas.',
    effect: 'Resistencia contra la frustración y el cansancio emocional.',
    unlocked: false
  },
  {
    id: 'emb_investigador_descubridor',
    name: 'Emblema del Investigador',
    description: 'Pasión por comprender los enigmas biopatológicos y crear nuevo saber.',
    icon: '🔬',
    color: '#6366f1', // indigo
    unlockCondition: 'Alcanza puntuación sobresaliente en la tendencia al Conocimiento de Lersch.',
    effect: 'Aumenta el rendimiento en estudios de laboratorio.',
    unlocked: false
  },
  {
    id: 'emb_asistencial_cuidador',
    name: 'Emblema del Acompañante',
    description: 'Disposición incondicional a sostener la mano de quien padece.',
    icon: '🕊️',
    color: '#ec4899', // pink
    unlockCondition: 'Alcanza puntuación sobresaliente en la tendencia Asistencial de Lersch.',
    effect: 'Aumenta la velocidad de recuperación de Energía Emocional.',
    unlocked: false
  },
  {
    id: 'emb_estimulacion_accion',
    name: 'Emblema del Impulso Crítico',
    description: 'Decisión firme y serenidad en situaciones de máxima intensidad asistencial.',
    icon: '⚡',
    color: '#eab308', // yellow
    unlockCondition: 'Alcanza puntuación sobresaliente en la tendencia a la Estimulación de Lersch.',
    effect: 'Opciones de acción rápida en emergencias simuladas.',
    unlocked: false
  },
  {
    id: 'emb_madurez_emocional',
    name: 'Emblema del Autoconocimiento',
    description: 'Habilidad de examinar los propios miedos, sesgos y contratransferencias.',
    icon: '🧘',
    color: '#14b8a6', // teal
    unlockCondition: 'Supera los capítulos de tutoría psicológica y contratransferencia.',
    effect: 'Inmunidad ante respuestas reactivas impulsivas.',
    unlocked: false
  },
  {
    id: 'emb_dimension_humana',
    name: 'Emblema de la Humanidad',
    description: 'Comprensión del paciente como ser bio-psico-social indivisible.',
    icon: '🌟',
    color: '#fbbf24', // warm gold
    unlockCondition: 'Desbloquea 8 o más artículos del Diario del Estudiante.',
    effect: 'Máxima afinidad en las entrevistas clínicas finales.',
    unlocked: false
  },
  {
    id: 'emb_medico_graduado',
    name: 'Emblema del Médico en Plenitud',
    description: 'Integración consumada de ciencia, arte, humanidad y ética profesional.',
    icon: '👨‍⚕️',
    color: '#38bdf8', // sky
    unlockCondition: 'Completa la campaña médica alcanzando cualquiera de los finales formativos.',
    effect: 'Corona de honor del profesional médico graduado.',
    unlocked: false
  }
];
