import React, { useState, useEffect } from 'react';
import { DialogueChoice, DialogueNode } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { MessageSquare, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface DialogueBoxProps {
  dialogueNode: DialogueNode;
  onSelectChoice: (choice: DialogueChoice) => void;
  onClose: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  dialogueNode,
  onSelectChoice,
  onClose
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<DialogueChoice | null>(null);

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);
    setActiveFeedback(null);
    setSelectedChoice(null);

    const fullText = dialogueNode.text;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.substring(0, index + 1));
        if (index % 3 === 0) {
          soundEngine.playDialogueBeep(dialogueNode.portrait.includes('female') ? 520 : 380);
        }
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [dialogueNode]);

  const handleSkipTyping = () => {
    if (isTyping) {
      setDisplayedText(dialogueNode.text);
      setIsTyping(false);
    }
  };

  const handleChoiceClick = (choice: DialogueChoice) => {
    soundEngine.playSelect();
    setSelectedChoice(choice);

    if (choice.feedback) {
      setActiveFeedback(choice.feedback);
      if (choice.stats) {
        if ((choice.stats.empathy && choice.stats.empathy > 0) || (choice.stats.vocation && choice.stats.vocation > 0)) {
          soundEngine.playStatUp();
        }
      }
    } else {
      onSelectChoice(choice);
    }
  };

  const handleProceedAfterFeedback = () => {
    if (selectedChoice) {
      onSelectChoice(selectedChoice);
    }
  };

  return (
    <div className="absolute inset-x-4 bottom-4 md:inset-x-24 md:bottom-8 z-40 animate-in fade-in slide-in-from-bottom-6 duration-200">
      <div className="bg-slate-900/95 border-2 border-cyan-500 rounded-2xl p-5 shadow-2xl text-slate-100 backdrop-blur-md pixel-box">
        {/* Speaker Name Tag & Role Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-bold font-retro text-lg shadow-inner">
              {dialogueNode.speaker.charAt(0)}
            </div>
            <div>
              <h4 className="font-retro text-base font-bold text-cyan-300 tracking-wide">
                {dialogueNode.speaker}
              </h4>
              {dialogueNode.speakerRole && (
                <span className="text-[11px] text-slate-400 font-ui font-medium">
                  {dialogueNode.speakerRole}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isTyping && (
              <button
                onClick={handleSkipTyping}
                className="text-[11px] text-cyan-400 hover:text-cyan-200 font-retro px-2.5 py-1 bg-cyan-950/80 rounded border border-cyan-800/80 cursor-pointer"
              >
                Saltar [Espacio]
              </button>
            )}
          </div>
        </div>

        {/* Dialogue Main Text Body */}
        <div
          onClick={handleSkipTyping}
          className="my-4 min-h-[64px] font-ui text-sm md:text-base leading-relaxed text-slate-200 cursor-pointer"
        >
          {displayedText}
          {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse" />}
        </div>

        {/* Immediate Pedagogical Feedback Banner if a choice was clicked */}
        {activeFeedback && selectedChoice && (
          <div className="my-4 p-4 rounded-xl bg-slate-950 border-2 border-amber-400/80 animate-in fade-in duration-150">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-300 font-retro uppercase tracking-wider">
                  Lección y Consecuencia Formativa
                </div>
                <p className="text-xs md:text-sm text-slate-200 font-ui leading-relaxed">
                  {activeFeedback}
                </p>

                {/* Stat deltas preview */}
                {selectedChoice.stats && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedChoice.stats.empathy !== undefined && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${selectedChoice.stats.empathy > 0 ? 'bg-rose-950 text-rose-300 border border-rose-700' : 'bg-slate-800 text-slate-400'}`}>
                        ❤️ Empatía {selectedChoice.stats.empathy > 0 ? `+${selectedChoice.stats.empathy}` : selectedChoice.stats.empathy}
                      </span>
                    )}
                    {selectedChoice.stats.communication !== undefined && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${selectedChoice.stats.communication > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-slate-800 text-slate-400'}`}>
                        🗣️ Comunicación {selectedChoice.stats.communication > 0 ? `+${selectedChoice.stats.communication}` : selectedChoice.stats.communication}
                      </span>
                    )}
                    {selectedChoice.stats.professionalism !== undefined && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${selectedChoice.stats.professionalism > 0 ? 'bg-purple-950 text-purple-300 border border-purple-700' : 'bg-slate-800 text-slate-400'}`}>
                        ⚕️ Profesionalismo {selectedChoice.stats.professionalism > 0 ? `+${selectedChoice.stats.professionalism}` : selectedChoice.stats.professionalism}
                      </span>
                    )}
                    {selectedChoice.stats.vocation !== undefined && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${selectedChoice.stats.vocation > 0 ? 'bg-amber-950 text-amber-300 border border-amber-700' : 'bg-slate-800 text-slate-400'}`}>
                        🧭 Vocación {selectedChoice.stats.vocation > 0 ? `+${selectedChoice.stats.vocation}` : selectedChoice.stats.vocation}
                      </span>
                    )}
                    {selectedChoice.stats.emotionalMaturity !== undefined && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${selectedChoice.stats.emotionalMaturity > 0 ? 'bg-teal-950 text-teal-300 border border-teal-700' : 'bg-slate-800 text-slate-400'}`}>
                        🧘 Madurez {selectedChoice.stats.emotionalMaturity > 0 ? `+${selectedChoice.stats.emotionalMaturity}` : selectedChoice.stats.emotionalMaturity}
                      </span>
                    )}
                    {selectedChoice.stats.xp !== undefined && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                        ⚡ +{selectedChoice.stats.xp} XP
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                onClick={handleProceedAfterFeedback}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-retro text-xs rounded-lg pixel-button flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Choice Options List */}
        {!isTyping && !activeFeedback && dialogueNode.choices && (
          <div className="space-y-2 mt-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-retro">
              Elige tu respuesta o decisión clínica:
            </div>
            {dialogueNode.choices.map((choice, index) => (
              <button
                key={choice.id || index}
                onClick={() => handleChoiceClick(choice)}
                className="w-full text-left p-3.5 rounded-xl bg-slate-800/90 hover:bg-cyan-950 hover:border-cyan-400 border border-slate-700 text-slate-100 transition-all font-ui text-xs md:text-sm flex items-start gap-3 group cursor-pointer pixel-button"
              >
                <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 group-hover:border-cyan-400 group-hover:bg-cyan-900 flex items-center justify-center font-retro text-xs text-cyan-300 shrink-0 mt-0.5">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="leading-snug">{choice.text}</span>
              </button>
            ))}
          </div>
        )}

        {/* Close Button if there are no choices */}
        {!isTyping && !activeFeedback && (!dialogueNode.choices || dialogueNode.choices.length === 0) && (
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-retro text-xs rounded-xl pixel-button cursor-pointer"
            >
              Cerrar diálogo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
