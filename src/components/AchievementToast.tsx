import React, { useEffect } from 'react';
import { Achievement } from '../types/game';
import { Trophy, Sparkles } from 'lucide-react';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
      <div className="bg-slate-900/95 border-2 border-amber-400 rounded-2xl p-4 shadow-2xl backdrop-blur-md max-w-sm pixel-box flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-400 flex items-center justify-center text-2xl shrink-0 shadow-inner">
          {achievement.icon}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-bold uppercase font-retro text-amber-400 tracking-wider">
              ¡Logro Desbloqueado!
            </span>
          </div>
          <h4 className="font-retro text-xs font-bold text-slate-100 mt-0.5">
            {achievement.title}
          </h4>
          <p className="text-[11px] text-slate-300 font-ui leading-tight mt-0.5">
            {achievement.description}
          </p>
          <span className="inline-block mt-1 text-[10px] font-bold font-mono text-cyan-300">
            +{achievement.xpReward} XP Obtenidos
          </span>
        </div>
      </div>
    </div>
  );
};
