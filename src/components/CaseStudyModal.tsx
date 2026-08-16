import React, { useState } from 'react';
import { QuestionCase } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { HelpCircle, CheckCircle, XCircle, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

interface CaseStudyModalProps {
  questionCase: QuestionCase;
  onAnswer: (isCorrect: boolean, statsDelta?: Record<string, number>) => void;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  questionCase,
  onAnswer,
  onClose
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const selectedOption = questionCase.options.find(o => o.id === selectedOptionId);

  const handleSubmit = (optionId: string) => {
    if (submitted) return;

    setSelectedOptionId(optionId);
    setSubmitted(true);

    const opt = questionCase.options.find(o => o.id === optionId);
    if (opt?.isCorrect) {
      soundEngine.playQuizSuccess();
    } else {
      soundEngine.playQuizError();
    }
  };

  const handleContinue = () => {
    if (!selectedOption) return;
    onAnswer(selectedOption.isCorrect, selectedOption.stats);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 safe-pt safe-pb">
      <div className="max-w-2xl w-full bg-slate-900 border-2 border-cyan-500 rounded-2xl shadow-2xl overflow-hidden pixel-box flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-950 to-slate-900 px-4 py-3 sm:px-6 sm:py-4 border-b border-cyan-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold font-retro text-base sm:text-lg shadow-md shrink-0">
              ?
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-retro block">
                {questionCase.category}
              </span>
              <h3 className="font-retro text-sm sm:text-base font-bold text-slate-100">
                {questionCase.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-3 sm:space-y-5 flex-1">
          {/* Clinical Context Vignette */}
          <div className="p-3 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-ui text-xs sm:text-sm leading-relaxed relative">
            <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 font-retro mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Situación Clínica / Dilema
            </div>
            {questionCase.context}
          </div>

          {/* Question Prompt */}
          <div className="text-xs sm:text-sm md:text-base font-bold text-cyan-200 font-ui">
            {questionCase.question}
          </div>

          {/* Options */}
          <div className="space-y-2 sm:space-y-2.5">
            {questionCase.options.map((option, index) => {
              let optionStyle = 'bg-slate-800/80 border-slate-700 hover:border-cyan-400 text-slate-200';
              if (submitted) {
                if (option.isCorrect) {
                  optionStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-md';
                } else if (option.id === selectedOptionId) {
                  optionStyle = 'bg-rose-950/90 border-rose-500 text-rose-200';
                } else {
                  optionStyle = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={option.id}
                  disabled={submitted}
                  onClick={() => handleSubmit(option.id)}
                  className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all font-ui text-[11px] sm:text-xs md:text-sm flex items-start gap-2.5 sm:gap-3.5 cursor-pointer pixel-button ${optionStyle}`}
                >
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-retro text-[10px] sm:text-xs shrink-0 mt-0.5">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 leading-snug">{option.text}</span>
                  {submitted && option.isCorrect && (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                  )}
                  {submitted && !option.isCorrect && option.id === selectedOptionId && (
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Formative Feedback Explanation once submitted */}
          {submitted && selectedOption && (
            <div className={`p-3 sm:p-4 rounded-xl border-2 animate-in fade-in duration-200 ${selectedOption.isCorrect ? 'bg-emerald-950/80 border-emerald-500' : 'bg-amber-950/80 border-amber-500'}`}>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <Sparkles className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 ${selectedOption.isCorrect ? 'text-emerald-400' : 'text-amber-400'}`} />
                <div className="space-y-1 sm:space-y-1.5">
                  <div className={`text-[10px] sm:text-xs font-bold font-retro uppercase tracking-wider ${selectedOption.isCorrect ? 'text-emerald-300' : 'text-amber-300'}`}>
                    {selectedOption.isCorrect ? '¡Excelente Análisis Clínico!' : 'Explicación Pedagógica Formativa'}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 font-ui leading-relaxed">
                    {selectedOption.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {submitted && (
          <div className="bg-slate-950 px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-800 flex justify-end shrink-0">
            <button
              onClick={handleContinue}
              className="px-4 py-2 sm:px-6 sm:py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-retro text-[11px] sm:text-xs rounded-xl pixel-button flex items-center gap-2 cursor-pointer shadow-xl"
            >
              <span>Continuar Historia</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
