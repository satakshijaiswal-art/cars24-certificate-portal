import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Download, Play, Square, Video, Music, VolumeX } from 'lucide-react';

// ─── Brand tokens — exact match to CertificateCanvas / templates.js ───────────
// Primary: #4736FE  (Cars24 indigo-purple — same as accentColor/borderColor in cert tab)
// Dark navy: #2B3990 (same as signatory color in BarRaiserLayout)
// Body text: #1C1C1C (same as holderName color in BarRaiserLayout)
// Background UI: #1c1c1c dark canvas, #252525 surface (unchanged — these are UI chrome,
//   not cert content colors)
const BRAND = {
  primary: '#4736FE',
  primaryDark: '#2B3990',
  bg: '#1c1c1c',
  surface: '#252525',
  border: 'rgba(255,255,255,0.06)',
  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.5)',
  // Gold accent used on certs for signatory; used as highlight in video too
  gold: '#FFD700',
  // Cert body text color
  bodyText: '#1C1C1C',
};

const VIDEO_W = 1280;
const VIDEO_H = 720;
const DURATION_MS = 6000; // 6 seconds per video

// ─── Music moods ──────────────────────────────────────────────────────────────
// WAV files generated in public/audio/ — 8s synthetic tones, 100% royalty-free.
// "Upbeat" and "Celebration" suit Birthday/Anniversary/Award/Welcome.
// "Gentle" suits Farewell.
const MUSIC_MOODS = [
  { id: 'upbeat',      label: 'Upbeat',      file: 'upbeat.wav',      defaultFor: ['birthday','anniversary','welcome'] },
  { id: 'celebration', label: 'Celebration', file: 'celebration.wav', defaultFor: ['award'] },
  { id: 'gentle',      label: 'Gentle',      file: 'gentle.wav',      defaultFor: ['farewell'] },
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
    // Warm reds blend into the Cars24 primary at the dark end
    gradient: ['#c0392b', '#4736FE', '#c0392b'],
    emoji: '🎂',
    fields: [
      { key: 'name', label: 'Employee Name', placeholder: 'Priya Sharma' },
      { key: 'message', label: 'Wish Message', placeholder: 'Wishing you a fantastic birthday!', multiline: true },
    ],
    draw: drawBirthday,
  },
  {
    id: 'anniversary',
    label: 'Work Anniversary',
    description: 'Celebrate milestone years with the team',
    // Deep indigo — centred on Cars24 primary
    gradient: ['#0f0a2e', '#4736FE', '#0f0a2e'],
    emoji: '🏆',
    fields: [
      { key: 'name', label: 'Employee Name', placeholder: 'Rahul Mehta' },
      { key: 'years', label: 'Years Completed', placeholder: '5' },
      { key: 'message', label: 'Message', placeholder: 'Thank you for your incredible journey!', multiline: true },
    ],
    draw: drawAnniversary,
  },
  {
    id: 'welcome',
    label: 'New Joiner Welcome',
    description: 'Warm welcome for new team members',
    // Dark navy to Cars24 primary
    gradient: ['#0d0829', '#2B3990', '#0d0829'],
    emoji: '👋',
    fields: [
      { key: 'name', label: 'Employee Name', placeholder: 'Ananya Singh' },
      { key: 'role', label: 'Role / Designation', placeholder: 'Product Manager' },
      { key: 'team', label: 'Team', placeholder: 'Growth' },
    ],
    draw: drawWelcome,
  },
  {
    id: 'award',
    label: 'Award & Recognition',
    description: 'Recognise outstanding performance',
    // Dark navy + gold (cert signatory is gold #FFD700, accentColor #4736FE)
    gradient: ['#0d0829', '#4736FE', '#0d0829'],
    emoji: '⭐',
    fields: [
      { key: 'name', label: 'Employee Name', placeholder: 'Vikram Nair' },
      { key: 'award', label: 'Award Title', placeholder: 'Bar Raiser of the Quarter' },
      { key: 'reason', label: 'Reason / Achievement', placeholder: 'For consistently raising the bar...', multiline: true },
    ],
    draw: drawAward,
  },
  {
    id: 'farewell',
    label: 'Farewell',
    description: 'Send off a colleague with warmth',
    // Deeper purple-navy for a softer, reflective feel
    gradient: ['#0d0829', '#2B3990', '#0d0829'],
    emoji: '💫',
    fields: [
      { key: 'name', label: 'Employee Name', placeholder: 'Deepak Patel' },
      { key: 'message', label: 'Thank-You Line', placeholder: 'You made Cars24 a better place. Godspeed!', multiline: true },
    ],
    draw: drawFarewell,
  },
];

// ─── canvas helpers ───────────────────────────────────────────────────────────

function lerp(a, b, t) { return a + (b - a) * t; }
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

function drawStars(ctx, t, count, color) {
  ctx.save();
  for (let i = 0; i < count; i++) {
    const seed = i * 137.5;
    const x = ((seed * 31) % VIDEO_W);
    const y = ((seed * 17) % VIDEO_H);
    const phase = (t * 2 + i * 0.3) % 1;
    const alpha = 0.2 + 0.5 * Math.abs(Math.sin(phase * Math.PI));
    const r = 1 + 2 * Math.abs(Math.sin(phase * Math.PI));
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color || `rgba(255,255,255,${alpha})`;
    ctx.fill();
  }
  ctx.restore();
}

function drawParticles(ctx, t, color1, color2) {
  const count = 18;
  for (let i = 0; i < count; i++) {
    const seed = i * 73.1;
    const startX = VIDEO_W * 0.5 + Math.cos(seed) * 100;
    const startY = VIDEO_H * 0.5;
    const angle = (seed * 2.4) % (Math.PI * 2);
    const speed = 80 + (seed % 120);
    const life = ((t + i / count) % 1);
    const x = startX + Math.cos(angle) * speed * life;
    const y = startY + Math.sin(angle) * speed * life - 60 * life * life;
    const alpha = 1 - life;
    const radius = (1 - life) * 6 + 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? color1.replace(')', `,${alpha})`) : color2.replace(')', `,${alpha})`);
    ctx.fill();
  }
}

// ─── Logo loader (singleton promise, cached after first load) ─────────────────
let _logoImg = null;
let _logoPromise = null;

function getLogoImage(baseUrl) {
  if (_logoImg) return Promise.resolve(_logoImg);
  if (_logoPromise) return _logoPromise;
  _logoPromise = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { _logoImg = img; resolve(img); };
    img.onerror = () => resolve(null); // graceful fallback
    img.src = (baseUrl || '/') + 'cars24-logo.png';
  });
  return _logoPromise;
}

// Global ref so draw functions can access the loaded image synchronously
let _cachedLogo = null;

// Draw logo image in top-left; fallback to a text "Cars24" if image not loaded
function drawLogoTopLeft(ctx, baseUrl) {
  ctx.save();
  if (_cachedLogo) {
    // Logo is 1669×389 — draw at ~12% of canvas width, vertically proportional
    const logoW = Math.round(VIDEO_W * 0.12); // ~154px
    const logoH = Math.round(logoW * (389 / 1669));
    const x = 32;
    const y = 28;
    ctx.drawImage(_cachedLogo, x, y, logoW, logoH);
  } else {
    // Text fallback until image loads
    ctx.font = 'bold 22px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Cars24', 32, 28);
  }
  ctx.restore();
}

function drawBg(ctx, gradColors, t) {
  const phase = (Math.sin(t * Math.PI * 2) + 1) / 2;
  const grd = ctx.createLinearGradient(0, 0, VIDEO_W, VIDEO_H);
  grd.addColorStop(0, gradColors[0]);
  grd.addColorStop(lerp(0.4, 0.6, phase), gradColors[1]);
  grd.addColorStop(1, gradColors[2]);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
}

// ─── Birthday ──────────────────────────────────────────────────────────────────
function drawBirthday(ctx, fields, t, progress) {
  const { name = '', message = '' } = fields;
  drawBg(ctx, ['#c0392b', '#4736FE', '#c0392b'], t);
  drawStars(ctx, t, 40, null);
  drawParticles(ctx, t, 'rgba(255,200,100', 'rgba(71,54,254');

  const fadeIn = easeOut(Math.min(progress * 3, 1));
  const nameSlide = easeOut(Math.min(Math.max(progress * 3 - 0.5, 0), 1));

  ctx.save();
  ctx.font = `${lerp(60, 90, easeInOut(Math.sin(t * Math.PI * 2) * 0.5 + 0.5))}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = fadeIn;
  ctx.fillText('🎂', VIDEO_W / 2, VIDEO_H * 0.22);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.font = 'bold 56px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Happy Birthday!', VIDEO_W / 2, VIDEO_H * 0.42);
  ctx.restore();

  if (name) {
    ctx.save();
    ctx.globalAlpha = nameSlide;
    ctx.font = 'bold 72px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#FFD700'; // gold accent — same as cert signatory highlight
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255,215,0,0.5)';
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

  drawLogoTopLeft(ctx);
}

// ─── Anniversary ───────────────────────────────────────────────────────────────
function drawAnniversary(ctx, fields, t, progress) {
  const { name = '', years = '', message = '' } = fields;
  drawBg(ctx, ['#0f0a2e', '#4736FE', '#0f0a2e'], t);
  drawStars(ctx, t, 60, 'rgba(200,180,255,0.7)');

  const fadeIn = easeOut(Math.min(progress * 3, 1));
  const yearsSlide = easeOut(Math.min(Math.max(progress * 3 - 0.3, 0), 1));
  const nameSlide = easeOut(Math.min(Math.max(progress * 3 - 0.8, 0), 1));

  if (years) {
    ctx.save();
    ctx.globalAlpha = yearsSlide;
    const cx = VIDEO_W / 2;
    const cy = VIDEO_H * 0.3;
    const radius = 70;
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
    grad.addColorStop(0, '#4736FE');
    grad.addColorStop(1, '#2B3990');
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#FFD700'; // gold ring — mirrors cert gold accent
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.font = 'bold 52px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(years, cx, cy - 6);
    ctx.font = '18px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText('YEAR' + (parseInt(years) !== 1 ? 'S' : ''), cx, cy + 28);
    ctx.restore();
  }

  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.font = 'bold 48px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Work Anniversary', VIDEO_W / 2, VIDEO_H * 0.52);
  ctx.restore();

  if (name) {
    ctx.save();
    ctx.globalAlpha = nameSlide;
    ctx.font = 'bold 64px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255,215,0,0.4)';
    ctx.shadowBlur = 20;
    ctx.fillText(name, VIDEO_W / 2, VIDEO_H * 0.65);
    ctx.restore();
  }

  if (message) {
    ctx.save();
    ctx.globalAlpha = Math.min(Math.max(progress * 3 - 1.4, 0), 1);
    ctx.font = '26px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.textAlign = 'center';
    wrapText(ctx, message, VIDEO_W / 2, VIDEO_H * 0.79, VIDEO_W * 0.72, 36);
    ctx.restore();
  }

  drawLogoTopLeft(ctx);
}

// ─── Welcome ───────────────────────────────────────────────────────────────────
function drawWelcome(ctx, fields, t, progress) {
  const { name = '', role = '', team = '' } = fields;
  drawBg(ctx, ['#0d0829', '#2B3990', '#0d0829'], t);
  drawStars(ctx, t, 30, 'rgba(180,170,255,0.5)');

  const fadeIn = easeOut(Math.min(progress * 3, 1));
  const nameSlide = easeOut(Math.min(Math.max(progress * 3 - 0.5, 0), 1));
  const roleSlide = easeOut(Math.min(Math.max(progress * 3 - 0.9, 0), 1));

  ctx.save();
  ctx.globalAlpha = fadeIn;
  const wave = 1 + 0.15 * Math.sin(t * Math.PI * 4);
  ctx.font = `${72 * wave}px serif`;
  ctx.textAlign = 'center';
  ctx.fillText('👋', VIDEO_W / 2, VIDEO_H * 0.22);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.font = 'bold 52px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Welcome to the team!', VIDEO_W / 2, VIDEO_H * 0.4);
  ctx.restore();

  if (name) {
    ctx.save();
    ctx.globalAlpha = nameSlide;
    ctx.font = 'bold 70px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255,215,0,0.4)';
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

  drawLogoTopLeft(ctx);
}

// ─── Award ─────────────────────────────────────────────────────────────────────
function drawAward(ctx, fields, t, progress) {
  const { name = '', award = '', reason = '' } = fields;
  drawBg(ctx, ['#0d0829', '#4736FE', '#0d0829'], t);
  drawStars(ctx, t, 50, 'rgba(255,215,0,0.6)');

  const fadeIn = easeOut(Math.min(progress * 3, 1));
  const nameSlide = easeOut(Math.min(Math.max(progress * 3 - 0.6, 0), 1));
  const reasonSlide = easeOut(Math.min(Math.max(progress * 3 - 1.1, 0), 1));

  ctx.save();
  ctx.globalAlpha = fadeIn;
  const pulse = 1 + 0.08 * Math.sin(t * Math.PI * 3);
  ctx.font = `${80 * pulse}px serif`;
  ctx.textAlign = 'center';
  ctx.fillText('⭐', VIDEO_W / 2, VIDEO_H * 0.2);
  ctx.restore();

  if (award) {
    ctx.save();
    ctx.globalAlpha = fadeIn;
    ctx.font = 'bold 44px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255,215,0,0.5)';
    ctx.shadowBlur = 16;
    wrapText(ctx, award, VIDEO_W / 2, VIDEO_H * 0.38, VIDEO_W * 0.75, 54);
    ctx.restore();
  }

  if (name) {
    ctx.save();
    ctx.globalAlpha = nameSlide;
    ctx.font = 'bold 64px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, VIDEO_W / 2, VIDEO_H * 0.56);
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

  drawLogoTopLeft(ctx);
}

// ─── Farewell ──────────────────────────────────────────────────────────────────
function drawFarewell(ctx, fields, t, progress) {
  const { name = '', message = '' } = fields;
  drawBg(ctx, ['#0d0829', '#2B3990', '#0d0829'], t);
  drawStars(ctx, t, 70, null);

  const fadeIn = easeOut(Math.min(progress * 3, 1));
  const nameSlide = easeOut(Math.min(Math.max(progress * 3 - 0.6, 0), 1));
  const msgSlide = easeOut(Math.min(Math.max(progress * 3 - 1.1, 0), 1));

  ctx.save();
  ctx.globalAlpha = fadeIn;
  const drift = Math.sin(t * Math.PI * 2) * 10;
  ctx.font = '80px serif';
  ctx.textAlign = 'center';
  ctx.fillText('💫', VIDEO_W / 2 + drift, VIDEO_H * 0.2);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.font = 'bold 56px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Farewell &', VIDEO_W / 2, VIDEO_H * 0.38);
  ctx.fillText('Best Wishes', VIDEO_W / 2, VIDEO_H * 0.46);
  ctx.restore();

  if (name) {
    ctx.save();
    ctx.globalAlpha = nameSlide;
    ctx.font = 'bold 68px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#C4B5FD'; // lavender — softer for farewell, still in the purple family
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(196,181,253,0.5)';
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

  drawLogoTopLeft(ctx);
}

// ─── text wrap utility ─────────────────────────────────────────────────────────
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
  const audioElRef = useRef(null);       // <audio> element
  const audioCtxRef = useRef(null);      // AudioContext
  const gainNodeRef = useRef(null);      // GainNode for fade in/out
  const mediaDestRef = useRef(null);     // MediaStreamDestinationNode

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

  // Pre-load the Cars24 logo image so draw functions have it synchronously
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    getLogoImage(baseUrl).then((img) => {
      _cachedLogo = img;
      // Re-draw the static first frame now that the logo is loaded
      if (!isRecording && !isPreviewPlaying && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        selectedTemplate.draw(ctx, fields, 0, 0.2);
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

  // Set up (or re-use) AudioContext + destination node.
  // Returns { gainNode, mediaDestNode } or null if audio is disabled.
  function setupAudio() {
    if (!musicEnabled) return null;

    try {
      // Create AudioContext on first use (or reuse existing one)
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;

      // Resume if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') ctx.resume();

      // Create gain node for volume / fade control
      const gain = ctx.createGain();
      gain.gain.value = 0; // start silent, fade in
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      // MediaStreamDestination — its stream will be mixed into the MediaRecorder
      const dest = ctx.createMediaStreamDestination();
      gainNodeRef.current.connect(dest);
      mediaDestRef.current = dest;

      return { gainNode: gain, mediaDestNode: dest };
    } catch (err) {
      console.warn('AudioContext setup failed:', err);
      return null;
    }
  }

  // Start the <audio> element and wire it through AudioContext
  function startAudio(audioNodes) {
    if (!audioNodes) return;
    const { gainNode } = audioNodes;
    const ctx = audioCtxRef.current;

    try {
      // Create / re-use <audio> element
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

      // Connect to AudioContext if not already connected
      // (createMediaElementSource can only be called once per element)
      if (!audioEl._sourceNode) {
        const sourceNode = ctx.createMediaElementSource(audioEl);
        audioEl._sourceNode = sourceNode;
      }
      // Reconnect source to current gain node each time
      audioEl._sourceNode.disconnect();
      audioEl._sourceNode.connect(gainNode);

      // Play
      audioEl.currentTime = 0;
      audioEl.volume = 1; // volume is controlled via GainNode
      const playPromise = audioEl.play();
      if (playPromise) playPromise.catch(() => {});

      // Fade in over 0.8s, fade out at the tail
      const durationSec = DURATION_MS / 1000;
      gainNode.gain.cancelScheduledValues(ctx.currentTime);
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.8); // fade in to 55% volume
      gainNode.gain.setValueAtTime(0.55, ctx.currentTime + durationSec - 0.8);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + durationSec); // fade out
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
    const progress = Math.min(elapsed / DURATION_MS, 1);
    const t = elapsed / 1000;

    selectedTemplate.draw(ctx, fields, t, progress);

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
  }, [selectedTemplate, fields]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview
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
  }, [animate, isRecording, musicEnabled, selectedMood]); // eslint-disable-line react-hooks/exhaustive-deps

  const stopPreview = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    stopAudio();
    setIsPreviewPlaying(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      selectedTemplate.draw(ctx, fields, 0, 0);
    }
  }, [selectedTemplate, fields]);

  // Record + download — combine canvas video track + audio track into MediaRecorder
  const startRecording = useCallback(() => {
    if (!canvasRef.current) return;
    cancelAnimationFrame(animFrameRef.current);
    setIsPreviewPlaying(false);
    stopAudio();
    setDownloadUrl(null);
    chunksRef.current = [];

    const mime = getBestMime();
    const ext = getExtension(mime);

    // Build combined stream: canvas video track + optional audio track
    const videoStream = canvasRef.current.captureStream(30);
    let combinedStream = videoStream;

    const audioNodes = musicEnabled ? setupAudio() : null;

    if (audioNodes && audioNodes.mediaDestNode) {
      // Add audio tracks from the MediaStreamDestination to the combined stream
      const audioTracks = audioNodes.mediaDestNode.stream.getAudioTracks();
      if (audioTracks.length > 0) {
        const tracks = [
          ...videoStream.getVideoTracks(),
          ...audioTracks,
        ];
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
  }, [animate, selectedTemplate, fields, musicEnabled, selectedMood]); // eslint-disable-line react-hooks/exhaustive-deps

  // Draw static frame when template/fields change (not during recording)
  useEffect(() => {
    if (isRecording || isPreviewPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    selectedTemplate.draw(ctx, fields, 0, 0.2);
  }, [selectedTemplate, fields, isRecording, isPreviewPlaying]);

  // Reset fields when template changes
  useEffect(() => {
    setFields({});
    setDownloadUrl(null);
    cancelAnimationFrame(animFrameRef.current);
    stopAudio();
    setIsPreviewPlaying(false);
    setIsRecording(false);
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
        <div style={{ flex: '0 0 340px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Template picker */}
          <div
            style={{
              backgroundColor: BRAND.surface,
              borderRadius: '16px',
              border: `1px solid ${BRAND.border}`,
              padding: '20px',
            }}
          >
            <p style={{ color: BRAND.textMuted, fontSize: '12px', fontWeight: '600', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>
              Template
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {VIDEO_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
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
                  <span style={{ fontSize: '28px' }}>{tpl.emoji}</span>
                  <div>
                    <div style={{ color: BRAND.text, fontSize: '14px', fontWeight: '600' }}>{tpl.label}</div>
                    <div style={{ color: BRAND.textMuted, fontSize: '11px', marginTop: '2px' }}>{tpl.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form fields */}
          <div
            style={{
              backgroundColor: BRAND.surface,
              borderRadius: '16px',
              border: `1px solid ${BRAND.border}`,
              padding: '20px',
            }}
          >
            <p style={{ color: BRAND.textMuted, fontSize: '12px', fontWeight: '600', letterSpacing: '1px', marginBottom: '16px', textTransform: 'uppercase' }}>
              Details
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {selectedTemplate.fields.map((f) => (
                <div key={f.key}>
                  <label style={{ color: BRAND.textMuted, fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                    {f.label}
                  </label>
                  {f.multiline ? (
                    <textarea
                      rows={3}
                      value={fields[f.key] || ''}
                      onChange={(e) => handleFieldChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      style={{
                        width: '100%',
                        background: '#1c1c1c',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '8px',
                        color: BRAND.text,
                        fontSize: '13px',
                        padding: '10px 12px',
                        resize: 'vertical',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={fields[f.key] || ''}
                      onChange={(e) => handleFieldChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      style={{
                        width: '100%',
                        background: '#1c1c1c',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '8px',
                        color: BRAND.text,
                        fontSize: '13px',
                        padding: '10px 12px',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Music controls */}
          <div
            style={{
              backgroundColor: BRAND.surface,
              borderRadius: '16px',
              border: `1px solid ${BRAND.border}`,
              padding: '20px',
            }}
          >
            <p style={{ color: BRAND.textMuted, fontSize: '12px', fontWeight: '600', letterSpacing: '1px', marginBottom: '14px', textTransform: 'uppercase' }}>
              Background Music
            </p>

            {/* Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: BRAND.text, fontSize: '13px', fontWeight: '500' }}>
                {musicEnabled ? <Music size={15} /> : <VolumeX size={15} />}
                {musicEnabled ? 'Music on' : 'Music off'}
              </div>
              {/* Toggle switch */}
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

            {/* Mood selector */}
            {musicEnabled && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {MUSIC_MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
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
                Music fades in/out on the 6-sec clip. Exported video file includes audio.
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
                {isRecording ? `Generating... ${recordingProgress}%` : 'Generate Video'}
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
              Preview — {VIDEO_W} x {VIDEO_H} · 6 sec
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
            <strong style={{ color: BRAND.text }}>How to use:</strong> Fill in the details, optionally choose a music mood, then click <strong style={{ color: BRAND.text }}>Preview Animation</strong> to watch (with audio). Click <strong style={{ color: BRAND.text }}>Generate Video</strong> to record the 6-sec clip — the exported file includes music. Click <strong style={{ color: BRAND.text }}>Download</strong> to save.
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCreator;
