import React, { useEffect } from 'react';

type HintPopupProps = {
  hint: string;
  /** Duration in milliseconds before auto‑close. If undefined, stays until user closes. */
  autoCloseDuration?: number;
  onClose: () => void;
};

export const HintPopup: React.FC<HintPopupProps> = ({ hint, autoCloseDuration, onClose }) => {
  // Auto‑close after the specified duration
  useEffect(() => {
    if (autoCloseDuration) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [autoCloseDuration, onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-400 text-cyan-100 px-6 py-4 rounded-lg shadow-xl max-w-md mx-4 pointer-events-auto">
        <div className="flex items-start gap-2">
          <svg
  className="w-5 h-5 mt-0.5 flex-shrink-0 text-cyan-300"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.364-5.636l-.707-.707M16.364 16.364l-.707-.707M12 21v-1M6.364 17.636l-.707.707M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
</svg>
          <div className="flex-1 text-sm font-retro leading-snug">
            {hint}
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-3 w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-1 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
