import React, { useEffect } from 'react';
import { Chapter } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { Sparkles, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

interface ChapterCompleteModalProps {
  completedChapter: Chapter;
  nextChapter?: Chapter;
  onContinue: () => void;
}

export const ChapterCompleteModal: React.FC<ChapterCompleteModalProps> = ({
  completedChapter,
  nextChapter,
  onContinue
}) => {
  useEffect(() => {
    soundEngine.playAchievementUnlock();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-lg w-full bg-slate-900 border-2 border-emerald-400 rounded-3xl p-6 md:p-8 shadow-2xl pixel-box relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-retro">
              ¡Capítulo {completedChapter.number} Superado!
            </span>
            <h3 className="text-lg font-bold font-retro text-slate-100">
              {completedChapter.title}
            </h3>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 my-4 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-retro flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            Síntesis y Aprendizaje Formativo
          </div>
          <p className="text-xs text-slate-300 font-ui leading-relaxed">
            {completedChapter.summary}
          </p>
        </div>

        {nextChapter && (
          <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-800 text-xs font-ui mb-6">
            <span className="block font-retro text-[10px] text-cyan-300 uppercase tracking-wider mb-0.5">
              Próximo Desafío: Capítulo {nextChapter.number}
            </span>
            <strong className="text-slate-200">{nextChapter.title}</strong> — {nextChapter.subtitle}
          </div>
        )}

        <button
          onClick={() => {
            soundEngine.playSelect();
            onContinue();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold font-retro text-xs rounded-xl pixel-button flex items-center justify-center gap-2 cursor-pointer shadow-xl"
        >
          <span>Avanzar al Siguiente Capítulo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
