import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ArrowLeft, Download, Sparkles } from 'lucide-react';

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const B = {
  primary: '#4736FE',
  primaryDark: '#2B3990',
  gold: '#FFD700',
  bg: '#1c1c1c',
  surface: '#252525',
  border: 'rgba(255,255,255,0.06)',
  text: '#FFFFFF',
  muted: 'rgba(255,255,255,0.5)',
};

// ─── Festival & Events preset templates ───────────────────────────────────────
const FESTIVAL_PRESETS = [
  {
    id: 'diwali',
    name: 'Diwali',
    emoji: '🪔',
    bg: 'linear-gradient(135deg, #1a0a00 0%, #4a1800 50%, #1a0a00 100%)',
    accentColor: '#FFD700',
    motifColor: '#FF6B2B',
    defaultTitle: 'Happy Diwali!',
    defaultMsg: 'May the festival of lights illuminate your life with joy, prosperity, and happiness. Wishing you and your loved ones a sparkling Diwali!',
    motif: 'diya',
  },
  {
    id: 'holi',
    name: 'Holi',
    emoji: '🎨',
    bg: 'linear-gradient(135deg, #0d1a4a 0%, #4736FE 50%, #0d1a4a 100%)',
    accentColor: '#FFD700',
    motifColor: '#FF4081',
    defaultTitle: 'Happy Holi!',
    defaultMsg: 'May the colors of Holi paint your life in hues of joy, love, and togetherness. Happy Holi from Team Cars24!',
    motif: 'colors',
  },
  {
    id: 'eid',
    name: 'Eid',
    emoji: '🌙',
    bg: 'linear-gradient(135deg, #001a0a 0%, #00472a 50%, #001a0a 100%)',
    accentColor: '#FFD700',
    motifColor: '#00C853',
    defaultTitle: 'Eid Mubarak!',
    defaultMsg: 'May this Eid bring you and your family endless blessings, joy, and peace. Eid Mubarak from all of us at Cars24!',
    motif: 'crescent',
  },
  {
    id: 'christmas',
    name: 'Christmas',
    emoji: '🎄',
    bg: 'linear-gradient(135deg, #0a1a0a 0%, #1a3a1a 50%, #0a1a0a 100%)',
    accentColor: '#FFD700',
    motifColor: '#FF3D00',
    defaultTitle: 'Merry Christmas!',
    defaultMsg: 'Wishing you a season filled with warmth, laughter, and the magic of giving. Happy holidays from the Cars24 family!',
    motif: 'snowflake',
  },
  {
    id: 'independence-day',
    name: 'Independence Day',
    emoji: '🇮🇳',
    bg: 'linear-gradient(135deg, #0d0829 0%, #4736FE 50%, #0d0829 100%)',
    accentColor: '#FFD700',
    motifColor: '#FF9933',
    defaultTitle: 'Happy Independence Day!',
    defaultMsg: 'Proud to be Indian. Proud to be Cars24. Here\'s to the spirit of freedom, innovation, and progress. Jai Hind!',
    motif: 'tricolor',
  },
  {
    id: 'republic-day',
    name: 'Republic Day',
    emoji: '🏛',
    bg: 'linear-gradient(135deg, #0d0829 0%, #1a237e 50%, #0d0829 100%)',
    accentColor: '#FFD700',
    motifColor: '#FF9933',
    defaultTitle: 'Happy Republic Day!',
    defaultMsg: 'On this day we celebrate the strength of our Constitution and the unity of our nation. Warm wishes from Team Cars24!',
    motif: 'wheel',
  },
  {
    id: 'town-hall',
    name: 'Town Hall',
    emoji: '🎤',
    bg: 'linear-gradient(135deg, #0d0829 0%, #4736FE 60%, #2B3990 100%)',
    accentColor: '#FFFFFF',
    motifColor: '#4736FE',
    defaultTitle: 'All Hands Town Hall',
    defaultMsg: 'Join us for our quarterly town hall. Updates, Q&A, and everything in between.',
    motif: 'event',
    isEvent: true,
  },
  {
    id: 'offsite',
    name: 'Offsite',
    emoji: '🏕',
    bg: 'linear-gradient(135deg, #001a2e 0%, #0d4b8c 50%, #001a2e 100%)',
    accentColor: '#FFD700',
    motifColor: '#4736FE',
    defaultTitle: 'Team Offsite',
    defaultMsg: 'Pack your bags — it\'s time to step back, connect, and recharge as a team.',
    motif: 'event',
    isEvent: true,
  },
  {
    id: 'team-outing',
    name: 'Team Outing',
    emoji: '🎉',
    bg: 'linear-gradient(135deg, #0d0829 0%, #4736FE 50%, #8B5CF6 100%)',
    accentColor: '#FFD700',
    motifColor: '#C4B5FD',
    defaultTitle: 'Team Outing',
    defaultMsg: 'A little fun, a lot of memories. See you there!',
    motif: 'event',
    isEvent: true,
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    emoji: '🚀',
    bg: 'linear-gradient(135deg, #000000 0%, #4736FE 50%, #00C9A7 100%)',
    accentColor: '#FFD700',
    motifColor: '#00C9A7',
    defaultTitle: 'Product Launch',
    defaultMsg: 'We built something incredible. Today we share it with the world.',
    motif: 'event',
    isEvent: true,
  },
];

// ─── Style variants ───────────────────────────────────────────────────────────
const FESTIVAL_STYLES = [
  { id: 'traditional',   label: 'Traditional Motif' },
  { id: 'confetti',      label: 'Confetti' },
  { id: 'minimal',       label: 'Minimal Elegant' },
  { id: 'bold-type',     label: 'Bold Typographic' },
  { id: 'photo-collage', label: 'Photo Collage' },
];

// ─── Motif renderers (SVG strings injected into backgrounds) ─────────────────
function getMotifElements(preset, styleId) {
  if (styleId === 'minimal') return null;

  const { motif, accentColor, motifColor } = preset;

  if (motif === 'diya') {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[
          { x: '10%', y: '75%', scale: 1.2, opacity: 0.9 },
          { x: '85%', y: '72%', scale: 0.9, opacity: 0.7 },
          { x: '50%', y: '80%', scale: 1.5, opacity: 0.85 },
          { x: '25%', y: '82%', scale: 0.7, opacity: 0.6 },
          { x: '70%', y: '78%', scale: 1.0, opacity: 0.75 },
        ].map((d, i) => (
          <div key={i} style={{ position: 'absolute', left: d.x, top: d.y, transform: `scale(${d.scale})`, opacity: d.opacity, fontSize: `${28 * d.scale}px` }}>
            🪔
          </div>
        ))}
        {/* Light rays from center */}
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '300px', height: '300px', borderRadius: '50%', background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
      </div>
    );
  }

  if (motif === 'colors') {
    const colors = ['#FF4081', '#FF9800', '#4CAF50', '#2196F3', '#9C27B0', '#FFD700'];
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const seed = i * 73.1;
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${(seed * 31) % 100}%`,
              top: `${(seed * 17) % 100}%`,
              width: `${8 + (seed % 20)}px`,
              height: `${8 + (seed % 20)}px`,
              borderRadius: '50%',
              background: colors[i % colors.length],
              opacity: 0.5 + (i % 5) * 0.08,
            }} />
          );
        })}
      </div>
    );
  }

  if (motif === 'crescent') {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '8%', right: '10%', fontSize: '80px', opacity: 0.35 }}>🌙</div>
        <div style={{ position: 'absolute', bottom: '10%', left: '8%', fontSize: '40px', opacity: 0.25 }}>⭐</div>
        <div style={{ position: 'absolute', top: '20%', left: '12%', fontSize: '28px', opacity: 0.2 }}>✦</div>
        <div style={{ position: 'absolute', bottom: '20%', right: '15%', fontSize: '36px', opacity: 0.2 }}>✦</div>
        <div style={{ position: 'absolute', top: '40%', right: '6%', fontSize: '22px', opacity: 0.18 }}>✦</div>
        {/* Geometric lattice strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: `linear-gradient(90deg, ${motifColor}44, ${accentColor}88, ${motifColor}44)` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '8px', background: `linear-gradient(90deg, ${motifColor}44, ${accentColor}88, ${motifColor}44)` }} />
      </div>
    );
  }

  if (motif === 'snowflake') {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: 14 }).map((_, i) => {
          const seed = i * 53.7;
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${(seed * 29) % 100}%`,
              top: `${(seed * 41) % 100}%`,
              fontSize: `${14 + (seed % 20)}px`,
              opacity: 0.2 + (i % 5) * 0.06,
              color: '#FFFFFF',
            }}>
              ❄
            </div>
          );
        })}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }} />
      </div>
    );
  }

  if (motif === 'tricolor') {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: '#FF9933' }} />
        <div style={{ position: 'absolute', top: '8px', left: 0, right: 0, height: '8px', background: '#FFFFFF', opacity: 0.8 }} />
        <div style={{ position: 'absolute', top: '16px', left: 0, right: 0, height: '8px', background: '#138808' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '8px', background: '#FF9933' }} />
        <div style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, height: '8px', background: '#FFFFFF', opacity: 0.8 }} />
        <div style={{ position: 'absolute', bottom: '16px', left: 0, right: 0, height: '8px', background: '#138808' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '28px', opacity: 0.12 }}>🔵</div>
      </div>
    );
  }

  if (motif === 'wheel') {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #FF9933 33%, #FFFFFF 33% 66%, #138808 66%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #FF9933 33%, #FFFFFF 33% 66%, #138808 66%)' }} />
        <div style={{ position: 'absolute', top: '8%', right: '10%', fontSize: '60px', opacity: 0.2 }}>⚙</div>
      </div>
    );
  }

  if (motif === 'event') {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, transparent, ${B.primary}, transparent)` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, transparent, ${B.primary}, transparent)` }} />
        {/* Corner accents */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '60px', height: '60px', borderTop: `3px solid ${motifColor}`, borderLeft: `3px solid ${motifColor}`, opacity: 0.6 }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', borderTop: `3px solid ${motifColor}`, borderRight: `3px solid ${motifColor}`, opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '60px', height: '60px', borderBottom: `3px solid ${motifColor}`, borderLeft: `3px solid ${motifColor}`, opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '60px', height: '60px', borderBottom: `3px solid ${motifColor}`, borderRight: `3px solid ${motifColor}`, opacity: 0.6 }} />
      </div>
    );
  }

  return null;
}

function getConfettiElements() {
  const colors = [B.primary, '#FFD700', '#FFFFFF', '#C4B5FD', '#FF6B9D'];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: 40 }).map((_, i) => {
        const seed = i * 53.7;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${(seed * 29) % 100}%`,
            top: `${(seed * 41) % 100}%`,
            width: `${6 + (seed % 10)}px`,
            height: `${3 + (seed % 6)}px`,
            background: colors[i % colors.length],
            opacity: 0.35 + (i % 5) * 0.08,
            transform: `rotate(${(seed * 47) % 360}deg)`,
            borderRadius: '1px',
          }} />
        );
      })}
    </div>
  );
}

// ─── Poster canvas ────────────────────────────────────────────────────────────
function FestivalCanvas({ preset, form, styleId }) {
  const {
    title = preset.defaultTitle,
    message = preset.defaultMsg,
    date = '',
    time = '',
    venue = '',
    fromName = '',
    fromTitle = '',
    footerText = 'With warm wishes from Team Cars24',
  } = form;

  const isEvent = preset.isEvent;
  const isBoldType = styleId === 'bold-type';
  const isMinimal = styleId === 'minimal';
  const isPhotoCollage = styleId === 'photo-collage';

  return (
    <div
      style={{
        width: '595px',
        height: '842px',
        position: 'relative',
        overflow: 'hidden',
        background: isMinimal ? '#FFFFFF' : preset.bg,
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Background motif / decoration */}
      {styleId === 'traditional' && getMotifElements(preset, styleId)}
      {styleId === 'confetti' && getConfettiElements()}
      {styleId === 'bold-type' && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '-10%', left: '-5%',
            fontSize: '320px', fontWeight: '900', color: 'rgba(255,255,255,0.04)',
            lineHeight: 1, userSelect: 'none', letterSpacing: '-10px',
          }}>
            {preset.emoji}
          </div>
        </div>
      )}
      {styleId === 'photo-collage' && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'rgba(0,0,0,0.55)' }} />
        </div>
      )}

      {/* Minimal style has a brand color band at top */}
      {isMinimal && (
        <div style={{ height: '8px', background: `linear-gradient(90deg, ${B.primary} 0%, ${B.primaryDark} 100%)` }} />
      )}

      {/* Logo — top left, correct variant based on bg */}
      <div style={{
        padding: isMinimal ? '20px 32px 0' : '28px 32px 0',
        position: 'relative',
        zIndex: 2,
      }}>
        <img
          src={import.meta.env.BASE_URL + (isMinimal ? 'cars24-logo-dark.png' : 'cars24-logo-light.png')}
          alt="Cars24"
          style={{ height: '24px', objectFit: 'contain' }}
          crossOrigin="anonymous"
        />
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isEvent ? 'flex-start' : 'center',
        padding: isEvent ? '28px 48px 0' : '32px 48px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
        gap: isEvent ? '12px' : '0',
      }}>

        {/* Emoji / Icon */}
        {!isBoldType && (
          <div style={{ fontSize: isMinimal ? '64px' : '80px', marginBottom: isMinimal ? '16px' : '24px', lineHeight: 1 }}>
            {preset.emoji}
          </div>
        )}

        {/* Title */}
        <h1 style={{
          color: isMinimal ? B.primary : preset.accentColor,
          fontSize: isBoldType ? '72px' : isEvent ? '52px' : '56px',
          fontWeight: '800',
          lineHeight: 1.05,
          margin: 0,
          marginBottom: isEvent ? '8px' : '20px',
          letterSpacing: isBoldType ? '-2px' : '-0.5px',
          textShadow: isMinimal ? 'none' : '0 2px 20px rgba(0,0,0,0.4)',
        }}>
          {title || preset.defaultTitle}
        </h1>

        {/* Event date/time/venue block */}
        {isEvent && (date || time || venue) && (
          <div style={{
            background: isMinimal ? 'rgba(71,54,254,0.08)' : 'rgba(255,255,255,0.1)',
            border: `1px solid ${isMinimal ? B.primary : 'rgba(255,255,255,0.2)'}`,
            borderRadius: '12px',
            padding: '16px 24px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            width: '100%',
            maxWidth: '420px',
          }}>
            {date && (
              <div style={{ color: isMinimal ? '#333' : '#FFFFFF', fontSize: '16px', fontWeight: '600' }}>
                {new Date(date + 'T00:00').toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
            {time && (
              <div style={{ color: isMinimal ? '#555' : 'rgba(255,255,255,0.8)', fontSize: '14px' }}>{time}</div>
            )}
            {venue && (
              <div style={{ color: isMinimal ? '#555' : 'rgba(255,255,255,0.75)', fontSize: '14px' }}>{venue}</div>
            )}
          </div>
        )}

        {/* Message */}
        <p style={{
          color: isMinimal ? '#333333' : 'rgba(255,255,255,0.88)',
          fontSize: isEvent ? '17px' : '18px',
          lineHeight: 1.7,
          margin: 0,
          marginBottom: isEvent ? '0' : '32px',
          maxWidth: '460px',
          fontWeight: '400',
        }}>
          {message || preset.defaultMsg}
        </p>

        {/* Signatory (festival) */}
        {!isEvent && (fromName || fromTitle) && (
          <div style={{ marginTop: '8px' }}>
            {fromName && (
              <div style={{ color: isMinimal ? B.primary : preset.accentColor, fontSize: '15px', fontWeight: '700' }}>
                {fromName}
              </div>
            )}
            {fromTitle && (
              <div style={{ color: isMinimal ? '#666' : 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                {fromTitle}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 32px 24px',
        borderTop: isMinimal ? `1px solid rgba(71,54,254,0.15)` : '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
      }}>
        <span style={{
          color: isMinimal ? '#999' : 'rgba(255,255,255,0.5)',
          fontSize: '12px',
          fontWeight: '500',
          letterSpacing: '0.5px',
        }}>
          {footerText || 'With warm wishes from Team Cars24'}
        </span>
      </div>

      {/* Minimal bottom accent */}
      {isMinimal && (
        <div style={{ height: '4px', background: `linear-gradient(90deg, ${B.primary} 0%, ${B.primaryDark} 100%)` }} />
      )}
    </div>
  );
}

// ─── Input / label styles ─────────────────────────────────────────────────────
const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
  color: '#FFFFFF',
  fontSize: '13px',
  padding: '9px 12px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: "'Inter', sans-serif",
};
const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '80px',
  lineHeight: '1.6',
};
const labelStyle = {
  color: 'rgba(255,255,255,0.5)',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  marginBottom: '6px',
  display: 'block',
  textTransform: 'uppercase',
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function FestivalsCreator({ onBack }) {
  const [selectedPreset, setSelectedPreset] = useState(FESTIVAL_PRESETS[0]);
  const [selectedStyle, setSelectedStyle] = useState(FESTIVAL_STYLES[0]);
  const [form, setForm] = useState({
    title: FESTIVAL_PRESETS[0].defaultTitle,
    message: FESTIVAL_PRESETS[0].defaultMsg,
    date: '',
    time: '',
    venue: '',
    fromName: '',
    fromTitle: '',
    footerText: 'With warm wishes from Team Cars24',
  });
  const [isDownloading, setIsDownloading] = useState(false);

  const exportRef = useRef(null);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setForm(prev => ({
      ...prev,
      title: preset.defaultTitle,
      message: preset.defaultMsg,
    }));
  };

  const getPosterName = () => {
    return `cars24-${selectedPreset.id}-${selectedStyle.id}`.toLowerCase();
  };

  const captureExport = async () => {
    if (!exportRef.current) throw new Error('Export ref not ready');
    return html2canvas(exportRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
  };

  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    try {
      const canvas = await captureExport();
      const link = document.createElement('a');
      link.download = `${getPosterName()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('PNG download failed:', err);
    }
    setIsDownloading(false);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const canvas = await captureExport();
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      pdf.save(`${getPosterName()}.pdf`);
    } catch (err) {
      console.error('PDF download failed:', err);
    }
    setIsDownloading(false);
  };

  const isEvent = selectedPreset.isEvent;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', backgroundColor: B.bg, fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>

      {/* Left sidebar: preset list */}
      <div style={{
        width: '200px',
        flexShrink: 0,
        background: B.surface,
        borderRight: `1px solid ${B.border}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Back + title */}
        <div style={{ padding: '16px', borderBottom: `1px solid ${B.border}` }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '14px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color={B.primary} />
            <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '700' }}>Festivals & Events</span>
          </div>
          <p style={{ color: B.muted, fontSize: '11px', margin: '4px 0 0 0' }}>10 preset templates</p>
        </div>

        {/* Preset list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {FESTIVAL_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePresetSelect(p)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '10px',
                border: selectedPreset.id === p.id
                  ? `1px solid ${B.primary}`
                  : '1px solid transparent',
                background: selectedPreset.id === p.id
                  ? 'rgba(71,54,254,0.15)'
                  : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => {
                if (selectedPreset.id !== p.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseOut={(e) => {
                if (selectedPreset.id !== p.id) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: '20px' }}>{p.emoji}</span>
              <div>
                <div style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: '600' }}>{p.name}</div>
                {p.isEvent && (
                  <div style={{ color: B.muted, fontSize: '10px' }}>Event</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Center: canvas area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 24px',
          borderBottom: `1px solid ${B.border}`,
          background: B.bg,
          flexShrink: 0,
          gap: '16px',
        }}>
          <h1 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', margin: 0, whiteSpace: 'nowrap' }}>
            {selectedPreset.emoji} {selectedPreset.name}
          </h1>

          {/* Style selector */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {FESTIVAL_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStyle(s)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: selectedStyle.id === s.id
                    ? `1px solid ${B.primary}`
                    : '1px solid rgba(255,255,255,0.12)',
                  background: selectedStyle.id === s.id
                    ? 'rgba(71,54,254,0.2)'
                    : 'transparent',
                  color: selectedStyle.id === s.id ? '#FFFFFF' : B.muted,
                  fontSize: '11px',
                  fontWeight: selectedStyle.id === s.id ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Download buttons */}
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={handleDownloadPNG}
              disabled={isDownloading}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: '500',
                cursor: isDownloading ? 'not-allowed' : 'pointer',
                opacity: isDownloading ? 0.6 : 1,
              }}
            >
              <Download size={13} />
              PNG
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px',
                background: `linear-gradient(135deg, ${B.primary} 0%, ${B.primaryDark} 100%)`,
                border: 'none',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: '600',
                cursor: isDownloading ? 'not-allowed' : 'pointer',
                opacity: isDownloading ? 0.6 : 1,
                boxShadow: '0 4px 12px rgba(71,54,254,0.3)',
              }}
            >
              <Download size={13} />
              {isDownloading ? 'Saving...' : 'PDF'}
            </button>
          </div>
        </div>

        {/* Canvas viewport */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#222',
          padding: '32px',
        }}>
          <div style={{
            transform: 'scale(0.55)',
            transformOrigin: 'center center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            borderRadius: '2px',
            flexShrink: 0,
          }}>
            <FestivalCanvas preset={selectedPreset} form={form} styleId={selectedStyle.id} />
          </div>
        </div>
      </div>

      {/* Right sidebar: edit panel */}
      <div style={{
        width: '280px',
        flexShrink: 0,
        background: B.surface,
        borderLeft: `1px solid ${B.border}`,
        overflowY: 'auto',
        padding: '20px 16px',
      }}>
        <p style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 16px 0', paddingBottom: '8px', borderBottom: `1px solid ${B.border}` }}>
          Content
        </p>

        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Title / Headline</label>
          <input
            style={inputStyle}
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder={selectedPreset.defaultTitle}
          />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Message</label>
          <textarea
            style={textareaStyle}
            value={form.message}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder={selectedPreset.defaultMsg}
            rows={4}
          />
        </div>

        {/* Event-specific fields */}
        {isEvent && (
          <>
            <p style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 16px 0', paddingBottom: '8px', borderBottom: `1px solid ${B.border}` }}>
              Event Details
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Date</label>
                <input
                  type="date"
                  style={{ ...inputStyle, fontSize: '12px', colorScheme: 'dark' }}
                  value={form.date}
                  onChange={(e) => updateField('date', e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Time</label>
                <input
                  style={{ ...inputStyle, fontSize: '12px' }}
                  value={form.time}
                  onChange={(e) => updateField('time', e.target.value)}
                  placeholder="3 PM – 5 PM"
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Venue</label>
              <input
                style={inputStyle}
                value={form.venue}
                onChange={(e) => updateField('venue', e.target.value)}
                placeholder="SAS Tower, Sector 39, Gurugram"
              />
            </div>
          </>
        )}

        {/* Festival signatory */}
        {!isEvent && (
          <>
            <p style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 16px 0', paddingBottom: '8px', borderBottom: `1px solid ${B.border}` }}>
              Signatory (optional)
            </p>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Name</label>
              <input
                style={inputStyle}
                value={form.fromName}
                onChange={(e) => updateField('fromName', e.target.value)}
                placeholder="e.g. Vikram Chopra"
              />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Title</label>
              <input
                style={inputStyle}
                value={form.fromTitle}
                onChange={(e) => updateField('fromTitle', e.target.value)}
                placeholder="e.g. CEO & Co-Founder"
              />
            </div>
          </>
        )}

        <p style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 16px 0', paddingBottom: '8px', borderBottom: `1px solid ${B.border}` }}>
          Footer
        </p>
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Footer Line</label>
          <input
            style={inputStyle}
            value={form.footerText}
            onChange={(e) => updateField('footerText', e.target.value)}
            placeholder="With warm wishes from Team Cars24"
          />
        </div>

        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', marginTop: '12px', lineHeight: '1.5' }}>
          Cars24 logo and brand color are locked. Style changes layout and decoration only.
        </p>
      </div>

      {/* Hidden full-size export */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none', zIndex: -1 }}>
        <div ref={exportRef} style={{ width: '595px', height: '842px' }}>
          <FestivalCanvas preset={selectedPreset} form={form} styleId={selectedStyle.id} />
        </div>
      </div>
    </div>
  );
}
