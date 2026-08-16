import React, { useState, useEffect, useRef } from 'react';
import { CharacterCustomization, Gender, HairColor, HairStyle, Outfit, SkinTone, Accessory } from '../types/game';
import { drawPixelCharacter, SKIN_PALETTES, HAIR_PALETTES, OUTFIT_COLORS } from '../engine/spriteRenderer';
import { soundEngine } from '../audio/soundEngine';
import { User, Sparkles, Wand2, ArrowRight, Shield } from 'lucide-react';

interface CharacterCreatorProps {
  initialCustomization?: CharacterCustomization;
  onConfirm: (custom: CharacterCustomization) => void;
}

const DEFAULT_CUSTOM: CharacterCustomization = {
  name: 'Alex Navarro',
  gender: 'female',
  hairStyle: 'short',
  hairColor: 'brown',
  skinTone: 'light',
  outfit: 'student_casual',
  accessory: 'stethoscope'
};

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  initialCustomization = DEFAULT_CUSTOM,
  onConfirm
}) => {
  const [custom, setCustom] = useState<CharacterCustomization>(initialCustomization);
  const [direction, setDirection] = useState<'down' | 'right' | 'up' | 'left'>('down');
  const [walkFrame, setWalkFrame] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live Canvas Preview Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Platform ring
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height * 0.85, 36, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    drawPixelCharacter(
      ctx,
      custom,
      canvas.width / 2 - 32,
      canvas.height * 0.2,
      direction,
      walkFrame,
      3.6
    );
  }, [custom, direction, walkFrame]);

  // Idle animation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setWalkFrame(prev => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  const handleChange = <K extends keyof CharacterCustomization>(key: K, value: CharacterCustomization[K]) => {
    soundEngine.playSelect();
    setCustom(prev => ({ ...prev, [key]: value }));
  };

  const handleRandomize = () => {
    soundEngine.playXpGain();
    const hairStyles: HairStyle[] = ['short', 'long', 'curly', 'ponytail', 'spiky', 'fade'];
    const hairColors: HairColor[] = ['black', 'brown', 'blonde', 'red', 'silver', 'blue'];
    const skinTones: SkinTone[] = ['fair', 'light', 'medium', 'tan', 'dark', 'deep'];
    const outfits: Outfit[] = ['student_casual', 'scrubs_cyan', 'scrubs_navy', 'lab_coat_white', 'intern_formal'];
    const accessories: Accessory[] = ['none', 'glasses', 'stethoscope', 'lanyard'];

    setCustom({
      name: custom.name || 'Estudiante',
      gender: Math.random() > 0.5 ? 'female' : 'male',
      hairStyle: hairStyles[Math.floor(Math.random() * hairStyles.length)],
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      skinTone: skinTones[Math.floor(Math.random() * skinTones.length)],
      outfit: outfits[Math.floor(Math.random() * outfits.length)],
      accessory: accessories[Math.floor(Math.random() * accessories.length)]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 overflow-y-auto">
      <div className="max-w-4xl w-full bg-slate-900 border-2 border-cyan-500 rounded-3xl shadow-2xl p-6 md:p-8 pixel-box">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-bold font-retro text-cyan-400 uppercase tracking-widest">
              Expediente de Matrícula
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-retro text-slate-100">
              Personaliza a tu Médico en Formación
            </h2>
          </div>
          <button
            onClick={handleRandomize}
            className="px-3.5 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-600 text-cyan-300 text-xs font-retro rounded-xl flex items-center gap-2 pixel-button cursor-pointer"
          >
            <Wand2 className="w-4 h-4" />
            <span>Aleatorio</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-6">
          {/* Avatar Preview Panel */}
          <div className="md:col-span-4 flex flex-col items-center justify-center bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
            <div className="relative w-48 h-56 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={192}
                height={224}
                className="w-full h-full block pixelated"
              />
            </div>

            {/* Direction Rotator */}
            <div className="flex gap-2 mt-4">
              {(['down', 'left', 'up', 'right'] as const).map(dir => (
                <button
                  key={dir}
                  onClick={() => {
                    soundEngine.playSelect();
                    setDirection(dir);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-retro border cursor-pointer ${direction === dir ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                >
                  {dir === 'down' ? 'Frente' : dir === 'left' ? 'Izq' : dir === 'up' ? 'Espalda' : 'Der'}
                </button>
              ))}
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs font-bold text-cyan-300 font-retro">{custom.name || 'Estudiante'}</span>
              <p className="text-[11px] text-slate-400 font-ui">1er Año • Aspirante Médico</p>
            </div>
          </div>

          {/* Customization Controls Panel */}
          <div className="md:col-span-8 space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro mb-1.5">
                Nombre del Estudiante
              </label>
              <input
                type="text"
                value={custom.name}
                onChange={e => handleChange('name', e.target.value)}
                maxLength={20}
                placeholder="Ej. Alex Navarro"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl text-slate-100 font-ui text-sm outline-none"
              />
            </div>

            {/* Hair Style */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro mb-1.5">
                Estilo de Cabello
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(['short', 'long', 'curly', 'ponytail', 'spiky', 'fade'] as HairStyle[]).map(style => (
                  <button
                    key={style}
                    onClick={() => handleChange('hairStyle', style)}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-ui capitalize border cursor-pointer ${custom.hairStyle === style ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold' : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro mb-1.5">
                Color de Cabello
              </label>
              <div className="flex flex-wrap gap-2">
                {(['black', 'brown', 'blonde', 'red', 'silver', 'blue'] as HairColor[]).map(color => (
                  <button
                    key={color}
                    onClick={() => handleChange('hairColor', color)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-ui capitalize border flex items-center gap-2 cursor-pointer ${custom.hairColor === color ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold' : 'bg-slate-800/80 text-slate-300 border-slate-700'}`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/30"
                      style={{ backgroundColor: HAIR_PALETTES[color].base }}
                    />
                    <span>{color}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Tone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro mb-1.5">
                Tono de Piel
              </label>
              <div className="flex flex-wrap gap-2">
                {(['fair', 'light', 'medium', 'tan', 'dark', 'deep'] as SkinTone[]).map(tone => (
                  <button
                    key={tone}
                    onClick={() => handleChange('skinTone', tone)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-ui capitalize border flex items-center gap-2 cursor-pointer ${custom.skinTone === tone ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold' : 'bg-slate-800/80 text-slate-300 border-slate-700'}`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/30"
                      style={{ backgroundColor: SKIN_PALETTES[tone].base }}
                    />
                    <span>{tone}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Outfit */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro mb-1.5">
                Indumentaria / Uniforme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'student_casual', label: 'Estudiante Casual' },
                  { id: 'scrubs_cyan', label: 'Pijama Quirúrgica Cian' },
                  { id: 'scrubs_navy', label: 'Pijama Azul Marino' },
                  { id: 'lab_coat_white', label: 'Bata Blanca Clínica' },
                  { id: 'intern_formal', label: 'Uniforme de Interno' }
                ].map(outfit => (
                  <button
                    key={outfit.id}
                    onClick={() => handleChange('outfit', outfit.id as Outfit)}
                    className={`py-2 px-3 text-left rounded-xl text-xs font-ui border cursor-pointer ${custom.outfit === outfit.id ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold' : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'}`}
                  >
                    {outfit.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 font-retro mb-1.5">
                Accesorio Profesional
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'none', label: 'Ninguno' },
                  { id: 'glasses', label: 'Gafas de Estudio' },
                  { id: 'stethoscope', label: 'Fonendoscopio Clínico' },
                  { id: 'lanyard', label: 'Credencial de la Facultad' }
                ].map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => handleChange('accessory', acc.id as Accessory)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-ui border cursor-pointer ${custom.accessory === acc.id ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold' : 'bg-slate-800/80 text-slate-300 border-slate-700'}`}
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => onConfirm(custom)}
            className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-retro text-sm rounded-2xl pixel-button flex items-center gap-3 cursor-pointer shadow-2xl"
          >
            <span>Comenzar Formación Médica</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
