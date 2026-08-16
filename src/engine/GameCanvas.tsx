import React, { useEffect, useRef, useState, useCallback } from 'react';

import { CharacterCustomization, MapLocation, MapObject, NPC } from '../types/game';
import { MAPS_DATA } from '../data/mapsData';
import { drawPixelCharacter, drawTile, drawObject, drawIndicator } from './spriteRenderer';
import { soundEngine } from '../audio/soundEngine';
import { Compass, MessageSquare, Hand, Sparkles } from 'lucide-react';

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

  // Ambient sound according to current room
  useEffect(() => {
    const soundMap: Record<string, 'campus' | 'hospital' | 'library' | 'reflection' | 'tension'> = {
      campus_main: 'campus',
      hospital_ward: 'hospital',
      library: 'library',
      psych_office: 'reflection',
      cafeteria: 'campus'
    };
    soundEngine.playMusic(soundMap[currentMapId] || 'campus');

    // Stop the ambient loop when GameCanvas unmounts (e.g. returning to the
    // title screen or resetting the game) so no orphaned setTimeout keeps
    // scheduling notes in the background.
    return () => {
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

      <div className="absolute top-4 left-4 z-20 pointer-events-none bg-slate-900/90 border border-slate-700/80 px-3.5 py-1.5 rounded-lg shadow-lg flex items-center gap-2 backdrop-blur-md">
        <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
        <div>
          <h3 className="font-retro text-sm text-cyan-200 tracking-wide font-bold">{mapData.name}</h3>
          <p className="text-[11px] text-slate-400 font-ui line-clamp-1">{mapData.description}</p>
        </div>
      </div>

      {(nearbyNPC || nearbyObject) && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 animate-bounce bg-cyan-950/95 border-2 border-cyan-400 text-cyan-100 px-5 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <div className="text-left">
            <div className="text-xs font-bold font-retro text-cyan-200 uppercase tracking-wider">
              {nearbyNPC ? `Hablar con ${nearbyNPC.fullName || nearbyNPC.name} ${nearbyNPC.isPatient ? `(Paciente - ${nearbyNPC.age} años)` : ''}` : `Examinar ${nearbyObject?.name}`}
            </div>
            <div className="text-[11px] text-slate-300 font-ui">
              Presiona <kbd className="px-1.5 py-0.5 bg-cyan-800 text-white rounded font-mono text-[10px]">E</kbd> o toca el botón de interacción
            </div>
          </div>
          <button
            onClick={handlePrimaryInteract}
            className="ml-2 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs font-retro pixel-button flex items-center gap-1 cursor-pointer"
          >
            <Hand className="w-3.5 h-3.5" />
            Interactuar
          </button>
        </div>
      )}

      {/* Mobile Touch On-Screen Virtual Controls (Hold to move) */}
      <div className="md:hidden absolute bottom-4 left-4 z-30 flex flex-col items-center gap-1 opacity-90 touch-none">
        <button
          onTouchStart={(e) => { e.preventDefault(); startTouchMove('up'); }}
          onTouchEnd={(e) => { e.preventDefault(); stopTouchMove(); }}
          className="w-16 h-16 bg-slate-900/80 border-2 border-cyan-500/60 rounded-xl flex items-center justify-center text-cyan-300 active:bg-cyan-600 active:text-white font-bold text-2xl select-none"
        >
          ▲
        </button>
        <div className="flex gap-16">
          <button
            onTouchStart={(e) => { e.preventDefault(); startTouchMove('left'); }}
            onTouchEnd={(e) => { e.preventDefault(); stopTouchMove(); }}
            className="w-16 h-16 bg-slate-900/80 border-2 border-cyan-500/60 rounded-xl flex items-center justify-center text-cyan-300 active:bg-cyan-600 active:text-white font-bold text-2xl select-none"
          >
            ◀
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); startTouchMove('right'); }}
            onTouchEnd={(e) => { e.preventDefault(); stopTouchMove(); }}
            className="w-16 h-16 bg-slate-900/80 border-2 border-cyan-500/60 rounded-xl flex items-center justify-center text-cyan-300 active:bg-cyan-600 active:text-white font-bold text-2xl select-none"
          >
            ▶
          </button>
        </div>
        <button
          onTouchStart={(e) => { e.preventDefault(); startTouchMove('down'); }}
          onTouchEnd={(e) => { e.preventDefault(); stopTouchMove(); }}
          className="w-16 h-16 bg-slate-900/80 border-2 border-cyan-500/60 rounded-xl flex items-center justify-center text-cyan-300 active:bg-cyan-600 active:text-white font-bold text-2xl -mt-16 select-none"
          style={{ transform: 'translateY(68px)' }}
        >
          ▼
        </button>
      </div>

      <div className="md:hidden absolute bottom-6 right-4 z-30 flex flex-col gap-2 touch-none">
        <button
          onClick={handlePrimaryInteract}
          className="w-20 h-20 bg-cyan-500 text-slate-950 border-2 border-white rounded-full flex flex-col items-center justify-center shadow-2xl active:scale-95 font-bold font-retro text-sm select-none"
        >
          <MessageSquare className="w-6 h-6 mb-1" />
          <span>Acción</span>
        </button>
      </div>

      <div className="absolute inset-0 scanlines pointer-events-none opacity-40" />
    </div>
  );
};
