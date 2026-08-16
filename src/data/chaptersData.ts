import { Chapter, DialogueNode, QuestionCase } from '../types/game';

export const CHAPTERS_DATA: Chapter[] = [
  {
    number: 1,
    title: 'El Primer Paso',
    subtitle: 'El ingreso a la Facultad y la pregunta fundamental',
    locationId: 'campus_main',
    summary: 'Inicias tu formación médica en la universidad. La Dra. Navarro te invita a reflexionar sobre qué significa realmente convertirse en médico.',
    mainObjective: 'Habla con la Dra. Navarro en el patio central y explora el concepto de "La persona en el ejercicio de la medicina".',
    completed: false,
    unlocked: true,
    introDialogueId: 'ch1_intro',
    clinicalCasesCount: 1
  },
  {
    number: 2,
    title: '¿Por Qué Medicina?',
    subtitle: 'Motivaciones vocacionales: familiares, sociales y auténticas',
    locationId: 'campus_main',
    summary: 'Tu compañero Mateo enfrenta una profunda crisis vocacional por presiones de su familia. Es momento de examinar las razones conscientes y externas que impulsan a elegir esta profesión.',
    mainObjective: 'Orienta a Mateo en el campus y distingue entre motivaciones intrínsecas, mandatos sociales y estereotipos de estatus.',
    completed: false,
    unlocked: false,
    introDialogueId: 'ch2_intro',
    clinicalCasesCount: 1
  },
  {
    number: 3,
    title: 'El Primer Paciente',
    subtitle: 'El choque con la realidad y la escucha activa',
    locationId: 'hospital_ward',
    summary: 'Pisas por primera vez la sala de hospitalización. Te encuentras frente a Don Roberto, un paciente angustiado que teme recibir un mal pronóstico.',
    mainObjective: 'Dirígete al Hospital Universitario, habla con el Dr. Mendoza y realiza la entrevista clínica inicial a Don Roberto.',
    completed: false,
    unlocked: false,
    introDialogueId: 'ch3_intro',
    clinicalCasesCount: 1
  },
  {
    number: 4,
    title: 'No es Solo una Enfermedad',
    subtitle: 'La dimensión biopsicosocial del ser humano doliente',
    locationId: 'hospital_ward',
    summary: 'Doña Carmen ingresa con descompensación diabética, pero detrás de sus cifras de glucosa se esconde una profunda soledad y sobrecarga de cuidado.',
    mainObjective: 'Entrevista a Doña Carmen en la Cama 102 y comprende el significado de su biografía en el curso de su salud.',
    completed: false,
    unlocked: false,
    introDialogueId: 'ch4_intro',
    clinicalCasesCount: 1
  },
  {
    number: 5,
    title: 'El Paciente Difícil',
    subtitle: 'Desconfianza, irritabilidad y madurez emocional',
    locationId: 'hospital_ward',
    summary: 'Don Ignacio reacciona con agresividad y reproches ante el sistema de salud. Aprenderás que el paciente real no siempre es dócil ni colaborador.',
    mainObjective: 'Atiende a Don Ignacio en la Cama 103 gestionando tus propias reacciones emocionales y manteniendo el profesionalismo.',
    completed: false,
    unlocked: false,
    introDialogueId: 'ch5_intro',
    clinicalCasesCount: 1
  },
  {
    number: 6,
    title: 'Lo que Busco',
    subtitle: 'Motivaciones inconscientes y el deseo de reparar',
    locationId: 'psych_office',
    summary: 'En la sesión de tutoría con el Dr. Araujo, explorarás aquellos impulsos profundos e inconscientes que te condujeron a la bata blanca.',
    mainObjective: 'Acude a la Sala de Psicología Médica y reflexiona sobre el deseo de reparar y la necesidad de utilidad.',
    completed: false,
    unlocked: false,
    introDialogueId: 'ch6_intro',
    clinicalCasesCount: 1
  },
  {
    number: 7,
    title: '¿Qué Tipo de Médico Quiero Ser?',
    subtitle: 'La Clasificación Vocacional de Lersch',
    locationId: 'library',
    summary: 'En la biblioteca universitaria, Sofía te presenta la clasificación de Lersch: Tendencia Asistencial, al Conocimiento o a la Estimulación.',
    mainObjective: 'Resuelve el test situacional de orientación vocacional en la Biblioteca junto a Sofía.',
    completed: false,
    unlocked: false,
    introDialogueId: 'ch7_intro',
    clinicalCasesCount: 1
  },
  {
    number: 8,
    title: 'La Elección de Especialidad',
    subtitle: 'Factores socioeconómicos, laborales, psicológicos y personales',
    locationId: 'cafeteria',
    summary: 'En la cafetería del campus, entrevistas a especialistas en Cirugía, Pediatría y Psiquiatría para sopesar el balance de vida, ingresos e intereses.',
    mainObjective: 'Dialoga con los especialistas en la Cafetería y define los factores que guiarán tu futuro profesional.',
    completed: false,
    unlocked: false,
    introDialogueId: 'ch8_intro',
    clinicalCasesCount: 1
  },
  {
    number: 9,
    title: 'El Reflejo',
    subtitle: 'Identificación, contratransferencia y límites terapéuticos',
    locationId: 'hospital_ward',
    summary: 'Un paciente joven ingresa con una historia idéntica a una vivencia familiar dolorosa tuya. Deberás reconocer tus emociones para proteger la neutralidad clínica.',
    mainObjective: 'Enfrenta el dilema de contratransferencia en el Hospital y consulta con tu tutor para procesar tus afectos.',
    completed: false,
    unlocked: false,
    introDialogueId: 'ch9_intro',
    clinicalCasesCount: 1
  },
  {
    number: 10,
    title: 'La Persona en el Ejercicio de la Medicina',
    subtitle: 'Integración final de ciencia, humanidad, ética y vocación',
    locationId: 'campus_main',
    summary: 'Llega la ceremonia de graduación y balance formativo. Todo lo aprendido sobre ti mismo, tus pacientes y tu profesión se consolida en tu juramento.',
    mainObjective: 'Presenta tu juramento y balance reflexivo ante el claustro universitario para desbloquear tu desenlace profesional.',
    completed: false,
    unlocked: false,
    introDialogueId: 'ch10_intro',
    clinicalCasesCount: 1
  }
];

// Complete Dialogue Tree Nodes for all NPCs & Chapters
export const DIALOGUE_NODES: Record<string, DialogueNode> = {
  // --- CAPÍTULO 1 ---
  ch1_intro: {
    id: 'ch1_intro',
    speaker: 'Dra. Navarro',
    speakerRole: 'Catedrática de Psicología Médica',
    portrait: 'teacher_female',
    text: '¡Te doy una cálida bienvenida a la Facultad de Medicina! Antes de memorizar anatomía o farmacología, permíteme hacerte una pregunta vital: ¿Qué crees que define a un verdadero médico?',
    choices: [
      {
        id: 'c1_human',
        text: 'Alguien que integra el rigor científico con la comprensión profunda del ser humano y sus valores.',
        stats: { empathy: 5, communication: 4, professionalism: 4, vocation: 5, xp: 50 },
        feedback: '¡Exacto! El ejercicio médico es una práctica humana y social; los conocimientos científicos son indispensables, pero sin empatía y ética resultan ciegos.',
        unlockJournalId: 'persona_medicina',
        unlockAchievementId: 'ach_explorador_campus',
        nextDialogueNodeId: 'ch1_navarro_great'
      },
      {
        id: 'c1_science_only',
        text: 'Tener un dominio técnico absoluto de las patologías biológicas y aplicar tratamientos eficaces.',
        stats: { knowledge: 6, scientificThinking: 5, empathy: 1, xp: 30 },
        feedback: 'El conocimiento biomédico es un pilar irremplazable, pero la medicina no trata órganos aislados, sino personas completas con emociones, cultura y biografía.',
        unlockJournalId: 'persona_medicina',
        nextDialogueNodeId: 'ch1_navarro_reflect'
      },
      {
        id: 'c1_status',
        text: 'Una profesión de alto prestigio social, estabilidad económica y reconocimiento familiar.',
        stats: { vocation: 1, professionalism: 2, xp: 20 },
        feedback: 'Es legítimo desear estabilidad, pero colocar el prestigio como fin principal suele derivar en frustración y deshumanización del acto médico.',
        unlockJournalId: 'persona_medicina',
        nextDialogueNodeId: 'ch1_navarro_warn'
      }
    ]
  },
  ch1_navarro_great: {
    id: 'ch1_navarro_great',
    speaker: 'Dra. Navarro',
    portrait: 'teacher_female',
    text: 'Excelente perspectiva. En este viaje aprenderás que el médico también es una persona con emociones, dudas y límites. Ahora, ve hacia el tablón y habla con tus compañeros para comenzar a explorar el campus.',
    choices: [
      {
        id: 'c1_continue',
        text: 'Gracias Doctora, comenzaré a explorar de inmediato.',
        stats: { energy: 10, xp: 20 },
        triggersAction: 'advance_quest'
      }
    ]
  },
  ch1_navarro_reflect: {
    id: 'ch1_navarro_reflect',
    speaker: 'Dra. Navarro',
    portrait: 'teacher_female',
    text: 'Valoro tu rigor técnico, pero no olvides jamás: el paciente no es un "caso de insuficiencia cardíaca", es una persona que sufre y teme. Acompáñame a profundizar en este principio.',
    choices: [
      {
        id: 'c1_continue_2',
        text: 'Comprendo. Trabajaré en fortalecer mi dimensión humana.',
        stats: { empathy: 3, emotionalMaturity: 3, xp: 20 },
        triggersAction: 'advance_quest'
      }
    ]
  },
  ch1_navarro_warn: {
    id: 'ch1_navarro_warn',
    speaker: 'Dra. Navarro',
    portrait: 'teacher_female',
    text: 'Agradezco tu sinceridad. En los siguientes capítulos analizaremos qué ocurre cuando las motivaciones externas dominan la carrera. Reflexiona sobre ello.',
    choices: [
      {
        id: 'c1_continue_3',
        text: 'Estaré atento a mis motivaciones.',
        stats: { emotionalMaturity: 3, xp: 20 },
        triggersAction: 'advance_quest'
      }
    ]
  },

  // --- CAPÍTULO 2: VOCACIÓN Y MATEO ---
  ch2_intro: {
    id: 'ch2_intro',
    speaker: 'Mateo',
    speakerRole: 'Compañero de 1er Año',
    portrait: 'student_male',
    text: 'Hola... la verdad estoy muy abrumado. Mi padre es cirujano y mi abuelo fue decano. Todos dan por sentado que seré médico, pero no sé si realmente deseo esto o solo temo decepcionarlos.',
    choices: [
      {
        id: 'c2_coaction',
        text: 'Estás viviendo una coacción familiar o mandato social. La medicina exige una vocación genuina, no solo cumplir expectativas ajenas.',
        stats: { empathy: 6, communication: 5, vocation: 6, emotionalMaturity: 5, xp: 70 },
        feedback: '¡Brillante! Identificaste con exactitud la vocación por coacción familiar. Elegir una carrera tan demandante por mandato externo conduce al burnout.',
        unlockJournalId: 'vocacion_extrinseca_intrinseca',
        unlockAchievementId: 'ach_vocacion_autentica',
        nextDialogueNodeId: 'ch2_mateo_relief'
      },
      {
        id: 'c2_edipo_stereotype',
        text: 'Aprovecha el prestigio de tu apellido y no pienses tanto; al final el estatus y el buen sueldo compensarán el esfuerzo.',
        stats: { knowledge: 2, vocation: -3, empathy: -2, xp: 25 },
        feedback: 'Cuidado: Las razones extrínsecas (dinero y prestigio) y la sumisión acrítica a figuras paternas (complejo de Edipo / mandato) no sostienen la resiliencia en situaciones difíciles.',
        unlockJournalId: 'vocacion_extrinseca_intrinseca',
        nextDialogueNodeId: 'ch2_mateo_confused'
      },
      {
        id: 'c2_explore_inner',
        text: 'Tómate un tiempo para separar lo que tú sientes de lo que ellos esperan. ¿Qué despierta en ti curiosidad o deseo de ayudar?',
        stats: { communication: 5, empathy: 5, emotionalMaturity: 6, xp: 60 },
        feedback: 'Excelente acompañamiento reflexivo. Fomentas la introspección y el desarrollo de motivaciones intrínsecas.',
        unlockJournalId: 'vocacion_extrinseca_intrinseca',
        unlockAchievementId: 'ach_superando_coaccion',
        nextDialogueNodeId: 'ch2_mateo_relief'
      }
    ]
  },
  ch2_mateo_relief: {
    id: 'ch2_mateo_relief',
    speaker: 'Mateo',
    portrait: 'student_male',
    text: 'Tienes tanta razón. Necesito hablar con honestidad con mi familia y redescubrir si hay una motivación propia en mí. ¡Gracias por escucharme de verdad!',
    choices: [
      {
        id: 'c2_end',
        text: 'Cuenta con mi apoyo, Mateo. Avancemos juntos.',
        stats: { xp: 30 },
        triggersQuiz: 'quiz_vocacion_types',
        triggersAction: 'complete_chapter_2'
      }
    ]
  },
  ch2_mateo_confused: {
    id: 'ch2_mateo_confused',
    speaker: 'Mateo',
    portrait: 'student_male',
    text: 'Mmm... no estoy seguro de que el prestigio baste cuando esté despierto a las 3 a.m. con un paciente grave. Aun así, pensaré en lo que me dices.',
    choices: [
      {
        id: 'c2_end_confused',
        text: 'Revisemos juntos los tipos de vocación en los libros de la facultad.',
        stats: { xp: 20 },
        triggersQuiz: 'quiz_vocacion_types',
        triggersAction: 'complete_chapter_2'
      }
    ]
  },

  // --- CAPÍTULO 3: EL PRIMER PACIENTE (DON ROBERTO) ---
  ch3_intro: {
    id: 'ch3_intro',
    speaker: 'Dr. Mendoza',
    speakerRole: 'Médico Adjunto',
    portrait: 'doctor_male',
    text: 'Estudiante, en la Cama 101 se encuentra Don Roberto. Ha ingresado por dolor torácico atípico. Está asustado y esperando los resultados de las pruebas. Realiza la entrevista inicial.',
    choices: [
      {
        id: 'c3_accept',
        text: 'Entendido, Doctor. Me acercaré con calma y respeto.',
        stats: { professionalism: 4, xp: 20 },
        nextDialogueNodeId: 'ch3_roberto_talk'
      }
    ]
  },
  ch3_roberto_talk: {
    id: 'ch3_roberto_talk',
    speaker: 'Don Roberto',
    speakerRole: 'Paciente (62 años)',
    portrait: 'patient_elder',
    text: 'Doctor... (se le quiebra la voz) Tengo mucho miedo de que esto sea algo grave. Mi hermano falleció del corazón a mi misma edad...',
    choices: [
      {
        id: 'c3_empathy_active',
        text: 'Entiendo que esté asustado, Don Roberto. Es muy natural sentir ese temor teniendo ese recuerdo familiar. Cuénteme qué es lo que más le inquieta ahora.',
        stats: { empathy: 7, communication: 6, professionalism: 5, emotionalMaturity: 5, xp: 80 },
        feedback: '¡Respuesta ejemplar! Validaste la emoción del paciente, mostraste escucha activa y abriste el canal de confianza sin falsas promesas vacías.',
        unlockJournalId: 'relacion_medico_paciente',
        unlockAchievementId: 'ach_escucha_activa',
        nextDialogueNodeId: 'ch3_roberto_happy'
      },
      {
        id: 'c3_dismissive',
        text: 'No se preocupe, seguramente no es nada. Primero déjeme revisar sus electros y análisis de laboratorio.',
        stats: { knowledge: 4, empathy: -3, communication: -2, xp: 25 },
        feedback: 'Inadecuado. La frase "no se preocupe" invalida el sufrimiento del paciente y centrarse únicamente en papeles demuestra frialdad tecnicista.',
        unlockJournalId: 'relacion_medico_paciente',
        nextDialogueNodeId: 'ch3_roberto_shut'
      },
      {
        id: 'c3_blunt_technical',
        text: 'La cardiopatía isquémica tiene factores hereditarios conocidos. En un 40% de los casos hay antecedentes similares.',
        stats: { knowledge: 6, scientificThinking: 5, empathy: -4, communication: -3, xp: 30 },
        feedback: 'Inadecuado. Arrojar estadísticas frías a una persona en pánico incrementa su angustia y destruye la relación médico-paciente.',
        unlockJournalId: 'relacion_medico_paciente',
        nextDialogueNodeId: 'ch3_roberto_shut'
      }
    ]
  },
  ch3_roberto_happy: {
    id: 'ch3_roberto_happy',
    speaker: 'Don Roberto',
    portrait: 'patient_elder',
    text: 'Gracias por escucharme, hijo. Nadie me había mirado a los ojos desde que ingresé a urgencias. Me siento mucho más tranquilo teniéndote cerca.',
    choices: [
      {
        id: 'c3_finish',
        text: 'Estamos aquí para cuidarle en todo momento. Pasemos a la exploración con su permiso.',
        stats: { professionalism: 4, xp: 40 },
        unlockAchievementId: 'ach_primera_entrevista',
        triggersQuiz: 'quiz_relacion_medico_paciente',
        triggersAction: 'complete_chapter_3'
      }
    ]
  },
  ch3_roberto_shut: {
    id: 'ch3_roberto_shut',
    speaker: 'Don Roberto',
    portrait: 'patient_elder',
    text: '(Baja la mirada en silencio y suspira con resignación) Está bien... haga lo que tenga que hacer.',
    choices: [
      {
        id: 'c3_retry_lesson',
        text: 'Reflexionar sobre el impacto de mis palabras y reintentar con empatía.',
        stats: { emotionalMaturity: 4, xp: 30 },
        unlockAchievementId: 'ach_primera_entrevista',
        triggersQuiz: 'quiz_relacion_medico_paciente',
        triggersAction: 'complete_chapter_3'
      }
    ]
  },

  // --- CAPÍTULO 4: NO ES SOLO UNA ENFERMEDAD (DOÑA CARMEN) ---
  ch4_intro: {
    id: 'ch4_intro',
    speaker: 'Doña Carmen',
    speakerRole: 'Paciente (54 años)',
    portrait: 'patient_female',
    text: 'Sé que los médicos se enojan porque no tomo las pastillas a tiempo... pero desde que mi esposo enfermó, paso todo el día cuidándolo y no me alcanza para comprar la comida adecuada.',
    choices: [
      {
        id: 'c4_biopsychosocial',
        text: 'Comprendo la tremenda carga que lleva, Doña Carmen. Su salud y su bienestar también importan. Buscaremos juntos un plan que se adapte a su vida real y contactaremos con asistencia social.',
        stats: { empathy: 8, communication: 6, professionalism: 6, vocation: 5, xp: 85 },
        feedback: '¡Excelente enfoque biopsicosocial! Reconoces que la adherencia al tratamiento depende del contexto humano, económico y emocional del enfermo.',
        unlockJournalId: 'paciente_ideal_real',
        unlockAchievementId: 'ach_no_es_solo_enfermedad',
        nextDialogueNodeId: 'ch4_carmen_grateful'
      },
      {
        id: 'c4_authoritarian',
        text: 'Si no sigue la pauta estricta, la diabetes le causará retinopatía y falla renal. No tiene excusas.',
        stats: { knowledge: 4, empathy: -5, communication: -4, xp: 20 },
        feedback: 'Pésima intervención. La amenaza y el juicio moral culpabilizan a la paciente sin resolver los obstáculos reales que le impiden cuidarse.',
        unlockJournalId: 'paciente_ideal_real',
        nextDialogueNodeId: 'ch4_carmen_sad'
      }
    ]
  },
  ch4_carmen_grateful: {
    id: 'ch4_carmen_grateful',
    speaker: 'Doña Carmen',
    portrait: 'patient_female',
    text: 'No sabe el alivio que me da escuchar que no me juzga. Prometo poner todo de mi parte para organizarme con las tomas.',
    choices: [
      {
        id: 'c4_done',
        text: 'Trabajaremos en equipo por su salud, Doña Carmen.',
        stats: { xp: 35 },
        triggersQuiz: 'quiz_biopsicosocial',
        triggersAction: 'complete_chapter_4'
      }
    ]
  },
  ch4_carmen_sad: {
    id: 'ch4_carmen_sad',
    speaker: 'Doña Carmen',
    portrait: 'patient_female',
    text: 'Usted no sabe lo que es vivir en mis zapatos... (llora en silencio).',
    choices: [
      {
        id: 'c4_done_sad',
        text: 'Comprender que la medicina requiere entender la dimensión humana de la enfermedad.',
        stats: { emotionalMaturity: 3, xp: 20 },
        triggersQuiz: 'quiz_biopsicosocial',
        triggersAction: 'complete_chapter_4'
      }
    ]
  },

  // --- CAPÍTULO 5: EL PACIENTE DIFÍCIL (DON IGNACIO) ---
  ch5_intro: {
    id: 'ch5_intro',
    speaker: 'Don Ignacio',
    speakerRole: 'Paciente Irritable (48 años)',
    portrait: 'patient_angry',
    text: '¡Llevo 4 horas esperando en esta cama! ¡Todos ustedes son unos incompetentes que solo juegan con el tiempo de la gente!',
    choices: [
      {
        id: 'c5_deescalate',
        text: 'Entiendo perfectamente su frustración y molestia por la espera, Don Ignacio. El servicio ha tenido urgencias críticas, pero estoy aquí ahora para dedicarle toda mi atención y resolver su caso.',
        stats: { emotionalMaturity: 8, communication: 7, professionalism: 7, empathy: 6, xp: 95 },
        feedback: '¡Maestría en contención y desescalada! No tomaste el ataque como algo personal, validaste su malestar legítimo y mantuviste el marco profesional con asertividad.',
        unlockJournalId: 'estudiante_frente_enfermedad',
        unlockAchievementId: 'ach_mente_bajo_presion',
        nextDialogueNodeId: 'ch5_ignacio_calm'
      },
      {
        id: 'c5_defensive',
        text: '¡No me grite! Si supiera la cantidad de pacientes graves que atendemos no se quejaría de una simple espera.',
        stats: { emotionalMaturity: -5, professionalism: -4, communication: -4, xp: 15 },
        feedback: 'Error grave. Reaccionar a la defensiva escala el conflicto y demuestra falta de madurez emocional en el profesional.',
        unlockJournalId: 'estudiante_frente_enfermedad',
        nextDialogueNodeId: 'ch5_ignacio_furious'
      }
    ]
  },
  ch5_ignacio_calm: {
    id: 'ch5_ignacio_calm',
    speaker: 'Don Ignacio',
    portrait: 'patient_angry',
    text: 'Uff... perdone la brusquedad. El dolor de espalda no me ha dejado dormir en 3 días y estaba al límite de los nervios.',
    choices: [
      {
        id: 'c5_finish',
        text: 'No tiene que disculparse. Evaluemos ese dolor para que descanse.',
        stats: { xp: 40 },
        unlockAchievementId: 'ach_vinculo_terapeutico',
        triggersQuiz: 'quiz_paciente_dificil',
        triggersAction: 'complete_chapter_5'
      }
    ]
  },
  ch5_ignacio_furious: {
    id: 'ch5_ignacio_furious',
    speaker: 'Don Ignacio',
    portrait: 'patient_angry',
    text: '¡Exijo hablar con el director del hospital ahora mismo!',
    choices: [
      {
        id: 'c5_finish_bad',
        text: 'Aprender la lección sobre el manejo de la agresividad en el paciente real.',
        stats: { emotionalMaturity: 3, xp: 20 },
        triggersQuiz: 'quiz_paciente_dificil',
        triggersAction: 'complete_chapter_5'
      }
    ]
  },

  // --- CAPÍTULO 6: MOTIVACIONES INCONSCIENTES (DR. ARAUJO) ---
  ch6_intro: {
    id: 'ch6_intro',
    speaker: 'Dr. Araujo',
    speakerRole: 'Tutor de Psicología Médica',
    portrait: 'psychologist_male',
    text: 'En el ejercicio médico actúan fuerzas profundas: el deseo de reparar vivencias de dolor pasadas, la necesidad de sentirnos indispensables o el anhelo de reconocimiento. ¿Qué descubres al mirar hacia tu interior?',
    choices: [
      {
        id: 'c6_repair',
        text: 'Reconozco que el sufrimiento que vi en un ser querido me impulsa a querer reparar y sanar a otros, pero debo cuidar no sobrecargarme.',
        stats: { vocation: 7, emotionalMaturity: 8, empathy: 6, xp: 85 },
        feedback: '¡Profundo autoconocimiento! El "deseo de reparar" es una de las motivaciones inconscientes más nobles y frecuentes; hacerla consciente previene la omnipotencia.',
        unlockJournalId: 'motivaciones_inconscientes',
        unlockAchievementId: 'ach_deseo_reparar',
        nextDialogueNodeId: 'ch6_araujo_wisdom'
      },
      {
        id: 'c6_omnipotence',
        text: 'Yo no tengo conflictos inconscientes ni debilidades. La medicina para mí es simplemente ciencia pura y control sobre la muerte.',
        stats: { scientificThinking: 4, emotionalMaturity: -3, empathy: -2, xp: 30 },
        feedback: 'Cuidado con la ilusión de invulnerabilidad. Negar las propias emociones conduce al distanciamiento defensivo y al agotamiento.',
        unlockJournalId: 'motivaciones_inconscientes',
        nextDialogueNodeId: 'ch6_araujo_wisdom'
      }
    ]
  },
  ch6_araujo_wisdom: {
    id: 'ch6_araujo_wisdom',
    speaker: 'Dr. Araujo',
    portrait: 'psychologist_male',
    text: 'El médico que comprende sus propias sombras y límites es el único capaz de ofrecer una compasión auténtica sin proyectar sus vacíos en el enfermo.',
    choices: [
      {
        id: 'c6_proceed',
        text: 'Agradezco esta valiosa instancia de autorreflexión, Doctor.',
        stats: { xp: 40 },
        triggersQuiz: 'quiz_motivaciones_inconscientes',
        triggersAction: 'complete_chapter_6'
      }
    ]
  },

  // --- CAPÍTULO 7: CLASIFICACIÓN DE LERSCH (SOFÍA EN BIBLIOTECA) ---
  ch7_intro: {
    id: 'ch7_intro',
    speaker: 'Sofía',
    speakerRole: 'Estudiante Investigadora',
    portrait: 'student_female',
    text: '¡Hola! Estoy repasando la Clasificación Vocacional de Philipp Lersch aplicada a la medicina. ¿En qué escenario clínico te sientes más vivo y realizado?',
    choices: [
      {
        id: 'c7_asistencial',
        text: 'Acompañando a pacientes de larga estancia, escuchando sus vidas y aliviando su sufrimiento con cercanía humana (Tendencia Asistencial).',
        stats: { empathy: 8, lerschTendency: 'asistencial', lerschValue: 10, xp: 80 },
        feedback: 'Clasificación de Lersch: Grupo 1 (Tendencia Asistencial). Tu motivación central es el cuidado directo, la empatía y el alivio del dolor humano.',
        unlockJournalId: 'clasificacion_lersch',
        unlockAchievementId: 'ach_lersch_asistencial',
        nextDialogueNodeId: 'ch7_sofia_eval'
      },
      {
        id: 'c7_conocimiento',
        text: 'Descifrando enigmas diagnósticos complejos, analizando literatura científica y descubriendo nuevos mecanismos (Tendencia al Conocimiento y Creación).',
        stats: { knowledge: 8, scientificThinking: 8, lerschTendency: 'conocimiento', lerschValue: 10, xp: 80 },
        feedback: 'Clasificación de Lersch: Grupo 2 (Tendencia al Conocimiento y Creación). Te apasiona la investigación, el análisis riguroso y la innovación científica.',
        unlockJournalId: 'clasificacion_lersch',
        unlockAchievementId: 'ach_lersch_conocimiento',
        nextDialogueNodeId: 'ch7_sofia_eval'
      },
      {
        id: 'c7_estimulacion',
        text: 'En el shock room de emergencias o quirófano, tomando decisiones inmediatas bajo presión y adrenalina (Tendencia a la Estimulación).',
        stats: { professionalism: 7, emotionalMaturity: 6, lerschTendency: 'estimulacion', lerschValue: 10, xp: 80 },
        feedback: 'Clasificación de Lersch: Grupo 3 (Tendencia a la Estimulación). Tu perfil busca la acción decisiva, el desafío y la resolución de situaciones agudas críticas.',
        unlockJournalId: 'clasificacion_lersch',
        unlockAchievementId: 'ach_lersch_estimulacion',
        nextDialogueNodeId: 'ch7_sofia_eval'
      }
    ]
  },
  ch7_sofia_eval: {
    id: 'ch7_sofia_eval',
    speaker: 'Sofía',
    portrait: 'student_female',
    text: '¡Fascinante! Recuerda que esto no es un diagnóstico rígido, sino una guía orientativa para conocer tus fortalezas y encontrar el área donde más aportes.',
    choices: [
      {
        id: 'c7_end',
        text: 'Completar la evaluación teórica de Lersch.',
        stats: { xp: 40 },
        triggersQuiz: 'quiz_lersch',
        triggersAction: 'complete_chapter_7'
      }
    ]
  },

  // --- CAPÍTULO 8: LA ELECCIÓN DE ESPECIALIDAD (CAFETERÍA) ---
  ch8_intro: {
    id: 'ch8_intro',
    speaker: 'Dr. Ramos',
    speakerRole: 'Cirujano General',
    portrait: 'surgeon_male',
    text: 'Al elegir especialidad muchos novatos solo piensan en el dinero o el estatus mediático de la serie de televisión. Pero hay factores socioeconómicos, laborales, psicológicos y personales muy reales que debes ponderar.',
    choices: [
      {
        id: 'c8_balance',
        text: 'Considero fundamental evaluar mi tolerancia al estrés, la afinidad con el tipo de pacientes y el balance con mi salud y vida personal.',
        stats: { professionalism: 6, emotionalMaturity: 7, vocation: 6, xp: 80 },
        feedback: '¡Criterio maduro! La elección de especialidad debe integrar factores psicológicos, laborales y el proyecto de vida integral del médico.',
        unlockJournalId: 'eleccion_especialidad_factores',
        unlockAchievementId: 'ach_especialidad_reflexiva',
        nextDialogueNodeId: 'ch8_specialties_talk'
      },
      {
        id: 'c8_only_money',
        text: 'Elegiré la especialidad que más rápido me genere ingresos elevados y prestigio sin importar las guardias ni el agotamiento.',
        stats: { knowledge: 2, vocation: -4, emotionalMaturity: -2, xp: 20 },
        feedback: 'Riesgo alto: Guiarse únicamente por factores socioeconómicos sin vocación psicológica es la principal causa de deserción e insatisfacción en residencias médicas.',
        unlockJournalId: 'eleccion_especialidad_factores',
        nextDialogueNodeId: 'ch8_specialties_talk'
      }
    ]
  },
  ch8_specialties_talk: {
    id: 'ch8_specialties_talk',
    speaker: 'Dra. Valle',
    speakerRole: 'Pediatra',
    portrait: 'doctor_female',
    text: 'En pediatría y medicina familiar, el vínculo humano y preventivo es infinito; en cirugía prima la destreza técnica inmediata; en psiquiatría la exploración de la mente. Ninguna es mejor, todas requieren personas comprometidas.',
    choices: [
      {
        id: 'c8_end',
        text: 'Agradezco los consejos de todos los especialistas.',
        stats: { xp: 40 },
        triggersQuiz: 'quiz_factores_especialidad',
        triggersAction: 'complete_chapter_8'
      }
    ]
  },

  // --- CAPÍTULO 9: EL REFLEJO (CONTRATRANSFERENCIA) ---
  ch9_intro: {
    id: 'ch9_intro',
    speaker: 'Dra. Lucía',
    speakerRole: 'Médico Residente',
    portrait: 'resident_female',
    text: 'Acaba de ingresar un paciente joven en estado delicado. Te veo muy pálido y angustiado... ¿Ocurre algo personal que te esté resonando?',
    choices: [
      {
        id: 'c9_contratransferencia_conscious',
        text: 'Su historia me recuerda vívidamente a la pérdida de mi hermano. Siento una fuerte contratransferencia y angustia, pero la reconozco para no perder la objetividad clínica.',
        stats: { emotionalMaturity: 9, professionalism: 8, empathy: 7, xp: 95 },
        feedback: '¡Extraordinaria madurez clínica! Reconocer la identificación y la contratransferencia evita actuar impulsivamente y protege tanto al paciente como a tu equilibrio emocional.',
        unlockJournalId: 'contratransferencia_identificacion',
        unlockAchievementId: 'ach_contratransferencia_controlada',
        nextDialogueNodeId: 'ch9_lucia_support'
      },
      {
        id: 'c9_deny_emotions',
        text: 'No me pasa nada. Los médicos no sentimos tristeza ni miedo ante los pacientes; somos profesionales de piedra.',
        stats: { emotionalMaturity: -5, professionalism: -2, empathy: -4, xp: 20 },
        feedback: 'Mecanismo defensivo de negación. Reprimir las emociones desemboca en cinismo, despersonalización y errores clínicos por sobreidentificación inconsciente.',
        unlockJournalId: 'contratransferencia_identificacion',
        nextDialogueNodeId: 'ch9_lucia_support'
      }
    ]
  },
  ch9_lucia_support: {
    id: 'ch9_lucia_support',
    speaker: 'Dra. Lucía',
    portrait: 'resident_female',
    text: 'Sentir es lo que nos hace humanos. El secreto está en procesar las emociones en equipo o con tutoría, sin volcarlas sobre el paciente ni fingir invulnerabilidad.',
    choices: [
      {
        id: 'c9_end',
        text: 'Gracias, Dra. Lucía. Ahora me siento listo para atenderlo con serenidad.',
        stats: { xp: 45 },
        triggersQuiz: 'quiz_contratransferencia',
        triggersAction: 'complete_chapter_9'
      }
    ]
  },

  // --- CAPÍTULO 10: LA PERSONA EN EL EJERCICIO DE LA MEDICINA (FINAL) ---
  ch10_intro: {
    id: 'ch10_intro',
    speaker: 'Dra. Navarro',
    speakerRole: 'Claustro de Profesores',
    portrait: 'teacher_female',
    text: 'Has recorrido un camino formativo excepcional: desde tus motivaciones iniciales hasta el entendimiento del paciente real, la ética y tus propias emociones. Ha llegado el momento del balance final de tu trayectoria.',
    choices: [
      {
        id: 'c10_oath',
        text: 'Juro ejercer la medicina integrando ciencia rigurosa, profunda compasión humana y responsabilidad ética frente a cada persona enferma.',
        stats: { vocation: 10, empathy: 10, professionalism: 10, xp: 150 },
        feedback: '¡Has culminado con honores tu formación en "La persona en el ejercicio de la medicina"!',
        unlockJournalId: 'integracion_medico_persona',
        unlockAchievementId: 'ach_la_persona_completa',
        nextDialogueNodeId: 'ch10_ending_prompt'
      }
    ]
  },
  ch10_ending_prompt: {
    id: 'ch10_ending_prompt',
    speaker: 'Dra. Navarro',
    portrait: 'teacher_female',
    text: 'Tus decisiones a lo largo de estos capítulos han forjado tu perfil como médico del mañana. ¡Veamos el dictamen de tu camino!',
    choices: [
      {
        id: 'c10_view_ending',
        text: 'Ver mi Despacho Profesional y Calificación Final.',
        stats: { xp: 50 },
        triggersAction: 'show_game_ending'
      }
    ]
  }
};

// Educational Question & Case Bank with Rich Formative Feedback
export const QUESTION_CASES: Record<string, QuestionCase> = {
  quiz_vocacion_types: {
    id: 'quiz_vocacion_types',
    title: 'Evaluación Formativa: Motivaciones Vocacionales',
    context: 'Un estudiante ingresa a Medicina afirmando: "Estudio esto porque en mi familia todos desde mi bisabuelo han sido médicos de renombre y no conciben otra opción para mí".',
    question: '¿Qué tipo de motivación vocacional predomina principalmente en este caso según la literatura académica?',
    conceptKey: 'vocacion_extrinseca_intrinseca',
    category: 'Vocación Médica',
    options: [
      {
        id: 'opt1',
        text: 'Vocación por coacción familiar / mandato social externo.',
        isCorrect: true,
        explanation: 'Correcto. Predomina una motivación extrínseca impuesta por expectativas y mandatos familiares, lo que aumenta el riesgo de frustración futura si no existe convicción intrínseca.',
        stats: { knowledge: 5, vocation: 5, xp: 40 }
      },
      {
        id: 'opt2',
        text: 'Vocación por tendencia científica pura y creación.',
        isCorrect: false,
        explanation: 'Incorrecto. No se menciona interés por la investigación o el conocimiento biológico, sino la presión del linaje familiar.',
        stats: { knowledge: 1 }
      },
      {
        id: 'opt3',
        text: 'Vocación asistencial intrínseca.',
        isCorrect: false,
        explanation: 'Incorrecto. La motivación asistencial brota del deseo interior de aliviar el sufrimiento ajeno, no de complacer a los padres.',
        stats: { knowledge: 1 }
      }
    ]
  },

  quiz_relacion_medico_paciente: {
    id: 'quiz_relacion_medico_paciente',
    title: 'Evaluación Formativa: Relación Médico-Paciente',
    context: 'Un paciente recién diagnosticado pregunta tembloroso: "Doctor, ¿por qué me tocó esto a mí? Tengo miedo". El médico responde: "No pierda el tiempo en preguntas filosóficas, tome este folleto y compre los fármacos de la receta".',
    question: '¿Cuál es la falla primordial del médico en este acto asistencial?',
    conceptKey: 'relacion_medico_paciente',
    category: 'Relación Médico-Paciente',
    options: [
      {
        id: 'opt1',
        text: 'Reduccionismo tecnicista e incapacidad de escucha empática, ignorando la dimensión humana del enfermo.',
        isCorrect: true,
        explanation: 'Correcto. La medicina no es solo prescribir recetas; requiere acoger la angustia existencial del paciente y ofrecer contención respetuosa.',
        stats: { empathy: 5, communication: 5, xp: 40 }
      },
      {
        id: 'opt2',
        text: 'No haber solicitado una resonancia magnética complementaria.',
        isCorrect: false,
        explanation: 'Incorrecto. El problema central no es técnico ni de pruebas accesorias, sino de actitud humana y comunicativa.',
        stats: { knowledge: 1 }
      },
      {
        id: 'opt3',
        text: 'Haber sido demasiado complaciente con el paciente.',
        isCorrect: false,
        explanation: 'Incorrecto. Al contrario, fue distante, descalificador y deshumanizado.',
        stats: { knowledge: 1 }
      }
    ]
  },

  quiz_biopsicosocial: {
    id: 'quiz_biopsicosocial',
    title: 'Evaluación Formativa: Dimensión Humana del Paciente',
    context: 'Una paciente hipertensa no cumple su dieta baja en sodio porque debe comer los restos de comida que le facilitan en un comedor comunitario de bajos recursos.',
    question: '¿Qué principio de la Psicología Médica debe aplicar el profesional?',
    conceptKey: 'paciente_ideal_real',
    category: 'Psicología Médica',
    options: [
      {
        id: 'opt1',
        text: 'Comprender que la enfermedad se inserta en una biografía y en determinantes sociales reales, adaptando las recomendaciones al contexto de la persona.',
        isCorrect: true,
        explanation: 'Correcto. El paciente real vive inmerso en condiciones sociales y familiares concretas; el médico no debe culparlo, sino articular soluciones realistas.',
        stats: { empathy: 5, professionalism: 5, xp: 40 }
      },
      {
        id: 'opt2',
        text: 'Sancionar a la paciente retirándole la atención médica por falta de disciplina.',
        isCorrect: false,
        explanation: 'Incorrecto. Es una conducta antiética que vulnera la responsabilidad profesional y la comprensión del ser humano.',
        stats: { professionalism: -3 }
      },
      {
        id: 'opt3',
        text: 'Ignorar la hipertensión y considerar que el tratamiento es innecesario.',
        isCorrect: false,
        explanation: 'Incorrecto. Se debe tratar la patología sin desatender el contexto social.',
        stats: { knowledge: 1 }
      }
    ]
  },

  quiz_paciente_dificil: {
    id: 'quiz_paciente_dificil',
    title: 'Evaluación Formativa: El Paciente Irritable',
    context: 'Un enfermo hospitalizado se muestra hostil, desconfiado y critica continuamente las decisiones del equipo de salud.',
    question: 'Desde el punto de vista psicológico, ¿qué suele esconder frecuentemente esta conducta?',
    conceptKey: 'estudiante_frente_enfermedad',
    category: 'Psicología Médica',
    options: [
      {
        id: 'opt1',
        text: 'Una manifestación defensiva de su intensa angustia, miedo a la vulnerabilidad y pérdida de control sobre su propia vida.',
        isCorrect: true,
        explanation: 'Correcto. La hostilidad en el enfermo a menudo es un escudo frente al terror de estar indefenso; el médico debe mantener la calma y no responder con agresión.',
        stats: { emotionalMaturity: 6, communication: 5, xp: 40 }
      },
      {
        id: 'opt2',
        text: 'Una intención deliberada y consciente de perjudicar la carrera del médico.',
        isCorrect: false,
        explanation: 'Incorrecto. Ver los ataques como ofensas personales es un sesgo inmaduro que obstaculiza la empatía.',
        stats: { emotionalMaturity: -2 }
      },
      {
        id: 'opt3',
        text: 'Falta total de patología orgánica.',
        isCorrect: false,
        explanation: 'Incorrecto. El malestar psíquico no descarta la presencia de enfermedad física severa.',
        stats: { knowledge: 1 }
      }
    ]
  },

  quiz_motivaciones_inconscientes: {
    id: 'quiz_motivaciones_inconscientes',
    title: 'Evaluación Formativa: Motivaciones Inconscientes',
    context: 'En psicología médica se describe el "deseo de reparar" como un motor vocacional frecuente.',
    question: '¿En qué consiste este fenómeno psicológico?',
    conceptKey: 'motivaciones_inconscientes',
    category: 'Psicología Médica',
    options: [
      {
        id: 'opt1',
        text: 'El impulso inconsciente de sanar a otros para elaborar internamente pérdidas, vivencias dolorosas o enfermedades sufridas en el pasado propio o familiar.',
        isCorrect: true,
        explanation: 'Correcto. La elaboración consciente del deseo de reparar permite desplegar una gran vocación solidaria evitando caer en la frustración omnipotente.',
        stats: { vocation: 5, emotionalMaturity: 6, xp: 40 }
      },
      {
        id: 'opt2',
        text: 'El arreglo mecánico de instrumentos quirúrgicos en el quirófano.',
        isCorrect: false,
        explanation: 'Incorrecto. Es un concepto psicodinámico sobre la vocación humana, no una labor de mantenimiento físico.',
        stats: { knowledge: 1 }
      },
      {
        id: 'opt3',
        text: 'La obligación legal de pagar indemnizaciones al paciente.',
        isCorrect: false,
        explanation: 'Incorrecto. No se refiere a compensaciones judiciales, sino a dinámicas afectivas profundas.',
        stats: { knowledge: 1 }
      }
    ]
  },

  quiz_lersch: {
    id: 'quiz_lersch',
    title: 'Evaluación Formativa: Clasificación de Lersch',
    context: 'Un médico se siente plenamente feliz en un laboratorio de genética analizando secuencias de ADN y formulando hipótesis experimentales para nuevas terapias.',
    question: '¿A qué grupo de la clasificación de Lersch corresponde este perfil?',
    conceptKey: 'clasificacion_lersch',
    category: 'Tipología Vocacional',
    options: [
      {
        id: 'opt1',
        text: 'Grupo 2 — Tendencia al Conocimiento y a la Creación.',
        isCorrect: true,
        explanation: 'Correcto. Este grupo se caracteriza por la curiosidad intelectual, la investigación rigurosa y la pasión por resolver interrogantes científicos.',
        stats: { scientificThinking: 6, knowledge: 5, xp: 40 }
      },
      {
        id: 'opt2',
        text: 'Grupo 3 — Tendencia a la Estimulación y Acción Inmediata.',
        isCorrect: false,
        explanation: 'Incorrecto. El grupo 3 busca la adrenalina y la resolución de crisis urgentes (ej. cirugía de trauma, emergencias).',
        stats: { knowledge: 1 }
      },
      {
        id: 'opt3',
        text: 'Grupo 1 — Tendencia Asistencial Directa.',
        isCorrect: false,
        explanation: 'Incorrecto. El grupo 1 se orienta primordialmente al cuidado directo y alivio del sufrimiento al pie de cama.',
        stats: { knowledge: 1 }
      }
    ]
  },

  quiz_factores_especialidad: {
    id: 'quiz_factores_especialidad',
    title: 'Evaluación Formativa: Factores de Especialidad',
    context: 'Al momento de postular a una residencia, un estudiante sopesa su tolerancia a las noches sin dormir, su destreza manual y su capacidad para tolerar la muerte y la incertidumbre.',
    question: '¿Qué tipo de factores de elección predominan en este análisis reflexivo?',
    conceptKey: 'eleccion_especialidad_factores',
    category: 'Elección de Especialidad',
    options: [
      {
        id: 'opt1',
        text: 'Factores psicológicos y personales de tolerancia y afinidad.',
        isCorrect: true,
        explanation: 'Correcto. Conocer la propia personalidad y resistencia al estrés es indispensable para no sufrir desajustes en la especialidad elegida.',
        stats: { emotionalMaturity: 6, professionalism: 5, xp: 40 }
      },
      {
        id: 'opt2',
        text: 'Factores socioeconómicos de mercado inmobiliario.',
        isCorrect: false,
        explanation: 'Incorrecto. El análisis se enfoca en aspectos psicológicos y habilidades del médico, no en inversiones de bienes raíces.',
        stats: { knowledge: 1 }
      },
      {
        id: 'opt3',
        text: 'Mandato institucional forzoso.',
        isCorrect: false,
        explanation: 'Incorrecto. Es un ejercicio reflexivo y deliberado del estudiante.',
        stats: { knowledge: 1 }
      }
    ]
  },

  quiz_contratransferencia: {
    id: 'quiz_contratransferencia',
    title: 'Evaluación Formativa: Contratransferencia e Identificación',
    context: 'Un médico atiende a un paciente anciano que le recuerda intensamente a su abuelo recientemente fallecido. Siente el impulso de llorar con él y sobreindicarle tratamientos no justificados por afecto.',
    question: '¿Cuál es la conducta éticamente correcta y profesional?',
    conceptKey: 'contratransferencia_identificacion',
    category: 'Psicología Médica',
    options: [
      {
        id: 'opt1',
        text: 'Reconocer conscientemente la contratransferencia y la sobreidentificación, manteniendo el marco terapéutico y solicitando supervisión si es necesario.',
        isCorrect: true,
        explanation: 'Correcto. Identificar las propias emociones permite al médico cuidarse y evitar que sus vivencias personales alteren la objetividad clínica.',
        stats: { emotionalMaturity: 7, professionalism: 7, xp: 40 }
      },
      {
        id: 'opt2',
        text: 'Fingir que no siente nada y medicar al paciente según sus propios deseos emocionales.',
        isCorrect: false,
        explanation: 'Incorrecto. La sobreidentificación no elaborada puede generar iatrogenia y daño al paciente.',
        stats: { professionalism: -3 }
      },
      {
        id: 'opt3',
        text: 'Abandonar de inmediato la carrera de Medicina por haber sentido afecto.',
        isCorrect: false,
        explanation: 'Incorrecto. Sentir afecto es natural y humano; el arte médico consiste en gestionarlo con madurez.',
        stats: { emotionalMaturity: -2 }
      }
    ]
  }
};
