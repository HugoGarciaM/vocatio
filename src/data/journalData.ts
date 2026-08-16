import { JournalEntry } from '../types/game';

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'persona_medicina',
    title: 'La Persona en el Ejercicio de la Medicina',
    category: 'etica_y_persona',
    summary: 'La medicina no es solo ciencia: es una práctica humana, ética y social integral.',
    content: [
      'El ejercicio de la medicina trasciende la mera aplicación técnica de conocimientos biomédicos.',
      'El acto médico involucra una totalidad: conocimientos científicos, habilidades clínicas, valores morales, circunstancias culturales y la historia personal tanto del médico como del paciente.',
      'Comprender la dimensión humana del enfermo implica reconocer su biografía, sus temores, su entorno familiar y el significado subjetivo que otorga a su enfermedad.'
    ],
    clinicalTakeaway: 'Un médico excelente combina el rigor científico con una profunda sensibilidad humana y responsabilidad social.',
    unlocked: true
  },
  {
    id: 'relacion_medico_paciente',
    title: 'La Relación Médico-Paciente',
    category: 'relacion_medico_paciente',
    summary: 'El núcleo del acto médico basado en la confianza, la escucha activa y la empatía.',
    content: [
      'La relación médico-paciente no es un simple intercambio de información técnica ni un contrato comercial.',
      'Exige escucha activa, empatía (capacidad de comprender el marco interno del otro sin perder la perspectiva profesional), respeto incondicional y madurez emocional.',
      'El paciente busca alivio a su síntoma, pero primordialmente busca ser comprendido, escuchado y tratado como persona digna.'
    ],
    clinicalTakeaway: 'Saber comunicarse y escuchar es tan terapéutico como prescribir el fármaco adecuado.',
    unlocked: false
  },
  {
    id: 'vocacion_extrinseca_intrinseca',
    title: 'Motivaciones Vocacionales: Intrínsecas vs. Extrínsecas',
    category: 'vocacion',
    summary: 'Diferencia entre vocación genuina y factores externos como prestigio, dinero o presión.',
    content: [
      'Motivaciones Intrínsecas: Interés genuino por el ser humano, curiosidad científica, deseo de aliviar el sufrimiento y autorrealización vocacional.',
      'Motivaciones Extrínsecas: Búsqueda de estatus socioeconómico, prestigio social, mandato familiar ("en mi familia todos son médicos") o estereotipos idealizados.',
      'Elegir medicina exclusivamente por factores extrínsecos incrementa el riesgo de agotamiento prematuro (burnout) e insatisfacción profesional.'
    ],
    clinicalTakeaway: 'Reflexionar tempranamente sobre los verdaderos motivos de la elección fortalece la salud mental del profesional.',
    unlocked: false
  },
  {
    id: 'clasificacion_lersch',
    title: 'Clasificación Vocacional de Lersch',
    category: 'vocacion',
    summary: 'Tres orientaciones actitudinales en la práctica médica (modelo educativo orientativo).',
    content: [
      '1. Tendencia Asistencial (Grupo 1): Orientación primordial hacia el cuidado directo, el acompañamiento, la empatía y el alivio del dolor humano (ej. Médicos de Familia, Paliativistas, Pediatras).',
      '2. Tendencia al Conocimiento y Creación (Grupo 2): Motivados por la investigación, la comprensión de mecanismos biopatológicos y la resolución de enigmas científicos (ej. Patólogos, Genetistas, Investigadores).',
      '3. Tendencia a la Estimulación (Grupo 3): Motivados por la acción inmediata, la toma de decisiones críticas bajo presión y desafíos intensos (ej. Cirujanos de trauma, Emergencistas, Intensivistas).'
    ],
    clinicalTakeaway: 'Ninguna tendencia es superior a otra; el autoconocimiento permite encontrar el ámbito donde mejor se despliegue el potencial personal.',
    unlocked: false
  },
  {
    id: 'motivaciones_inconscientes',
    title: 'Motivaciones Inconscientes y Deseo de Reparar',
    category: 'psicologia_medica',
    summary: 'Fuerzas psicológicas profundas que influyen en la elección vocacional.',
    content: [
      'Detrás de la decisión de ser médico operan a menudo deseos inconscientes como la necesidad de reparar pérdidas tempranas, resolver vivencias de enfermedad en seres queridos, o la búsqueda de control sobre la vulnerabilidad y la muerte.',
      'También puede manifestarse como necesidad de reconocimiento afectivo o de sentirse indispensable.',
      'Reconocer estas dinámicas no invalida la vocación, sino que la madura y evita proyecciones no elaboradas sobre los pacientes.'
    ],
    clinicalTakeaway: 'El médico que comprende sus propias heridas cuida mejor sin manipular la relación clínica.',
    unlocked: false
  },
  {
    id: 'paciente_ideal_real',
    title: 'El Paciente Ideal frente al Paciente Real',
    category: 'relacion_medico_paciente',
    summary: 'La realidad clínica cotidiana frente a las expectativas teóricas del estudiante.',
    content: [
      'El Paciente Ideal: Colaborador, agradecido, puntual, que comprende a la perfección las indicaciones y no cuestiona.',
      'El Paciente Real: Ser humano en crisis, a menudo angustiado, desconfiado, irritable, temeroso, confuso o con baja adherencia debido a factores psicosociales.',
      'El desafío del médico radica en sostener el compromiso y la calidez profesional ante la incomodidad o resistencia del paciente.'
    ],
    clinicalTakeaway: 'La irritabilidad o desconfianza del paciente suele ser una manifestación de su angustia ante la vulnerabilidad.',
    unlocked: false
  },
  {
    id: 'contratransferencia_identificacion',
    title: 'Identificación y Contratransferencia',
    category: 'psicologia_medica',
    summary: 'Manejo de las emociones que el paciente despierta en el profesional.',
    content: [
      'La Contratransferencia comprende el conjunto de reacciones afectivas conscientes e inconscientes que el paciente suscita en el médico.',
      'La Sobreidentificación ocurre cuando el médico ve en el paciente a su madre, hermano o a sí mismo, perdiendo la distancia terapéutica necesaria para tomar decisiones objetivas.',
      'Ignorar las propias emociones conduce al cinismo o al desborde; identificarlas conscientemente permite modular la respuesta profesional.'
    ],
    clinicalTakeaway: 'Tener sentimientos ante el paciente es humano; actuar impulsivamente por ellos es un error clínico.',
    unlocked: false
  },
  {
    id: 'eleccion_especialidad_factores',
    title: 'Factores en la Elección de Especialidad',
    category: 'etica_y_persona',
    summary: 'Factores socioeconómicos, laborales, psicológicos y profesionales.',
    content: [
      'Factores Socioeconómicos y Laborales: Ingresos potenciales, demanda del mercado, horarios de guardia, balance con la vida personal.',
      'Factores Psicológicos: Tolerancia a la incertidumbre, velocidad en la toma de decisiones, afinidad con procedimientos manuales o reflexión clínica.',
      'Factores Profesionales: Oportunidades académicas, prestigio, trabajo en equipo interdisciplinario.',
      'Una elección armónica conjuga intereses vocacionales con la realidad del contexto sanitario.'
    ],
    clinicalTakeaway: 'Elegir especialidad es un proceso reflexivo que exige alinear la personalidad propia con las demandas del área.',
    unlocked: false
  },
  {
    id: 'estudiante_frente_enfermedad',
    title: 'El Estudiante frente al Dolor y la Muerte',
    category: 'psicologia_medica',
    summary: 'El impacto emocional de la transición de las aulas al hospital.',
    content: [
      'El estudiante de medicina experimenta con frecuencia el impacto del "choque con la realidad": la crudeza del dolor físico, el deterioro corporal y la muerte.',
      'Mecanismos defensivos inadecuados: Frialdad despersonalizada ("el caso de la cama 4"), distanciamiento afectivo o cinismo.',
      'Mecanismos saludables: Espacios de reflexión, tutoría psicológica, trabajo en equipo y aceptación de los límites de la ciencia médica.'
    ],
    clinicalTakeaway: 'La compasión no es debilidad; es el motor que da sentido a la ciencia médica.',
    unlocked: false
  },
  {
    id: 'integracion_medico_persona',
    title: 'El Médico como Persona Integrada',
    category: 'etica_y_persona',
    summary: 'Equilibrio entre la vida personal, la salud mental y la excelencia profesional.',
    content: [
      'El médico no es un autómata inmune a la fatiga o al sufrimiento. Cuidarse a sí mismo es un deber ético fundamental.',
      'La madurez profesional requiere cultivar relaciones personales, descanso, cultura y aficiones fuera del hospital.',
      'Solo quien cuida su propia condición humana puede ofrecer un cuidado auténticamente humano a los demás.'
    ],
    clinicalTakeaway: 'El primer paciente al que el médico debe aprender a cuidar y escuchar es a sí mismo.',
    unlocked: false
  }
];
