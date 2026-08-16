import { CharacterCustomization, HairColor, HairStyle, Outfit, SkinTone } from '../types/game';

// Color Palette Constants
export const SKIN_PALETTES: Record<SkinTone, { base: string; shadow: string; highlight: string }> = {
  fair: { base: '#fed7aa', shadow: '#fdba74', highlight: '#ffedd5' },
  light: { base: '#fcd34d', shadow: '#fbbf24', highlight: '#fef08a' },
  medium: { base: '#d97706', shadow: '#b45309', highlight: '#f59e0b' },
  tan: { base: '#b45309', shadow: '#92400e', highlight: '#d97706' },
  dark: { base: '#78350f', shadow: '#451a03', highlight: '#92400e' },
  deep: { base: '#451a03', shadow: '#1c0a00', highlight: '#78350f' }
};

export const HAIR_PALETTES: Record<HairColor, { base: string; shadow: string; highlight: string }> = {
  black: { base: '#1e293b', shadow: '#0f172a', highlight: '#334155' },
  brown: { base: '#713f12', shadow: '#451a03', highlight: '#a16207' },
  blonde: { base: '#eab308', shadow: '#ca8a04', highlight: '#fef08a' },
  red: { base: '#b91c1c', shadow: '#7f1d1d', highlight: '#ef4444' },
  silver: { base: '#94a3b8', shadow: '#64748b', highlight: '#cbd5e1' },
  blue: { base: '#0284c7', shadow: '#0369a1', highlight: '#38bdf8' }
};

export const OUTFIT_COLORS: Record<Outfit, { shirt: string; pants: string; coat?: string }> = {
  student_casual: { shirt: '#3b82f6', pants: '#1e293b' },
  scrubs_cyan: { shirt: '#06b6d4', pants: '#0891b2' },
  scrubs_navy: { shirt: '#1e3a8a', pants: '#172554' },
  lab_coat_white: { shirt: '#3b82f6', pants: '#334155', coat: '#f8fafc' },
  intern_formal: { shirt: '#0f172a', pants: '#1e293b', coat: '#ffffff' }
};

/**
 * Draws a pixelated character (Player or NPC) onto the 2D canvas.
 */
export function drawPixelCharacter(
  ctx: CanvasRenderingContext2D,
  custom: CharacterCustomization,
  x: number,
  y: number,
  direction: 'up' | 'down' | 'left' | 'right',
  walkFrame: number = 0,
  scale: number = 2.5
) {
  ctx.save();
  ctx.translate(x, y);

  const skin = SKIN_PALETTES[custom.skinTone] || SKIN_PALETTES.light;
  const hair = HAIR_PALETTES[custom.hairColor] || HAIR_PALETTES.brown;
  const outfit = OUTFIT_COLORS[custom.outfit] || OUTFIT_COLORS.student_casual;

  const bob = walkFrame % 2 !== 0 ? 1 : 0;
  const legOffset = (walkFrame % 4 === 1 ? 2 : walkFrame % 4 === 3 ? -2 : 0) * (direction === 'up' || direction === 'down' ? 1 : 1.5);

  const p = scale; // pixel unit multiplier

  // 1. Shadow underneath
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(8 * p, 15 * p, 6 * p, 3 * p, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Legs / Shoes
  ctx.fillStyle = outfit.pants;
  if (direction === 'up' || direction === 'down') {
    // Left leg
    ctx.fillRect(5 * p, (11 + legOffset) * p, 2.5 * p, 3.5 * p);
    // Right leg
    ctx.fillRect(8.5 * p, (11 - legOffset) * p, 2.5 * p, 3.5 * p);
    // Shoes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(5 * p, (14 + legOffset) * p, 2.5 * p, 1.5 * p);
    ctx.fillRect(8.5 * p, (14 - legOffset) * p, 2.5 * p, 1.5 * p);
  } else {
    // Side profile legs
    ctx.fillRect(6 * p, (11 + legOffset) * p, 3.5 * p, 3.5 * p);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect((direction === 'right' ? 6 : 5) * p, (14 + legOffset) * p, 4 * p, 1.5 * p);
  }

  // 3. Torso / Shirt / Scrubs
  ctx.fillStyle = outfit.shirt;
  ctx.fillRect(4.5 * p, (6 - bob) * p, 7 * p, 5.5 * p);

  // Lab coat overlay if equipped
  if (outfit.coat) {
    ctx.fillStyle = outfit.coat;
    if (direction === 'down') {
      ctx.fillRect(4 * p, (6 - bob) * p, 2.2 * p, 6 * p);
      ctx.fillRect(9.8 * p, (6 - bob) * p, 2.2 * p, 6 * p);
      ctx.fillRect(5 * p, (11 - bob) * p, 6 * p, 1.5 * p);
    } else if (direction === 'up') {
      ctx.fillRect(4 * p, (6 - bob) * p, 8 * p, 6.5 * p);
    } else {
      ctx.fillRect(4 * p, (6 - bob) * p, 8 * p, 6 * p);
      ctx.fillStyle = outfit.shirt;
      ctx.fillRect((direction === 'right' ? 8 : 4.5) * p, (6.5 - bob) * p, 3 * p, 4.5 * p);
    }
  }

  // Arms
  ctx.fillStyle = outfit.coat || outfit.shirt;
  if (direction === 'down') {
    ctx.fillRect(3 * p, (6.5 - bob - legOffset * 0.5) * p, 1.8 * p, 4 * p);
    ctx.fillRect(11.2 * p, (6.5 - bob + legOffset * 0.5) * p, 1.8 * p, 4 * p);
    // Hands
    ctx.fillStyle = skin.base;
    ctx.fillRect(3 * p, (10 - bob - legOffset * 0.5) * p, 1.8 * p, 1.5 * p);
    ctx.fillRect(11.2 * p, (10 - bob + legOffset * 0.5) * p, 1.8 * p, 1.5 * p);
  } else if (direction === 'up') {
    ctx.fillRect(3 * p, (6.5 - bob + legOffset * 0.5) * p, 1.8 * p, 4 * p);
    ctx.fillRect(11.2 * p, (6.5 - bob - legOffset * 0.5) * p, 1.8 * p, 4 * p);
  } else {
    ctx.fillRect(7 * p, (6.5 - bob + legOffset * 0.5) * p, 2.5 * p, 4 * p);
    ctx.fillStyle = skin.base;
    ctx.fillRect(7 * p, (10 - bob + legOffset * 0.5) * p, 2.5 * p, 1.5 * p);
  }

  // 4. Head & Face
  ctx.fillStyle = skin.base;
  ctx.fillRect(4.5 * p, (1.5 - bob) * p, 7 * p, 5 * p);

  // Face Features (Eyes, Eyebrows)
  if (direction === 'down') {
    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(6 * p, (3.5 - bob) * p, 1.2 * p, 1.5 * p);
    ctx.fillRect(8.8 * p, (3.5 - bob) * p, 1.2 * p, 1.5 * p);
    // Eye shine
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(6 * p, (3.5 - bob) * p, 0.6 * p, 0.6 * p);
    ctx.fillRect(8.8 * p, (3.5 - bob) * p, 0.6 * p, 0.6 * p);
    // Mouth / Smile
    ctx.fillStyle = skin.shadow;
    ctx.fillRect(7.2 * p, (5.2 - bob) * p, 1.6 * p, 0.6 * p);
  } else if (direction === 'right') {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(9 * p, (3.5 - bob) * p, 1.2 * p, 1.5 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(9.4 * p, (3.5 - bob) * p, 0.6 * p, 0.6 * p);
  } else if (direction === 'left') {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(5.8 * p, (3.5 - bob) * p, 1.2 * p, 1.5 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5.8 * p, (3.5 - bob) * p, 0.6 * p, 0.6 * p);
  }

  // 5. Hair Styles
  drawHair(ctx, custom.hairStyle, hair, direction, bob, p);

  // 6. Accessories (Glasses, Stethoscope)
  if (custom.accessory === 'glasses' && (direction === 'down' || direction === 'left' || direction === 'right')) {
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1 * p;
    if (direction === 'down') {
      ctx.strokeRect(5.5 * p, (3 - bob) * p, 2 * p, 2 * p);
      ctx.strokeRect(8.5 * p, (3 - bob) * p, 2 * p, 2 * p);
      ctx.beginPath();
      ctx.moveTo(7.5 * p, (3.8 - bob) * p);
      ctx.lineTo(8.5 * p, (3.8 - bob) * p);
      ctx.stroke();
    } else if (direction === 'right') {
      ctx.strokeRect(8.2 * p, (3 - bob) * p, 2.2 * p, 2 * p);
    } else if (direction === 'left') {
      ctx.strokeRect(5.6 * p, (3 - bob) * p, 2.2 * p, 2 * p);
    }
  }

  if (custom.accessory === 'stethoscope' && direction === 'down') {
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1 * p;
    ctx.beginPath();
    ctx.arc(8 * p, (7 - bob) * p, 2.2 * p, 0, Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(7.4 * p, (9.2 - bob) * p, 1.2 * p, 1.2 * p);
  }

  ctx.restore();
}

function drawHair(
  ctx: CanvasRenderingContext2D,
  style: HairStyle,
  color: { base: string; shadow: string; highlight: string },
  direction: 'up' | 'down' | 'left' | 'right',
  bob: number,
  p: number
) {
  ctx.fillStyle = color.base;

  // Hair Top Cap
  ctx.fillRect(4 * p, (0.5 - bob) * p, 8 * p, 2.5 * p);

  if (style === 'short') {
    if (direction === 'down') {
      ctx.fillRect(3.8 * p, (1 - bob) * p, 1.2 * p, 3 * p);
      ctx.fillRect(11 * p, (1 - bob) * p, 1.2 * p, 3 * p);
      ctx.fillRect(4.5 * p, (2.2 - bob) * p, 7 * p, 1 * p);
    } else if (direction === 'up') {
      ctx.fillRect(4 * p, (1 - bob) * p, 8 * p, 5.5 * p);
    } else {
      ctx.fillRect((direction === 'right' ? 3.8 : 10) * p, (1 - bob) * p, 2.2 * p, 4 * p);
    }
  } else if (style === 'long') {
    if (direction === 'down') {
      ctx.fillRect(3.5 * p, (1 - bob) * p, 1.8 * p, 7 * p);
      ctx.fillRect(10.7 * p, (1 - bob) * p, 1.8 * p, 7 * p);
    } else if (direction === 'up') {
      ctx.fillRect(3.5 * p, (1 - bob) * p, 9 * p, 8 * p);
    } else {
      ctx.fillRect((direction === 'right' ? 3 : 9) * p, (1 - bob) * p, 4 * p, 8 * p);
    }
  } else if (style === 'curly') {
    ctx.fillRect(3 * p, (0.2 - bob) * p, 10 * p, 3.5 * p);
    ctx.fillRect(3 * p, (3 - bob) * p, 2 * p, 4 * p);
    ctx.fillRect(11 * p, (3 - bob) * p, 2 * p, 4 * p);
  } else if (style === 'ponytail') {
    if (direction === 'down') {
      ctx.fillRect(3.8 * p, (1 - bob) * p, 1.5 * p, 3 * p);
      ctx.fillRect(10.7 * p, (1 - bob) * p, 1.5 * p, 3 * p);
      // Ponytail hanging to the side
      ctx.fillRect(11.5 * p, (2.5 - bob) * p, 2 * p, 5 * p);
    } else if (direction === 'up') {
      ctx.fillRect(4 * p, (1 - bob) * p, 8 * p, 5 * p);
      ctx.fillRect(7 * p, (5 - bob) * p, 2 * p, 5 * p);
    } else {
      ctx.fillRect((direction === 'right' ? 2 : 11) * p, (2 - bob) * p, 3 * p, 6 * p);
    }
  } else if (style === 'spiky') {
    // Spikes on top
    ctx.fillRect(4.5 * p, (-0.6 - bob) * p, 1.5 * p, 1.5 * p);
    ctx.fillRect(7 * p, (-1 - bob) * p, 2 * p, 1.8 * p);
    ctx.fillRect(9.5 * p, (-0.6 - bob) * p, 1.5 * p, 1.5 * p);
  } else {
    // Fade / Clean
    ctx.fillRect(4.5 * p, (0.5 - bob) * p, 7 * p, 2 * p);
  }
}

/**
 * Procedurally draws environment tiles (floors, walls, grass, water, carpets, tables).
 */
export function drawTile(
  ctx: CanvasRenderingContext2D,
  tileType: number,
  x: number,
  y: number,
  tileSize: number,
  timeMs: number = 0
) {
  ctx.save();
  ctx.translate(x, y);

  switch (tileType) {
    case 0: // Parquet / Hospital Tile Floor
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 0, tileSize, tileSize);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, tileSize, tileSize);
      // Subtle shine dot
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(3, 3, 2, 2);
      break;

    case 1: // Wall (Modern Medical Facility / University)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, tileSize, tileSize);
      // Top wall bevel
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, tileSize, 4);
      // Dark bottom shadow
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, tileSize - 4, tileSize, 4);
      // Brick mortar line
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, tileSize / 2);
      ctx.lineTo(tileSize, tileSize / 2);
      ctx.stroke();
      break;

    case 2: // Door / Transition Portal
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 0, tileSize, tileSize);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(3, 3, tileSize - 6, tileSize - 6);
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(tileSize / 2 - 2, tileSize / 2 - 4, 4, 8);
      break;

    case 3: // Carpet (Teal / Warm Navy)
      ctx.fillStyle = '#0f766e';
      ctx.fillRect(0, 0, tileSize, tileSize);
      ctx.fillStyle = '#115e59';
      ctx.fillRect(2, 2, tileSize - 4, tileSize - 4);
      break;

    case 4: // Counter / Table / Desk
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, 0, tileSize, tileSize);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(2, 2, tileSize - 4, tileSize - 4);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(tileSize - 4, tileSize - 4, 4, 4);
      break;

    case 5: // Campus Grass
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 0, tileSize, tileSize);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(4, 4, 3, 3);
      ctx.fillRect(tileSize - 8, tileSize - 8, 3, 3);
      break;

    case 6: // Cobblestone Path
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, 0, tileSize, tileSize);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.strokeRect(2, 2, tileSize / 2 - 2, tileSize / 2 - 2);
      ctx.strokeRect(tileSize / 2 + 1, tileSize / 2 + 1, tileSize / 2 - 2, tileSize / 2 - 2);
      break;

    case 7: // Tree / Bush (Solid)
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 0, tileSize, tileSize);
      // Trunk & Foliage
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.arc(tileSize / 2, tileSize / 2, tileSize * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(tileSize / 2 - 3, tileSize / 2 - 3, tileSize * 0.25, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 8: // Water / Fountain (Animated)
      const wave = Math.sin(timeMs / 400 + (x + y) / 20) * 2;
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 0, tileSize, tileSize);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(4 + wave, 6, tileSize - 8, 3);
      ctx.fillRect(6 - wave, 14, tileSize - 12, 2);
      break;

    default:
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, tileSize, tileSize);
  }

  ctx.restore();
}

/**
 * Draws special interactable objects (Hospital Beds, Computers, Books, Stethoscope posters, Coffee machines).
 */
export function drawObject(
  ctx: CanvasRenderingContext2D,
  objType: string,
  x: number,
  y: number,
  tileSize: number
) {
  ctx.save();
  ctx.translate(x, y);

  if (objType === 'bed') {
    // Hospital Bed
    ctx.fillStyle = '#64748b';
    ctx.fillRect(2, 2, tileSize - 4, tileSize - 4);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(4, 4, tileSize - 8, tileSize - 10);
    // Pillow
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(6, 6, tileSize - 12, 6);
  } else if (objType === 'computer') {
    // Clinical Computer Station
    ctx.fillStyle = '#334155';
    ctx.fillRect(4, 8, tileSize - 8, tileSize - 10);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(6, 2, tileSize - 12, 8);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(8, 4, tileSize - 16, 5);
  } else if (objType === 'coffee') {
    // Coffee Machine
    ctx.fillStyle = '#b45309';
    ctx.fillRect(4, 4, tileSize - 8, tileSize - 6);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(7, 7, tileSize - 14, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(9, 15, 6, 6);
  } else if (objType === 'book') {
    // Open Academic Book
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(4, 6, tileSize - 8, tileSize - 12);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(6, 8, tileSize - 12, tileSize - 16);
  } else if (objType === 'whiteboard') {
    // Whiteboard / Chalkboard
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(2, 2, tileSize - 4, tileSize - 4);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(4, 4, tileSize - 8, tileSize - 8);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(6, 6, tileSize - 12, 2);
    ctx.fillRect(6, 10, tileSize - 14, 2);
  } else if (objType === 'plant') {
    // Medical Office Plant
    ctx.fillStyle = '#78350f';
    ctx.fillRect(tileSize / 2 - 4, tileSize - 8, 8, 6);
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(tileSize / 2, tileSize / 2 - 2, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draws floating indicator icons ([!] for Quest / [?] for Inspection)
 */
export function drawIndicator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: 'quest' | 'dialogue' | 'examine',
  timeMs: number
) {
  const bob = Math.sin(timeMs / 250) * 4;
  ctx.save();
  ctx.translate(x, y - 18 + bob);

  // Background bubble
  ctx.fillStyle = type === 'quest' ? '#f59e0b' : '#0284c7';
  ctx.beginPath();
  ctx.roundRect(-10, -10, 20, 20, [4]);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Icon symbol
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(type === 'quest' ? '!' : '?', 0, 1);

  ctx.restore();
}
