import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Download, Play, Square, Video } from 'lucide-react';

// Brand tokens matching the rest of the portal
const BRAND = {
  primary: '#4736FE',
  primaryDark: '#3a2bd4',
  bg: '#1c1c1c',
  surface: '#252525',
  border: 'rgba(255,255,255,0.06)',
  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.5)',
  accent: '#00FFAA',
};

const VIDEO_W = 1280;
const VIDEO_H = 720;
const DURATION_MS = 6000; // 6 seconds per video

// ─── template definitions ────────────────────────────────────────────────────
const VIDEO_TEMPLATES = [
  {
    id: 'birthday',
    label: 'Birthday Wish',
    description: 'Festive animation for employee birthdays',
    gradient: ['#FF6B6B', '#FF8E53', '#FF6B6B'],
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
    gradient: ['#4736FE', '#8B5CF6', '#4736FE'],
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
    gradient: ['#00C9A7', '#4736FE', '#00C9A7'],
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
    gradient: ['#FFD700', '#FF6B35', '#FFD700'],
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
    gradient: ['#667EEA', '#764BA2', '#667EEA'],
    emoji: '💫',
    fields: [
      { key: 'name', label: 'Employee Name', placeholder: 'Deepak Patel' },
      { key: 'message', label: 'Thank-You Line', placeholder: 'You made Cars24 a better place. Godspeed!', multiline: true },
    ],
    draw: drawFarewell,
  },
];

// ─── canvas draw functions ────────────────────────────────────────────────────

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

function drawCars24Logo(ctx, x, y, size) {
  // Simple text-based Cars24 logo mark
  ctx.save();
  const boxSize = size;
  const radius = boxSize * 0.18;
  const grd = ctx.createLinearGradient(x, y, x + boxSize, y + boxSize);
  grd.addColorStop(0, '#4736FE');
  grd.addColorStop(1, '#8B5CF6');
  ctx.beginPath();
  ctx.roundRect(x, y, boxSize, boxSize, radius);
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${boxSize * 0.5}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('C', x + boxSize / 2, y + boxSize / 2);
  ctx.restore();
}

function drawBg(ctx, gradColors, t) {
  // Animated gradient background
  const phase = (Math.sin(t * Math.PI * 2) + 1) / 2;
  const grd = ctx.createLinearGradient(0, 0, VIDEO_W, VIDEO_H);
  grd.addColorStop(0, gradColors[0]);
  grd.addColorStop(lerp(0.4, 0.6, phase), gradColors[1]);
  grd.addColorStop(1, gradColors[2]);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);

  // Dark overlay for readability
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
}

function drawCars24Tag(ctx) {
  ctx.save();
  ctx.font = 'bold 22px Inter, system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('Cars24', VIDEO_W - 32, VIDEO_H - 28);
  ctx.restore();
}

// ─── Birthday ─────────────────────────────────────────────────────────────────
function drawBirthday(ctx, fields, t, progress) {
  const { name = '', message = '' } = fields;
  drawBg(ctx, ['#FF6B6B', '#FF8E53', '#c0392b'], t);
  drawStars(ctx, t, 40, null);
  drawParticles(ctx, t, 'rgba(255,200,100', 'rgba(255,100,100');

  const fadeIn = easeOut(Math.min(progress * 3, 1));
  const nameSlide = easeOut(Math.min(Math.max(progress * 3 - 0.5, 0), 1));

  // Emoji
  ctx.save();
  ctx.font = `${lerp(60, 90, easeInOut(Math.sin(t * Math.PI * 2) * 0.5 + 0.5))}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = fadeIn;
  ctx.fillText('🎂', VIDEO_W / 2, VIDEO_H * 0.22);
  ctx.restore();

  // "Happy Birthday"
  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.font = 'bold 56px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Happy Birthday!', VIDEO_W / 2, VIDEO_H * 0.42);
  ctx.restore();

  // Name
  if (name) {
    ctx.save();
    ctx.globalAlpha = nameSlide;
    ctx.font = 'bold 72px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255,215,0,0.5)';
    ctx.shadowBlur = 20;
    ctx.fillText(name, VIDEO_W / 2, VIDEO_H * 0.56);
    ctx.restore();
  }

  // Message
  if (message) {
    ctx.save();
    ctx.globalAlpha = Math.min(Math.max(progress * 3 - 1.2, 0), 1);
    ctx.font = '28px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.textAlign = 'center';
    wrapText(ctx, message, VIDEO_W / 2, VIDEO_H * 0.72, VIDEO_W * 0.7, 38);
    ctx.restore();
  }

  drawCars24Tag(ctx);
}

// ─── Anniversary ──────────────────────────────────────────────────────────────
function drawAnniversary(ctx, fields, t, progress) {
  const { name = '', years = '', message = '' } = fields;
  drawBg(ctx, ['#1a0533', '#4736FE', '#1a0533'], t);
  drawStars(ctx, t, 60, 'rgba(200,180,255,0.7)');

  const fadeIn = easeOut(Math.min(progress * 3, 1));
  const yearsSlide = easeOut(Math.min(Math.max(progress * 3 - 0.3, 0), 1));
  const nameSlide = easeOut(Math.min(Math.max(progress * 3 - 0.8, 0), 1));

  // Milestone ring
  if (years) {
    ctx.save();
    ctx.globalAlpha = yearsSlide;
    const cx = VIDEO_W / 2;
    const cy = VIDEO_H * 0.3;
    const radius = 70;
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
    grad.addColorStop(0, '#8B5CF6');
    grad.addColorStop(1, '#4736FE');
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#00FFAA';
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

  // Headline
  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.font = 'bold 48px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Work Anniversary', VIDEO_W / 2, VIDEO_H * 0.52);
  ctx.restore();

  // Name
  if (name) {
    ctx.save();
    ctx.globalAlpha = nameSlide;
    ctx.font = 'bold 64px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#00FFAA';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,255,170,0.4)';
    ctx.shadowBlur = 20;
    ctx.fillText(name, VIDEO_W / 2, VIDEO_H * 0.65);
    ctx.restore();
  }

  // Message
  if (message) {
    ctx.save();
    ctx.globalAlpha = Math.min(Math.max(progress * 3 - 1.4, 0), 1);
    ctx.font = '26px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.textAlign = 'center';
    wrapText(ctx, message, VIDEO_W / 2, VIDEO_H * 0.79, VIDEO_W * 0.72, 36);
    ctx.restore();
  }

  drawCars24Tag(ctx);
}

// ─── Welcome ──────────────────────────────────────────────────────────────────
function drawWelcome(ctx, fields, t, progress) {
  const { name = '', role = '', team = '' } = fields;
  drawBg(ctx, ['#004d3d', '#00C9A7', '#004d3d'], t);
  drawStars(ctx, t, 30, 'rgba(0,255,170,0.5)');

  const fadeIn = easeOut(Math.min(progress * 3, 1));
  const nameSlide = easeOut(Math.min(Math.max(progress * 3 - 0.5, 0), 1));
  const roleSlide = easeOut(Math.min(Math.max(progress * 3 - 0.9, 0), 1));

  // Wave emoji
  ctx.save();
  ctx.globalAlpha = fadeIn;
  const wave = 1 + 0.15 * Math.sin(t * Math.PI * 4);
  ctx.font = `${72 * wave}px serif`;
  ctx.textAlign = 'center';
  ctx.fillText('👋', VIDEO_W / 2, VIDEO_H * 0.22);
  ctx.restore();

  // Welcome headline
  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.font = 'bold 52px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Welcome to the team!', VIDEO_W / 2, VIDEO_H * 0.4);
  ctx.restore();

  // Name
  if (name) {
    ctx.save();
    ctx.globalAlpha = nameSlide;
    ctx.font = 'bold 70px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#00FFD4';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,255,212,0.5)';
    ctx.shadowBlur = 24;
    ctx.fillText(name, VIDEO_W / 2, VIDEO_H * 0.54);
    ctx.restore();
  }

  // Role + Team pill
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
    ctx.fillStyle = 'rgba(0,255,170,0.2)';
    ctx.fill();
    ctx.strokeStyle = '#00FFAA';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, VIDEO_W / 2, VIDEO_H * 0.67);
    ctx.restore();
  }

  // Cars24 team note
  ctx.save();
  ctx.globalAlpha = Math.min(Math.max(progress * 3 - 1.6, 0), 1);
  ctx.font = '24px Inter, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('We\'re thrilled to have you at Cars24!', VIDEO_W / 2, VIDEO_H * 0.81);
  ctx.restore();

  drawCars24Tag(ctx);
}

// ─── Award ────────────────────────────────────────────────────────────────────
function drawAward(ctx, fields, t, progress) {
  const { name = '', award = '', reason = '' } = fields;
  drawBg(ctx, ['#3d2500', '#FF6B35', '#3d2500'], t);
  drawStars(ctx, t, 50, 'rgba(255,215,0,0.6)');

  const fadeIn = easeOut(Math.min(progress * 3, 1));
  const nameSlide = easeOut(Math.min(Math.max(progress * 3 - 0.6, 0), 1));
  const reasonSlide = easeOut(Math.min(Math.max(progress * 3 - 1.1, 0), 1));

  // Star burst
  ctx.save();
  ctx.globalAlpha = fadeIn;
  const pulse = 1 + 0.08 * Math.sin(t * Math.PI * 3);
  ctx.font = `${80 * pulse}px serif`;
  ctx.textAlign = 'center';
  ctx.fillText('⭐', VIDEO_W / 2, VIDEO_H * 0.2);
  ctx.restore();

  // Award title
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

  // Name
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

  // Reason
  if (reason) {
    ctx.save();
    ctx.globalAlpha = reasonSlide;
    ctx.font = '26px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.textAlign = 'center';
    wrapText(ctx, reason, VIDEO_W / 2, VIDEO_H * 0.72, VIDEO_W * 0.68, 36);
    ctx.restore();
  }

  drawCars24Tag(ctx);
}

// ─── Farewell ─────────────────────────────────────────────────────────────────
function drawFarewell(ctx, fields, t, progress) {
  const { name = '', message = '' } = fields;
  drawBg(ctx, ['#1a1040', '#667EEA', '#1a1040'], t);
  drawStars(ctx, t, 70, null);

  const fadeIn = easeOut(Math.min(progress * 3, 1));
  const nameSlide = easeOut(Math.min(Math.max(progress * 3 - 0.6, 0), 1));
  const msgSlide = easeOut(Math.min(Math.max(progress * 3 - 1.1, 0), 1));

  // Sparkle
  ctx.save();
  ctx.globalAlpha = fadeIn;
  const drift = Math.sin(t * Math.PI * 2) * 10;
  ctx.font = '80px serif';
  ctx.textAlign = 'center';
  ctx.fillText('💫', VIDEO_W / 2 + drift, VIDEO_H * 0.2);
  ctx.restore();

  // Headline
  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.font = 'bold 56px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Farewell &', VIDEO_W / 2, VIDEO_H * 0.38);
  ctx.fillText('Best Wishes', VIDEO_W / 2, VIDEO_H * 0.46);
  ctx.restore();

  // Name
  if (name) {
    ctx.save();
    ctx.globalAlpha = nameSlide;
    ctx.font = 'bold 68px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#C4B5FD';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(196,181,253,0.5)';
    ctx.shadowBlur = 20;
    ctx.fillText(name, VIDEO_W / 2, VIDEO_H * 0.59);
    ctx.restore();
  }

  // Message
  if (message) {
    ctx.save();
    ctx.globalAlpha = msgSlide;
    ctx.font = '28px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.textAlign = 'center';
    wrapText(ctx, message, VIDEO_W / 2, VIDEO_H * 0.74, VIDEO_W * 0.68, 38);
    ctx.restore();
  }

  drawCars24Tag(ctx);
}

// ─── text wrap utility ────────────────────────────────────────────────────────
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
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
  currentY = y - totalH / 2;
  for (const l of lines) {
    ctx.fillText(l, x, currentY);
    currentY += lineHeight;
  }
}

// ─── VideoCreator component ───────────────────────────────────────────────────
function VideoCreator({ onBack }) {
  const [selectedTemplate, setSelectedTemplate] = useState(VIDEO_TEMPLATES[0]);
  const [fields, setFields] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadFilename, setDownloadFilename] = useState('');
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [supportNote, setSupportNote] = useState('');

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const startTimeRef = useRef(null);
  const previewStartRef = useRef(null);
  const isPreviewRef = useRef(false);

  // Detect codec support once on mount
  useEffect(() => {
    const mp4 = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1');
    const webm = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      || MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
      || MediaRecorder.isTypeSupported('video/webm');
    if (!mp4 && !webm) {
      setSupportNote('Your browser does not support video recording. Please use Chrome, Edge, or Firefox.');
    } else if (!mp4) {
      setSupportNote('Downloading as .webm (fully supported in Chrome/Firefox). Safari plays webm via VLC or ffmpeg.');
    }
  }, []);

  // Pick best supported MIME type
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
    if (mime.startsWith('video/mp4')) return 'mp4';
    return 'webm';
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
    const t = elapsed / 1000; // seconds

    // Draw the frame
    selectedTemplate.draw(ctx, fields, t, progress);

    if (isRecordingRun) {
      setRecordingProgress(Math.round(progress * 100));
    }

    if (progress < 1) {
      animFrameRef.current = requestAnimationFrame((ts) => animate(ts, isRecordingRun));
    } else {
      // Animation finished
      if (isRecordingRun) {
        recorderRef.current?.stop();
        setIsRecording(false);
        setRecordingProgress(100);
      } else {
        setIsPreviewPlaying(false);
        isPreviewRef.current = false;
      }
    }
  }, [selectedTemplate, fields]);

  // Preview
  const startPreview = useCallback(() => {
    if (isRecording) return;
    cancelAnimationFrame(animFrameRef.current);
    previewStartRef.current = null;
    isPreviewRef.current = true;
    setIsPreviewPlaying(true);
    animFrameRef.current = requestAnimationFrame((ts) => {
      previewStartRef.current = ts;
      animate(ts, false);
    });
  }, [animate, isRecording]);

  // Stop preview
  const stopPreview = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    setIsPreviewPlaying(false);
    isPreviewRef.current = false;
    // Draw static first frame
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      selectedTemplate.draw(ctx, fields, 0, 0);
    }
  }, [selectedTemplate, fields]);

  // Record + download
  const startRecording = useCallback(() => {
    if (!canvasRef.current) return;
    cancelAnimationFrame(animFrameRef.current);
    setIsPreviewPlaying(false);
    setDownloadUrl(null);
    chunksRef.current = [];

    const mime = getBestMime();
    const ext = getExtension(mime);
    const stream = canvasRef.current.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4000000 });

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
      animate(ts, true);
    });
  }, [animate, selectedTemplate, fields]);

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
    setIsPreviewPlaying(false);
    setIsRecording(false);
  }, [selectedTemplate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handleFieldChange = (key, value) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const canRecord = typeof MediaRecorder !== 'undefined';

  // ─── render ─────────────────────────────────────────────────────────────────
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
        {/* Left: template picker + form */}
        <div style={{ flex: '0 0 340px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Template cards */}
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
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Preview */}
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

            {/* Record / Generate */}
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

            {/* Download */}
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
                  background: 'linear-gradient(135deg, #00C9A7 0%, #00FFAA 100%)',
                  color: '#000',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0,255,170,0.35)',
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
              Preview — {VIDEO_W} × {VIDEO_H} · 6 sec
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
                  <span>Recording...</span>
                  <span>{recordingProgress}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div style={{ height: '100%', width: `${recordingProgress}%`, background: BRAND.primary, borderRadius: '2px', transition: 'width 0.1s' }} />
                </div>
              </div>
            )}
            {downloadUrl && !isRecording && (
              <p style={{ color: BRAND.accent, fontSize: '13px', fontWeight: '600' }}>
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
            <strong style={{ color: BRAND.text }}>How to use:</strong> Fill in the details on the left, click <strong style={{ color: BRAND.text }}>Preview Animation</strong> to watch the animated card, then click <strong style={{ color: BRAND.text }}>Generate Video</strong> to record it in real-time. When it finishes, click <strong style={{ color: BRAND.text }}>Download</strong> to save the file.
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCreator;
