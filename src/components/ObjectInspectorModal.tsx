import React from 'react';
import { MapObject } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { Eye, Sparkles, BookOpen, Coffee, Monitor, HeartPulse, X } from 'lucide-react';

interface ObjectInspectorModalProps {
  object: MapObject;
  onClose: () => void;
}

export const ObjectInspectorModal: React.FC<ObjectInspectorModalProps> = ({
  object,
  onClose
}) => {
  const getIcon = () => {
    switch (object.type) {
      case 'book':
        return <BookOpen className="w-6 h-6 text-amber-400" />;
      case 'coffee':
        return <Coffee className="w-6 h-6 text-amber-500" />;
      case 'computer':
        return <Monitor className="w-6 h-6 text-cyan-400" />;
      case 'bed':
        return <HeartPulse className="w-6 h-6 text-rose-400" />;
      default:
        return <Eye className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="max-w-md w-full bg-slate-900 border-2 border-cyan-500 rounded-3xl p-6 shadow-2xl pixel-box space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center shadow-inner">
              {getIcon()}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase font-retro text-cyan-400">
                Inspección de Entorno
              </span>
              <h3 className="font-retro text-sm font-bold text-slate-100">
                {object.name}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playSelect();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs md:text-sm text-slate-300 font-ui leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
          {object.description}
        </div>

        <button
          onClick={() => {
            soundEngine.playSelect();
            onClose();
          }}
          className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-retro text-xs rounded-xl pixel-button cursor-pointer"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
