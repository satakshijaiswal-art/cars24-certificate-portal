import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Download, Play, Square, Video, Music, VolumeX } from 'lucide-react';

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const BRAND = {
  primary: '#4736FE',
  primaryDark: '#2B3990',
  bg: '#1c1c1c',
  surface: '#252525',
  border: 'rgba(255,255,255,0.06)',
  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.5)',
  gold: '#FFD700',
  bodyText: '#1C1C1C',
};

const VIDEO_W = 1280;
const VIDEO_H = 720;

// ─── Duration options ─────────────────────────────────────────────────────────
const DURATION_OPTIONS = [
  { label: '4s', ms: 4000 },
  { label: '6s', ms: 6000 },
  { label: '8s', ms: 8000 },
  { label: '10s', ms: 10000 },
];

// ─── Accent color palette — Cars24 brand-safe only ───────────────────────────
const ACCENT_COLORS = [
  { id: 'gold',        label: 'Gold',        hex: '#FFD700' },
  { id: 'white',       label: 'White',       hex: '#FFFFFF' },
  { id: 'lightblue',   label: 'Light Blue',  hex: '#7B9FFF' },
  { id: 'paleviolet',  label: 'Pale Violet', hex: '#C4B5FD' },
  { id: 'mint',        label: 'Brand Mint',  hex: '#A5F3E8' },
];

// ─── Background pattern options ───────────────────────────────────────────────
const BG_PATTERNS = [
  { id: 'gradient',         label: 'Gradient' },
  { id: 'solid',            label: 'Solid' },
  { id: 'grid',             label: 'Grid' },
  { id: 'dots',             label: 'Dots' },
  { id: 'diagonal-stripes', label: 'Diagonal Stripes' },
  { id: 'confetti',         label: 'Confetti' },
  { id: 'bokeh',            label: 'Bokeh' },
];

// ─── Particle style options ───────────────────────────────────────────────────
const PARTICLE_STYLES = [
  { id: 'none',    label: 'None' },
  { id: 'stars',   label: 'Stars' },
  { id: 'confetti-fall', label: 'Confetti' },
  { id: 'bubbles', label: 'Bubbles' },
  { id: 'sparkles', label: 'Sparkles' },
  { id: 'hearts',  label: 'Floating Hearts' },
];

// ─── Name typography options ──────────────────────────────────────────────────
const TYPOGRAPHY_OPTIONS = [
  { id: 'classic-serif',   label: 'Classic Serif',   fontFamily: 'Georgia, "Times New Roman", serif',   weight: '700' },
  { id: 'modern-sans',     label: 'Modern Sans',     fontFamily: 'Inter, system-ui, sans-serif',        weight: '600' },
  { id: 'bold-display',    label: 'Bold Display',    fontFamily: 'Inter, system-ui, sans-serif',        weight: '900' },
  { id: 'script',          label: 'Script',          fontFamily: '"Palatino Linotype", Palatino, serif', weight: '700' },
  { id: 'mono',            label: 'Mono',            fontFamily: '"Courier New", Courier, monospace',   weight: '700' },
];

// ─── Logo position options ────────────────────────────────────────────────────
const LOGO_POSITIONS = [
  { id: 'top-left',     label: 'Top Left' },
  { id: 'top-center',   label: 'Top Center' },
  { id: 'top-right',    label: 'Top Right' },
  { id: 'bottom-left',  label: 'Bottom Left' },
  { id: 'bottom-right', label: 'Bottom Right' },
];

// ─── Border / frame options ───────────────────────────────────────────────────
const BORDER_OPTIONS = [
  { id: 'none',   label: 'None' },
  { id: 'subtle', label: 'Subtle' },
  { id: 'bold',   label: 'Bold' },
  { id: 'glow',   label: 'Glow' },
];

// ─── Emoji palette ────────────────────────────────────────────────────────────
const EMOJI_PALETTE = ['🎂', '🎉', '🏆', '👋', '⭐', '🎁', '🙏', '🎊', '💐', '🚀', '❤️', '👏', '🌟', '🎯', '💼', '🪔'];

// ─── Music moods ──────────────────────────────────────────────────────────────
const MUSIC_MOODS = [
  { id: 'upbeat',            label: 'Upbeat',           file: 'upbeat.wav',            defaultFor: ['birthday','anniversary','welcome'] },
  { id: 'celebration',       label: 'Celebration',      file: 'celebration.wav',       defaultFor: ['award'] },
  { id: 'gentle',            label: 'Gentle',           file: 'gentle.wav',            defaultFor: ['farewell'] },
  { id: 'energetic-techno',  label: 'Energetic Techno', file: 'energetic-techno.wav',  defaultFor: [] },
  { id: 'festival-dhol',     label: 'Festival Dhol',    file: 'festival-dhol.wav',     defaultFor: ['festival'] },
  { id: 'corporate-uplift',  label: 'Corporate Uplift', file: 'corporate-uplift.wav',  defaultFor: [] },
];

function getMoodForTemplate(templateId) {
  for (const mood of MUSIC_MOODS) {
    if (mood.defaultFor.includes(templateId)) return mood;
  }
  return MUSIC_MOODS[0];
}

// ─── template definitions ─────────────────────────────────────────────────────
const VIDEO_TEMPLATES = [
  {
    id: 'birthday',
    label: 'Birthday Wish',
    description: 'Festive animation for employee birthdays',
    // Cars24 indigo/blue gradient — NO red/pink/warm hues
    gradient: ['#0f0a2e', '#4736FE', '#0f0a2e'],
    defaultEmoji: '🎂',
    defaultHeadline: 'Happy Birthday!',
    fields: [
      { key: 'name',    label: 'Employee Name', placeholder: 'Priya Sharma' },
      { key: 'message', label: 'Wish Message',  placeholder: 'Wishing you a fantastic birthday!', multiline: true },
    ],
    draw: drawBirthday,
  },
  {
    id: 'anniversary',
    label: 'Work Anniversary',
    description: 'Celebrate milestone years with the team',
    gradient: ['#0f0a2e', '#4736FE', '#0f0a2e'],
    defaultEmoji: '🏆',
    defaultHeadline: 'Work Anniversary',
    fields: [
      { key: 'name',    label: 'Employee Name',  placeholder: 'Rahul Mehta' },
      { key: 'years',   label: 'Years Completed', placeholder: '5' },
      { key: 'message', label: 'Message',         placeholder: 'Thank you for your incredible journey!', multiline: true },
    ],
    draw: drawAnniversary,
  },
  {
    id: 'welcome',
    label: 'New Joiner Welcome',
    description: 'Warm welcome for new team members',
    gradient: ['#0d0829', '#2B3990', '#0d0829'],
    defaultEmoji: '👋',
    defaultHeadline: 'Welcome to the team!',
    fields: [
      { key: 'name', label: 'Employee Name',       placeholder: 'Ananya Singh' },
      { key: 'role', label: 'Role / Designation',  placeholder: 'Product Manager' },
      { key: 'team', label: 'Team',                placeholder: 'Growth' },
    ],
    draw: drawWelcome,
  },
  {
    id: 'award',
    label: 'Award & Recognition',
    description: 'Recognise outstanding performance',
    gradient: ['#0d0829', '#4736FE', '#0d0829'],
    defaultEmoji: '⭐',
    defaultHeadline: 'Congratulations!',
    fields: [
      { key: 'name',   label: 'Employee Name',       placeholder: 'Vikram Nair' },
      { key: 'award',  label: 'Award Title',          placeholder: 'Bar Raiser of the Quarter' },
      { key: 'reason', label: 'Reason / Achievement', placeholder: 'For consistently raising the bar...', multiline: true },
    ],
    draw: drawAward,
  },
  {
    id: 'farewell',
    label: 'Farewell',
    description: 'Send off a colleague with warmth',
    gradient: ['#0d0829', '#2B3990', '#0d0829'],
    defaultEmoji: '💫',
    defaultHeadline: 'Farewell & Best Wishes',
    fields: [
      { key: 'name',    label: 'Employee Name',   placeholder: 'Deepak Patel' },
      { key: 'message', label: 'Thank-You Line',  placeholder: 'You made Cars24 a better place. Godspeed!', multiline: true },
    ],
    draw: drawFarewell,
  },
];

// ─── canvas helpers ───────────────────────────────────────────────────────────

function lerp(a, b, t) { return a + (b - a) * t; }
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

// ─── Background pattern renderer ─────────────────────────────────────────────
function drawBackground(ctx, patternId, gradColors, t) {
  const phase = (Math.sin(t * Math.PI * 2) + 1) / 2;

  if (patternId === 'solid') {
    ctx.fillStyle = gradColors[1]; // use middle (primary) color as solid
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    return;
  }

  if (patternId === 'gradient' || !patternId) {
    const grd = ctx.createLinearGradient(0, 0, VIDEO_W, VIDEO_H);
    grd.addColorStop(0, gradColors[0]);
    grd.addColorStop(lerp(0.4, 0.6, phase), gradColors[1]);
    grd.addColorStop(1, gradColors[2]);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    return;
  }

  if (patternId === 'grid') {
    // Base dark fill
    ctx.fillStyle = gradColors[0];
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.save();
    ctx.globalAlpha = 0.18 + 0.06 * Math.sin(t * 2);
    ctx.strokeStyle = gradColors[1];
    ctx.lineWidth = 1;
    const gridSize = 60;
    const offset = (t * 15) % gridSize;
    for (let x = -gridSize + offset; x < VIDEO_W + gridSize; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, VIDEO_H); ctx.stroke();
    }
    for (let y = -gridSize + offset; y < VIDEO_H + gridSize; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(VIDEO_W, y); ctx.stroke();
    }
    ctx.restore();
    return;
  }

  if (patternId === 'dots') {
    ctx.fillStyle = gradColors[0];
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.save();
    const spacing = 48;
    const pulse = 0.12 + 0.04 * Math.sin(t * 2.5);
    ctx.globalAlpha = pulse;
    ctx.fillStyle = gradColors[1];
    for (let xi = 0; xi < VIDEO_W + spacing; xi += spacing) {
      for (let yi = 0; yi < VIDEO_H + spacing; yi += spacing) {
        ctx.beginPath();
        ctx.arc(xi, yi, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
    return;
  }

  if (patternId === 'diagonal-stripes') {
    ctx.fillStyle = gradColors[0];
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.save();
    ctx.globalAlpha = 0.1 + 0.04 * Math.sin(t * 1.5);
    ctx.fillStyle = gradColors[1];
    const stripeW = 40;
    const diagOffset = (t * 20) % (stripeW * 2);
    for (let x = -VIDEO_H - stripeW * 2 + diagOffset; x < VIDEO_W + VIDEO_H + stripeW * 2; x += stripeW * 2) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + VIDEO_H, VIDEO_H);
      ctx.lineTo(x + VIDEO_H + stripeW, VIDEO_H);
      ctx.lineTo(x + stripeW, 0);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  if (patternId === 'confetti') {
    ctx.fillStyle = gradColors[0];
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.save();
    const confColors = ['rgba(71,54,254,0.4)', 'rgba(255,215,0,0.35)', 'rgba(196,181,253,0.4)', 'rgba(255,255,255,0.25)'];
    for (let i = 0; i < 40; i++) {
      const seed = i * 53.7;
      const life = ((t * 0.6 + i / 40) % 1);
      const x = ((seed * 29) % VIDEO_W);
      const startY = 0;
      const y = startY + life * VIDEO_H;
      const size = 5 + (seed % 9);
      ctx.globalAlpha = (1 - life) * 0.7;
      ctx.fillStyle = confColors[i % confColors.length];
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(t * 2 + seed);
      ctx.fillRect(-size / 2, -size / 4, size, size / 2);
      ctx.restore();
    }
    ctx.restore();
    return;
  }

  if (patternId === 'bokeh') {
    const grd2 = ctx.createRadialGradient(VIDEO_W / 2, VIDEO_H / 2, 100, VIDEO_W / 2, VIDEO_H / 2, VIDEO_W * 0.8);
    grd2.addColorStop(0, gradColors[1]);
    grd2.addColorStop(1, gradColors[0]);
    ctx.fillStyle = grd2;
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.save();
    for (let i = 0; i < 18; i++) {
      const seed = i * 117.3;
      const cx = ((seed * 37) % VIDEO_W);
      const cy = ((seed * 19) % VIDEO_H);
      const r = 30 + (seed % 60);
      const alpha = 0.06 + 0.04 * Math.sin(t * 1.5 + seed);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, gradColors[1].replace('#', 'rgba(').replace(/([0-9A-Fa-f]{2})/g, (m) => parseInt(m, 16) + ',').replace(/,$/, '') + `${alpha})`);
      grad.addColorStop(0, `rgba(71,54,254,${alpha})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  // Fallback to gradient
  const grd = ctx.createLinearGradient(0, 0, VIDEO_W, VIDEO_H);
  grd.addColorStop(0, gradColors[0]);
  grd.addColorStop(lerp(0.4, 0.6, phase), gradColors[1]);
  grd.addColorStop(1, gradColors[2]);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
}

// ─── Particle renderer ────────────────────────────────────────────────────────
function drawParticleLayer(ctx, particleStyleId, t, accentHex) {
  if (!particleStyleId || particleStyleId === 'none') return;

  ctx.save();

  if (particleStyleId === 'stars') {
    const count = 70;
    for (let i = 0; i < count; i++) {
      const seed = i * 137.5;
      const x = ((seed * 31) % VIDEO_W);
      const y = ((seed * 17) % VIDEO_H);
      const phase = (t * 2 + i * 0.3) % 1;
      const alpha = 0.15 + 0.45 * Math.abs(Math.sin(phase * Math.PI));
      const r = 1 + 2 * Math.abs(Math.sin(phase * Math.PI));
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }
  }

  if (particleStyleId === 'confetti-fall') {
    const colors = ['rgba(71,54,254,0.85)', `${accentHex}cc`, 'rgba(196,181,253,0.85)', 'rgba(255,255,255,0.7)'];
    for (let i = 0; i < 28; i++) {
      const seed = i * 53.7;
      const life = ((t * 0.65 + i / 28) % 1);
      const x = ((seed * 29) % VIDEO_W);
      const y = life * VIDEO_H;
      const size = 6 + (seed % 8);
      ctx.globalAlpha = (1 - life) * 0.85;
      ctx.fillStyle = colors[i % colors.length];
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(t * 2.5 + seed);
      ctx.fillRect(-size / 2, -size / 4, size, size / 2);
      ctx.restore();
    }
  }

  if (particleStyleId === 'bubbles') {
    for (let i = 0; i < 20; i++) {
      const seed = i * 79.3;
      const life = ((t * 0.4 + i / 20) % 1);
      const x = ((seed * 41) % VIDEO_W);
      const y = VIDEO_H - life * VIDEO_H * 1.1;
      const r = 4 + (seed % 14);
      ctx.globalAlpha = (1 - life) * 0.4;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = accentHex;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  if (particleStyleId === 'sparkles') {
    for (let i = 0; i < 24; i++) {
      const seed = i * 91.3;
      const life = ((t * 0.55 + i / 24) % 1);
      const cx = VIDEO_W / 2 + Math.cos(seed * 2.1) * VIDEO_W * 0.42;
      const cy = VIDEO_H / 2 + Math.sin(seed * 1.7) * VIDEO_H * 0.38;
      const r = (1 - life) * 5 + 1;
      ctx.globalAlpha = (1 - life) * 0.9;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(t + seed) * 25, cy + Math.sin(t * 1.3 + seed) * 18, r, 0, Math.PI * 2);
      ctx.fillStyle = accentHex;
      ctx.fill();
      // cross sparkle
      ctx.globalAlpha = (1 - life) * 0.5;
      ctx.strokeStyle = accentHex;
      ctx.lineWidth = 1;
      const sx = cx + Math.cos(t + seed) * 25;
      const sy = cy + Math.sin(t * 1.3 + seed) * 18;
      ctx.beginPath(); ctx.moveTo(sx - r * 2, sy); ctx.lineTo(sx + r * 2, sy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx, sy - r * 2); ctx.lineTo(sx, sy + r * 2); ctx.stroke();
    }
  }

  if (particleStyleId === 'hearts') {
    for (let i = 0; i < 14; i++) {
      const seed = i * 67.1;
      const life = ((t * 0.45 + i / 14) % 1);
      const x = ((seed * 33) % VIDEO_W);
      const y = VIDEO_H - life * VIDEO_H * 1.05;
      const size = 8 + (seed % 10);
      ctx.globalAlpha = (1 - life) * 0.65;
      ctx.font = `${size * 2}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('❤️', x, y);
    }
  }

  ctx.restore();
}

// ─── Logo loader ──────────────────────────────────────────────────────────────
let _logoImg = null;
let _logoPromise = null;

function getLogoImage(baseUrl) {
  if (_logoImg) return Promise.resolve(_logoImg);
  if (_logoPromise) return _logoPromise;
  _logoPromise = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { _logoImg = img; resolve(img); };
    img.onerror = () => {
      const fallback = new Image();
      fallback.crossOrigin = 'anonymous';
      fallback.onload = () => { _logoImg = fallback; resolve(fallback); };
      fallback.onerror = () => resolve(null);
      fallback.src = (baseUrl || '/') + 'cars24-logo.png';
    };
    img.src = (baseUrl || '/') + 'cars24-logo-light.png';
  });
  return _logoPromise;
}

let _cachedLogo = null;

// Draw logo at configurable position
function drawLogo(ctx, positionId) {
  const logoW = Math.round(VIDEO_W * 0.12); // ~154px
  const logoH = Math.round(logoW * (389 / 1669));
  const margin = 28;
  let x, y;

  switch (positionId) {
    case 'top-center':
      x = VIDEO_W / 2 - logoW / 2;
      y = margin;
      break;
    case 'top-right':
      x = VIDEO_W - logoW - margin;
      y = margin;
      break;
    case 'bottom-left':
      x = margin;
      y = VIDEO_H - logoH - margin;
      break;
    case 'bottom-right':
      x = VIDEO_W - logoW - margin;
      y = VIDEO_H - logoH - margin;
      break;
    case 'top-left':
    default:
      x = margin;
      y = margin;
      break;
  }

  ctx.save();
  if (_cachedLogo) {
    ctx.drawImage(_cachedLogo, x, y, logoW, logoH);
  } else {
    ctx.font = 'bold 22px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Cars24', x, y);
  }
  ctx.restore();
}

// ─── Border / frame renderer ──────────────────────────────────────────────────
function drawBorder(ctx, borderId, t) {
  if (!borderId || borderId === 'none') return;

  ctx.save();

  if (borderId === 'subtle') {
    ctx.globalAlpha = 0.25 + 0.08 * Math.sin(t * 2);
    ctx.strokeStyle = '#4736FE';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, VIDEO_W - 20, VIDEO_H - 20);
  }

  if (borderId === 'bold') {
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = '#4736FE';
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, VIDEO_W - 16, VIDEO_H - 16);
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#2B3990';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, VIDEO_W - 32, VIDEO_H - 32);
  }

  if (borderId === 'glow') {
    ctx.globalAlpha = 0.55 + 0.2 * Math.sin(t * Math.PI * 2);
    ctx.strokeStyle = '#4736FE';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#4736FE';
    ctx.shadowBlur = 18 + 8 * Math.sin(t * 2);
    ctx.strokeRect(10, 10, VIDEO_W - 20, VIDEO_H - 20);
  }

  ctx.restore();
}

// ─── Name font helper ─────────────────────────────────────────────────────────
function getNameFont(typographyId, sizePx) {
  const typo = TYPOGRAPHY_OPTIONS.find(t => t.id === typographyId) || TYPOGRAPHY_OPTIONS[1];
  return `${typo.weight} ${sizePx}px ${typo.fontFamily}`;
}

// ─── Video style variants (existing overlay effects) ─────────────────────────
const VIDEO_STYLES = [
  { id: 'minimal',        label: 'Minimal' },
  { id: 'confetti-burst', label: 'Confetti Burst' },
  { id: 'gradient-sweep', label: 'Gradient Sweep' },
  { id: 'particle-stars', label: 'Particle Stars' },
  { id: 'neon-grid',      label: 'Neon Grid' },
];

function drawStyleOverlay(ctx, styleId, t, progress) {
  if (styleId === 'minimal') return;

  if (styleId === 'confetti-burst') {
    const count = 30;
    for (let i = 0; i < count; i++) {
      const seed = i * 53.7;
      const life = ((t * 0.7 + i / count) % 1);
      const x = ((seed * 29) % VIDEO_W);
      const startY = VIDEO_H * 0.1;
      const y = startY + life * VIDEO_H * 0.9;
      const alpha = (1 - life) * 0.85;
      const size = 6 + (seed % 8);
      const colors = ['#4736FE', '#FFD700', '#FFFFFF', '#C4B5FD'];
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = colors[i % colors.length];
      ctx.translate(x, y);
      ctx.rotate(t * 3 + seed);
      ctx.fillRect(-size / 2, -size / 4, size, size / 2);
      ctx.restore();
    }
  }

  if (styleId === 'gradient-sweep') {
    const sweepX = (Math.sin(t * Math.PI) + 1) / 2 * VIDEO_W;
    const grad = ctx.createLinearGradient(sweepX - 200, 0, sweepX + 200, VIDEO_H);
    grad.addColorStop(0, 'rgba(71,54,254,0)');
    grad.addColorStop(0.5, 'rgba(71,54,254,0.18)');
    grad.addColorStop(1, 'rgba(71,54,254,0)');
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.restore();
  }

  if (styleId === 'particle-stars') {
    const count = 80;
    for (let i = 0; i < count; i++) {
      const seed = i * 137.5;
      const x = ((seed * 31) % VIDEO_W);
      const y = ((seed * 17) % VIDEO_H);
      const phase = (t * 2 + i * 0.3) % 1;
      const alpha = 0.2 + 0.5 * Math.abs(Math.sin(phase * Math.PI));
      const r = 1 + 2 * Math.abs(Math.sin(phase * Math.PI));
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }
    const pcount = 12;
    for (let i = 0; i < pcount; i++) {
      const seed = i * 91.3;
      const life = ((t * 0.5 + i / pcount) % 1);
      const cx = VIDEO_W / 2 + Math.cos(seed * 2.1) * VIDEO_W * 0.4;
      const cy = VIDEO_H / 2 + Math.sin(seed * 1.7) * VIDEO_H * 0.35;
      const r = (1 - life) * 4 + 1;
      ctx.save();
      ctx.globalAlpha = (1 - life) * 0.9;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(t + seed) * 30, cy + Math.sin(t * 1.3 + seed) * 20, r, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
      ctx.restore();
    }
  }

  if (styleId === 'neon-grid') {
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#4736FE';
    ctx.lineWidth = 1;
    const gridSize = 60;
    const offset = (t * 20) % gridSize;
    for (let x = -gridSize + offset; x < VIDEO_W + gridSize; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, VIDEO_H); ctx.stroke();
    }
    for (let y = -gridSize + offset; y < VIDEO_H + gridSize; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(VIDEO_W, y); ctx.stroke();
    }
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = '#4736FE';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#4736FE';
    ctx.shadowBlur = 12;
    ctx.strokeRect(12, 12, VIDEO_W - 24, VIDEO_H - 24);
    ctx.restore();
  }
}

// ─── text wrap utility ────────────────────────────────────────────────────────
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  const totalH = (lines.length - 1) * lineHeight;
  let currentY = y - totalH / 2;
  for (const l of lines) {
    ctx.fillText(l, x, currentY);
    currentY += lineHeight;
  }
}

// ─── shared draw options type ─────────────────────────────────────────────────
// drawOpts = { styleId, bgPattern, particleStyle, typography, logoPosition, border, accentColor,
//              headline, emoji, footer }

// ─── Birthday ──────────────────────────────────────────────────────────────────
function drawBirthday(ctx, fields, t, progress, styleId = 'minimal', drawOpts = {}) {
  const { name = '', message = '' } = fields;
  const {
    bgPattern = 'gradient',
    particleStyle = 'stars',
    typography = 'modern-sans',
    logoPosition = 'top-left',
    border = 'none',
    accentColor = '#FFD700',
    headline = 'Happy Birthday!',
    emoji = '🎂',
    footer = '',
  } = drawOpts;

  // Cars24 blue gradient — no red
  drawBackground(ctx, bgPattern, ['#0f0a2e', '#4736FE', '#0f0a2e'], t);
  drawParticleLayer(ctx, particleStyle, t, accentColor);

  const fadeIn = easeOut(Math.min(progress * 3, 1));
  const nameSlide = easeOut(Math.min(Math.max(progress * 3 - 0.5, 0), 1));

  ctx.save();
  ctx.font = `${lerp(60, 90, easeInOut(Math.sin(t * Math.PI * 2) * 0.5 + 0.5))}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = fadeIn;
  ctx.fillText(emoji, VIDEO_W / 2, VIDEO_H * 0.22);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.font = 'bold 56px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(headline, VIDEO_W / 2, VIDEO_H * 0.42);
  ctx.restore();

  if (name) {
    ctx.save();
    ctx.globalAlpha = nameSlide;
    ctx.font = getNameFont(typography, 72);
    ctx.fillStyle = accentColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = accentColor + '88';
    ctx.shadowBlur = 20;
    ctx.fillText(name, VIDEO_W / 2, VIDEO_H * 0.56);
    ctx.restore();
  }

  if (message) {
    ctx.save();
    ctx.globalAlpha = Math.min(Math.max(progress * 3 - 1.2, 0), 1);
    ctx.font = '28px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.textAlign = 'center';
    wrapText(ctx, message, VIDEO_W / 2, VIDEO_H * 0.72, VIDEO_W * 0.7, 38);
    ctx.restore();
  }

  if (footer) {
    ctx.save();
    ctx.globalAlpha = Math.min(Math.max(progress * 3 - 1.5, 0), 1);
    ctx.font = '20px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(footer, VIDEO_W / 2, VIDEO_H - 40);
    ctx.restore();
  }

  drawStyleOverlay(ctx, styleId, t, progress);
  drawBorder(ctx, border, t);
  drawLogo(ctx, logoPosition);
}

// ─── Anniversary ───────────────────────────────────────────────────────────────
function drawAnniversary(ctx, fields, t, progress, styleId = 'minimal', drawOpts = {}) {
  const { name = '', years = '', message = '' } = fields;
  const {
    bgPattern = 'gradient',
    particleStyle = 'sparkles',
    typography = 'bold-display',
    logoPosition = 'top-left',
    border = 'none',
    accentColor = '#FFD700',
    headline = 'Work Anniversary',
    emoji = '🏆',
    footer = '',
  } = drawOpts;

  drawBackground(ctx, bgPattern, ['#0f0a2e', '#4736FE', '#0f0a2e'], t);
  drawParticleLayer(ctx, particleStyle, t, accentColor);

  const fadeIn = easeOut(Math.min(progress * 3, 1));
  const yearsSlide = easeOut(Math.min(Math.max(progress * 3 - 0.3, 0), 1));
  const nameSlide = easeOut(Math.min(Math.max(progress * 3 - 0.8, 0), 1));

  // Emoji (replacing fixed 🏆 position)
  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.font = `${lerp(50, 70, easeInOut(Math.sin(t * Math.PI * 2) * 0.5 + 0.5))}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, VIDEO_W / 2, VIDEO_H * 0.18);
  ctx.restore();

  if (years) {
    ctx.save();
    ctx.globalAlpha = yearsSlide;
    const cx = VIDEO_W / 2;
    const cy = VIDEO_H * 0.33;
    const radius = 65;
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
    grad.addColorStop(0, '#4736FE');
    grad.addColorStop(1, '#2B3990');
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.font = 'bold 50px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(years, cx, cy - 6);
    ctx.font = '17px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText('YEAR' + (parseInt(years) !== 1 ? 'S' : ''), cx, cy + 26);
    ctx.restore();
  }

  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.font = 'bold 46px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(headline, VIDEO_W / 2, VIDEO_H * 0.53);
  ctx.restore();

  if (name) {
    ctx.save();
    ctx.globalAlpha = nameSlide;
    ctx.font = getNameFont(typography, 62);
    ctx.fillStyle = accentColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = accentColor + '66';
    ctx.shadowBlur = 20;
    ctx.fillText(name, VIDEO_W / 2, VIDEO_H * 0.66);
    ctx.restore();
  }

  if (message) {
    ctx.save();
    ctx.globalAlpha = Math.min(Math.max(progress * 3 - 1.4, 0), 1);
    ctx.font = '26px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.textAlign = 'center';
    wrapText(ctx, message, VIDEO_W / 2, VIDEO_H * 0.8, VIDEO_W * 0.72, 36);
    ctx.restore();
  }

  if (footer) {
    ctx.save();
    ctx.globalAlpha = Math.min(Math.max(progress * 3 - 1.5, 0), 1);
    ctx.font = '20px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(footer, VIDEO_W / 2, VIDEO_H - 40);
    ctx.restore();
  }

  drawStyleOverlay(ctx, styleId, t, progress);
  drawBorder(ctx, border, t);
  drawLogo(ctx, logoPosition);
}

// ─── Welcome ───────────────────────────────────────────────────────────────────
function drawWelcome(ctx, fields, t, progress, styleId = 'minimal', drawOpts = {}) {
  const { name = '', role = '', team = '' } = fields;
  const {
    bgPattern = 'gradient',
    particleStyle = 'bubbles',
    typography = 'modern-sans',
    logoPosition = 'top-left',
    border = 'none',
    accentColor = '#FFD700',
    headline = 'Welcome to the team!',
    emoji = '👋',
    footer = '',
  } = drawOpts;

  drawBackground(ctx, bgPattern, ['#0d0829', '#2B3990', '#0d0829'], t);
  drawParticleLayer(ctx, particleStyle, t, accentColor);

  const fadeIn = easeOut(Math.min(progress * 3, 1));
  const nameSlide = easeOut(Math.min(Math.max(progress * 3 - 0.5, 0), 1));
  const roleSlide = easeOut(Math.min(Math.max(progress * 3 - 0.9, 0), 1));

  ctx.save();
  ctx.globalAlpha = fadeIn;
  const wave = 1 + 0.15 * Math.sin(t * Math.PI * 4);
  ctx.font = `${72 * wave}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, VIDEO_W / 2, VIDEO_H * 0.22);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.font = 'bold 52px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(headline, VIDEO_W / 2, VIDEO_H * 0.4);
  ctx.restore();

  if (name) {
    ctx.save();
    ctx.globalAlpha = nameSlide;
    ctx.font = getNameFont(typography, 68);
    ctx.fillStyle = accentColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = accentColor + '66';
    ctx.shadowBlur = 24;
    ctx.fillText(name, VIDEO_W / 2, VIDEO_H * 0.54);
    ctx.restore();
  }

  if (role || team) {
    ctx.save();
    ctx.globalAlpha = roleSlide;
    const label = [role, team].filter(Boolean).join('  ·  ');
    ctx.font = '32px Inter, system-ui, sans-serif';
    const textW = ctx.measureText(label).width;
    const pillW = textW + 48;
    const pillH = 52;
    const pillX = VIDEO_W / 2 - pillW / 2;
    const pillY = VIDEO_H * 0.67 - pillH / 2;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 26);
    ctx.fillStyle = 'rgba(71,54,254,0.3)';
    ctx.fill();
    ctx.strokeStyle = '#4736FE';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, VIDEO_W / 2, VIDEO_H * 0.67);
    ctx.restore();
  }

  ctx.save();
  ctx.globalAlpha = Math.min(Math.max(progress * 3 - 1.6, 0), 1);
  ctx.font = '24px Inter, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('We\'re thrilled to have you at Cars24!', VIDEO_W / 2, VIDEO_H * 0.81);
  ctx.restore();

  if (footer) {
    ctx.save();
    ctx.globalAlpha = Math.min(Math.max(progress * 3 - 1.7, 0), 1);
    ctx.font = '20px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(footer, VIDEO_W / 2, VIDEO_H - 40);
    ctx.restore();
  }

  drawStyleOverlay(ctx, styleId, t, progress);
  drawBorder(ctx, border, t);
  drawLogo(ctx, logoPosition);
}

// ─── Award ─────────────────────────────────────────────────────────────────────
function drawAward(ctx, fields, t, progress, styleId = 'minimal', drawOpts = {}) {
  const { name = '', award = '', reason = '' } = fields;
  const {
    bgPattern = 'gradient',
    particleStyle = 'sparkles',
    typography = 'bold-display',
    logoPosition = 'top-left',
    border = 'glow',
    accentColor = '#FFD700',
    headline = 'Congratulations!',
    emoji = '⭐',
    footer = '',
  } = drawOpts;

  drawBackground(ctx, bgPattern, ['#0d0829', '#4736FE', '#0d0829'], t);
  drawParticleLayer(ctx, particleStyle, t, accentColor);

  const fadeIn = easeOut(Math.min(progress * 3, 1));
  const nameSlide = easeOut(Math.min(Math.max(progress * 3 - 0.6, 0), 1));
  const reasonSlide = easeOut(Math.min(Math.max(progress * 3 - 1.1, 0), 1));

  ctx.save();
  ctx.globalAlpha = fadeIn;
  const pulse = 1 + 0.08 * Math.sin(t * Math.PI * 3);
  ctx.font = `${80 * pulse}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, VIDEO_W / 2, VIDEO_H * 0.2);
  ctx.restore();

  // Headline above award title
  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.font = 'bold 36px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(headline, VIDEO_W / 2, VIDEO_H * 0.33);
  ctx.restore();

  if (award) {
    ctx.save();
    ctx.globalAlpha = fadeIn;
    ctx.font = 'bold 44px Inter, system-ui, sans-serif';
    ctx.fillStyle = accentColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = accentColor + '88';
    ctx.shadowBlur = 16;
    wrapText(ctx, award, VIDEO_W / 2, VIDEO_H * 0.44, VIDEO_W * 0.75, 54);
    ctx.restore();
  }

  if (name) {
    ctx.save();
    ctx.globalAlpha = nameSlide;
    ctx.font = getNameFont(typography, 62);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, VIDEO_W / 2, VIDEO_H * 0.58);
    ctx.restore();
  }

  if (reason) {
    ctx.save();
    ctx.globalAlpha = reasonSlide;
    ctx.font = '26px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.textAlign = 'center';
    wrapText(ctx, reason, VIDEO_W / 2, VIDEO_H * 0.72, VIDEO_W * 0.68, 36);
    ctx.restore();
  }

  if (footer) {
    ctx.save();
    ctx.globalAlpha = Math.min(Math.max(progress * 3 - 1.5, 0), 1);
    ctx.font = '20px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(footer, VIDEO_W / 2, VIDEO_H - 40);
    ctx.restore();
  }

  drawStyleOverlay(ctx, styleId, t, progress);
  drawBorder(ctx, border, t);
  drawLogo(ctx, logoPosition);
}

// ─── Farewell ──────────────────────────────────────────────────────────────────
function drawFarewell(ctx, fields, t, progress, styleId = 'minimal', drawOpts = {}) {
  const { name = '', message = '' } = fields;
  const {
    bgPattern = 'gradient',
    particleStyle = 'stars',
    typography = 'classic-serif',
    logoPosition = 'top-left',
    border = 'none',
    accentColor = '#C4B5FD',
    headline = 'Farewell & Best Wishes',
    emoji = '💫',
    footer = '',
  } = drawOpts;

  drawBackground(ctx, bgPattern, ['#0d0829', '#2B3990', '#0d0829'], t);
  drawParticleLayer(ctx, particleStyle, t, accentColor);

  const fadeIn = easeOut(Math.min(progress * 3, 1));
  const nameSlide = easeOut(Math.min(Math.max(progress * 3 - 0.6, 0), 1));
  const msgSlide = easeOut(Math.min(Math.max(progress * 3 - 1.1, 0), 1));

  ctx.save();
  ctx.globalAlpha = fadeIn;
  const drift = Math.sin(t * Math.PI * 2) * 10;
  ctx.font = '80px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, VIDEO_W / 2 + drift, VIDEO_H * 0.2);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.font = 'bold 54px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Support multiline headline by splitting on &
  if (headline.includes('&') || headline.includes('\n')) {
    const parts = headline.split(/&|\n/);
    const line1 = parts[0].trim();
    const line2 = parts[1] ? parts[1].trim() : '';
    ctx.fillText(line1 + (parts[1] ? ' &' : ''), VIDEO_W / 2, VIDEO_H * 0.37);
    if (line2) ctx.fillText(line2, VIDEO_W / 2, VIDEO_H * 0.46);
  } else {
    ctx.fillText(headline, VIDEO_W / 2, VIDEO_H * 0.4);
  }
  ctx.restore();

  if (name) {
    ctx.save();
    ctx.globalAlpha = nameSlide;
    ctx.font = getNameFont(typography, 66);
    ctx.fillStyle = accentColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = accentColor + '80';
    ctx.shadowBlur = 20;
    ctx.fillText(name, VIDEO_W / 2, VIDEO_H * 0.59);
    ctx.restore();
  }

  if (message) {
    ctx.save();
    ctx.globalAlpha = msgSlide;
    ctx.font = '28px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.textAlign = 'center';
    wrapText(ctx, message, VIDEO_W / 2, VIDEO_H * 0.74, VIDEO_W * 0.68, 38);
    ctx.restore();
  }

  if (footer) {
    ctx.save();
    ctx.globalAlpha = Math.min(Math.max(progress * 3 - 1.5, 0), 1);
    ctx.font = '20px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(footer, VIDEO_W / 2, VIDEO_H - 40);
    ctx.restore();
  }

  drawStyleOverlay(ctx, styleId, t, progress);
  drawBorder(ctx, border, t);
  drawLogo(ctx, logoPosition);
}

// ─── VideoCreator component ────────────────────────────────────────────────────
function VideoCreator({ onBack }) {
  const [selectedTemplate, setSelectedTemplate] = useState(VIDEO_TEMPLATES[0]);
  const [fields, setFields] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadFilename, setDownloadFilename] = useState('');
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [supportNote, setSupportNote] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(VIDEO_STYLES[0]);

  // New creative controls state
  const [bgPattern, setBgPattern] = useState('gradient');
  const [particleStyle, setParticleStyle] = useState('stars');
  const [typography, setTypography] = useState('modern-sans');
  const [logoPosition, setLogoPosition] = useState('top-left');
  const [border, setBorder] = useState('none');
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[1]); // 6s default

  // Editable template fields
  const [headline, setHeadline] = useState(VIDEO_TEMPLATES[0].defaultHeadline);
  const [emoji, setEmoji] = useState(VIDEO_TEMPLATES[0].defaultEmoji);
  const [footer, setFooter] = useState('');
  const [accentColor, setAccentColor] = useState('#FFD700');
  const [showEmojiPalette, setShowEmojiPalette] = useState(false);

  // Music state
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [selectedMood, setSelectedMood] = useState(() => getMoodForTemplate(VIDEO_TEMPLATES[0].id));

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const startTimeRef = useRef(null);
  const previewStartRef = useRef(null);

  // Audio refs
  const audioElRef = useRef(null);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const mediaDestRef = useRef(null);

  // Computed duration in ms from selected duration option
  const durationMs = selectedDuration.ms;

  // Build drawOpts object for passing to draw functions
  const drawOpts = {
    bgPattern,
    particleStyle,
    typography,
    logoPosition,
    border,
    accentColor,
    headline,
    emoji,
    footer,
  };

  // Detect codec support once on mount
  useEffect(() => {
    const mp4 = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1');
    const webm = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      || MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
      || MediaRecorder.isTypeSupported('video/webm');
    if (!mp4 && !webm) {
      setSupportNote('Your browser does not support video recording. Please use Chrome, Edge, or Firefox.');
    } else if (!mp4) {
      setSupportNote('Downloading as .webm (Chrome/Firefox). Safari users can convert via VLC or ffmpeg.');
    }
  }, []);

  // Pre-load the Cars24 logo image
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    getLogoImage(baseUrl).then((img) => {
      _cachedLogo = img;
      if (!isRecording && !isPreviewPlaying && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        selectedTemplate.draw(ctx, fields, 0, 0.2, selectedStyle.id, drawOpts);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update default mood when template changes
  useEffect(() => {
    setSelectedMood(getMoodForTemplate(selectedTemplate.id));
  }, [selectedTemplate]);

  function getBestMime() {
    const candidates = [
      'video/mp4;codecs=avc1',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];
    for (const c of candidates) {
      if (MediaRecorder.isTypeSupported(c)) return c;
    }
    return 'video/webm';
  }

  function getExtension(mime) {
    return mime.startsWith('video/mp4') ? 'mp4' : 'webm';
  }

  function setupAudio() {
    if (!musicEnabled) return null;
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;
      const dest = ctx.createMediaStreamDestination();
      gainNodeRef.current.connect(dest);
      mediaDestRef.current = dest;
      return { gainNode: gain, mediaDestNode: dest };
    } catch (err) {
      console.warn('AudioContext setup failed:', err);
      return null;
    }
  }

  function startAudio(audioNodes) {
    if (!audioNodes) return;
    const { gainNode } = audioNodes;
    const ctx = audioCtxRef.current;
    try {
      let audioEl = audioElRef.current;
      if (!audioEl) {
        audioEl = document.createElement('audio');
        audioEl.loop = true;
        audioEl.crossOrigin = 'anonymous';
        audioElRef.current = audioEl;
      }
      const baseUrl = import.meta.env.BASE_URL || '/';
      const newSrc = baseUrl + 'audio/' + selectedMood.file;
      if (audioEl.src !== new URL(newSrc, window.location.href).href) {
        audioEl.src = newSrc;
      }
      if (!audioEl._sourceNode) {
        const sourceNode = ctx.createMediaElementSource(audioEl);
        audioEl._sourceNode = sourceNode;
      }
      audioEl._sourceNode.disconnect();
      audioEl._sourceNode.connect(gainNode);
      audioEl.currentTime = 0;
      audioEl.volume = 1;
      const playPromise = audioEl.play();
      if (playPromise) playPromise.catch(() => {});
      const durationSec = durationMs / 1000;
      gainNode.gain.cancelScheduledValues(ctx.currentTime);
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.8);
      gainNode.gain.setValueAtTime(0.55, ctx.currentTime + durationSec - 0.8);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + durationSec);
    } catch (err) {
      console.warn('Audio start failed:', err);
    }
  }

  function stopAudio() {
    try {
      const audioEl = audioElRef.current;
      if (audioEl) {
        audioEl.pause();
        audioEl.currentTime = 0;
      }
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
        gainNodeRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      }
    } catch (err) {
      console.warn('Audio stop failed:', err);
    }
  }

  // Main animation loop
  const animate = useCallback((timestamp, isRecordingRun) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startTime = isRecordingRun ? startTimeRef.current : previewStartRef.current;
    if (!startTime) {
      if (isRecordingRun) startTimeRef.current = timestamp;
      else previewStartRef.current = timestamp;
    }
    const elapsed = timestamp - (isRecordingRun ? startTimeRef.current : previewStartRef.current);
    const progress = Math.min(elapsed / durationMs, 1);
    const t = elapsed / 1000;

    selectedTemplate.draw(ctx, fields, t, progress, selectedStyle.id, drawOpts);

    if (isRecordingRun) {
      setRecordingProgress(Math.round(progress * 100));
    }

    if (progress < 1) {
      animFrameRef.current = requestAnimationFrame((ts) => animate(ts, isRecordingRun));
    } else {
      stopAudio();
      if (isRecordingRun) {
        recorderRef.current?.stop();
        setIsRecording(false);
        setRecordingProgress(100);
      } else {
        setIsPreviewPlaying(false);
      }
    }
  }, [selectedTemplate, fields, selectedStyle, drawOpts, durationMs]); // eslint-disable-line react-hooks/exhaustive-deps

  const startPreview = useCallback(() => {
    if (isRecording) return;
    cancelAnimationFrame(animFrameRef.current);
    previewStartRef.current = null;
    setIsPreviewPlaying(true);
    const audioNodes = setupAudio();
    animFrameRef.current = requestAnimationFrame((ts) => {
      previewStartRef.current = ts;
      startAudio(audioNodes);
      animate(ts, false);
    });
  }, [animate, isRecording, musicEnabled, selectedMood, selectedStyle]); // eslint-disable-line react-hooks/exhaustive-deps

  const stopPreview = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    stopAudio();
    setIsPreviewPlaying(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      selectedTemplate.draw(ctx, fields, 0, 0, selectedStyle.id, drawOpts);
    }
  }, [selectedTemplate, fields, selectedStyle, drawOpts]);

  const startRecording = useCallback(() => {
    if (!canvasRef.current) return;
    cancelAnimationFrame(animFrameRef.current);
    setIsPreviewPlaying(false);
    stopAudio();
    setDownloadUrl(null);
    chunksRef.current = [];

    const mime = getBestMime();
    const ext = getExtension(mime);

    const videoStream = canvasRef.current.captureStream(30);
    let combinedStream = videoStream;

    const audioNodes = musicEnabled ? setupAudio() : null;

    if (audioNodes && audioNodes.mediaDestNode) {
      const audioTracks = audioNodes.mediaDestNode.stream.getAudioTracks();
      if (audioTracks.length > 0) {
        const tracks = [...videoStream.getVideoTracks(), ...audioTracks];
        combinedStream = new MediaStream(tracks);
      }
    }

    const recorder = new MediaRecorder(combinedStream, { mimeType: mime, videoBitsPerSecond: 4000000 });

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mime });
      const url = URL.createObjectURL(blob);
      const name = selectedTemplate.label.toLowerCase().replace(/\s+/g, '-');
      const fname = `cars24-${name}-${(fields.name || 'video').toLowerCase().replace(/\s+/g, '-')}.${ext}`;
      setDownloadUrl(url);
      setDownloadFilename(fname);
      setIsRecording(false);
      setRecordingProgress(100);
    };

    recorder.start(100);
    recorderRef.current = recorder;
    startTimeRef.current = null;
    setIsRecording(true);
    setRecordingProgress(0);

    animFrameRef.current = requestAnimationFrame((ts) => {
      startTimeRef.current = ts;
      startAudio(audioNodes);
      animate(ts, true);
    });
  }, [animate, selectedTemplate, fields, musicEnabled, selectedMood, selectedStyle, drawOpts, durationMs]); // eslint-disable-line react-hooks/exhaustive-deps

  // Draw static frame when template/fields/opts change (not during recording)
  useEffect(() => {
    if (isRecording || isPreviewPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    selectedTemplate.draw(ctx, fields, 0, 0.2, selectedStyle.id, drawOpts);
  }, [selectedTemplate, fields, isRecording, isPreviewPlaying, selectedStyle, bgPattern, particleStyle, typography, logoPosition, border, accentColor, headline, emoji, footer]);

  // Reset fields and editable opts when template changes
  useEffect(() => {
    setFields({});
    setDownloadUrl(null);
    cancelAnimationFrame(animFrameRef.current);
    stopAudio();
    setIsPreviewPlaying(false);
    setIsRecording(false);
    setHeadline(selectedTemplate.defaultHeadline);
    setEmoji(selectedTemplate.defaultEmoji);
    setFooter('');
    // Reset accent to gold for most, pale-violet for farewell
    setAccentColor(selectedTemplate.id === 'farewell' ? '#C4B5FD' : '#FFD700');
    // Reset border default for award
    setBorder(selectedTemplate.id === 'award' ? 'glow' : 'none');
    // Reset particle default
    const particleDefaults = {
      birthday: 'stars',
      anniversary: 'sparkles',
      welcome: 'bubbles',
      award: 'sparkles',
      farewell: 'stars',
    };
    setParticleStyle(particleDefaults[selectedTemplate.id] || 'stars');
  }, [selectedTemplate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      stopAudio();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFieldChange = (key, value) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const canRecord = typeof MediaRecorder !== 'undefined';

  // ─── Shared input style ───────────────────────────────────────────────────────
  const inputStyle = {
    width: '100%',
    background: '#1c1c1c',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: BRAND.text,
    fontSize: '13px',
    padding: '9px 11px',
    fontFamily: 'Inter, system-ui, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.5)' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    paddingRight: '28px',
  };

  const labelStyle = {
    color: BRAND.textMuted,
    fontSize: '11px',
    fontWeight: '500',
    display: 'block',
    marginBottom: '5px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const sectionStyle = {
    backgroundColor: BRAND.surface,
    borderRadius: '16px',
    border: `1px solid ${BRAND.border}`,
    padding: '18px',
  };

  const sectionTitleStyle = {
    color: BRAND.textMuted,
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '1px',
    marginBottom: '14px',
    textTransform: 'uppercase',
  };

  // ─── render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: BRAND.bg, minHeight: '100vh', padding: '24px 32px' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '10px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#FFFFFF',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 style={{ color: BRAND.text, fontSize: '24px', fontWeight: '600' }}>
          Video Templates
        </h1>
        {supportNote && (
          <span style={{ color: '#FFD700', fontSize: '12px', marginLeft: 'auto', maxWidth: '400px' }}>
            {supportNote}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Left panel */}
        <div style={{ flex: '0 0 360px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Template picker */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Template</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {VIDEO_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '11px 13px',
                    borderRadius: '12px',
                    border: selectedTemplate.id === tpl.id
                      ? `1px solid ${BRAND.primary}`
                      : '1px solid rgba(255,255,255,0.08)',
                    background: selectedTemplate.id === tpl.id
                      ? 'rgba(71,54,254,0.18)'
                      : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    if (selectedTemplate.id !== tpl.id) {
                      e.currentTarget.style.border = `1px solid ${BRAND.primary}`;
                      e.currentTarget.style.background = 'rgba(71,54,254,0.08)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedTemplate.id !== tpl.id) {
                      e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{tpl.defaultEmoji}</span>
                  <div>
                    <div style={{ color: BRAND.text, fontSize: '14px', fontWeight: '600' }}>{tpl.label}</div>
                    <div style={{ color: BRAND.textMuted, fontSize: '11px', marginTop: '2px' }}>{tpl.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Editable card fields — headline, emoji, accent, footer */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Card Text</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Headline */}
              <div>
                <label style={labelStyle}>Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder={selectedTemplate.defaultHeadline}
                  style={inputStyle}
                />
              </div>

              {/* Emoji */}
              <div>
                <label style={labelStyle}>Emoji / Icon</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    placeholder="🎂"
                    style={{ ...inputStyle, width: '80px', fontSize: '20px', textAlign: 'center', padding: '7px 8px' }}
                  />
                  <button
                    onClick={() => setShowEmojiPalette(v => !v)}
                    style={{
                      background: showEmojiPalette ? 'rgba(71,54,254,0.25)' : 'rgba(255,255,255,0.08)',
                      border: `1px solid ${showEmojiPalette ? BRAND.primary : 'rgba(255,255,255,0.15)'}`,
                      borderRadius: '8px',
                      color: BRAND.text,
                      fontSize: '12px',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Pick
                  </button>
                </div>
                {showEmojiPalette && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: '8px',
                    padding: '10px',
                    background: '#1c1c1c',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px',
                  }}>
                    {EMOJI_PALETTE.map((em) => (
                      <button
                        key={em}
                        onClick={() => { setEmoji(em); setShowEmojiPalette(false); }}
                        style={{
                          background: emoji === em ? 'rgba(71,54,254,0.3)' : 'transparent',
                          border: emoji === em ? `1px solid ${BRAND.primary}` : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          padding: '5px',
                          fontSize: '20px',
                          cursor: 'pointer',
                          lineHeight: 1,
                        }}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Accent color */}
              <div>
                <label style={labelStyle}>Accent Color</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ACCENT_COLORS.map((ac) => (
                    <button
                      key={ac.id}
                      onClick={() => setAccentColor(ac.hex)}
                      title={ac.label}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: accentColor === ac.hex
                          ? '3px solid #FFFFFF'
                          : '2px solid rgba(255,255,255,0.2)',
                        background: ac.hex,
                        cursor: 'pointer',
                        flexShrink: 0,
                        boxShadow: accentColor === ac.hex ? `0 0 0 2px ${BRAND.primary}` : 'none',
                        transition: 'box-shadow 0.15s',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Footer line */}
              <div>
                <label style={labelStyle}>Footer Line (optional)</label>
                <input
                  type="text"
                  value={footer}
                  onChange={(e) => setFooter(e.target.value)}
                  placeholder="— Cars24 People Team"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Template-specific detail fields */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Details</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedTemplate.fields.map((f) => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  {f.multiline ? (
                    <textarea
                      rows={3}
                      value={fields[f.key] || ''}
                      onChange={(e) => handleFieldChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={fields[f.key] || ''}
                      onChange={(e) => handleFieldChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      style={inputStyle}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Creative controls */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Creative Controls</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>

              {/* Background pattern */}
              <div>
                <label style={labelStyle}>Background Pattern</label>
                <select value={bgPattern} onChange={(e) => setBgPattern(e.target.value)} style={selectStyle}>
                  {BG_PATTERNS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>

              {/* Particle style */}
              <div>
                <label style={labelStyle}>Particle Style</label>
                <select value={particleStyle} onChange={(e) => setParticleStyle(e.target.value)} style={selectStyle}>
                  {PARTICLE_STYLES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>

              {/* Name typography */}
              <div>
                <label style={labelStyle}>Name Typography</label>
                <select value={typography} onChange={(e) => setTypography(e.target.value)} style={selectStyle}>
                  {TYPOGRAPHY_OPTIONS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>

              {/* Logo position */}
              <div>
                <label style={labelStyle}>Logo Position</label>
                <select value={logoPosition} onChange={(e) => setLogoPosition(e.target.value)} style={selectStyle}>
                  {LOGO_POSITIONS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>

              {/* Border */}
              <div>
                <label style={labelStyle}>Border / Frame</label>
                <select value={border} onChange={(e) => setBorder(e.target.value)} style={selectStyle}>
                  {BORDER_OPTIONS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label style={labelStyle}>Duration</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {DURATION_OPTIONS.map((d) => (
                    <button
                      key={d.label}
                      onClick={() => setSelectedDuration(d)}
                      style={{
                        flex: 1,
                        padding: '7px 4px',
                        borderRadius: '8px',
                        border: selectedDuration.ms === d.ms
                          ? `1px solid ${BRAND.primary}`
                          : '1px solid rgba(255,255,255,0.12)',
                        background: selectedDuration.ms === d.ms
                          ? 'rgba(71,54,254,0.2)'
                          : 'transparent',
                        color: selectedDuration.ms === d.ms ? '#FFFFFF' : BRAND.textMuted,
                        fontSize: '12px',
                        fontWeight: selectedDuration.ms === d.ms ? '600' : '400',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Style overlay */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Visual Style Overlay</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {VIDEO_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: selectedStyle.id === style.id
                      ? `1px solid ${BRAND.primary}`
                      : '1px solid rgba(255,255,255,0.12)',
                    background: selectedStyle.id === style.id
                      ? 'rgba(71,54,254,0.2)'
                      : 'transparent',
                    color: selectedStyle.id === style.id ? '#FFFFFF' : BRAND.textMuted,
                    fontSize: '11px',
                    fontWeight: selectedStyle.id === style.id ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Music controls */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Background Music</p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: BRAND.text, fontSize: '13px', fontWeight: '500' }}>
                {musicEnabled ? <Music size={15} /> : <VolumeX size={15} />}
                {musicEnabled ? 'Music on' : 'Music off'}
              </div>
              <button
                onClick={() => setMusicEnabled(v => !v)}
                style={{
                  width: '42px',
                  height: '24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: musicEnabled ? BRAND.primary : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                }}
                aria-label="Toggle music"
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '3px',
                    left: musicEnabled ? '21px' : '3px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }}
                />
              </button>
            </div>

            {musicEnabled && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {MUSIC_MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood)}
                    style={{
                      flex: '1 1 auto',
                      minWidth: '80px',
                      padding: '7px 4px',
                      borderRadius: '8px',
                      border: selectedMood.id === mood.id
                        ? `1px solid ${BRAND.primary}`
                        : '1px solid rgba(255,255,255,0.12)',
                      background: selectedMood.id === mood.id
                        ? 'rgba(71,54,254,0.2)'
                        : 'transparent',
                      color: selectedMood.id === mood.id ? '#FFFFFF' : BRAND.textMuted,
                      fontSize: '11px',
                      fontWeight: selectedMood.id === mood.id ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            )}
            {musicEnabled && (
              <p style={{ color: BRAND.textMuted, fontSize: '11px', marginTop: '10px', lineHeight: '1.5' }}>
                Music fades in/out. Exported video file includes audio.
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={isPreviewPlaying ? stopPreview : startPreview}
              disabled={isRecording}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: isPreviewPlaying ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
                color: BRAND.text,
                fontSize: '14px',
                fontWeight: '600',
                cursor: isRecording ? 'not-allowed' : 'pointer',
                opacity: isRecording ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {isPreviewPlaying ? <Square size={16} /> : <Play size={16} />}
              {isPreviewPlaying ? 'Stop Preview' : 'Preview Animation'}
            </button>

            {canRecord && (
              <button
                onClick={startRecording}
                disabled={isRecording || isPreviewPlaying}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isRecording
                    ? `linear-gradient(90deg, ${BRAND.primary} ${recordingProgress}%, rgba(71,54,254,0.3) ${recordingProgress}%)`
                    : BRAND.primary,
                  color: BRAND.text,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: (isRecording || isPreviewPlaying) ? 'not-allowed' : 'pointer',
                  opacity: isPreviewPlaying ? 0.5 : 1,
                  transition: 'background 0.1s',
                  boxShadow: isRecording ? 'none' : '0 4px 16px rgba(71,54,254,0.4)',
                }}
              >
                <Video size={16} />
                {isRecording ? `Generating... ${recordingProgress}%` : `Generate Video (${selectedDuration.label})`}
              </button>
            )}

            {downloadUrl && (
              <a
                href={downloadUrl}
                download={downloadFilename}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%)`,
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  boxShadow: `0 4px 16px rgba(71,54,254,0.45)`,
                }}
              >
                <Download size={16} />
                Download {downloadFilename.endsWith('.mp4') ? 'MP4' : 'WebM'}
              </a>
            )}
          </div>
        </div>

        {/* Right: Canvas preview */}
        <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              backgroundColor: BRAND.surface,
              borderRadius: '16px',
              border: `1px solid ${BRAND.border}`,
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <p style={{ color: BRAND.textMuted, fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
              Preview — {VIDEO_W} x {VIDEO_H} · {selectedDuration.label}
            </p>
            <canvas
              ref={canvasRef}
              width={VIDEO_W}
              height={VIDEO_H}
              style={{
                width: '100%',
                maxWidth: '800px',
                borderRadius: '8px',
                background: '#000',
                aspectRatio: '16/9',
              }}
            />
            {isRecording && (
              <div style={{ width: '100%', maxWidth: '800px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: BRAND.textMuted, fontSize: '12px', marginBottom: '4px' }}>
                  <span>Recording{musicEnabled ? ' (with audio)' : ''}...</span>
                  <span>{recordingProgress}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div style={{ height: '100%', width: `${recordingProgress}%`, background: BRAND.primary, borderRadius: '2px', transition: 'width 0.1s' }} />
                </div>
              </div>
            )}
            {downloadUrl && !isRecording && (
              <p style={{ color: BRAND.primary, fontSize: '13px', fontWeight: '600' }}>
                Video ready! Click "Download" to save.
              </p>
            )}
          </div>

          {/* How-to tip */}
          <div
            style={{
              backgroundColor: 'rgba(71,54,254,0.1)',
              border: `1px solid ${BRAND.primary}`,
              borderRadius: '12px',
              padding: '14px 18px',
              color: 'rgba(255,255,255,0.65)',
              fontSize: '13px',
              lineHeight: '1.6',
            }}
          >
            <strong style={{ color: BRAND.text }}>How to use:</strong> Fill in the details, set your headline, emoji, and creative options, then click <strong style={{ color: BRAND.text }}>Preview Animation</strong> to watch. Click <strong style={{ color: BRAND.text }}>Generate Video</strong> to record — the exported file includes music and runs for {selectedDuration.label}. Click <strong style={{ color: BRAND.text }}>Download</strong> to save.
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCreator;
