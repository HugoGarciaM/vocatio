import React from 'react';
import { PlayerStats, Chapter } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { 
  Sparkles, 
  Heart, 
  Brain, 
  MessageSquare, 
  ShieldCheck, 
  Compass, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Award, 
  Menu, 
  Map as MapIcon, 
  BatteryMedium 
} from 'lucide-react';

interface HUDProps {
  stats: PlayerStats;
  level: number;
  xp: number;
  xpToNextLevel: number;
  emotionalEnergy: number;
  maxEnergy: number;
  currentChapter: Chapter;
  activeMission?: import('../types/game').Mission;
  currentLocationName?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenMenuTab: (tab: string) => void;
}

const LEVEL_TITLES = [
  'Aspirante Médico',
  'Estudiante de Pregrado',
  'Observador Clínico',
  'Estudiante Avanzado',
  'Interno de Medicina',
  'Médico en Formación'
];

export const HUD: React.FC<HUDProps> = ({
  stats,
  level,
  xp,
  xpToNextLevel,
  emotionalEnergy,
  maxEnergy,
  currentChapter,
  activeMission,
  currentLocationName,
  isMuted,
  onToggleMute,
  onOpenMenuTab
}) => {
  const currentTitle = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] || 'Médico';
  const xpPercent = Math.min(100, Math.round((xp / xpToNextLevel) * 100));
  const energyPercent = Math.min(100, Math.round((emotionalEnergy / maxEnergy) * 100));

  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none z-30 p-2 md:p-4 pt-[max(0.5rem,env(safe-area-inset-top))] flex flex-col justify-between gap-2 h-full">
      {/* Top Bar: Profile & Quick Buttons in a single clean row */}
      <div className="flex flex-row items-center justify-between gap-2 w-full">
        {/* Player Profile & Vitality Box */}
        <div className="pointer-events-auto bg-slate-900/90 border border-slate-700/80 rounded-xl md:rounded-2xl p-2 md:p-2.5 shadow-xl backdrop-blur-md flex items-center gap-2 md:gap-3 pixel-box shrink-0">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 border-2 border-cyan-300 flex flex-col items-center justify-center text-white shadow-inner shrink-0">
            <span className="text-[8px] md:text-[9px] font-bold uppercase font-retro tracking-tighter">NV</span>
            <span className="text-xs md:text-base font-bold font-retro leading-none">{level}</span>
          </div>

          <div className="space-y-0.5 min-w-[110px] sm:min-w-[160px] md:min-w-[200px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] md:text-xs font-bold text-cyan-300 font-retro truncate max-w-[90px] sm:max-w-none">
                {currentTitle}
              </span>
              <span className="hidden sm:inline text-[10px] text-slate-400 font-ui font-medium">
                {xp}/{xpToNextLevel} XP
              </span>
            </div>

            {/* XP Bar */}
            <div className="w-full h-1.5 md:h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
                style={{ width: `${xpPercent}%` }}
              />
            </div>

            {/* Emotional Energy / Composure Gauge */}
            <div className="flex items-center justify-between text-[9px] md:text-[10px] text-slate-300 pt-0.5">
              <span className="flex items-center gap-1 text-teal-300 font-ui font-semibold">
                <BatteryMedium className="w-3 h-3 md:w-3.5 md:h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Compostura</span>
              </span>
              <span className="font-mono text-[9px] md:text-[10px]">{emotionalEnergy}/{maxEnergy}</span>
            </div>
            <div className="w-full h-1 md:h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${energyPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats Pills (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 pointer-events-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-2 backdrop-blur-md">
          <button
            onClick={() => onOpenMenuTab('estadisticas')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500 transition-colors text-xs font-ui cursor-pointer"
            title="Conocimiento Biomédico y Rigor"
          >
            <Brain className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-300 font-bold">{stats.knowledge}</span>
          </button>
          <button
            onClick={() => onOpenMenuTab('estadisticas')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-rose-500 transition-colors text-xs font-ui cursor-pointer"
            title="Empatía y Sensibilidad Humana"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-slate-300 font-bold">{stats.empathy}</span>
          </button>
          <button
            onClick={() => onOpenMenuTab('estadisticas')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500 transition-colors text-xs font-ui cursor-pointer"
            title="Comunicación Asertiva y Escucha"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-bold">{stats.communication}</span>
          </button>
          <button
            onClick={() => onOpenMenuTab('estadisticas')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500 transition-colors text-xs font-ui cursor-pointer"
            title="Profesionalismo y Ética"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-300 font-bold">{stats.professionalism}</span>
          </button>
          <button
            onClick={() => onOpenMenuTab('estadisticas')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500 transition-colors text-xs font-ui cursor-pointer"
            title="Vocación Auténtica"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300 font-bold">{stats.vocation}</span>
          </button>
        </div>

        {/* Top Right Quick Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-1 md:gap-2 shrink-0">
          {/* Audio toggle */}
          <button
            onClick={() => {
              soundEngine.playSelect();
              onToggleMute();
            }}
            className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 flex items-center justify-center shadow-lg backdrop-blur-md pixel-button cursor-pointer"
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-400" />}
          </button>

          {/* Student Journal shortcut */}
          <button
            onClick={() => {
              soundEngine.playSelect();
              onOpenMenuTab('diario');
            }}
            className="px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 flex items-center gap-1.5 text-xs font-retro shadow-lg backdrop-blur-md pixel-button cursor-pointer"
            title="Diario"
          >
            <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />
            <span className="hidden sm:inline">Diario</span>
          </button>

          {/* World Map shortcut */}
          <button
            onClick={() => {
              soundEngine.playSelect();
              onOpenMenuTab('mapa');
            }}
            className="px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 flex items-center gap-1.5 text-xs font-retro shadow-lg backdrop-blur-md pixel-button cursor-pointer"
            title="Mapa"
          >
            <MapIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-400" />
            <span className="hidden sm:inline">Mapa</span>
          </button>

          {/* Full RPG Pause Menu */}
          <button
            onClick={() => {
              soundEngine.playSelect();
              onOpenMenuTab('estadisticas');
            }}
            className="px-2.5 md:px-3.5 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold font-retro text-xs shadow-xl pixel-button flex items-center gap-1.5 cursor-pointer"
            title="Menú Principal"
          >
            <Menu className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Menú</span>
          </button>
        </div>
      </div>

      {/* Bottom Center: Current Mission Banner */}
      <div className="pointer-events-auto self-center max-w-sm md:max-w-xl w-full bg-slate-900/90 border border-cyan-800/80 rounded-xl md:rounded-2xl p-2 md:p-3 shadow-2xl backdrop-blur-md pixel-box flex flex-col gap-1 mb-1 sm:mb-2">
        {currentLocationName && (
          <div className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-800/50 pb-0.5 mb-0.5">
            📍 {currentLocationName}
          </div>
        )}
        
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3 w-full">
            <div className="hidden sm:flex w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500 items-center justify-center text-cyan-400 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="w-full">
              <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-retro flex justify-between">
                <span>MISIÓN: {activeMission ? activeMission.title : currentChapter.title}</span>
              </div>
              <p className="text-[10px] md:text-xs text-slate-200 font-ui font-medium leading-tight line-clamp-1 md:line-clamp-2">
                {activeMission ? activeMission.description : currentChapter.mainObjective}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenMenuTab('mision_actual')}
            className="hidden sm:block px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] md:text-[11px] font-retro text-cyan-300 border border-slate-700 cursor-pointer shrink-0"
          >
            Objetivos
          </button>
        </div>
      </div>
    </div>
  );
};

