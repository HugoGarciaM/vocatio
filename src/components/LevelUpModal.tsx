import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../audio/soundEngine';
import { Sparkles, Trophy, ArrowRight, ShieldCheck, Heart, Brain } from 'lucide-react';

interface LevelUpModalProps {
  newLevel: number;
  levelTitle: string;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  newLevel,
  levelTitle,
  onClose
}) => {
  useEffect(() => {
    soundEngine.playLevelUpFanfare();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in zoom-in-95 duration-200">
      <div className="max-w-md w-full bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 md:p-8 text-center shadow-2xl pixel-box relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-600 to-yellow-400 border-4 border-amber-200 flex items-center justify-center shadow-2xl mb-4">
          <Trophy className="w-10 h-10 text-slate-950" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 font-retro">
          ¡Ascenso de Nivel Médico!
        </span>

        <h2 className="text-2xl font-bold font-retro text-slate-100 mt-1">
          NIVEL {newLevel}
        </h2>

        <div className="inline-block mt-2 px-4 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/80 text-amber-300 font-retro text-xs font-bold shadow-inner">
          {levelTitle}
        </div>

        <p className="text-xs text-slate-300 font-ui my-5 leading-relaxed">
          Tu madurez clínica y comprensión de la persona doliente han alcanzado un nuevo hito. Se han incrementado tus capacidades de empatía, escucha y juicio ético.
        </p>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 mb-6 flex justify-around text-xs font-ui">
          <div className="text-center">
            <span className="block font-bold text-rose-400">+5 Empatía</span>
            <span className="text-[10px] text-slate-500">Escucha</span>
          </div>
          <div className="text-center border-x border-slate-800 px-3">
            <span className="block font-bold text-blue-400">+5 Rigor</span>
            <span className="text-[10px] text-slate-500">Ciencia</span>
          </div>
          <div className="text-center">
            <span className="block font-bold text-teal-400">+10 Energía</span>
            <span className="text-[10px] text-slate-500">Compostura</span>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playSelect();
            onClose();
          }}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold font-retro text-xs rounded-xl pixel-button flex items-center justify-center gap-2 cursor-pointer shadow-xl"
        >
          <span>Continuar Práctica Clínica</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
