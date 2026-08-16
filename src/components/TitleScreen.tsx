import React, { useState } from 'react';
import { soundEngine } from '../audio/soundEngine';
import { Play, RotateCcw, BookOpen, Volume2, VolumeX, Sparkles, Heart, Award, Shield } from 'lucide-react';

interface TitleScreenProps {
  hasSavedGame: boolean;
  onStartNewGame: () => void;
  onContinueGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  hasSavedGame,
  onStartNewGame,
  onContinueGame,
  isMuted,
  onToggleMute
}) => {
  const [showCredits, setShowCredits] = useState<boolean>(false);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-3 sm:p-6 bg-slate-950 text-slate-100 overflow-y-auto select-none safe-pt safe-pb">
      {/* Background Pixel Grid and Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />

      {/* Top Bar with Audio & Academic Badge */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl backdrop-blur-md">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] sm:text-[11px] font-retro text-cyan-300">
            Universidad & Hospital Universitario Docente
          </span>
        </div>

        <button
          onClick={() => {
            soundEngine.playSelect();
            onToggleMute();
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 flex items-center justify-center pixel-button cursor-pointer backdrop-blur-md"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>

      {/* Center Title Logo Block */}
      <div className="relative z-10 text-center max-w-2xl my-auto py-4 space-y-3 sm:space-y-4">
        {/* Medical Pixel Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-cyan-600 to-blue-600 border-4 border-cyan-300 flex items-center justify-center text-slate-950 shadow-2xl animate-pulse">
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
        </div>

        <div>
          <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-cyan-400 font-retro">
            RPG Educativo • Medicina & Psicología Médica
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-retro text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 tracking-tight mt-1 sm:mt-2 drop-shadow-md">
            VOCATIO
          </h1>
          <h2 className="text-xs sm:text-base font-retro text-cyan-200 font-medium tracking-wide mt-0.5">
            El Camino del Médico
          </h2>
          <p className="text-[10px] sm:text-xs font-retro text-cyan-300/80 font-medium tracking-wider mt-1">
            La Persona en el ejercicio de la medicina
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 font-ui max-w-lg mx-auto leading-relaxed hidden xs:block">
          Una experiencia interactiva donde la ciencia biomédica, la empatía humana, la relación médico-paciente y la vocación auténtica forjan al verdadero profesional de la salud.
        </p>

        {/* Mobile Landscape Recommendation Tip */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 text-[10px] sm:text-[11px] font-retro backdrop-blur-md">
          <span>📱 Tip Móvil: Para evitar cortes, usa tu pantalla en posición horizontal (Landscape)</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
          {hasSavedGame && (
            <button
              onClick={() => {
                soundEngine.playSelect();
                onContinueGame();
              }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold font-retro text-xs rounded-2xl pixel-button flex items-center justify-center gap-2 cursor-pointer shadow-xl"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Continuar Formación</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEngine.playSelect();
              onStartNewGame();
            }}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-retro text-xs rounded-2xl pixel-button flex items-center justify-center gap-2 cursor-pointer shadow-xl"
          >
            <Sparkles className="w-4 h-4" />
            <span>{hasSavedGame ? 'Nueva Formación' : 'Comenzar Aventura'}</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playSelect();
              setShowCredits(true);
            }}
            className="w-full sm:w-auto px-4 sm:px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-300 font-retro text-xs rounded-2xl pixel-button flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Marco Académico</span>
          </button>
        </div>
      </div>


      {/* Footer Controls Reminder */}
      <div className="relative z-10 text-center text-[11px] text-slate-400 font-ui">
        Controles: <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-cyan-400">WASD / Flechas</kbd> Moverse • <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-cyan-400">E / Espacio</kbd> Interactuar • <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-cyan-400">J</kbd> Diario • <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-cyan-400">ESC</kbd> Menú
      </div>

      {/* Academic Framework & Syllabus Modal */}
      {showCredits && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="max-w-2xl w-full bg-slate-900 border-2 border-cyan-500 rounded-3xl p-6 md:p-8 shadow-2xl pixel-box space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-retro text-base font-bold text-cyan-300">
                Fundamento Académico del Videojuego
              </h3>
              <button
                onClick={() => setShowCredits(false)}
                className="text-xs text-slate-400 hover:text-white font-retro cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>

            <div className="text-xs md:text-sm text-slate-300 font-ui space-y-3 leading-relaxed">
              <p>
                <strong>VOCATIO: El Camino del Médico</strong> ha sido diseñado como un recurso pedagógico interactivo de alto rigor universitario para la enseñanza de la <strong>Psicología Médica y la Ética Clínica</strong>.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <strong className="block text-cyan-300 font-retro text-[10px] uppercase">
                  Ejes Temáticos Integrados:
                </strong>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs">
                  <li><strong>La persona en el ejercicio de la medicina:</strong> Integración de ciencia, persona y vocación.</li>
                  <li><strong>La relación médico-paciente:</strong> Vínculo terapéutico, comunicación verbal y no verbal, desescalada.</li>
                  <li><strong>Clasificación de Lersch:</strong> Tendencia asistencial, hacia el conocimiento/creación y estimulación/acción.</li>
                  <li><strong>Contratransferencia y autocuidado:</strong> Manejo del agotamiento profesional (Burnout) y madurez emocional.</li>
                  <li><strong>Toma de decisiones éticas:</strong> Autonomía del paciente, consentimiento y confidencialidad.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowCredits(false)}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-retro text-xs rounded-xl pixel-button cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
