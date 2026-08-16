import React, { useState, useEffect } from 'react';
import { RotateCw, Smartphone, Check } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

export const RotateDevicePromptModal: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const checkState = () => {
      if (typeof window === 'undefined') return;
      const portrait = window.innerHeight > window.innerWidth;
      const ua = navigator.userAgent || '';
      const mobileOrTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      
      setIsPortrait(portrait);
      setIsMobile(mobileOrTouch);

      // Auto-reset dismissed if user turns phone landscape then portrait again
      if (!portrait) {
        setDismissed(false);
      }
    };

    checkState();
    window.addEventListener('resize', checkState);
    window.addEventListener('orientationchange', checkState);
    return () => {
      window.removeEventListener('resize', checkState);
      window.removeEventListener('orientationchange', checkState);
    };
  }, []);

  if (!isMobile || !isPortrait || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-slate-100 select-none animate-in fade-in duration-200">
      <div className="max-w-md bg-slate-900 border-2 border-cyan-400 rounded-3xl p-6 md:p-8 shadow-2xl pixel-box flex flex-col items-center gap-4">
        {/* Animated Phone Rotation Icon */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <Smartphone className="w-16 h-16 text-cyan-400 animate-pulse transform rotate-90 transition-transform duration-700" />
          <RotateCw className="w-12 h-12 text-amber-400 absolute animate-spin-slow opacity-80" />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-retro">
            💡 RECOMENDACIÓN DE PANTALLA
          </span>
          <h3 className="text-lg md:text-xl font-bold font-retro text-cyan-200 mt-1">
            Gira tu dispositivo a Modo Horizontal
          </h3>
          <p className="text-xs md:text-sm text-slate-300 font-ui mt-2 leading-relaxed">
            Para evitar que la interfaz se corte en la parte inferior y disfrutar el control RPG con la cruceta táctil, <strong>voltea tu celular o tableta a posición horizontal (Landscape)</strong>.
          </p>
        </div>

        <button
          onClick={() => {
            soundEngine.playSelect();
            setDismissed(true);
          }}
          className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-retro text-xs rounded-xl pixel-button flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <Check className="w-4 h-4" />
          <span>Continuar de todos modos</span>
        </button>
      </div>
    </div>
  );
};
