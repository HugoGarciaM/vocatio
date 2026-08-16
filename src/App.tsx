import React, { useState, useEffect, useCallback } from 'react';
import { HintPopup } from './components/HintPopup';
import { 
  GameSaveState, 
  CharacterCustomization, 
  PlayerStats, 
  LerschTendencies, 
  NPC, 
  MapObject, 
  DialogueChoice, 
  DialogueNode, 
  QuestionCase, 
  Achievement,
  InventoryItem 
} from './types/game';
import { CHAPTERS_DATA, DIALOGUE_NODES, QUESTION_CASES } from './data/chaptersData';
import { ACHIEVEMENTS_DATA } from './data/achievementsData';
import { EMBLEMS_DATA } from './data/emblemsData';
import { JOURNAL_ENTRIES } from './data/journalData';
import { MAPS_DATA } from './data/mapsData';
import { soundEngine } from './audio/soundEngine';

// Components
import { TitleScreen } from './components/TitleScreen';
import { CharacterCreator } from './components/CharacterCreator';
import { GameCanvas } from './engine/GameCanvas';
import { HUD } from './components/HUD';
import { DialogueBox } from './components/DialogueBox';
import { CaseStudyModal } from './components/CaseStudyModal';
import { PauseMenu } from './components/PauseMenu';
import { LevelUpModal } from './components/LevelUpModal';
import { ChapterCompleteModal } from './components/ChapterCompleteModal';
import { AchievementToast } from './components/AchievementToast';
import { ObjectInspectorModal } from './components/ObjectInspectorModal';

const SAVE_KEY = 'vocatio_rpg_save_v1';

const NPC_DIALOGUE_ALIASES: Record<string, string> = {
  intro_prof_navarro: 'ch1_intro',
  dialogue_mateo_vocation: 'ch2_intro',
  dialogue_lucia_hospital: 'ch9_intro',
  dialogue_roberto_first_patient: 'ch3_roberto_talk',
  dialogue_carmen_human_dimension: 'ch4_intro',
  dialogue_ignacio_difficult: 'ch5_intro',
  dialogue_dr_mendoza_ward: 'ch3_intro',
  dialogue_dr_araujo_tutoria: 'ch6_intro',
  dialogue_sofia_lersch: 'ch7_intro',
  dialogue_especialidad_cirujano: 'ch8_intro',
  dialogue_especialidad_pediatra: 'ch8_specialties_talk',
  dialogue_especialidad_psiquiatra: 'ch8_specialties_talk'
};

const INITIAL_STATS: PlayerStats = {
  knowledge: 15,
  empathy: 15,
  communication: 15,
  professionalism: 15,
  vocation: 20,
  emotionalMaturity: 15,
  scientificThinking: 15
};

const INITIAL_LERSCH: LerschTendencies = {
  asistencial: 10,
  conocimiento: 10,
  estimulacion: 10
};

const INITIAL_CUSTOMIZATION: CharacterCustomization = {
  name: 'Alex Navarro',
  gender: 'female',
  hairStyle: 'short',
  hairColor: 'brown',
  skinTone: 'light',
  outfit: 'student_casual',
  accessory: 'stethoscope'
};

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'badge_id',
    name: 'Credencial Universitaria',
    description: 'Acredita tu condición de estudiante de Medicina en el Hospital Universitario.',
    category: 'badge',
    icon: '🪪',
    quantity: 1
  },
  {
    id: 'notes',
    name: 'Cuaderno de Psicología Médica',
    description: 'Anotaciones sobre la relación médico-paciente y el manejo de la contratransferencia.',
    category: 'note',
    icon: '📓',
    quantity: 1
  },
  {
    id: 'steth',
    name: 'Fonendoscopio Clínico',
    description: 'Herramienta fundamental para auscultación cardiorrespiratoria.',
    category: 'tool',
    icon: '🩺',
    quantity: 1
  }
];

const INITIAL_SAVE_STATE: GameSaveState = {
  version: 1,
  character: INITIAL_CUSTOMIZATION,
  level: 1,
  xp: 0,
  stats: INITIAL_STATS,
  lersch: INITIAL_LERSCH,
  specialty: 'undecided',
  currentChapter: 1,
  completedChapters: [],
  currentMapId: 'campus_main',
  playerX: 7,
  playerY: 6,
  playerDirection: 'down',
  inventory: INITIAL_INVENTORY,
  unlockedJournal: ['persona_medicina', 'relacion_medico_paciente'],
  unlockedAchievements: [],
  unlockedEmblems: ['emblem_escucha'],
  answeredQuestions: {},
  decisionsHistory: [],
  emotionalEnergy: 100,
  maxEnergy: 100,
  // New optional fields initialized to undefined or empty arrays
  activeMission: undefined,
  clinicalHistory: [],
  metCharacters: [],
  usedPatientIds: [],
  hintLevel: 0,
  hintTimestamp: undefined,
  hintCount: 0,
  savedAt: new Date().toISOString()
};



export default function App() {
  const [screen, setScreen] = useState<'title' | 'creator' | 'game'>('title');
  const [gameState, setGameState] = useState<GameSaveState>(INITIAL_SAVE_STATE);
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Active overlays
  const [activeDialogue, setActiveDialogue] = useState<DialogueNode | null>(null);
  const [activeCaseStudy, setActiveCaseStudy] = useState<QuestionCase | null>(null);
  const [pendingChapterCompletion, setPendingChapterCompletion] = useState<number | null>(null);
  const [activeObject, setActiveObject] = useState<MapObject | null>(null);
  const [activeMenuTab, setActiveMenuTab] = useState<string | null>(null);

  // Celebratory notifications
  const [levelUpData, setLevelUpData] = useState<{ newLevel: number; title: string } | null>(null);
  const [chapterCompleteData, setChapterCompleteData] = useState<number | null>(null);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);

  // Check saved game on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        setHasSavedGame(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const unlockAudio = () => soundEngine.unlockAudio();

    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  // Save game helper
  const handleSaveGame = useCallback((overrideState?: GameSaveState) => {
    const toSave = overrideState || gameState;
    try {
      const updated = { ...toSave, savedAt: new Date().toISOString() };
      localStorage.setItem(SAVE_KEY, JSON.stringify(updated));
      setHasSavedGame(true);
    } catch (err) {
      console.error('Failed to save game state', err);
    }
  }, [gameState]);

  // Load saved game
  const handleContinueGame = () => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as GameSaveState;
        setGameState(parsed);
        setScreen('game');
        soundEngine.playGameStart();
      }
    } catch {
      handleStartNewGame();
    }
  };

  const handleStartNewGame = () => {
    setScreen('creator');
  };

  const handleConfirmCharacter = (custom: CharacterCustomization) => {
    const newState: GameSaveState = {
      ...INITIAL_SAVE_STATE,
      character: custom,
      savedAt: new Date().toISOString()
    };
    setGameState(newState);
    handleSaveGame(newState);
    setScreen('game');
    soundEngine.playGameStart();

    // Trigger initial tutorial dialogue with Dra. Navarro
    setTimeout(() => {
      const ch1Intro = DIALOGUE_NODES['ch1_intro'];
      if (ch1Intro) {
        setActiveDialogue(ch1Intro);
      }
    }, 400);
  };

  // Check Achievement helper
  const checkAchievementUnlock = useCallback((achievementId: string, currentState: GameSaveState): GameSaveState => {
    if (currentState.unlockedAchievements.includes(achievementId)) return currentState;

    const ach = ACHIEVEMENTS_DATA.find(a => a.id === achievementId);
    if (!ach) return currentState;

    soundEngine.playAchievementUnlock();
    setRecentAchievement(ach);

    const newAchievements = [...currentState.unlockedAchievements, achievementId];
    return {
      ...currentState,
      unlockedAchievements: newAchievements,
      xp: currentState.xp + ach.xpReward
    };
  }, []);

  // Add XP and handle Level Ups
  const addXP = useCallback((amount: number) => {
    setGameState(prev => {
      let currentXP = prev.xp + amount;
      let currentLevel = prev.level;
      let requiredXP = currentLevel * 100;
      let didLevelUp = false;

      soundEngine.playXpGain();

      while (currentXP >= requiredXP) {
        currentXP -= requiredXP;
        currentLevel += 1;
        requiredXP = currentLevel * 100;
        didLevelUp = true;
      }

      let updated = {
        ...prev,
        xp: currentXP,
        level: currentLevel
      };

      if (didLevelUp) {
        const titles = ['Aspirante', 'Estudiante de Pregrado', 'Observador Clínico', 'Estudiante Avanzado', 'Interno', 'Médico en Formación'];
        const title = titles[Math.min(currentLevel - 1, titles.length - 1)];
        setLevelUpData({ newLevel: currentLevel, title });

        if (currentLevel >= 2) updated = checkAchievementUnlock('ach_level_2', updated);
        if (currentLevel >= 3) updated = checkAchievementUnlock('ach_level_3', updated);
        if (currentLevel >= 5) updated = checkAchievementUnlock('ach_level_5', updated);
      }

      handleSaveGame(updated);
      return updated;
    });
  }, [checkAchievementUnlock, handleSaveGame]);

  // Movement update
  const handlePlayerMove = (x: number, y: number, dir: 'up' | 'down' | 'left' | 'right') => {
    setGameState(prev => ({
      ...prev,
      playerX: x,
      playerY: y,
      playerDirection: dir
    }));
  };

  // Map Change / Fast Travel
  const handleChangeMap = (targetMap: string, targetX: number, targetY: number) => {
    setGameState(prev => {
      let updated = {
        ...prev,
        currentMapId: targetMap,
        playerX: targetX,
        playerY: targetY
      };

      if (targetMap === 'hospital_ward') updated = checkAchievementUnlock('ach_hospital_entry', updated);
      if (targetMap === 'library') updated = checkAchievementUnlock('ach_library_visit', updated);

      handleSaveGame(updated);
      return updated;
    });
  };

  // NPC Interaction
  const handleInteractNPC = (npc: NPC) => {
    const dialogueId = npc.dialogueTreeId ? NPC_DIALOGUE_ALIASES[npc.dialogueTreeId] || npc.dialogueTreeId : undefined;
    const node = dialogueId ? DIALOGUE_NODES[dialogueId] : undefined;

    if (node) {
      setActiveDialogue(node);
    } else {
      // Generic contextual dialogue
      const fallbackDialogue: DialogueNode = {
        id: `generic_${npc.id}`,
        speaker: npc.name,
        speakerRole: npc.role,
        text: `Hola, colega. La formación médica requiere un constante equilibrio entre el saber técnico y el corazón compasivo. Continúa tu recorrido por las salas clínicas.`,
        portrait: npc.sprite,
        choices: [
          {
            id: 'generic_1',
            text: 'Gracias por el consejo, doctor/a.',
            feedback: 'La humildad y el intercambio con los colegas enriquecen el ejercicio médico.',
            stats: { professionalism: 1 }
          }
        ]
      };
      setActiveDialogue(fallbackDialogue);
    }

    setGameState(prev => checkAchievementUnlock('ach_first_dialogue', prev));
  };

  // Map Object Interaction
  const handleInteractObject = (obj: MapObject) => {
    setActiveObject(obj);

    if (obj.type === 'coffee') {
      setGameState(prev => ({
        ...prev,
        emotionalEnergy: Math.min(prev.maxEnergy, prev.emotionalEnergy + 20)
      }));
    } else if (obj.type === 'book') {
      addXP(15);
      setGameState(prev => checkAchievementUnlock('ach_first_journal', prev));
    }
  };

  const completeChapterInState = useCallback((state: GameSaveState, chapterNumber: number): GameSaveState => {
    const completed = Array.from(new Set([...state.completedChapters, chapterNumber]));
    const nextChapterNum = Math.min(CHAPTERS_DATA.length, chapterNumber + 1);

    let updated = {
      ...state,
      completedChapters: completed,
      currentChapter: Math.max(state.currentChapter, nextChapterNum),
      xp: state.xp + 100
    };

    if (chapterNumber === 1) updated = checkAchievementUnlock('ach_ch1_complete', updated);
    if (chapterNumber === 3) updated = checkAchievementUnlock('ach_ch3_complete', updated);
    if (chapterNumber === 5) updated = checkAchievementUnlock('ach_ch5_complete', updated);
    if (chapterNumber === 10) updated = checkAchievementUnlock('ach_all_chapters', updated);

    return updated;
  }, [checkAchievementUnlock]);

  const applyChoiceProgress = useCallback((choice: DialogueChoice, baseState: GameSaveState): GameSaveState => {
    let updated = { ...baseState };

    if (choice.unlockJournalId && !updated.unlockedJournal.includes(choice.unlockJournalId)) {
      updated.unlockedJournal = [...updated.unlockedJournal, choice.unlockJournalId];
    }

    if (choice.unlockAchievementId) {
      updated = checkAchievementUnlock(choice.unlockAchievementId, updated);
    }

    if (choice.triggersAction === 'advance_quest') {
      updated = completeChapterInState(updated, updated.currentChapter);
    } else if (choice.triggersAction?.startsWith('complete_chapter_') && !choice.triggersQuiz) {
      const chapterNumber = Number(choice.triggersAction.replace('complete_chapter_', ''));
      if (Number.isFinite(chapterNumber)) {
        updated = completeChapterInState(updated, chapterNumber);
      }
    }

    return updated;
  }, [checkAchievementUnlock, completeChapterInState]);

  // Dialogue Choice Selection Handler
  const handleSelectDialogueChoice = (choice: DialogueChoice) => {
    setActiveDialogue(null);

    setGameState(prev => {
      const nextStats = { ...prev.stats };
      if (choice.stats?.empathy) nextStats.empathy = Math.max(0, nextStats.empathy + choice.stats.empathy);
      if (choice.stats?.knowledge) nextStats.knowledge = Math.max(0, nextStats.knowledge + choice.stats.knowledge);
      if (choice.stats?.communication) nextStats.communication = Math.max(0, nextStats.communication + choice.stats.communication);
      if (choice.stats?.professionalism) nextStats.professionalism = Math.max(0, nextStats.professionalism + choice.stats.professionalism);
      if (choice.stats?.vocation) nextStats.vocation = Math.max(0, nextStats.vocation + choice.stats.vocation);
      if (choice.stats?.emotionalMaturity) nextStats.emotionalMaturity = Math.max(0, nextStats.emotionalMaturity + choice.stats.emotionalMaturity);
      if (choice.stats?.scientificThinking) nextStats.scientificThinking = Math.max(0, nextStats.scientificThinking + choice.stats.scientificThinking);

      const nextLersch = { ...prev.lersch };
      if (choice.stats?.lerschTendency && choice.stats?.lerschValue) {
        nextLersch[choice.stats.lerschTendency] += choice.stats.lerschValue;
      }

      let updated = { ...prev, stats: nextStats, lersch: nextLersch };

      if (nextStats.empathy >= 30) updated = checkAchievementUnlock('ach_empathy_30', updated);
      if (nextStats.communication >= 30) updated = checkAchievementUnlock('ach_communication_30', updated);
      if (nextStats.vocation >= 35) updated = checkAchievementUnlock('ach_vocation_master', updated);

      if (choice.stats?.xp) {
        updated.xp += choice.stats.xp;
      }

      updated = applyChoiceProgress(choice, updated);

      handleSaveGame(updated);
      return updated;
    });

    // Trigger next node if present
    if (choice.nextDialogueNodeId && DIALOGUE_NODES[choice.nextDialogueNodeId]) {
      const nextNode = DIALOGUE_NODES[choice.nextDialogueNodeId];
      setTimeout(() => setActiveDialogue(nextNode), 150);
      return;
    }

    // Trigger evaluation question if configured
    if (choice.triggersQuiz && QUESTION_CASES[choice.triggersQuiz]) {
      if (choice.triggersAction?.startsWith('complete_chapter_')) {
        const chapterNumber = Number(choice.triggersAction.replace('complete_chapter_', ''));
        setPendingChapterCompletion(Number.isFinite(chapterNumber) ? chapterNumber : null);
      } else {
        setPendingChapterCompletion(null);
      }
      const q = QUESTION_CASES[choice.triggersQuiz];
      setTimeout(() => setActiveCaseStudy(q), 200);
      return;
    }

    // Advance Chapter if end of chapter dialogue
  };

  // Case Study Answer handler
  const handleAnswerCaseStudy = (isCorrect: boolean, _statsDelta?: Record<string, number>) => {
    setActiveCaseStudy(null);
    const chapterToComplete = pendingChapterCompletion || gameState.currentChapter;
    setPendingChapterCompletion(null);
    setGameState(prev => {
      let updated = { ...prev };
      if (isCorrect) {
        updated.xp += 40;
        updated = checkAchievementUnlock('ach_first_case', updated);
      }
      handleSaveGame(updated);
      return updated;
    });
    handleCompleteCurrentChapter(chapterToComplete);
  };

  // Chapter Advance Logic
  const handleCompleteCurrentChapter = (chapterNumber?: number) => {
    const currentNum = chapterNumber || gameState.currentChapter;
    setChapterCompleteData(currentNum);

    setGameState(prev => {
      const updated = completeChapterInState(prev, currentNum);

      handleSaveGame(updated);
      return updated;
    });
  };

  const handleResetGame = () => {
    localStorage.removeItem(SAVE_KEY);
    setGameState(INITIAL_SAVE_STATE);
    setHasSavedGame(false);
    setActiveMenuTab(null);
    setScreen('title');
  };

  const currentChapterObj = CHAPTERS_DATA.find(c => c.number === gameState.currentChapter) || CHAPTERS_DATA[0];
  const nextChapterObj = CHAPTERS_DATA.find(c => c.number === gameState.currentChapter + 1);
  const xpToNextLevel = gameState.level * 100;

  return (
    <div className="fixed inset-0 w-full h-full h-[100dvh] bg-slate-950 overflow-hidden font-ui select-none text-slate-100 touch-none">
      {/* 1. TITLE SCREEN */}
      {screen === 'title' && (
        <TitleScreen
          hasSavedGame={hasSavedGame}
          onStartNewGame={handleStartNewGame}
          onContinueGame={handleContinueGame}
          isMuted={isMuted}
          onToggleMute={() => {
            setIsMuted(!isMuted);
            soundEngine.toggleMute();
          }}
        />
      )}

      {/* 2. CHARACTER CREATOR */}
      {screen === 'creator' && (
        <CharacterCreator
          initialCustomization={gameState.character}
          onConfirm={handleConfirmCharacter}
        />
      )}

      {/* 3. MAIN GAMEPLAY SCREEN */}
      {screen === 'game' && (
        <div className="relative w-full h-full">
          {/* Main 2D Pixel Canvas Viewport */}
          <GameCanvas
            currentMapId={gameState.currentMapId}
            character={gameState.character}
            playerX={gameState.playerX}
            playerY={gameState.playerY}
            playerDirection={gameState.playerDirection}
            onMove={handlePlayerMove}
            onInteractNPC={handleInteractNPC}
            onInteractObject={handleInteractObject}
            onChangeMap={handleChangeMap}
            onOpenMenu={tab => setActiveMenuTab(tab || 'estadisticas')}
            disabled={Boolean(activeDialogue || activeCaseStudy || activeObject || activeMenuTab || levelUpData || chapterCompleteData)}
          />

          {/* Persistent Heads-Up Display (HUD) */}
          <HUD
            stats={gameState.stats}
            level={gameState.level}
            xp={gameState.xp}
            xpToNextLevel={xpToNextLevel}
            emotionalEnergy={gameState.emotionalEnergy}
            maxEnergy={gameState.maxEnergy}
            currentChapter={currentChapterObj}
            activeMission={gameState.activeMission}
            isMuted={isMuted}
            onToggleMute={() => {
              setIsMuted(!isMuted);
              soundEngine.toggleMute();
            }}
            onOpenMenuTab={tab => setActiveMenuTab(tab)}
          />

          {/* Interactive Dialogue Box */}
          {activeDialogue && (
            <DialogueBox
              dialogueNode={activeDialogue}
              onSelectChoice={handleSelectDialogueChoice}
              onClose={() => setActiveDialogue(null)}
            />
          )}

          {/* Evaluative Case Study Modal */}
          {activeCaseStudy && (
            <CaseStudyModal
              questionCase={activeCaseStudy}
              onAnswer={handleAnswerCaseStudy}
              onClose={() => setActiveCaseStudy(null)}
            />
          )}

          {/* Object Lore Inspector Modal */}
          {activeObject && (
            <ObjectInspectorModal
              object={activeObject}
              onClose={() => setActiveObject(null)}
            />
          )}

          {/* Full RPG Pause / Dossier Menu */}
          {activeMenuTab && (
            <PauseMenu
              initialTab={activeMenuTab}
              gameState={gameState}
              onClose={() => setActiveMenuTab(null)}
              onSaveGame={() => handleSaveGame()}
              onResetGame={handleResetGame}
              onFastTravel={handleChangeMap}
            />
          )}

          {/* Level Up Fanfare Screen */}
          {levelUpData && (
            <LevelUpModal
              newLevel={levelUpData.newLevel}
              levelTitle={levelUpData.title}
              onClose={() => setLevelUpData(null)}
            />
          )}

          {/* Chapter Complete Celebration Modal */}
          {chapterCompleteData !== null && (
            <ChapterCompleteModal
              completedChapter={CHAPTERS_DATA.find(c => c.number === chapterCompleteData) || CHAPTERS_DATA[0]}
              nextChapter={nextChapterObj}
              onContinue={() => setChapterCompleteData(null)}
            />
          )}

          {/* Floating Achievement Unlocked Toast */}
          {recentAchievement && (
            <AchievementToast
              achievement={recentAchievement}
              onClose={() => setRecentAchievement(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
