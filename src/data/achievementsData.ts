import { Achievement } from '../types/game';

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 'ach_primera_entrevista',
    title: 'Primera Entrevista Clínica',
    description: 'Completa tu primera conversación profesional con un paciente en el hospital.',
    category: 'clinical',
    icon: '🩺',
    xpReward: 50
  },
  {
    id: 'ach_escucha_activa',
    title: 'Escuchar antes de Hablar',
    description: 'Prioriza la indagación empática sobre el interrogatorio frío con un paciente ansioso.',
    category: 'empathy',
    icon: '👂',
    xpReward: 75
  },
  {
    id: 'ach_no_es_solo_enfermedad',
    title: 'No es Solo una Enfermedad',
    description: 'Comprende la dimensión psicosocial y familiar de un paciente con patología crónica.',
    category: 'empathy',
    icon: '❤️',
    xpReward: 100
  },
  {
    id: 'ach_vocacion_autentica',
    title: 'Vocación Auténtica',
    description: 'Diferencia con claridad las motivaciones intrínsecas de las presiones sociales en el capítulo 2.',
    category: 'vocation',
    icon: '🧭',
    xpReward: 100
  },
  {
    id: 'ach_mas_alla_prestigio',
    title: 'Más Allá del Prestigio',
    description: 'Reconoce que el estatus social y el dinero son motivaciones extrínsecas que no sustentan la vocación.',
    category: 'vocation',
    icon: '💎',
    xpReward: 80
  },
  {
    id: 'ach_el_cientifico',
    title: 'Rigor Científico',
    description: 'Resuelve un dilema clínico aplicando pensamiento crítico y medicina basada en la evidencia.',
    category: 'academic',
    icon: '🔬',
    xpReward: 90
  },
  {
    id: 'ach_el_cuidador',
    title: 'El Cuidador Compasivo',
    description: 'Demuestra una alta orientación asistencial acompañando el sufrimiento sin distanciamiento frío.',
    category: 'empathy',
    icon: '🕊️',
    xpReward: 100
  },
  {
    id: 'ach_mente_bajo_presion',
    title: 'Mente bajo Presión',
    description: 'Maneja adecuadamente la frustración y la hostilidad de un paciente difícil sin alterarte.',
    category: 'clinical',
    icon: '🧘',
    xpReward: 120
  },
  {
    id: 'ach_profesionalismo_impecable',
    title: 'Profesionalismo Ético',
    description: 'Mantén una conducta ética y confidencial durante una situación dilemática.',
    category: 'clinical',
    icon: '⚕️',
    xpReward: 110
  },
  {
    id: 'ach_la_persona_completa',
    title: 'La Persona en la Medicina',
    description: 'Completa la campaña principal integrando ciencia, humanidad y madurez emocional.',
    category: 'special',
    icon: '🌟',
    xpReward: 250
  },
  {
    id: 'ach_explorador_campus',
    title: 'Espíritu Universitario',
    description: 'Visita todas las áreas del campus universitario y el hospital docente.',
    category: 'academic',
    icon: '🏫',
    xpReward: 60
  },
  {
    id: 'ach_lector_empedernido',
    title: 'Biblioteca Médica',
    description: 'Desbloquea al menos 6 entradas en el Diario del Estudiante.',
    category: 'academic',
    icon: '📚',
    xpReward: 80
  },
  {
    id: 'ach_lersch_asistencial',
    title: 'Lersch: Tendencia Asistencial',
    description: 'Obtén una afinidad destacada con el Grupo 1 orientado al cuidado y alivio humano.',
    category: 'vocation',
    icon: '🤝',
    xpReward: 90
  },
  {
    id: 'ach_lersch_conocimiento',
    title: 'Lersch: Tendencia al Conocimiento',
    description: 'Obtén una afinidad destacada con el Grupo 2 orientado a la investigación y el descubrimiento.',
    category: 'academic',
    icon: '🧠',
    xpReward: 90
  },
  {
    id: 'ach_lersch_estimulacion',
    title: 'Lersch: Tendencia a la Estimulación',
    description: 'Obtén una afinidad destacada con el Grupo 3 orientado a la acción y el desafío crítico.',
    category: 'clinical',
    icon: '⚡',
    xpReward: 90
  },
  {
    id: 'ach_calma_tormenta',
    title: 'Calma en la Tormenta',
    description: 'Conserva tu energía emocional por encima del 70% tras un caso clínico de alta exigencia.',
    category: 'clinical',
    icon: '🛡️',
    xpReward: 100
  },
  {
    id: 'ach_vinculo_terapeutico',
    title: 'Vínculo Terapéutico',
    description: 'Logra que un paciente desconfiado coopere gracias a una comunicación empática.',
    category: 'empathy',
    icon: '💬',
    xpReward: 95
  },
  {
    id: 'ach_deseo_reparar',
    title: 'Autoconocimiento Profundo',
    description: 'Analiza tus motivaciones inconscientes y el deseo de reparar en la sesión de tutoría.',
    category: 'vocation',
    icon: '🪞',
    xpReward: 110
  },
  {
    id: 'ach_superando_coaccion',
    title: 'Libertad Vocacional',
    description: 'Supera la presión de mandatos familiares y reafirma tu vocación desde la convicción propia.',
    category: 'vocation',
    icon: '🔓',
    xpReward: 100
  },
  {
    id: 'ach_paciente_real',
    title: 'Abrazar la Realidad Clínica',
    description: 'Acepta que el paciente real puede ser contradictorio y requerir mayor paciencia.',
    category: 'clinical',
    icon: '🌱',
    xpReward: 90
  },
  {
    id: 'ach_maestro_comunicacion',
    title: 'Comunicación Terapéutica',
    description: 'Alcanza más de 30 puntos en la estadística de Comunicación.',
    category: 'empathy',
    icon: '🗣️',
    xpReward: 120
  },
  {
    id: 'ach_especialidad_reflexiva',
    title: 'Decisión Madura',
    description: 'Explora a fondo los factores psicológicos y laborales antes de inclinarte por una especialidad.',
    category: 'vocation',
    icon: '🎯',
    xpReward: 100
  },
  {
    id: 'ach_contratransferencia_controlada',
    title: 'Espejo Lúcido',
    description: 'Reconoce la sobreidentificación con un paciente sin perder la neutralidad terapéutica.',
    category: 'special',
    icon: '👁️',
    xpReward: 130
  },
  {
    id: 'ach_sabiduria_medica',
    title: 'Sabiduría en Formación',
    description: 'Responde correctamente al 100% de los casos evaluativos de la campaña.',
    category: 'academic',
    icon: '📜',
    xpReward: 150
  },
  {
    id: 'ach_medico_persona',
    title: 'Cuidar al Cuidador',
    description: 'Reconoce la importancia del descanso y la salud mental en el bienestar del médico.',
    category: 'special',
    icon: '☀️',
    xpReward: 100
  }
];
