import React, { useState } from 'react';
import { 
  GameSaveState, 
  Chapter, 
  Achievement, 
  Emblem, 
  JournalEntry, 
  PlayerStats, 
  LerschTendencies, 
  InventoryItem 
} from '../types/game';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { ACHIEVEMENTS_DATA } from '../data/achievementsData';
import { EMBLEMS_DATA } from '../data/emblemsData';
import { JOURNAL_ENTRIES } from '../data/journalData';
import { MAPS_DATA } from '../data/mapsData';
import { soundEngine } from '../audio/soundEngine';
import { 
  BarChart3, 
  Scroll, 
  Briefcase, 
  Trophy, 
  Award, 
  BookOpen, 
  MapPin, 
  Settings, 
  X, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Heart, 
  Brain, 
  MessageSquare, 
  ShieldCheck, 
  Compass, 
  Sliders,
  Target,
  Users,
  ClipboardList,
  GraduationCap
} from 'lucide-react';
import { getCharacterIdentity } from '../data/charactersData';

interface PauseMenuProps {
  initialTab?: string;
  gameState: GameSaveState;
  onClose: () => void;
  onSaveGame: () => void;
  onResetGame: () => void;
  onFastTravel: (mapId: string, x: number, y: number) => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  initialTab = 'estadisticas',
  gameState,
  onClose,
  onSaveGame,
  onResetGame,
  onFastTravel
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [achievementFilter, setAchievementFilter] = useState<string>('all');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const tabs = [
    { id: 'mision_actual', label: 'Misión Actual', icon: Target },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
    { id: 'historial', label: 'Historial Clínico', icon: ClipboardList },
    { id: 'personajes', label: 'Personajes', icon: Users },
    { id: 'progreso', label: 'Progreso', icon: GraduationCap },
    { id: 'misiones', label: 'Capítulos', icon: Scroll },
    { id: 'inventario', label: 'Inventario', icon: Briefcase },
    { id: 'logros', label: 'Logros', icon: Trophy },
    { id: 'emblemas', label: 'Emblemas', icon: Award },
    { id: 'diario', label: 'Diario', icon: BookOpen },
    { id: 'mapa', label: 'Mapa', icon: MapPin },
    { id: 'opciones', label: 'Opciones', icon: Settings }
  ];

  const handleTabSwitch = (tabId: string) => {
    soundEngine.playSelect();
    setActiveTab(tabId);
  };

  const handleSave = () => {
    soundEngine.playAchievementUnlock();
    onSaveGame();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Calculate Lersch tendency dominance
  const totalLersch = gameState.lersch.asistencial + gameState.lersch.conocimiento + gameState.lersch.estimulacion || 1;
  const asistencialPercent = Math.round((gameState.lersch.asistencial / totalLersch) * 100);
  const conocimientoPercent = Math.round((gameState.lersch.conocimiento / totalLersch) * 100);
  const estimulacionPercent = Math.round((gameState.lersch.estimulacion / totalLersch) * 100);

  // Overall Campaign Progress
  const completedChaptersCount = gameState.completedChapters.length;
  const progressPercent = Math.round((completedChaptersCount / CHAPTERS_DATA.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="max-w-5xl w-full h-[90vh] bg-slate-900 border-2 border-cyan-500 rounded-3xl shadow-2xl overflow-hidden pixel-box flex flex-col">
        {/* Top Title Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-600 border border-cyan-300 flex items-center justify-center text-slate-950 font-bold font-retro shadow-md">
              V
            </div>
            <div>
              <h2 className="font-retro text-base font-bold text-slate-100">
                Expediente y Menú del Médico
              </h2>
              <p className="text-[11px] text-cyan-400 font-ui">
                {gameState.character.name} • Nivel {gameState.level} • {progressPercent}% de Formación Completada
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playSelect();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-900 border border-slate-700 hover:border-rose-500 text-slate-300 hover:text-rose-200 flex items-center justify-center pixel-button cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-4 flex items-center gap-1.5 overflow-x-auto py-2 shrink-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabSwitch(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-retro flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${isActive ? 'bg-cyan-500 text-slate-950 font-bold shadow-md border-b-2 border-cyan-300' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/90 text-slate-100">
          
          {/* TAB 0: MISIÓN ACTUAL */}
          {activeTab === 'mision_actual' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-retro flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5" />
                  Misión Activa: {gameState.activeMission ? gameState.activeMission.title : CHAPTERS_DATA.find(c => c.number === gameState.currentChapter)?.title}
                </h3>
                <p className="text-sm text-slate-300 font-ui mb-6">
                  {gameState.activeMission ? gameState.activeMission.description : CHAPTERS_DATA.find(c => c.number === gameState.currentChapter)?.summary}
                </p>

                <div className="space-y-3">
                  <h4 className="font-retro text-xs text-slate-400 mb-2 border-b border-slate-800 pb-2">Objetivos Paso a Paso</h4>
                  {gameState.activeMission ? (
                    gameState.activeMission.objectives.map((obj, i) => (
                      <div key={obj.id} className={`flex items-start gap-3 p-3 rounded-xl border ${obj.completed ? 'bg-emerald-950/30 border-emerald-900/50 text-slate-400' : obj.id === gameState.activeMission?.currentObjectiveId ? 'bg-cyan-950/50 border-cyan-700 text-slate-100 shadow-md' : 'bg-slate-900/50 border-slate-800 text-slate-500'}`}>
                        {obj.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : obj.id === gameState.activeMission.currentObjectiveId ? (
                          <div className="w-5 h-5 rounded-full border-2 border-cyan-400 flex items-center justify-center shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-700 shrink-0"></div>
                        )}
                        <div className="flex-1">
                          <p className={`font-ui text-sm ${obj.completed ? 'line-through opacity-70' : ''}`}>{obj.text}</p>
                          {obj.location && !obj.completed && <p className="text-[10px] text-cyan-500 mt-1 uppercase">📍 Ubicación: {obj.location}</p>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-amber-300 font-ui bg-amber-950/30 p-4 rounded-xl border border-amber-900/50">
                      Explora el campus para encontrar tu siguiente objetivo narrativo.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: ESTADÍSTICAS */}
          {activeTab === 'estadisticas' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core RPG Stats */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    Estadísticas Clínicas y Humanas
                  </h3>

                  <div className="space-y-3.5">
                    {[
                      { key: 'empathy', label: '❤️ Empatía y Escucha', val: gameState.stats.empathy, color: 'bg-rose-500', desc: 'Comprensión de la vivencia subjetiva del enfermo.' },
                      { key: 'knowledge', label: '🧠 Conocimiento Biomédico', val: gameState.stats.knowledge, color: 'bg-blue-500', desc: 'Rigor científico y medicina basada en la evidencia.' },
                      { key: 'communication', label: '🗣️ Comunicación Asertiva', val: gameState.stats.communication, color: 'bg-emerald-500', desc: 'Claridad en la información y desescalada de conflictos.' },
                      { key: 'professionalism', label: '⚕️ Profesionalismo y Ética', val: gameState.stats.professionalism, color: 'bg-purple-500', desc: 'Respeto al marco ético y secreto médico.' },
                      { key: 'vocation', label: '🧭 Vocación Auténtica', val: gameState.stats.vocation, color: 'bg-amber-500', desc: 'Firmeza en motivaciones intrínsecas sin mandatos externos.' },
                      { key: 'emotionalMaturity', label: '🧘 Madurez Emocional', val: gameState.stats.emotionalMaturity, color: 'bg-teal-500', desc: 'Manejo de la contratransferencia y el autocuidado.' },
                      { key: 'scientificThinking', label: '🔬 Pensamiento Científico', val: gameState.stats.scientificThinking, color: 'bg-indigo-500', desc: 'Capacidad de investigación y curiosidad clínica.' }
                    ].map(stat => (
                      <div key={stat.key} className="space-y-1">
                        <div className="flex justify-between text-xs font-ui">
                          <span className="font-semibold text-slate-200">{stat.label}</span>
                          <span className="font-bold font-mono text-cyan-300">{stat.val} pts</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full ${stat.color} rounded-full transition-all duration-300`}
                            style={{ width: `${Math.min(100, stat.val * 2.5)}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 font-ui">{stat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lersch Typology & Profile */}
                <div className="space-y-6">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-retro flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Clasificación Vocacional de Lersch
                    </h3>
                    <p className="text-xs text-slate-400 font-ui leading-relaxed">
                      Perfil actitudinal orientativo basado en la tipología de Philipp Lersch:
                    </p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-ui font-semibold text-pink-300">
                          <span>Grupo 1: Tendencia Asistencial</span>
                          <span>{asistencialPercent}%</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Orientado al cuidado directo, empatía y acompañamiento del sufrimiento.</p>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-ui font-semibold text-indigo-300">
                          <span>Grupo 2: Conocimiento y Creación</span>
                          <span>{conocimientoPercent}%</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Orientado a la investigación, formulación de hipótesis y resolución de enigmas.</p>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-ui font-semibold text-yellow-300">
                          <span>Grupo 3: Estimulación y Acción</span>
                          <span>{estimulacionPercent}%</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Orientado a situaciones intensas, toma rápida de decisiones críticas y desafíos.</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-gradient-to-br from-cyan-950 to-slate-950 border border-cyan-800/60 rounded-2xl p-5">
                    <h4 className="font-retro text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                      Dictamen Formativo Provisional
                    </h4>
                    <p className="text-xs text-slate-300 font-ui leading-relaxed">
                      {gameState.stats.empathy > 25 && gameState.stats.professionalism > 20
                        ? 'Tu perfil destaca por un admirable equilibrio entre sensibilidad humana y rigor profesional. Construyes un vínculo terapéutico sólido con el paciente real.'
                        : 'Continúa explorando los dilemas clínicos para equilibrar tu vocación, ciencia y comprensión de la persona doliente.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HISTORIAL CLÍNICO */}
          {activeTab === 'historial' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Historial Clínico de Pacientes
                </h3>
                <p className="text-xs text-slate-400 font-ui">
                  Registro de pacientes atendidos, diagnósticos y decisiones.
                </p>
              </div>

              {gameState.clinicalHistory && gameState.clinicalHistory.length > 0 ? (
                <div className="space-y-4">
                  {gameState.clinicalHistory.map((record) => (
                    <div key={record.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg">
                      <div className="flex justify-between items-start mb-3 border-b border-slate-800/50 pb-3">
                        <div>
                          <h4 className="text-sm font-bold font-retro text-cyan-300">{record.fullName}</h4>
                          <span className="text-xs text-slate-400">{record.age} años • {record.gender === 'male' ? 'Masculino' : 'Femenino'} • {record.profession}</span>
                        </div>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded">Expediente #{record.id.split('_')[1]?.toUpperCase() || '001'}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-ui">
                        <div>
                          <strong className="text-amber-400 block mb-1">Motivo de Consulta:</strong>
                          <p className="text-slate-300 bg-slate-900/50 p-2 rounded">{record.reasonForVisit}</p>
                        </div>
                        <div>
                          <strong className="text-emerald-400 block mb-1">Diagnóstico Final:</strong>
                          <p className="text-slate-300 bg-slate-900/50 p-2 rounded">{record.diagnosis}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-950/50 rounded-2xl border border-slate-800 border-dashed">
                  <ClipboardList className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-ui">Aún no has registrado ninguna historia clínica completa.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: PERSONAJES */}
          {activeTab === 'personajes' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Directorio de Personajes Conocidos
                </h3>
              </div>

              {gameState.metCharacters && gameState.metCharacters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gameState.metCharacters.map(charId => {
                    const charInfo = getCharacterIdentity(charId);
                    if (!charInfo) return null;
                    return (
                      <div key={charId} className="flex gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl items-center">
                        <div className="w-14 h-14 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center shrink-0">
                          {charInfo.sprite === 'teacher_female' ? '👩‍🏫' : charInfo.sprite === 'doctor_male' ? '👨‍⚕️' : charInfo.sprite === 'patient_elder' ? '👴' : charInfo.sprite === 'nurse_female' ? '👩‍⚕️' : '👤'}
                        </div>
                        <div>
                          <h4 className="font-retro text-sm text-cyan-300">{charInfo.fullName || charInfo.name}</h4>
                          <p className="text-[11px] text-slate-400 font-ui font-semibold">{charInfo.role} {charInfo.profession ? `• ${charInfo.profession}` : ''}</p>
                          <p className="text-[10px] text-slate-500 mt-1 leading-tight">{charInfo.personality}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-950/50 rounded-2xl border border-slate-800 border-dashed">
                  <p className="text-sm text-slate-500 font-ui">Interactúa con el entorno para conocer a más personas.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: PROGRESO */}
          {activeTab === 'progreso' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-cyan-950/40 to-blue-950/40 border border-cyan-800/50 rounded-2xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 font-retro mb-4">
                  Progreso Académico General
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                    <div className="text-2xl mb-1 text-emerald-400 font-mono font-bold">{gameState.clinicalHistory?.length || 0}</div>
                    <div className="text-[10px] uppercase font-retro text-slate-400">Casos Resueltos</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                    <div className="text-2xl mb-1 text-cyan-400 font-mono font-bold">{gameState.metCharacters?.length || 0}</div>
                    <div className="text-[10px] uppercase font-retro text-slate-400">NPCs Conocidos</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                    <div className="text-2xl mb-1 text-amber-400 font-mono font-bold">{gameState.unlockedAchievements.length}</div>
                    <div className="text-[10px] uppercase font-retro text-slate-400">Logros Obtenidos</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                    <div className="text-2xl mb-1 text-purple-400 font-mono font-bold">{gameState.level}</div>
                    <div className="text-[10px] uppercase font-retro text-slate-400">Nivel de Formación</div>
                  </div>
                </div>

                <h4 className="font-retro text-xs text-slate-400 mb-3">Malla Curricular</h4>
                <div className="space-y-2">
                  {['Anatomía y Ciencias Básicas', 'Semiología Clínica', 'Psicología Médica', 'Patología Médica', 'Bioética'].map((materia, i) => {
                    const isUnlocked = gameState.level >= i;
                    const isCompleted = gameState.level > i + 1;
                    return (
                      <div key={materia} className={`p-3 rounded-lg border flex justify-between items-center ${isCompleted ? 'bg-emerald-950/20 border-emerald-900/50' : isUnlocked ? 'bg-cyan-950/30 border-cyan-800/50' : 'bg-slate-900/30 border-slate-800/50 opacity-50'}`}>
                        <span className={`text-xs font-ui ${isCompleted ? 'text-emerald-400' : isUnlocked ? 'text-cyan-300' : 'text-slate-500'}`}>{materia}</span>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : isUnlocked ? <span className="text-[10px] bg-cyan-900 text-cyan-200 px-2 py-0.5 rounded">En curso</span> : <Lock className="w-4 h-4 text-slate-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MISIONES Y CAPÍTULOS */}
          {activeTab === 'misiones' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro">
                  Campaña Principal: 10 Capítulos Narrativos
                </h3>
                <span className="text-xs font-retro text-slate-400">
                  {completedChaptersCount} / {CHAPTERS_DATA.length} Completados
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CHAPTERS_DATA.map(chapter => {
                  const isCompleted = gameState.completedChapters.includes(chapter.number);
                  const isCurrent = gameState.currentChapter === chapter.number;
                  const isUnlocked = isCompleted || isCurrent || chapter.number <= Math.max(...gameState.completedChapters, 1) + 1;

                  return (
                    <div
                      key={chapter.number}
                      className={`p-5 rounded-2xl border-2 transition-all ${isCurrent ? 'bg-cyan-950/80 border-cyan-400 shadow-xl' : isCompleted ? 'bg-slate-950 border-emerald-600/70' : 'bg-slate-950/40 border-slate-800 opacity-60'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className={`text-[10px] font-bold uppercase font-retro tracking-wider ${isCurrent ? 'text-cyan-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                            Capítulo {chapter.number} {isCurrent && '• EN CURSO'}
                          </span>
                          <h4 className="font-retro text-sm font-bold text-slate-100 mt-0.5">
                            {chapter.title}
                          </h4>
                          <span className="text-[11px] text-cyan-200/80 font-ui block italic">
                            {chapter.subtitle}
                          </span>
                        </div>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : isUnlocked ? (
                          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
                        ) : (
                          <Lock className="w-5 h-5 text-slate-600 shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-slate-300 font-ui mt-2 leading-relaxed">
                        {chapter.summary}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 font-ui">
                        <strong className="text-slate-200">Objetivo:</strong> {chapter.mainObjective}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: INVENTARIO */}
          {activeTab === 'inventario' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro">
                Instrumentos Clínicos y Cuadernos de Campo
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'steth',
                    name: 'Fonendoscopio Clínico',
                    category: 'Herramienta Diagnóstica',
                    icon: '🩺',
                    desc: 'Instrumento fundamental para la auscultación cardíaca y pulmonar. Recuerda mirar a los ojos del paciente antes de colocar la membrana.'
                  },
                  {
                    id: 'notes',
                    name: 'Cuaderno de Psicología Médica',
                    category: 'Apuntes Académicos',
                    icon: '📓',
                    desc: 'Anotaciones sobre la relación médico-paciente, la comunicación no verbal y el manejo de la contratransferencia.'
                  },
                  {
                    id: 'badge_id',
                    name: 'Credencial Universitaria',
                    category: 'Acreditación',
                    icon: '🪪',
                    desc: 'Acredita tu condición de Estudiante de Medicina del Hospital Universitario Docente.'
                  },
                  {
                    id: 'reflex',
                    name: 'Martillo de Reflejos',
                    category: 'Instrumental',
                    icon: '🔨',
                    desc: 'Utilizado en la exploración neurológica de reflejos osteotendinosos.'
                  },
                  {
                    id: 'penlight',
                    name: 'Linterna de Exploración',
                    category: 'Instrumental',
                    icon: '🔦',
                    desc: 'Para evaluación pupilar y orofaringe con consentimiento informado.'
                  }
                ].map(item => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500 transition-colors flex items-start gap-3.5"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-400 font-retro">
                        {item.category}
                      </span>
                      <h4 className="font-retro text-xs font-bold text-slate-100">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-ui mt-1 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LOGROS */}
          {activeTab === 'logros' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro">
                    Sistema de Logros Formativos (25 Logros)
                  </h3>
                  <span className="text-xs font-ui text-slate-400">
                    Desbloqueados: {gameState.unlockedAchievements.length} de {ACHIEVEMENTS_DATA.length}
                  </span>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'clinical', 'empathy', 'vocation', 'academic'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setAchievementFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-retro capitalize cursor-pointer ${achievementFilter === filter ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
                    >
                      {filter === 'all' ? 'Todos' : filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {ACHIEVEMENTS_DATA.filter(a => achievementFilter === 'all' || a.category === achievementFilter).map(ach => {
                  const isUnlocked = gameState.unlockedAchievements.includes(ach.id);
                  return (
                    <div
                      key={ach.id}
                      className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${isUnlocked ? 'bg-slate-950 border-amber-400/80 shadow-md' : 'bg-slate-950/40 border-slate-800 opacity-60'}`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${isUnlocked ? 'bg-amber-950/80 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                        {isUnlocked ? ach.icon : '🔒'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-retro text-xs font-bold ${isUnlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                            {ach.title}
                          </h4>
                          <span className="text-[10px] font-bold font-mono text-cyan-400">
                            +{ach.xpReward} XP
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-ui mt-1 leading-snug">
                          {ach.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: EMBLEMAS */}
          {activeTab === 'emblemas' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro">
                  Colección de Emblemas de la Profesión Médica
                </h3>
                <p className="text-xs text-slate-400 font-ui">
                  Insignias de honor que confieren virtudes y rasgos formativos al personaje.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {EMBLEMS_DATA.map(emblem => {
                  const isUnlocked = gameState.unlockedEmblems.includes(emblem.id) || emblem.unlocked;
                  return (
                    <div
                      key={emblem.id}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${isUnlocked ? 'bg-slate-950 border-cyan-400 shadow-xl' : 'bg-slate-950/40 border-slate-800 opacity-50'}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner border"
                            style={{ borderColor: emblem.color, backgroundColor: `${emblem.color}20` }}
                          >
                            {isUnlocked ? emblem.icon : '🔒'}
                          </div>
                          {isUnlocked && (
                            <span className="text-[9px] font-bold font-retro uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                              Activo
                            </span>
                          )}
                        </div>

                        <h4 className="font-retro text-xs font-bold text-slate-100">
                          {emblem.name}
                        </h4>
                        <p className="text-[11px] text-slate-300 font-ui mt-1 leading-snug">
                          {emblem.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1">
                        <div className="text-[10px] text-amber-300 font-ui font-semibold">
                          ✨ Efecto: {emblem.effect}
                        </div>
                        <div className="text-[9px] text-slate-500 font-ui">
                          Requisito: {emblem.unlockCondition}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: DIARIO ACADÉMICO */}
          {activeTab === 'diario' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro">
                  Diario Académico: Tratado de Psicología Médica
                </h3>
                <p className="text-xs text-slate-400 font-ui">
                  Compendio de conceptos fundamentales desbloqueados durante tu formación.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* List of Entries */}
                <div className="md:col-span-5 space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {JOURNAL_ENTRIES.map(entry => {
                    const isUnlocked = gameState.unlockedJournal.includes(entry.id) || entry.unlocked;
                    const isSelected = selectedJournalId === entry.id || (!selectedJournalId && entry.id === 'persona_medicina');

                    return (
                      <button
                        key={entry.id}
                        onClick={() => {
                          if (isUnlocked) {
                            soundEngine.playSelect();
                            setSelectedJournalId(entry.id);
                          }
                        }}
                        disabled={!isUnlocked}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold' : isUnlocked ? 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300' : 'bg-slate-950/40 border-slate-800/50 text-slate-600 cursor-not-allowed'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase font-retro text-cyan-400">
                            {isUnlocked ? entry.category.replace(/_/g, ' ') : 'Bloqueado'}
                          </span>
                          {isUnlocked ? <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> : <Lock className="w-3.5 h-3.5 text-slate-700" />}
                        </div>
                        <div className="text-xs font-retro mt-1 truncate">
                          {isUnlocked ? entry.title : 'Entrada Confidencial'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Reader Detail Panel */}
                <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 overflow-y-auto max-h-[460px]">
                  {(() => {
                    const currentEntry = JOURNAL_ENTRIES.find(e => e.id === (selectedJournalId || 'persona_medicina')) || JOURNAL_ENTRIES[0];
                    return (
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-retro">
                            {currentEntry.category.replace(/_/g, ' ')}
                          </span>
                          <h4 className="text-base font-bold font-retro text-slate-100 mt-1">
                            {currentEntry.title}
                          </h4>
                          <p className="text-xs text-cyan-300 font-ui italic mt-1">
                            {currentEntry.summary}
                          </p>
                        </div>

                        <div className="space-y-2.5 text-xs md:text-sm text-slate-300 font-ui leading-relaxed border-t border-slate-800 pt-3">
                          {currentEntry.content.map((p, idx) => (
                            <p key={idx}>{p}</p>
                          ))}
                        </div>

                        <div className="p-3.5 rounded-xl bg-cyan-950/70 border border-cyan-800/80 text-cyan-200 text-xs font-ui">
                          <strong className="block font-retro text-[10px] text-cyan-300 uppercase tracking-wider mb-1">
                            💡 Conclusión Clínica y Ética
                          </strong>
                          {currentEntry.clinicalTakeaway}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MAPA Y VIAJE RÁPIDO */}
          {activeTab === 'mapa' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro">
                  Mapa del Campus y Hospital Universitario
                </h3>
                <p className="text-xs text-slate-400 font-ui">
                  Selecciona una zona para desplazarte directamente.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.values(MAPS_DATA).map(loc => {
                  const isCurrent = gameState.currentMapId === loc.id;
                  return (
                    <div
                      key={loc.id}
                      className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${isCurrent ? 'bg-cyan-950/80 border-cyan-400 shadow-xl' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase font-retro text-cyan-400">
                            {loc.category}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold font-retro px-2 py-0.5 rounded bg-cyan-500 text-slate-950">
                              Ubicación Actual
                            </span>
                          )}
                        </div>

                        <h4 className="font-retro text-xs font-bold text-slate-100">
                          {loc.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-ui mt-1 leading-snug">
                          {loc.description}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          soundEngine.playSelect();
                          onFastTravel(loc.id, loc.spawnX, loc.spawnY);
                          onClose();
                        }}
                        disabled={isCurrent}
                        className={`mt-4 w-full py-2 rounded-xl text-xs font-retro pixel-button flex items-center justify-center gap-2 cursor-pointer ${isCurrent ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-default' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold'}`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{isCurrent ? 'Estás aquí' : 'Ir a esta zona'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 8: OPCIONES Y GUARDADO */}
          {activeTab === 'opciones' && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro flex items-center gap-2">
                  <Save className="w-4 h-4 text-cyan-400" />
                  Guardado de Partida (LocalStorage)
                </h3>
                <p className="text-xs text-slate-400 font-ui leading-relaxed">
                  Tu progreso se guarda automáticamente con cada decisión clínica. También puedes guardar manualmente en cualquier momento.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-retro text-xs rounded-xl pixel-button flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Partida Ahora</span>
                  </button>
                  {saveSuccess && (
                    <span className="text-xs text-emerald-400 font-retro animate-in fade-in flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      ¡Guardado con éxito!
                    </span>
                  )}
                </div>
              </div>

              {/* Reset Game Caution Box */}
              <div className="bg-slate-950 border border-rose-900/60 rounded-2xl p-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 font-retro flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                  Reiniciar Formación Médica
                </h3>
                <p className="text-xs text-slate-400 font-ui leading-relaxed">
                  Borra todos los datos guardados en este navegador y reinicia la historia desde el Capítulo 1.
                </p>

                <button
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que deseas reiniciar tu partida desde cero?')) {
                      onResetGame();
                    }
                  }}
                  className="px-5 py-2 bg-rose-950 hover:bg-rose-900 border border-rose-600 text-rose-200 text-xs font-retro rounded-xl pixel-button cursor-pointer"
                >
                  Reiniciar Todo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
