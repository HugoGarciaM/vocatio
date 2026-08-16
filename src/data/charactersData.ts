import { NPC, Gender } from '../types/game';

// Define the full roster of named medical staff and teachers
export const MEDICAL_STAFF: Record<string, Partial<NPC>> = {
  dr_navarro: {
    id: 'npc_prof_navarro',
    name: 'Dra. Navarro',
    fullName: 'Dra. Elena Navarro',
    role: 'Catedrática de Psicología Médica',
    profession: 'Médica Psiquiatra',
    age: 55,
    gender: 'female',
    sprite: 'teacher_female',
    personality: 'Estricta pero profundamente humana y observadora.',
  },
  dr_mendoza: {
    id: 'npc_dr_mendoza',
    name: 'Dr. Mendoza',
    fullName: 'Dr. Héctor Mendoza',
    role: 'Médico Adjunto de Medicina Interna',
    profession: 'Médico Internista',
    age: 45,
    gender: 'male',
    sprite: 'doctor_male',
    personality: 'Pragmático, técnico, pero dispuesto a enseñar.',
  },
  dr_araujo: {
    id: 'npc_dr_araujo',
    name: 'Dr. Araujo',
    fullName: 'Dr. Samuel Araujo',
    role: 'Tutor de Psicología Médica',
    profession: 'Psicólogo Clínico',
    age: 50,
    gender: 'male',
    sprite: 'psychologist_male',
    personality: 'Reflexivo, empático, habla con pausas.',
  },
  dr_lucia: {
    id: 'npc_lucia',
    name: 'Dra. Lucía',
    fullName: 'Dra. Lucía Fernández',
    role: 'Médico Residente de 3er Año',
    profession: 'Residente de Medicina Interna',
    age: 28,
    gender: 'female',
    sprite: 'resident_female',
    personality: 'Agotada pero solidaria con los estudiantes nuevos.',
  },
  enf_elena: {
    id: 'npc_enfermera_elena',
    name: 'Lic. Elena',
    fullName: 'Lic. Elena Rojas',
    role: 'Enfermera Jefa de Planta',
    profession: 'Enfermera Especialista',
    age: 42,
    gender: 'female',
    sprite: 'nurse_female',
    personality: 'Organizada, maternal y protectora de los pacientes.',
  },
  dr_ramos: {
    id: 'npc_dr_cirujano_ramos',
    name: 'Dr. Ramos',
    fullName: 'Dr. Alberto Ramos',
    role: 'Cirujano General',
    profession: 'Cirujano',
    age: 52,
    gender: 'male',
    sprite: 'surgeon_male',
    personality: 'Directo, seguro de sí mismo, valora la acción rápida.',
  },
  dra_valle: {
    id: 'npc_dra_pediatra_valle',
    name: 'Dra. Valle',
    fullName: 'Dra. Patricia Valle',
    role: 'Pediatra',
    profession: 'Médica Pediatra',
    age: 38,
    gender: 'female',
    sprite: 'doctor_female',
    personality: 'Cálida, paciente y centrada en el vínculo.',
  },
  dr_rios: {
    id: 'npc_dr_psiquiatra_rios',
    name: 'Dr. Ríos',
    fullName: 'Dr. Javier Ríos',
    role: 'Psiquiatra y Docente',
    profession: 'Médico Psiquiatra',
    age: 60,
    gender: 'male',
    sprite: 'doctor_male',
    personality: 'Analítico, interesado en los dilemas éticos.',
  },
  mateo: {
    id: 'npc_mateo',
    name: 'Mateo',
    fullName: 'Mateo Valdivia',
    role: 'Estudiante de Medicina (1er Año)',
    profession: 'Estudiante',
    age: 19,
    gender: 'male',
    sprite: 'student_male',
    personality: 'Inseguro, bajo mucha presión familiar.',
  },
  sofia: {
    id: 'npc_sofia_estudiante',
    name: 'Sofía',
    fullName: 'Sofía Castro',
    role: 'Estudiante Investigadora',
    profession: 'Estudiante',
    age: 23,
    gender: 'female',
    sprite: 'student_female',
    personality: 'Curiosa, académica, apasionada por la teoría.',
  }
};

// Define a pool of predefined unique patients to avoid cloning
export const PATIENTS_POOL: Partial<NPC>[] = [
  {
    id: 'pat_roberto',
    name: 'Don Roberto',
    fullName: 'Roberto Salazar',
    role: 'Paciente',
    age: 62,
    gender: 'male',
    profession: 'Carpintero jubilado',
    sprite: 'patient_elder',
    personality: 'Temeroso por sus antecedentes familiares de cardiopatía.',
    isPatient: true
  },
  {
    id: 'pat_carmen',
    name: 'Doña Carmen',
    fullName: 'Carmen Rosa Mamani',
    role: 'Paciente',
    age: 54,
    gender: 'female',
    profession: 'Ama de casa y cuidadora',
    sprite: 'patient_female',
    personality: 'Sobrecargada, triste y con dificultades socioeconómicas.',
    isPatient: true
  },
  {
    id: 'pat_ignacio',
    name: 'Don Ignacio',
    fullName: 'Ignacio Vargas',
    role: 'Paciente',
    age: 48,
    gender: 'male',
    profession: 'Chofer de transporte público',
    sprite: 'patient_angry',
    personality: 'Irritable, frustrado por el dolor crónico y la espera.',
    isPatient: true
  },
  {
    id: 'pat_carlos_eduardo',
    name: 'Carlos Eduardo',
    fullName: 'Carlos Eduardo Fernández',
    role: 'Paciente',
    age: 47,
    gender: 'male',
    profession: 'Contador',
    sprite: 'patient_male',
    personality: 'Ansioso, hace muchas preguntas sobre su dolor abdominal.',
    isPatient: true
  },
  {
    id: 'pat_maria_elena',
    name: 'María Elena',
    fullName: 'María Elena Quispe',
    role: 'Paciente',
    age: 35,
    gender: 'female',
    profession: 'Comerciante',
    sprite: 'patient_female',
    personality: 'Preocupada por no poder trabajar debido a sus mareos.',
    isPatient: true
  },
  {
    id: 'pat_jose_antonio',
    name: 'José Antonio',
    fullName: 'José Antonio Mamani',
    role: 'Paciente',
    age: 22,
    gender: 'male',
    profession: 'Estudiante universitario',
    sprite: 'patient_young_male',
    personality: 'Asustado, sufre ataques de pánico que confunde con infartos.',
    isPatient: true
  },
  {
    id: 'pat_andrea_patricia',
    name: 'Andrea Patricia',
    fullName: 'Andrea Patricia Salazar',
    role: 'Paciente',
    age: 29,
    gender: 'female',
    profession: 'Desarrolladora de software',
    sprite: 'patient_young_female',
    personality: 'Analítica, trae su propia investigación de internet.',
    isPatient: true
  },
  {
    id: 'pat_miguel_angel',
    name: 'Miguel Ángel',
    fullName: 'Miguel Ángel Condori',
    role: 'Paciente',
    age: 71,
    gender: 'male',
    profession: 'Agricultor retirado',
    sprite: 'patient_elder',
    personality: 'Resignado, habla poco y minimiza sus síntomas.',
    isPatient: true
  }
];

export const getCharacterIdentity = (id: string): Partial<NPC> | undefined => {
  const staff = Object.values(MEDICAL_STAFF).find(s => s.id === id);
  if (staff) return staff;
  
  const patient = PATIENTS_POOL.find(p => p.id === id);
  if (patient) return patient;

  return undefined;
};

export const getUniquePatient = (usedIds: string[], preferredAgeGroup?: 'young' | 'adult' | 'elder'): Partial<NPC> | null => {
  let available = PATIENTS_POOL.filter(p => p.id && !usedIds.includes(p.id));
  
  if (preferredAgeGroup) {
    const ageFiltered = available.filter(p => {
      if (preferredAgeGroup === 'young' && p.age! < 30) return true;
      if (preferredAgeGroup === 'adult' && p.age! >= 30 && p.age! < 60) return true;
      if (preferredAgeGroup === 'elder' && p.age! >= 60) return true;
      return false;
    });
    if (ageFiltered.length > 0) available = ageFiltered;
  }

  if (available.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
};
