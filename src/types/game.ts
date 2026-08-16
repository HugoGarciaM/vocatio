export type HintLevel = 'none' | 'level1' | 'level2' | 'level3';

export interface HintState {
  missionId: string;
  objectiveId: string;
  level: HintLevel;
  lastShown: string | null; // ISO timestamp
  hintCount: number;
}

export interface HintSettings {
  autoHints: boolean;
  helpLevel: 'minimo' | 'normal' | 'alto';
}

export interface GameSaveState {
  version: number;
  character: CharacterCustomization;
  stats: PlayerStats;
  lersch: LerschTendencies;
  specialty: SpecialtyPreference;
  xp: number;
  level: number;
  emotionalEnergy: number;
  maxEnergy: number;
  currentChapter: number;
  currentMapId: string;
  playerX: number;
  playerY: number;
  playerDirection: 'up' | 'down' | 'left' | 'right';
  completedChapters: number[];
  unlockedAchievements: string[];
  unlockedEmblems: string[];
  unlockedJournal: string[];
  answeredQuestions: { [key: string]: { answerId: string; isCorrect: boolean; timestamp: string } };
  decisionsHistory: PlayerDecisionRecord[];
  inventory: InventoryItem[];
  // Nuevos campos para la reestructuración:
  activeMission?: Mission;
  clinicalHistory: PatientRecord[];
  metCharacters: string[]; // IDs de los NPCs conocidos
  usedPatientIds: string[]; // Para evitar repetición
  hintLevel?: number; // Nivel de pista actual (0 = nada, 1-3 progresivo)
  hintTimestamp?: string; // ISO timestamp de la última pista mostrada
  hintCount?: number; // Cantidad total de pistas mostradas para la misión actual
  savedAt: string;
  // New hint system fields
  hintState?: HintState[];
  hintSettings?: HintSettings;
}
export type HairStyle = 'short' | 'long' | 'curly' | 'ponytail' | 'spiky' | 'messy' | 'fade';
export type HairColor = 'black' | 'brown' | 'blonde' | 'red' | 'silver' | 'blue';
export type SkinTone = 'fair' | 'light' | 'medium' | 'tan' | 'dark' | 'deep';
export type Outfit = 'student_casual' | 'scrubs_cyan' | 'scrubs_navy' | 'lab_coat_white' | 'intern_formal';
export type Accessory = 'none' | 'glasses' | 'stethoscope' | 'lanyard' | 'smartwatch';
export type Gender = 'female' | 'male' | 'nonbinary';

export interface CharacterCustomization {
  name: string;
  gender: Gender;
  hairStyle: HairStyle;
  hairColor: HairColor;
  skinTone: SkinTone;
  outfit: Outfit;
  accessory: Accessory;
}

export interface PlayerStats {
  knowledge: number;          // 🧠 Conocimiento
  empathy: number;            // ❤️ Empatía
  communication: number;      // 🗣️ Comunicación
  professionalism: number;    // ⚕️ Profesionalismo
  vocation: number;           // 🧭 Vocación (Autenticidad)
  emotionalMaturity: number;  // 🧘 Madurez Emocional
  scientificThinking: number; // 🔬 Pensamiento Científico
}

export interface LerschTendencies {
  asistencial: number;    // Grupo 1: Cuidar, acompañar, aliviar sufrimiento
  conocimiento: number;   // Grupo 2: Investigar, descubrir, resolver problemas
  estimulacion: number;   // Grupo 3: Acción, situaciones intensas, desafío
}

export type SpecialtyPreference = 
  | 'undecided'
  | 'medicina_interna'
  | 'cirugia'
  | 'pediatria'
  | 'psiquiatria'
  | 'medicina_familiar'
  | 'urgencias'
  | 'investigacion'
  | 'cardiologia';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: 'tool' | 'note' | 'book' | 'badge';
  icon: string;
  quantity: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'clinical' | 'vocation' | 'empathy' | 'academic' | 'special';
  icon: string;
  xpReward: number;
  unlockedAt?: string;
  isSecret?: boolean;
}

export interface Emblem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockCondition: string;
  effect: string;
  unlocked: boolean;
}

export interface JournalEntry {
  id: string;
  title: string;
  category: 'vocacion' | 'relacion_medico_paciente' | 'psicologia_medica' | 'etica_y_persona';
  summary: string;
  content: string[];
  clinicalTakeaway: string;
  unlocked: boolean;
}

export interface StatDelta {
  knowledge?: number;
  empathy?: number;
  communication?: number;
  professionalism?: number;
  vocation?: number;
  emotionalMaturity?: number;
  scientificThinking?: number;
  energy?: number;
  xp?: number;
  lerschTendency?: 'asistencial' | 'conocimiento' | 'estimulacion';
  lerschValue?: number;
}

export interface DialogueChoice {
  id: string;
  text: string;
  stats?: StatDelta;
  responseDialog?: string;
  unlockJournalId?: string;
  unlockAchievementId?: string;
  nextDialogueNodeId?: string;
  feedback?: string; // Retroalimentación educativa inmediata
  triggersQuiz?: string; // id de pregunta evaluativa
  triggersAction?: string;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  portrait: string;
  speakerRole?: string;
  text: string;
  choices?: DialogueChoice[];
  nextId?: string;
  unlockJournalId?: string;
}

export interface QuestionCase {
  id: string;
  title: string;
  context: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
    stats?: StatDelta;
  }[];
  category: string;
  conceptKey: string;
}

export interface NPC {
  id: string;
  name: string; // Nombre corto / ID visual anterior
  fullName?: string; // Nombre completo: ej. "Dra. Valeria Mendoza"
  role: string; // ej. "Médica Residente"
  age?: number;
  gender?: Gender;
  profession?: string;
  personality?: string;
  sprite: string;
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  dialogueTreeId: string;
  currentEmotion?: 'neutral' | 'worried' | 'happy' | 'angry' | 'relieved' | 'thinking';
  questGiver?: boolean;
  requiredChapter?: number;
  availableUntilChapter?: number;
  isPatient?: boolean;
}

export interface PatientRecord {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  profession: string;
  reasonForVisit: string;
  background: string;
  findings: string;
  studies: string;
  diagnosis: string;
  decisions: string;
  result: string;
}

export interface MissionObjective {
  id: string;
  text: string;
  completed: boolean;
  location?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  objectives: MissionObjective[];
  currentObjectiveId: string;
  nextStepPrompt: string;
  isCompleted: boolean;
}

export interface MapObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  type: 'file' | 'book' | 'computer' | 'bed' | 'plant' | 'poster' | 'door' | 'coffee' | 'whiteboard' | 'shelf';
  dialogueText?: string;
  interactAction?: string;
  journalId?: string;
  achievementId?: string;
  targetMap?: string;
  targetX?: number;
  targetY?: number;
}

export interface MapLocation {
  id: string;
  name: string;
  category: 'campus' | 'hospital' | 'residence' | 'clinic';
  description: string;
  ambientSound: 'campus_breeze' | 'hospital_beeps' | 'library_calm' | 'cafeteria_hum' | 'clinic_gentle';
  width: number; // in tiles (e.g. 24)
  height: number; // in tiles (e.g. 18)
  tiles: number[][]; // 0: floor, 1: wall, 2: door, 3: carpet, 4: counter, 5: outdoor_grass, 6: tree, etc.
  npcs: NPC[];
  objects: MapObject[];
  spawnX: number;
  spawnY: number;
}

export interface Chapter {
  number: number;
  title: string;
  subtitle: string;
  locationId: string;
  summary: string;
  mainObjective: string;
  completed: boolean;
  unlocked: boolean;
  introDialogueId: string;
  clinicalCasesCount: number;
}

export interface PlayerDecisionRecord {
  chapter: number;
  scene: string;
  choiceMade: string;
  reasoningCategory: string;
  timestamp: string;
}

export interface GameSaveState {
  version: number;
  character: CharacterCustomization;
  stats: PlayerStats;
  lersch: LerschTendencies;
  specialty: SpecialtyPreference;
  xp: number;
  level: number;
  emotionalEnergy: number;
  maxEnergy: number;
  currentChapter: number;
  currentMapId: string;
  playerX: number;
  playerY: number;
  playerDirection: 'up' | 'down' | 'left' | 'right';
  completedChapters: number[];
  unlockedAchievements: string[];
  unlockedEmblems: string[];
  unlockedJournal: string[];
  answeredQuestions: { [key: string]: { answerId: string; isCorrect: boolean; timestamp: string } };
  decisionsHistory: PlayerDecisionRecord[];
  inventory: InventoryItem[];
  // Nuevos campos para la reestructuración:
  activeMission?: Mission;
  clinicalHistory: PatientRecord[];
  metCharacters: string[]; // IDs de los NPCs conocidos
  usedPatientIds: string[]; // Para evitar repetición
  hintLevel?: number; // Nivel de pista actual (0 = nada, 1-3 progresivo)
  hintTimestamp?: string; // ISO timestamp de la última pista mostrada
  hintCount?: number; // Cantidad total de pistas mostradas para la misión actual
  savedAt: string;
}
