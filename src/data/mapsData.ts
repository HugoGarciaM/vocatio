import { MapLocation } from '../types/game';

// Tile constants:
// 0: Floor (parquet/tile)
// 1: Wall (solid)
// 2: Door / Portal (interactive transition)
// 3: Carpet / Rug (decorative floor)
// 4: Counter / Table / Desk (solid obstacle)
// 5: Grass (outdoor)
// 6: Path / Cobblestone (outdoor)
// 7: Tree / Bush (solid obstacle outdoor)
// 8: Water / Fountain (solid)

export const MAPS_DATA: Record<string, MapLocation> = {
  campus_main: {
    id: 'campus_main',
    name: 'Campus Universitario de Medicina',
    category: 'campus',
    description: 'La plaza central de la Facultad de Medicina. Estudiantes, profesores y personal caminan entre edificios históricos.',
    ambientSound: 'campus_breeze',
    width: 22,
    height: 15,
    spawnX: 11,
    spawnY: 10,
    tiles: [
      [1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
      [5, 5, 7, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 7, 5, 5, 5],
      [5, 7, 7, 5, 6, 5, 5, 5, 5, 6, 6, 6, 5, 5, 5, 5, 6, 5, 7, 7, 5, 5],
      [5, 5, 5, 5, 6, 5, 8, 8, 5, 6, 6, 6, 5, 8, 8, 5, 6, 5, 5, 5, 5, 5],
      [6, 6, 6, 6, 6, 5, 8, 8, 5, 6, 6, 6, 5, 8, 8, 5, 6, 6, 6, 6, 6, 6],
      [6, 5, 5, 5, 6, 5, 5, 5, 5, 6, 6, 6, 5, 5, 5, 5, 6, 5, 5, 5, 5, 6],
      [6, 5, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 4, 5, 5, 6],
      [6, 5, 5, 5, 6, 5, 5, 5, 5, 6, 6, 6, 5, 5, 5, 5, 6, 5, 5, 5, 5, 6],
      [5, 7, 5, 5, 6, 5, 7, 7, 5, 6, 6, 6, 5, 7, 7, 5, 6, 5, 5, 7, 5, 5],
      [5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    npcs: [
      {
        id: 'npc_prof_navarro',
        name: 'Dra. Navarro',
        fullName: 'Dra. Elena Navarro',
        role: 'Catedrática de Psicología Médica',
        profession: 'Médica Psiquiatra',
        age: 55,
        gender: 'female',
        sprite: 'teacher_female',
        x: 10,
        y: 6,
        direction: 'down',
        dialogueTreeId: 'intro_prof_navarro',
        currentEmotion: 'happy',
        questGiver: true
      },
      {
        id: 'npc_mateo',
        name: 'Mateo',
        fullName: 'Mateo Valdivia',
        role: 'Compañero de 1er Año',
        profession: 'Estudiante',
        age: 19,
        gender: 'male',
        sprite: 'student_male',
        x: 6,
        y: 8,
        direction: 'right',
        dialogueTreeId: 'dialogue_mateo_vocation',
        currentEmotion: 'worried'
      },
      {
        id: 'npc_lucia',
        name: 'Dra. Lucía',
        fullName: 'Dra. Lucía Fernández',
        role: 'Médico Residente de 3er Año',
        profession: 'Residente',
        age: 28,
        gender: 'female',
        sprite: 'resident_female',
        x: 16,
        y: 7,
        direction: 'left',
        dialogueTreeId: 'dialogue_lucia_hospital',
        currentEmotion: 'neutral'
      }
    ],
    objects: [
      {
        id: 'door_hospital',
        name: 'Hospital Universitario',
        x: 5,
        y: 0,
        type: 'door',
        targetMap: 'hospital_ward',
        targetX: 10,
        targetY: 12
      },
      {
        id: 'door_library',
        name: 'Biblioteca Central',
        x: 14,
        y: 0,
        type: 'door',
        targetMap: 'library',
        targetX: 9,
        targetY: 12
      },
      {
        id: 'door_psych',
        name: 'Sala de Psicología Médica y Tutoría',
        x: 10,
        y: 11,
        type: 'door',
        targetMap: 'psych_office',
        targetX: 7,
        targetY: 9
      },
      {
        id: 'obj_statue',
        name: 'Monumento a Hipócrates',
        x: 11,
        y: 4,
        type: 'poster',
        dialogueText: 'Inscripción en piedra: "Dondequiera que se ame el arte de la medicina, se ama también a la humanidad."'
      },
      {
        id: 'obj_board_campus',
        name: 'Tablón de Anuncios Universitario',
        x: 18,
        y: 3,
        type: 'whiteboard',
        dialogueText: 'Seminario Especial: "La persona del médico y la salud mental en el pregrado. Viernes 16:00 hs."'
      }
    ]
  },

  hospital_ward: {
    id: 'hospital_ward',
    name: 'HOSPITAL UNIVERSITARIO - PLANTA DE MEDICINA INTERNA',
    category: 'hospital',
    description: 'Unidad de hospitalización y consultas clínicas. El silencio profesional se mezcla con el murmullo de monitores.',
    ambientSound: 'hospital_beeps',
    width: 20,
    height: 14,
    spawnX: 10,
    spawnY: 12,
    tiles: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 0, 4, 1, 0, 0, 0, 1, 4, 0, 4, 1, 0, 0, 0, 0, 0, 4, 1],
      [1, 0, 0, 0, 1, 0, 3, 0, 1, 0, 0, 0, 1, 0, 3, 3, 3, 0, 0, 1],
      [1, 0, 0, 0, 2, 0, 3, 0, 2, 0, 0, 0, 2, 0, 3, 3, 3, 0, 0, 1],
      [1, 1, 2, 1, 1, 0, 0, 0, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 1],
      [1, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 1],
      [1, 0, 4, 0, 4, 0, 0, 3, 3, 3, 3, 0, 0, 0, 4, 4, 4, 0, 0, 1],
      [1, 0, 4, 4, 4, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    npcs: [
      {
        id: 'npc_paciente_roberto',
        name: 'Don Roberto',
        fullName: 'Roberto Salazar',
        role: 'Paciente Ansioso - Cama 101',
        profession: 'Carpintero jubilado',
        age: 62,
        gender: 'male',
        isPatient: true,
        sprite: 'patient_elder',
        x: 2,
        y: 2,
        direction: 'down',
        dialogueTreeId: 'dialogue_roberto_first_patient',
        currentEmotion: 'worried'
      },
      {
        id: 'npc_paciente_carmen',
        name: 'Doña Carmen',
        fullName: 'Carmen Rosa Mamani',
        role: 'Paciente con Patología Crónica',
        profession: 'Ama de casa',
        age: 54,
        gender: 'female',
        isPatient: true,
        sprite: 'patient_female',
        x: 10,
        y: 2,
        direction: 'down',
        dialogueTreeId: 'dialogue_carmen_human_dimension',
        currentEmotion: 'worried'
      },
      {
        id: 'npc_paciente_ignacio',
        name: 'Don Ignacio',
        fullName: 'Ignacio Vargas',
        role: 'Paciente Irritable',
        profession: 'Chofer',
        age: 48,
        gender: 'male',
        isPatient: true,
        sprite: 'patient_angry',
        x: 17,
        y: 2,
        direction: 'down',
        dialogueTreeId: 'dialogue_ignacio_difficult',
        currentEmotion: 'angry'
      },
      {
        id: 'npc_dr_mendoza',
        name: 'Dr. Mendoza',
        fullName: 'Dr. Héctor Mendoza',
        role: 'Médico Adjunto de Medicina Interna',
        profession: 'Médico Internista',
        age: 45,
        gender: 'male',
        sprite: 'doctor_male',
        x: 15,
        y: 7,
        direction: 'left',
        dialogueTreeId: 'dialogue_dr_mendoza_ward',
        currentEmotion: 'neutral',
        questGiver: true
      },
      {
        id: 'npc_enfermera_elena',
        name: 'Lic. Elena',
        fullName: 'Lic. Elena Rojas',
        role: 'Enfermera Jefa de Planta',
        profession: 'Enfermera Especialista',
        age: 42,
        gender: 'female',
        sprite: 'nurse_female',
        x: 3,
        y: 7,
        direction: 'right',
        dialogueTreeId: 'dialogue_enfermera_elena',
        currentEmotion: 'happy'
      }
    ],
    objects: [
      {
        id: 'door_exit_hospital',
        name: 'Salida al Campus',
        x: 9,
        y: 13,
        type: 'door',
        targetMap: 'campus_main',
        targetX: 5,
        targetY: 2
      },
      {
        id: 'obj_historia_clinica',
        name: 'Estación de Historias Clínicas',
        x: 14,
        y: 5,
        type: 'file',
        dialogueText: 'Carpetas de historias clínicas. Recuerda: Detrás de cada número de expediente hay una biografía humana que merece confidencialidad absoluta.'
      },
      {
        id: 'obj_farmacos',
        name: 'Carro de Medicación Segura',
        x: 2,
        y: 6,
        type: 'shelf',
        dialogueText: 'Medicamentos rotulados con precisión. La técnica farmacéutica es vital, pero la adherencia del paciente depende del vínculo de confianza que construyas.'
      }
    ]
  },

  library: {
    id: 'library',
    name: 'Biblioteca Histórica de Medicina',
    category: 'campus',
    description: 'Estantes repletos de tratados clásicos, publicaciones biomédicas y manuales de psicología y ética.',
    ambientSound: 'library_calm',
    width: 18,
    height: 14,
    spawnX: 9,
    spawnY: 12,
    tiles: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 4, 1, 4, 4, 1, 0, 0, 0, 0, 1, 4, 4, 1, 4, 4, 1],
      [1, 4, 4, 1, 4, 4, 1, 0, 3, 3, 0, 1, 4, 4, 1, 4, 4, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 1],
      [1, 0, 4, 0, 4, 0, 0, 4, 4, 4, 4, 0, 0, 4, 0, 4, 0, 1],
      [1, 0, 4, 4, 4, 0, 0, 4, 0, 0, 4, 0, 0, 4, 4, 4, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 4, 4, 4, 0, 0, 0, 3, 3, 0, 0, 0, 4, 4, 4, 0, 1],
      [1, 0, 4, 0, 4, 0, 0, 0, 3, 3, 0, 0, 0, 4, 0, 4, 0, 1],
      [1, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    npcs: [
      {
        id: 'npc_bibliotecario',
        name: 'D. Ernesto',
        role: 'Bibliotecario y Custodio de Archivos',
        sprite: 'elder_male',
        x: 9,
        y: 2,
        direction: 'down',
        dialogueTreeId: 'dialogue_bibliotecario',
        currentEmotion: 'neutral'
      },
      {
        id: 'npc_sofia_estudiante',
        name: 'Sofía',
        role: 'Estudiante de Último Año (Investigadora)',
        sprite: 'student_female',
        x: 4,
        y: 6,
        direction: 'right',
        dialogueTreeId: 'dialogue_sofia_lersch',
        currentEmotion: 'thinking'
      }
    ],
    objects: [
      {
        id: 'door_exit_library',
        name: 'Salida al Campus',
        x: 9,
        y: 13,
        type: 'door',
        targetMap: 'campus_main',
        targetX: 14,
        targetY: 2
      },
      {
        id: 'book_psicologia_medica',
        name: 'Tratado de Psicología Médica y Humanidades',
        x: 1,
        y: 1,
        type: 'book',
        journalId: 'persona_medicina',
        dialogueText: 'Abres el capítulo fundamental: "La persona en el ejercicio de la medicina". Se añade una entrada clave al Diario del Estudiante.'
      },
      {
        id: 'book_lersch',
        name: 'Compendio de Tipología Vocacional',
        x: 4,
        y: 1,
        type: 'book',
        journalId: 'clasificacion_lersch',
        dialogueText: 'Texto sobre la Clasificación de Lersch: Tendencia Asistencial, al Conocimiento y a la Estimulación.'
      }
    ]
  },

  psych_office: {
    id: 'psych_office',
    name: 'Sala de Psicología Médica & Tutoría',
    category: 'clinic',
    description: 'Espacio cálido y confidencial destinado a la reflexión de la vocación, la salud mental y la relación clínica.',
    ambientSound: 'clinic_gentle',
    width: 16,
    height: 12,
    spawnX: 7,
    spawnY: 10,
    tiles: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 4, 1, 0, 0, 0, 0, 0, 0, 1, 4, 4, 4, 4, 1],
      [1, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 4, 0, 0, 3, 4, 4, 3, 0, 0, 4, 0, 0, 0, 1],
      [1, 0, 4, 0, 0, 3, 4, 4, 3, 0, 0, 4, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 1],
      [1, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1]
    ],
    npcs: [
      {
        id: 'npc_dr_araujo',
        name: 'Dr. Araujo',
        fullName: 'Dr. Samuel Araujo',
        role: 'Tutor de Psicología Médica',
        profession: 'Psicólogo Clínico',
        age: 50,
        gender: 'male',
        sprite: 'psychologist_male',
        x: 7,
        y: 4,
        direction: 'down',
        dialogueTreeId: 'dialogue_dr_araujo_tutoria',
        currentEmotion: 'thinking',
        questGiver: true
      }
    ],
    objects: [
      {
        id: 'door_exit_psych',
        name: 'Salida al Campus',
        x: 7,
        y: 11,
        type: 'door',
        targetMap: 'campus_main',
        targetX: 10,
        targetY: 10
      },
      {
        id: 'whiteboard_psych',
        name: 'Pizarra de Esquemas Psicológicos',
        x: 11,
        y: 1,
        type: 'whiteboard',
        dialogueText: 'Esquema dibujado: "Médico = Ciencia + Humanidad + Autoconocimiento. Cuidar al cuidador."'
      },
      {
        id: 'sofa_reflection',
        name: 'Sillón de Reflexión Clínica',
        x: 2,
        y: 4,
        type: 'plant',
        dialogueText: 'Un espacio tranquilo para hacer una pausa, respirar y ordenar tus pensamientos antes de volver a la clínica.'
      }
    ]
  },

  cafeteria: {
    id: 'cafeteria',
    name: 'Cafetería del Campus Universitario',
    category: 'campus',
    description: 'El punto de encuentro informal donde estudiantes y médicos comparten experiencias y alivian la tensión de las guardias.',
    ambientSound: 'cafeteria_hum',
    width: 18,
    height: 12,
    spawnX: 9,
    spawnY: 10,
    tiles: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 4, 4, 0, 0, 4, 4, 0, 0, 4, 4, 0, 0, 4, 4, 0, 1],
      [1, 0, 4, 4, 0, 0, 4, 4, 0, 0, 4, 4, 0, 0, 4, 4, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 4, 4, 0, 0, 4, 4, 0, 0, 4, 4, 0, 0, 4, 4, 0, 1],
      [1, 0, 4, 4, 0, 0, 4, 4, 0, 0, 4, 4, 0, 0, 4, 4, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    npcs: [
      {
        id: 'npc_dr_cirujano_ramos',
        name: 'Dr. Ramos',
        fullName: 'Dr. Alberto Ramos',
        role: 'Cirujano General',
        profession: 'Cirujano',
        age: 52,
        gender: 'male',
        sprite: 'surgeon_male',
        x: 3,
        y: 4,
        direction: 'right',
        dialogueTreeId: 'dialogue_especialidad_cirujano',
        currentEmotion: 'neutral'
      },
      {
        id: 'npc_dra_pediatra_valle',
        name: 'Dra. Valle',
        fullName: 'Dra. Patricia Valle',
        role: 'Pediatra',
        profession: 'Médica Pediatra',
        age: 38,
        gender: 'female',
        sprite: 'doctor_female',
        x: 7,
        y: 4,
        direction: 'left',
        dialogueTreeId: 'dialogue_especialidad_pediatra',
        currentEmotion: 'happy'
      },
      {
        id: 'npc_dr_psiquiatra_rios',
        name: 'Dr. Ríos',
        fullName: 'Dr. Javier Ríos',
        role: 'Psiquiatra y Docente',
        profession: 'Médico Psiquiatra',
        age: 60,
        gender: 'male',
        sprite: 'doctor_male',
        x: 11,
        y: 4,
        direction: 'right',
        dialogueTreeId: 'dialogue_especialidad_psiquiatra',
        currentEmotion: 'thinking'
      }
    ],
    objects: [
      {
        id: 'door_exit_cafeteria',
        name: 'Salida al Campus',
        x: 8,
        y: 10,
        type: 'door',
        targetMap: 'campus_main',
        targetX: 18,
        targetY: 8
      },
      {
        id: 'coffee_machine',
        name: 'Cafetera de la Facultad',
        x: 2,
        y: 1,
        type: 'coffee',
        dialogueText: 'Tomas un café caliente. Recuperas +15 de Energía Emocional y Compostura.'
      }
    ]
  }
};
