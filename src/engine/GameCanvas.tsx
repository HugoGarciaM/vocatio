import React, { useEffect, useRef, useState, useCallback } from 'react';

import { CharacterCustomization, MapLocation, MapObject, NPC } from '../types/game';
import { MAPS_DATA } from '../data/mapsData';
import { drawPixelCharacter, drawTile, drawObject, drawIndicator } from './spriteRenderer';
import { soundEngine } from '../audio/soundEngine';
import { Compass, MessageSquare, Hand, Sparkles, MapPin } from 'lucide-react';

interface GameCanvasProps {
  currentMapId: string;
  character: CharacterCustomization;
  playerX: number;
  playerY: number;
  playerDirection: 'up' | 'down' | 'left' | 'right';
  onMove: (x: number, y: number, dir: 'up' | 'down' | 'left' | 'right') => void;
  onInteractNPC: (npc: NPC) => void;
  onInteractObject: (obj: MapObject) => void;
  onChangeMap: (targetMap: string, targetX: number, targetY: number) => void;
  onOpenMenu: (tab?: string) => void;
  disabled?: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  currentMapId,
  character,
  playerX,
  playerY,
  playerDirection,
  onMove,
  onInteractNPC,
  onInteractObject,
  onChangeMap,
  onOpenMenu,
  disabled = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [nearbyNPC, setNearbyNPC] = useState<NPC | null>(null);
  const [nearbyObject, setNearbyObject] = useState<MapObject | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Area entrance popup banner state
  const [areaBanner, setAreaBanner] = useState<{ name: string; description: string } | null>(null);
  const [showAreaBanner, setShowAreaBanner] = useState<boolean>(false);
  const [bannerKey, setBannerKey] = useState<number>(0);

  // Android & Mobile Touch Device Detection
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const isAndroid = /Android/i.test(ua);
    const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const hasTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    return isAndroid || isMobileOrTablet || hasTouch;
  });

  useEffect(() => {
    const enableTouch = () => setIsTouchDevice(true);
    window.addEventListener('touchstart', enableTouch, { once: true });
    return () => window.removeEventListener('touchstart', enableTouch);
  }, []);

  const handleDPadTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target) {
        const dir = target.getAttribute('data-dir');
        if (dir) {
          virtualDir.current = dir;
          return;
        }
      }
    }
    virtualDir.current = null;
  };



  const TILE_SIZE = 32;

  // Real-time movement state
  const pixelPosRef = useRef({ x: playerX * TILE_SIZE, y: playerY * TILE_SIZE, dir: playerDirection });
  const targetPosRef = useRef({ x: playerX, y: playerY, dir: playerDirection });
  const isMovingRef = useRef(false);
  const walkFrameRef = useRef(0);
  
  const keysDown = useRef(new Set<string>());
  const virtualDir = useRef<string | null>(null);

  const mapData = MAPS_DATA[currentMapId] || MAPS_DATA.campus_main;

  // Debounced onMove to prevent React re-render stutter
  const lastMoveSync = useRef(Date.now());
  const syncMoveState = useCallback((tx: number, ty: number, dir: 'up' | 'down' | 'left' | 'right') => {
    const now = Date.now();
    if (now - lastMoveSync.current > 100) { // Sync at most every 100ms
      onMove(tx, ty, dir);
      lastMoveSync.current = now;
    }
  }, [onMove]);

  // Sync positions when map changes
  useEffect(() => {
    pixelPosRef.current = { x: playerX * TILE_SIZE, y: playerY * TILE_SIZE, dir: playerDirection };
    targetPosRef.current = { x: playerX, y: playerY, dir: playerDirection };
    isMovingRef.current = false;
  }, [currentMapId]); 
  // ONLY run on currentMapId change. Do NOT depend on playerX/Y to avoid stuttering!

  // Ambient sound & Location banner popup according to current room
  useEffect(() => {
    const soundMap: Record<string, 'campus' | 'hospital' | 'library' | 'reflection' | 'tension'> = {
      campus_main: 'campus',
      hospital_ward: 'hospital',
      library: 'library',
      psych_office: 'reflection',
      cafeteria: 'campus'
    };
    soundEngine.playMusic(soundMap[currentMapId] || 'campus');

    // Trigger Area Entrance Banner Notice
    const map = MAPS_DATA[currentMapId] || MAPS_DATA.campus_main;
    setAreaBanner({ name: map.name, description: map.description });
    setShowAreaBanner(true);
    setBannerKey(prev => prev + 1);

    const bannerTimer = setTimeout(() => {
      setShowAreaBanner(false);
    }, 3600);

    return () => {
      clearTimeout(bannerTimer);
      soundEngine.stopMusic();
    };
  }, [currentMapId]);


  // Check nearby interactables
  const checkProximity = useCallback((px: number, py: number, map: MapLocation) => {
    let foundNpc: NPC | null = null;
    for (const npc of map.npcs) {
      const dist = Math.hypot(npc.x - px, npc.y - py);
      if (dist <= 1.5) {
        foundNpc = npc;
        break;
      }
    }
    setNearbyNPC(foundNpc);

    let foundObj: MapObject | null = null;
    for (const obj of map.objects) {
      const dist = Math.hypot(obj.x - px, obj.y - py);
      if (dist <= 1.5) {
        foundObj = obj;
        break;
      }
    }
    setNearbyObject(foundObj);
  }, []);

  // Keyboard events for continuous movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || isTransitioning) return;
      keysDown.current.add(e.key.toLowerCase());
      
      // Action keys
      if (['e', ' ', 'enter'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        handlePrimaryInteract();
      }
      // Menu keys
      if (e.key.toLowerCase() === 'm') onOpenMenu('mapa');
      if (e.key.toLowerCase() === 'j') onOpenMenu('diario');
      if (e.key.toLowerCase() === 'escape') onOpenMenu('estadisticas');
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [disabled, isTransitioning, onOpenMenu]);

  const handlePrimaryInteract = useCallback(() => {
    if (disabled || isTransitioning) return;
    if (nearbyNPC) {
      soundEngine.playInteract();
      // Ensure we face the NPC
      const dx = nearbyNPC.x - targetPosRef.current.x;
      const dy = nearbyNPC.y - targetPosRef.current.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        pixelPosRef.current.dir = dx > 0 ? 'right' : 'left';
      } else {
        pixelPosRef.current.dir = dy > 0 ? 'down' : 'up';
      }
      onInteractNPC(nearbyNPC);
    } else if (nearbyObject) {
      soundEngine.playInteract();
      onInteractObject(nearbyObject);
    }
  }, [disabled, isTransitioning, nearbyNPC, nearbyObject, onInteractNPC, onInteractObject]);

  // Main Game Render & Movement Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (timeMs: number) => {
      const dt = timeMs - lastTime;
      lastTime = timeMs;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const currentMap = MAPS_DATA[currentMapId] || MAPS_DATA.campus_main;
      
      // MOVEMENT LOGIC
      const speed = 2.0; // pixels per frame

      if (!isMovingRef.current && !disabled && !isTransitioning) {
        let desiredDir: 'up' | 'down' | 'left' | 'right' | null = null;
        
        if (virtualDir.current) {
          desiredDir = virtualDir.current as any;
        } else if (keysDown.current.has('w') || keysDown.current.has('arrowup')) {
          desiredDir = 'up';
        } else if (keysDown.current.has('s') || keysDown.current.has('arrowdown')) {
          desiredDir = 'down';
        } else if (keysDown.current.has('a') || keysDown.current.has('arrowleft')) {
          desiredDir = 'left';
        } else if (keysDown.current.has('d') || keysDown.current.has('arrowright')) {
          desiredDir = 'right';
        }

        if (desiredDir) {
          const dx = desiredDir === 'right' ? 1 : desiredDir === 'left' ? -1 : 0;
          const dy = desiredDir === 'down' ? 1 : desiredDir === 'up' ? -1 : 0;
          
          const tx = targetPosRef.current.x + dx;
          const ty = targetPosRef.current.y + dy;

          pixelPosRef.current.dir = desiredDir;
          
          // Collision Check
          let canMove = true;
          if (tx < 0 || tx >= currentMap.width || ty < 0 || ty >= currentMap.height) {
             canMove = false;
          } else {
             const targetTile = currentMap.tiles[ty]?.[tx];
             const solidTiles = [1, 4, 7, 8];
             if (solidTiles.includes(targetTile)) canMove = false;
             
             const hitsNPC = currentMap.npcs.some(npc => npc.x === tx && npc.y === ty);
             if (hitsNPC) canMove = false;
          }

          if (canMove) {
            targetPosRef.current = { x: tx, y: ty, dir: desiredDir };
            isMovingRef.current = true;
            walkFrameRef.current = (walkFrameRef.current + 1) % 4;
            if (walkFrameRef.current === 0 || walkFrameRef.current === 2) soundEngine.playFootstep();
          } else {
            // Still sync direction even if blocked
            syncMoveState(targetPosRef.current.x, targetPosRef.current.y, desiredDir);
          }
        }
      }

      // Interpolate movement
      if (isMovingRef.current) {
        const targetPixelX = targetPosRef.current.x * TILE_SIZE;
        const targetPixelY = targetPosRef.current.y * TILE_SIZE;
        
        if (pixelPosRef.current.x < targetPixelX) pixelPosRef.current.x = Math.min(targetPixelX, pixelPosRef.current.x + speed);
        if (pixelPosRef.current.x > targetPixelX) pixelPosRef.current.x = Math.max(targetPixelX, pixelPosRef.current.x - speed);
        if (pixelPosRef.current.y < targetPixelY) pixelPosRef.current.y = Math.min(targetPixelY, pixelPosRef.current.y + speed);
        if (pixelPosRef.current.y > targetPixelY) pixelPosRef.current.y = Math.max(targetPixelY, pixelPosRef.current.y - speed);

        if (pixelPosRef.current.x === targetPixelX && pixelPosRef.current.y === targetPixelY) {
          isMovingRef.current = false; // Reached destination tile
          
          checkProximity(targetPosRef.current.x, targetPosRef.current.y, currentMap);
          syncMoveState(targetPosRef.current.x, targetPosRef.current.y, pixelPosRef.current.dir);
          
          // Check door transitions
          const doorObj = currentMap.objects.find(obj => obj.type === 'door' && obj.x === targetPosRef.current.x && obj.y === targetPosRef.current.y);
          if (doorObj && doorObj.targetMap) {
            setIsTransitioning(true);
            soundEngine.playSelect();
            setTimeout(() => {
              onChangeMap(doorObj.targetMap!, doorObj.targetX || 5, doorObj.targetY || 5);
              setIsTransitioning(false);
            }, 250);
          }
        }
      }

      // DRAWING
      ctx.imageSmoothingEnabled = false;
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      const cameraX = Math.floor(width / 2 - pixelPosRef.current.x - TILE_SIZE / 2);
      const cameraY = Math.floor(height / 2 - pixelPosRef.current.y - TILE_SIZE / 2);

      ctx.save();
      ctx.translate(cameraX, cameraY);

      // Tiles
      for (let y = 0; y < currentMap.height; y++) {
        for (let x = 0; x < currentMap.width; x++) {
          const tile = currentMap.tiles[y]?.[x] ?? 0;
          drawTile(ctx, tile, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, timeMs);
        }
      }

      // Objects
      for (const obj of currentMap.objects) {
        drawObject(ctx, obj.type, obj.x * TILE_SIZE, obj.y * TILE_SIZE, TILE_SIZE);
      }

      // NPCs
      for (const npc of currentMap.npcs) {
        const npcCustom: CharacterCustomization = {
          name: npc.name,
          gender: 'nonbinary',
          hairStyle: npc.sprite.includes('female') ? 'long' : 'short',
          hairColor: npc.sprite.includes('elder') ? 'silver' : 'brown',
          skinTone: 'light',
          outfit: npc.sprite.includes('patient') ? 'scrubs_cyan' : npc.sprite.includes('doctor') || npc.sprite.includes('teacher') ? 'lab_coat_white' : npc.sprite.includes('surgeon') ? 'scrubs_cyan' : 'student_casual',
          accessory: npc.sprite.includes('doctor') ? 'stethoscope' : 'none'
        };

        drawPixelCharacter(ctx, npcCustom, npc.x * TILE_SIZE, npc.y * TILE_SIZE, npc.direction, 0, 2.0);

        if (npc.questGiver) {
          drawIndicator(ctx, npc.x * TILE_SIZE + TILE_SIZE / 2, npc.y * TILE_SIZE, 'quest', timeMs);
        } else {
          drawIndicator(ctx, npc.x * TILE_SIZE + TILE_SIZE / 2, npc.y * TILE_SIZE, 'dialogue', timeMs);
        }

        const displayName = npc.fullName || npc.name;
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        const textWidth = ctx.measureText(displayName).width;
        ctx.roundRect(npc.x * TILE_SIZE + TILE_SIZE/2 - (textWidth + 20)/2, npc.y * TILE_SIZE + TILE_SIZE + 4, textWidth + 20, 16, [4]);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '9px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(displayName, npc.x * TILE_SIZE + TILE_SIZE / 2, npc.y * TILE_SIZE + TILE_SIZE + 15);
      }

      // Player
      drawPixelCharacter(
        ctx,
        character,
        pixelPosRef.current.x,
        pixelPosRef.current.y,
        pixelPosRef.current.dir,
        isMovingRef.current ? walkFrameRef.current : 0,
        2.0
      );

      ctx.fillStyle = 'rgba(2, 132, 199, 0.9)';
      ctx.beginPath();
      ctx.roundRect(pixelPosRef.current.x - 16, pixelPosRef.current.y + TILE_SIZE + 4, TILE_SIZE + 32, 16, [4]);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(character.name || 'Estudiante', pixelPosRef.current.x + TILE_SIZE / 2, pixelPosRef.current.y + TILE_SIZE + 15);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [character, currentMapId, disabled, isTransitioning, onChangeMap, syncMoveState, checkProximity]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Mobile Touch Callbacks
  const startTouchMove = (dir: string) => {
    virtualDir.current = dir;
  };
  const stopTouchMove = () => {
    virtualDir.current = null;
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-950 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />

      {isTransitioning && (
        <div className="absolute inset-0 bg-slate-950 transition-opacity duration-200 pointer-events-none z-50" />
      )}

      {/* Area Entrance Notification Banner Popup */}
      {areaBanner && showAreaBanner && (
        <div
          key={`area-banner-${currentMapId}-${bannerKey}`}
          className="absolute top-16 md:top-12 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-area-banner flex flex-col items-center"
        >
          <div className="bg-slate-950/95 border-2 border-cyan-400/90 shadow-[0_0_35px_rgba(6,182,212,0.4)] px-6 py-2.5 md:px-7 md:py-3 rounded-2xl flex flex-col items-center text-center backdrop-blur-md min-w-[260px] max-w-[90vw]">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="w-4 h-4 text-amber-400 animate-bounce" />
              <span className="text-[9px] md:text-[10px] font-retro uppercase tracking-[0.25em] text-amber-400 font-bold">
                Área Actual
              </span>
            </div>
            <h2 className="text-sm md:text-lg font-bold font-retro text-cyan-100 tracking-wide drop-shadow-md">
              {areaBanner.name}
            </h2>
            <p className="text-[10px] md:text-xs text-slate-300 font-ui mt-0.5 max-w-sm line-clamp-2">
              {areaBanner.description}
            </p>
          </div>
        </div>
      )}

      {/* Static location badge */}
      <div className="hidden sm:flex absolute top-16 left-4 z-20 pointer-events-none bg-slate-900/90 border border-slate-700/80 px-3.5 py-1.5 rounded-lg shadow-lg items-center gap-2 backdrop-blur-md">
        <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
        <div>
          <h3 className="font-retro text-sm text-cyan-200 tracking-wide font-bold">{mapData.name}</h3>
          <p className="text-[11px] text-slate-400 font-ui line-clamp-1">{mapData.description}</p>
        </div>
      </div>

      {/* Nearby Proximity Prompt (Desktop / Touch) */}
      {(nearbyNPC || nearbyObject) && (
        <div className="absolute bottom-28 sm:bottom-24 left-1/2 -translate-x-1/2 z-30 animate-bounce bg-cyan-950/95 border-2 border-cyan-400 text-cyan-100 px-4 py-2 md:px-5 md:py-2.5 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md max-w-[92vw]">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-left">
            <div className="text-xs font-bold font-retro text-cyan-200 uppercase tracking-wider line-clamp-1">
              {nearbyNPC ? `Hablar con ${nearbyNPC.fullName || nearbyNPC.name}` : `Examinar ${nearbyObject?.name}`}
            </div>
            <div className="text-[10px] md:text-[11px] text-slate-300 font-ui">
              Presiona <kbd className="px-1 bg-cyan-800 text-white rounded font-mono text-[9px]">E</kbd> o toca Acción
            </div>
          </div>
          <button
            onClick={handlePrimaryInteract}
            className="ml-1 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs font-retro pixel-button flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Hand className="w-3.5 h-3.5" />
            Interactuar
          </button>
        </div>
      )}

      {/* Universal Touch Controls Overlay (Android, Mobile, Tablet & Touchscreen Devices) */}
      {isTouchDevice && (
        <div className="absolute inset-0 pointer-events-none z-30 flex justify-between items-end p-2 sm:p-4 md:p-6 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {/* Virtual 4-Way Directional D-Pad */}
          <div
            className="pointer-events-auto relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 bg-slate-950/85 border-2 border-cyan-500/60 rounded-full p-1.5 backdrop-blur-md shadow-2xl touch-none flex items-center justify-center select-none"
            onTouchMove={handleDPadTouchMove}
            onTouchEnd={() => { virtualDir.current = null; }}
          >
            {/* Up Button */}
            <button
              data-dir="up"
              onTouchStart={(e) => { e.preventDefault(); virtualDir.current = 'up'; }}
              onTouchEnd={(e) => { e.preventDefault(); virtualDir.current = null; }}
              onMouseDown={() => { virtualDir.current = 'up'; }}
              onMouseUp={() => { virtualDir.current = null; }}
              className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-11 sm:w-12 sm:h-13 bg-cyan-950/90 border border-cyan-400/70 rounded-t-xl sm:rounded-t-2xl flex items-center justify-center text-cyan-300 active:bg-cyan-500 active:text-slate-950 font-bold text-base sm:text-lg select-none shadow-md"
            >
              ▲
            </button>

            {/* Down Button */}
            <button
              data-dir="down"
              onTouchStart={(e) => { e.preventDefault(); virtualDir.current = 'down'; }}
              onTouchEnd={(e) => { e.preventDefault(); virtualDir.current = null; }}
              onMouseDown={() => { virtualDir.current = 'down'; }}
              onMouseUp={() => { virtualDir.current = null; }}
              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-11 sm:w-12 sm:h-13 bg-cyan-950/90 border border-cyan-400/70 rounded-b-xl sm:rounded-b-2xl flex items-center justify-center text-cyan-300 active:bg-cyan-500 active:text-slate-950 font-bold text-base sm:text-lg select-none shadow-md"
            >
              ▼
            </button>

            {/* Left Button */}
            <button
              data-dir="left"
              onTouchStart={(e) => { e.preventDefault(); virtualDir.current = 'left'; }}
              onTouchEnd={(e) => { e.preventDefault(); virtualDir.current = null; }}
              onMouseDown={() => { virtualDir.current = 'left'; }}
              onMouseUp={() => { virtualDir.current = null; }}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-11 h-10 sm:w-13 sm:h-12 bg-cyan-950/90 border border-cyan-400/70 rounded-l-xl sm:rounded-l-2xl flex items-center justify-center text-cyan-300 active:bg-cyan-500 active:text-slate-950 font-bold text-base sm:text-lg select-none shadow-md"
            >
              ◀
            </button>

            {/* Right Button */}
            <button
              data-dir="right"
              onTouchStart={(e) => { e.preventDefault(); virtualDir.current = 'right'; }}
              onTouchEnd={(e) => { e.preventDefault(); virtualDir.current = null; }}
              onMouseDown={() => { virtualDir.current = 'right'; }}
              onMouseUp={() => { virtualDir.current = null; }}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-10 sm:w-13 sm:h-12 bg-cyan-950/90 border border-cyan-400/70 rounded-r-xl sm:rounded-r-2xl flex items-center justify-center text-cyan-300 active:bg-cyan-500 active:text-slate-950 font-bold text-base sm:text-lg select-none shadow-md"
            >
              ▶
            </button>

            {/* D-Pad Center Indicator */}
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-[8px] sm:text-[9px] font-retro text-cyan-400 font-bold pointer-events-none">
              PAD
            </div>
          </div>

          {/* Action / Interaction Touch Button */}
          <div className="pointer-events-auto flex flex-col items-end gap-2 mb-0.5">
            <button
              onClick={handlePrimaryInteract}
              onTouchStart={(e) => { e.preventDefault(); handlePrimaryInteract(); }}
              className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center border-2 sm:border-4 shadow-2xl transition-all cursor-pointer select-none active:scale-95 ${
                nearbyNPC || nearbyObject
                  ? 'bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 border-white text-slate-950 animate-pulse'
                  : 'bg-gradient-to-tr from-cyan-600 to-blue-600 border-cyan-300 text-slate-950'
              }`}
            >
              {nearbyNPC ? (
                <>
                  <MessageSquare className="w-5 h-5 sm:w-7 sm:h-7 mb-0.5 fill-current" />
                  <span className="text-[9px] sm:text-[10px] font-bold font-retro uppercase tracking-tighter">Hablar</span>
                </>
              ) : nearbyObject ? (
                <>
                  <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 mb-0.5 fill-current" />
                  <span className="text-[9px] sm:text-[10px] font-bold font-retro uppercase tracking-tighter">Examinar</span>
                </>
              ) : (
                <>
                  <Hand className="w-5 h-5 sm:w-7 sm:h-7 mb-0.5" />
                  <span className="text-[9px] sm:text-[10px] font-bold font-retro uppercase tracking-tighter">Acción [E]</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}


      {/* Manual Touch Control Toggle (Fallback for Touchscreen Laptops or Manual Enable) */}
      <button
        onClick={() => setIsTouchDevice(!isTouchDevice)}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 text-[9px] font-retro text-slate-400 hover:text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 cursor-pointer pointer-events-auto"
        title="Alternar controles táctiles en pantalla"
      >
        {isTouchDevice ? 'Ocultar Controles Táctiles' : 'Activar Controles Táctiles'}
      </button>

      <div className="absolute inset-0 scanlines pointer-events-none opacity-40" />
    </div>
  );
};

