import { forwardRef } from 'react';

// ─── Cars24 brand tokens (used only for event announcements & footer) ──────────
const BRAND = {
  primary:      '#4A35FE',
  primaryLight: '#6B57FF',
  primaryDark:  '#2E1FCC',
  bg:           '#FFFFFF',
  textPrimary:  '#1A1A1A',
  textSecond:   '#4A4A4A',
  headerGrad:   'linear-gradient(135deg, #4A35FE 0%, #6B57FF 100%)',
  bodyWash:     'linear-gradient(180deg, rgba(74,53,254,0.03) 0%, rgba(255,255,255,1) 30%)',
};

const FONT_SANS = "'Inter', 'Segoe UI', system-ui, sans-serif";

const LAYOUT = {
  headerPadH: 40,
  bodyPadH:   56,
  bodyPadHEv: 40,
  footerH:    44,
};

// ─── Date helper ──────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

// ─── Cars24 logo (dark version for light backgrounds) ─────────────────────────
const Cars24LogoDark = () => (
  <>
    <img src="/cars24-logo.png" alt="Cars24"
      style={{ height: '28px', objectFit: 'contain' }}
      onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
    <span style={{ display: 'none', color: '#4A35FE', fontSize: '22px', fontWeight: '800', fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px' }}>Cars24</span>
  </>
);

// ─── Cars24 logo (white version for dark backgrounds) ────────────────────────
const Cars24LogoWhite = () => (
  <>
    <img src="/cars24-logo.png" alt="Cars24"
      style={{ height: '28px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
      onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
    <span style={{ display: 'none', color: '#FFFFFF', fontSize: '22px', fontWeight: '800', fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px' }}>Cars24</span>
  </>
);

// ─── Uploaded image block ─────────────────────────────────────────────────────
const UploadedImageBlock = ({ src }) => {
  if (!src) return null;
  return (
    <div style={{ width: '220px', height: '155px', borderRadius: '8px', overflow: 'hidden',
      flexShrink: 0, alignSelf: 'center', margin: '6px 0 18px 0',
      boxShadow: '0 4px 20px rgba(0,0,0,0.18)' }}>
      <img src={src} alt="Uploaded"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SVG MOTIF COMPONENTS — rich multi-element compositions
// ═══════════════════════════════════════════════════════════════════════════════

// DIWALI — pale purple BG, Cars24 purple diyas cascading sides, gold flame accent, rangoli
const DiwaliMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Rangoli border arcs at bottom */}
    {[0,30,60,90,120,150,180].map((a,i) => {
      const rad = (a * Math.PI) / 180;
      return <circle key={i} cx={297 + Math.cos(rad)*160} cy={800 + Math.sin(rad)*40} r="4"
        fill={accentColor} opacity="0.5" />;
    })}
    {[297,240,354,190,404,150,444].map((x,i) => (
      <circle key={`r${i}`} cx={x} cy={800} r="3" fill={i%2===0?accentColor:accentColor2} opacity="0.45" />
    ))}
    {/* Rangoli petal ring */}
    {Array.from({length:16}).map((_,i) => {
      const a = (i/16)*Math.PI*2;
      return <ellipse key={`re${i}`} cx={297+Math.cos(a)*80} cy={800+Math.sin(a)*25}
        rx="9" ry="4" fill={accentColor} opacity="0.3"
        transform={`rotate(${(i/16)*360},${297+Math.cos(a)*80},${800+Math.sin(a)*25})`} />;
    })}
    {/* Soft purple glow behind centre */}
    <radialGradient id="diwaliGlow" cx="50%" cy="52%" r="45%">
      <stop offset="0%" stopColor={accentColor} stopOpacity="0.10" />
      <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
    </radialGradient>
    <ellipse cx="297" cy="430" rx="200" ry="180" fill="url(#diwaliGlow)" />
    {/* Diyas along both sides — base in Cars24 purple, flame in gold accent */}
    {[
      [50,260],[50,360],[50,460],[50,560],[50,660],
      [545,260],[545,360],[545,460],[545,560],[545,660],
      [100,700],[200,740],[297,760],[394,740],[495,700],
    ].map(([cx,cy],i) => (
      <g key={`d${i}`} transform={`translate(${cx},${cy})`}>
        <ellipse rx="11" ry="6" fill={accentColor} opacity="0.55" />
        <ellipse rx="7" ry="4" cy="-2" fill="#6B57FF" opacity="0.45" />
        <path d={`M0,-7 Q5,-17 0,-24 Q-5,-17 0,-7`} fill={accentColor2} opacity="0.85" />
        <path d={`M0,-9 Q3,-16 0,-21 Q-3,-16 0,-9`} fill="#FFD54F" opacity="0.90" />
        <ellipse cx="0" cy="-14" rx="3" ry="5" fill="rgba(255,210,60,0.20)" />
      </g>
    ))}
    {/* Gold star ornaments at corners */}
    {[[30,180],[565,180],[30,808],[565,808]].map(([x,y],i) => (
      <polygon key={`s${i}`}
        points={`${x},${y-14} ${x+4},${y-4} ${x+14},${y-4} ${x+7},${y+3} ${x+9},${y+14} ${x},${y+8} ${x-9},${y+14} ${x-7},${y+3} ${x-14},${y-4} ${x-4},${y-4}`}
        fill={accentColor} opacity="0.55" />
    ))}
    {/* Dot pattern border (geometric) */}
    {[30,70,110,150,190].map((y,i) =>
      [30,565].map((x,j) => (
        <circle key={`dot${i}${j}`} cx={x} cy={y} r="2.5" fill={accentColor} opacity="0.25" />
      ))
    )}
    {/* Horizontal gold line borders */}
    <line x1="30" y1="170" x2="565" y2="170" stroke={accentColor} strokeWidth="1.5" opacity="0.2" />
    <line x1="30" y1="175" x2="565" y2="175" stroke={accentColor} strokeWidth="0.5" opacity="0.12" />
    <line x1="30" y1="820" x2="565" y2="820" stroke={accentColor} strokeWidth="1.5" opacity="0.2" />
  </svg>
);

// HOLI — pale-purple BG, purple-dominant splashes, magenta/yellow festival accents
const HoliMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Large corner splashes — 70% purple tones */}
    <ellipse cx="0" cy="200" rx="130" ry="100" fill={accentColor} opacity="0.14" transform="rotate(-20,0,200)" />
    <ellipse cx="595" cy="200" rx="120" ry="90" fill="#6B57FF" opacity="0.12" transform="rotate(20,595,200)" />
    <ellipse cx="0" cy="650" rx="140" ry="105" fill={accentColor} opacity="0.12" transform="rotate(15,0,650)" />
    <ellipse cx="595" cy="650" rx="130" ry="95" fill="#8B7BFF" opacity="0.12" transform="rotate(-15,595,650)" />
    <ellipse cx="297" cy="700" rx="160" ry="70" fill={accentColor} opacity="0.08" />
    {/* Mid splashes — mix of purple + magenta accents */}
    <ellipse cx="60" cy="420" rx="70" ry="55" fill={accentColor} opacity="0.10" transform="rotate(-10)" />
    <ellipse cx="535" cy="440" rx="65" ry="50" fill={accentColor2} opacity="0.10" transform="rotate(10)" />
    <ellipse cx="150" cy="120" rx="80" ry="50" fill={accentColor} opacity="0.12" />
    <ellipse cx="445" cy="110" rx="75" ry="48" fill="#8B7BFF" opacity="0.10" />
    {/* Paint drip blobs — top — purple dominant, magenta accent */}
    {[40,100,180,260,340,420,500,570].map((x,i) => {
      const colors = [accentColor,'#6B57FF',accentColor,'#8B7BFF',accentColor2,accentColor,'#6B57FF',accentColor2];
      const h = 18 + (i%3)*8;
      return (
        <g key={`drip${i}`}>
          <rect x={x-8} y={0} width={16} height={h} rx="8" fill={colors[i]} opacity="0.25" />
          <ellipse cx={x} cy={h} rx="9" ry="7" fill={colors[i]} opacity="0.25" />
        </g>
      );
    })}
    {/* Scattered powder circles — purple dominant, magenta accent */}
    {[[80,300],[515,280],[40,580],[555,590],[180,760],[415,750],[100,480],[490,460],[250,650],[350,660]].map(([x,y],i) => (
      <circle key={`pw${i}`} cx={x} cy={y} r={14+i*3}
        fill={[accentColor,'#6B57FF',accentColor2,accentColor,'#8B7BFF',accentColor,'#6B57FF',accentColor2,accentColor,'#8B7BFF'][i]}
        opacity="0.16" />
    ))}
    {/* Small dots scattered — purple tones */}
    {Array.from({length:20}).map((_,i) => (
      <circle key={`sd${i}`} cx={30+(i*179)%535} cy={200+(i*113)%580}
        r={4+(i%4)} fill={[accentColor,'#6B57FF',accentColor2,'#8B7BFF'][i%4]} opacity="0.20" />
    ))}
  </svg>
);

// EID — emerald/teal BG, crescent, stars, geometric border
const EidMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Geometric border — Islamic tile pattern */}
    <rect x="18" y="168" width="559" height="656" rx="4" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.25" />
    <rect x="26" y="176" width="543" height="640" rx="2" fill="none" stroke={accentColor} strokeWidth="0.7" opacity="0.15" />
    {/* Corner diamonds */}
    {[[18,168],[577,168],[18,824],[577,824]].map(([x,y],i) => (
      <g key={`cd${i}`} transform={`translate(${x},${y})`}>
        <polygon points="0,-20 12,0 0,20 -12,0" fill={accentColor} opacity="0.35" />
        <polygon points="0,-12 7,0 0,12 -7,0" fill={accentColor} opacity="0.5" />
      </g>
    ))}
    {/* Large crescent moon — centre-top of body, purple with cutout matching bg */}
    <g transform="translate(297, 370)" opacity="0.22">
      <circle cx="-10" cy="0" r="62" fill={accentColor} />
      <circle cx="24" cy="0" r="52" fill="#F0EEFF" />
    </g>
    {/* Stars around crescent */}
    {[[297,300],[340,325],[255,318],[297,255],[335,260],[260,263]].map(([x,y],i) => (
      <polygon key={`st${i}`}
        points={`${x},${y-9} ${x+2.5},${y-3} ${x+9},${y-3} ${x+4},${y+2} ${x+6},${y+9} ${x},${y+5} ${x-6},${y+9} ${x-4},${y+2} ${x-9},${y-3} ${x-2.5},${y-3}`}
        fill={accentColor} opacity={0.4 - i*0.04} />
    ))}
    {/* Repeating geometric tile row — top */}
    {[50,110,170,230,290,350,410,470,530].map((x,i) => (
      <g key={`tile${i}`} transform={`translate(${x},196)`} opacity="0.2">
        <polygon points="0,-10 8,0 0,10 -8,0" fill={accentColor} />
        <polygon points="0,-5 4,0 0,5 -4,0" fill="none" stroke={accentColor} strokeWidth="0.8" />
      </g>
    ))}
    {/* Repeating geometric tile row — bottom */}
    {[50,110,170,230,290,350,410,470,530].map((x,i) => (
      <g key={`tileb${i}`} transform={`translate(${x},804)`} opacity="0.2">
        <polygon points="0,-10 8,0 0,10 -8,0" fill={accentColor} />
      </g>
    ))}
    {/* Lanterns */}
    {[[70,560],[525,560],[170,680],[425,680]].map(([x,y],i) => (
      <g key={`lan${i}`} transform={`translate(${x},${y})`} opacity="0.22">
        <rect x="-10" y="-28" width="20" height="38" rx="4" fill="none" stroke={accentColor} strokeWidth="1.5" />
        <line x1="0" y1="-28" x2="0" y2="-38" stroke={accentColor} strokeWidth="1.5" />
        <ellipse cx="0" cy="-10" rx="5" ry="6" fill={accentColor} opacity="0.35" />
        <line x1="-10" y1="10" x2="-14" y2="18" stroke={accentColor} strokeWidth="1" />
        <line x1="10" y1="10" x2="14" y2="18" stroke={accentColor} strokeWidth="1" />
      </g>
    ))}
  </svg>
);

// CHRISTMAS — pale purple BG, Cars24 purple snowflakes + pine, red berry accents
const ChristmasMotif = ({ accentColor, secondaryColor }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Pine branches — bottom corners, Cars24 purple */}
    {[
      [0, 842, 1], [595, 842, -1]
    ].map(([bx, by, flip], bi) => (
      <g key={`branch${bi}`} transform={`translate(${bx},${by}) scale(${flip},1)`} opacity="0.28">
        <ellipse cx="30" cy="-30" rx="35" ry="14" fill={accentColor} transform="rotate(-35,30,-30)" />
        <ellipse cx="10" cy="-55" rx="30" ry="12" fill={accentColor} transform="rotate(-45,10,-55)" />
        <ellipse cx="55" cy="-12" rx="40" ry="14" fill="#6B57FF" transform="rotate(-20,55,-12)" />
        <ellipse cx="70" cy="-45" rx="32" ry="12" fill={accentColor} transform="rotate(-30,70,-45)" />
        {/* Red berries — festival accent, small */}
        <circle cx="22" cy="-46" r="5" fill={secondaryColor} opacity="0.85" />
        <circle cx="35" cy="-52" r="5" fill={secondaryColor} opacity="0.85" />
        <circle cx="14" cy="-40" r="4" fill={secondaryColor} opacity="0.85" />
      </g>
    ))}
    {/* Top corner pine sprigs */}
    {[
      [0, 168, 1], [595, 168, -1]
    ].map(([bx, by, flip], bi) => (
      <g key={`topbranch${bi}`} transform={`translate(${bx},${by}) scale(${flip},1)`} opacity="0.22">
        <ellipse cx="30" cy="20" rx="32" ry="12" fill={accentColor} transform="rotate(35,30,20)" />
        <ellipse cx="60" cy="10" rx="28" ry="11" fill="#6B57FF" transform="rotate(20,60,10)" />
        <circle cx="42" cy="28" r="4" fill={secondaryColor} opacity="0.9" />
        <circle cx="55" cy="22" r="4" fill={secondaryColor} opacity="0.9" />
      </g>
    ))}
    {/* Christmas tree silhouette — faint purple backdrop */}
    <g transform="translate(297, 560)" opacity="0.05">
      <polygon points="0,-100 -60,20 60,20" fill={accentColor} />
      <polygon points="0,-60 -80,50 80,50" fill={accentColor} />
      <polygon points="0,-20 -100,80 100,80" fill={accentColor} />
      <rect x="-14" y="80" width="28" height="22" fill="#2E1FCC" />
    </g>
    {/* Snowflakes — Cars24 purple (most) + a few red accents */}
    {[
      [80,220,16],[515,240,14],[150,300,10],[445,280,12],
      [60,450,18],[535,430,14],[200,540,10],[395,560,12],
      [100,680,12],[490,670,10],[250,740,8],[345,730,10],
      [297,350,20],[40,350,8],[555,350,8],[180,180,9],[410,185,9],
    ].map(([x,y,sz],i) => {
      const snowColor = i < 4 ? secondaryColor : (i < 6 ? '#8B7BFF' : accentColor);
      return (
      <g key={`snow${i}`} transform={`translate(${x},${y})`} opacity="0.22">
        {[0,30,60,90,120,150].map(a => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1="0" y1={-sz} x2="0" y2={sz} stroke={snowColor} strokeWidth="1.2" />
            <line x1={-sz*0.5} y1={-sz*0.6} x2={sz*0.5} y2={sz*0.6} stroke={snowColor} strokeWidth="1" />
            <line x1={-sz*0.4} y1={0} x2={-sz*0.8} y2={-sz*0.35} stroke={snowColor} strokeWidth="0.9" />
            <line x1={sz*0.4} y1={0} x2={sz*0.8} y2={sz*0.35} stroke={snowColor} strokeWidth="0.9" />
          </g>
        ))}
        <circle cx="0" cy="0" r="2" fill={snowColor} opacity="0.5" />
      </g>
      );
    })}
    {/* Cars24 purple accent lines at top/bottom */}
    <path d="M 0 165 Q 150 185 297 168 Q 445 152 595 165" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.15" />
    <path d="M 0 840 Q 150 820 297 840 Q 445 856 595 840" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.15" />
  </svg>
);

// NEW YEAR — pale purple BG, Cars24 purple fireworks + confetti, gold accent
const NewYearMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Fireworks bursts — purple primary, gold accent */}
    {[
      [100,280,28,accentColor],[500,260,24,'#6B57FF'],
      [60,480,20,accentColor],[530,500,22,'#8B7BFF'],
      [200,600,18,accentColor2],[390,580,20,accentColor],
      [297,330,32,accentColor],
    ].map(([cx,cy,sz,col],i) => {
      const rays = 12 + i*2;
      return (
        <g key={`fw${i}`} transform={`translate(${cx},${cy})`} opacity="0.28">
          {Array.from({length:rays}).map((_,r) => {
            const a = (r/rays)*Math.PI*2;
            const inner = sz*0.3;
            return (
              <g key={r}>
                <line x1={Math.cos(a)*inner} y1={Math.sin(a)*inner}
                  x2={Math.cos(a)*sz} y2={Math.sin(a)*sz}
                  stroke={col} strokeWidth="1.5" />
                <circle cx={Math.cos(a)*sz} cy={Math.sin(a)*sz} r="2" fill={col} />
              </g>
            );
          })}
          <circle cx="0" cy="0" r="4" fill={col} opacity="0.8" />
        </g>
      );
    })}
    {/* Confetti squares — purple dominant */}
    {Array.from({length:35}).map((_,i) => (
      <rect key={`cf${i}`}
        x={(i*97+30)%535} y={180+(i*137)%620}
        width={4+(i%3)*2} height={4+(i%3)*2}
        fill={[accentColor,'#6B57FF',accentColor2,'#8B7BFF',accentColor][i%5]}
        opacity="0.22" transform={`rotate(${i*37})`} />
    ))}
    {/* Champagne circles — gold accent bubbles */}
    {Array.from({length:15}).map((_,i) => (
      <circle key={`bub${i}`}
        cx={260+(i%4)*25} cy={700-(i*40)%320}
        r={3+(i%3)} fill={accentColor2} opacity="0.25" />
    ))}
    {/* Clock face centre — faint Cars24 purple */}
    <g transform="translate(297, 430)" opacity="0.08">
      <circle cx="0" cy="0" r="50" fill="none" stroke={accentColor} strokeWidth="2.5" />
      <circle cx="0" cy="0" r="44" fill="none" stroke={accentColor} strokeWidth="1" />
      {Array.from({length:12}).map((_,i) => {
        const a = (i/12)*Math.PI*2 - Math.PI/2;
        return <line key={i} x1={Math.cos(a)*38} y1={Math.sin(a)*38}
          x2={Math.cos(a)*44} y2={Math.sin(a)*44}
          stroke={accentColor} strokeWidth="2" />;
      })}
      <line x1="0" y1="0" x2="0" y2="-30" stroke={accentColor} strokeWidth="3" />
      <line x1="0" y1="0" x2="22" y2="0" stroke={accentColor} strokeWidth="2" />
      <circle cx="0" cy="0" r="4" fill={accentColor} />
    </g>
    {/* Star dust dots — purple */}
    {[[40,220],[555,210],[80,700],[510,680],[180,170],[415,175]].map(([x,y],i) => (
      <polygon key={`sd2${i}`}
        points={`${x},${y-7} ${x+2},${y-2} ${x+7},${y-2} ${x+3},${y+1} ${x+4},${y+7} ${x},${y+4} ${x-4},${y+7} ${x-3},${y+1} ${x-7},${y-2} ${x-2},${y-2}`}
        fill={accentColor} opacity="0.28" />
    ))}
  </svg>
);

// INDEPENDENCE DAY — pale purple BG, Cars24 purple Chakra, saffron/green tricolour accents
const IndependenceMotif = ({ accentColor, accentColor2, secondaryColor }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Large Ashoka Chakra — Cars24 purple */}
    <g transform="translate(297, 430)" opacity="0.12">
      <circle cx="0" cy="0" r="130" fill="none" stroke={accentColor} strokeWidth="6" />
      <circle cx="0" cy="0" r="110" fill="none" stroke={accentColor} strokeWidth="2" />
      <circle cx="0" cy="0" r="18" fill={accentColor} />
      {Array.from({length:24}).map((_,i) => {
        const a = (i/24)*Math.PI*2;
        return (
          <g key={i}>
            <line x1={Math.cos(a)*20} y1={Math.sin(a)*20}
              x2={Math.cos(a)*108} y2={Math.sin(a)*108}
              stroke={accentColor} strokeWidth="2" />
            <circle cx={Math.cos(a)*108} cy={Math.sin(a)*108} r="3" fill={accentColor} />
          </g>
        );
      })}
    </g>
    {/* Star decorations — corners, purple */}
    {[[30,185],[565,185],[30,812],[565,812]].map(([x,y],i) => (
      <polygon key={`ist${i}`}
        points={`${x},${y-10} ${x+3},${y-3} ${x+10},${y-3} ${x+4},${y+2} ${x+6},${y+10} ${x},${y+6} ${x-6},${y+10} ${x-4},${y+2} ${x-10},${y-3} ${x-3},${y-3}`}
        fill={accentColor} opacity="0.45" />
    ))}
    {/* Tricolour ribbon bands — saffron/white/green as festival accents on sides */}
    <rect x="20" y="168" width="8" height="30" rx="3" fill={accentColor2} opacity="0.55" />
    <rect x="20" y="198" width="8" height="30" rx="3" fill="#FFFFFF" opacity="0.5" />
    <rect x="20" y="228" width="8" height="30" rx="3" fill={secondaryColor} opacity="0.55" />
    <rect x="567" y="168" width="8" height="30" rx="3" fill={accentColor2} opacity="0.55" />
    <rect x="567" y="198" width="8" height="30" rx="3" fill="#FFFFFF" opacity="0.5" />
    <rect x="567" y="228" width="8" height="30" rx="3" fill={secondaryColor} opacity="0.55" />
    {/* India Gate silhouette — Cars24 purple */}
    <g transform="translate(297, 750)" opacity="0.10">
      <rect x="-4" y="-90" width="8" height="90" fill={accentColor} />
      <path d="M -35 0 Q -35 -50 0 -90 Q 35 -50 35 0 Z" fill="none" stroke={accentColor} strokeWidth="3" />
      <rect x="-40" y="0" width="80" height="8" fill={accentColor} />
      <rect x="-55" y="8" width="110" height="10" fill={accentColor} />
      <rect x="-6" y="-100" width="12" height="8" fill={accentColor} />
    </g>
    {/* Dotted border — purple */}
    {Array.from({length:18}).map((_,i) => (
      <circle key={`idb${i}`} cx={50+i*28} cy={185} r="2" fill={accentColor} opacity="0.18" />
    ))}
    {Array.from({length:18}).map((_,i) => (
      <circle key={`idb2${i}`} cx={50+i*28} cy={820} r="2" fill={accentColor} opacity="0.18" />
    ))}
  </svg>
);

// REPUBLIC DAY — pale purple BG, Cars24 purple Chakra + India Gate, tricolour accents
const RepublicMotif = ({ accentColor, accentColor2, secondaryColor }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Gold border frame */}
    <rect x="20" y="168" width="555" height="656" rx="6" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.3" />
    <rect x="28" y="176" width="539" height="640" rx="4" fill="none" stroke={accentColor} strokeWidth="0.8" opacity="0.18" />
    {/* Corner ornaments */}
    {[[20,168],[575,168],[20,824],[575,824]].map(([x,y],i) => (
      <g key={`ro${i}`} transform={`translate(${x},${y})`} opacity="0.4">
        <circle cx="0" cy="0" r="8" fill={accentColor} opacity="0.5" />
        <circle cx="0" cy="0" r="4" fill={accentColor} />
      </g>
    ))}
    {/* Ashoka Chakra — Cars24 purple */}
    <g transform="translate(297, 430)" opacity="0.1">
      <circle cx="0" cy="0" r="110" fill="none" stroke={accentColor} strokeWidth="5" />
      <circle cx="0" cy="0" r="93" fill="none" stroke={accentColor} strokeWidth="1.5" />
      <circle cx="0" cy="0" r="16" fill={accentColor} />
      {Array.from({length:24}).map((_,i) => {
        const a = (i/24)*Math.PI*2;
        return <line key={i} x1={Math.cos(a)*18} y1={Math.sin(a)*18}
          x2={Math.cos(a)*91} y2={Math.sin(a)*91}
          stroke={accentColor} strokeWidth="2.5" />;
      })}
    </g>
    {/* India Gate — Cars24 purple */}
    <g transform="translate(297, 760)" opacity="0.12">
      <rect x="-5" y="-100" width="10" height="100" fill={accentColor} />
      <path d="M -40 0 Q -40 -60 0 -100 Q 40 -60 40 0 Z" fill="none" stroke={accentColor} strokeWidth="4" />
      <rect x="-50" y="0" width="100" height="10" fill={accentColor} />
      <rect x="-65" y="10" width="130" height="12" fill={accentColor} />
      <rect x="-8" y="-112" width="16" height="10" fill={accentColor} />
    </g>
    {/* Tricolour stripe accents */}
    {[[0,1],[1,0]].map((_,side) => (
      <g key={`ts${side}`} transform={`translate(${side===0?20:567},400)`} opacity="0.35">
        <rect x="0" y="-30" width="8" height="20" rx="2" fill={accentColor2} />
        <rect x="0" y="-10" width="8" height="20" rx="2" fill="#FFFFFF" opacity="0.8" />
        <rect x="0" y="10" width="8" height="20" rx="2" fill={secondaryColor || '#138808'} />
      </g>
    ))}
    {/* Stars at top */}
    {[100,200,297,394,494].map((x,i) => (
      <polygon key={`rs${i}`}
        points={`${x},${185} ${x+3},${192} ${x+10},${192} ${x+5},${196} ${x+7},${203} ${x},${199} ${x-7},${203} ${x-5},${196} ${x-10},${192} ${x-3},${192}`}
        fill={accentColor} opacity="0.3" />
    ))}
  </svg>
);

// RAKSHA BANDHAN — warm pink/gold, rakhi, floral corners, ribbons
const RakhiMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Floral corner motifs */}
    {[[0,168,1,1],[595,168,-1,1],[0,842,1,-1],[595,842,-1,-1]].map(([x,y,sx,sy],i) => (
      <g key={`flc${i}`} transform={`translate(${x},${y}) scale(${sx},${sy})`} opacity="0.3">
        {[0,60,120,180,240,300].map(a => {
          const rad = (a*Math.PI)/180;
          return <ellipse key={a} cx={Math.cos(rad)*22} cy={Math.sin(rad)*22}
            rx="14" ry="6" fill={accentColor}
            transform={`rotate(${a},${Math.cos(rad)*22},${Math.sin(rad)*22})`} />;
        })}
        <circle cx="0" cy="0" r="6" fill={accentColor2} opacity="0.7" />
      </g>
    ))}
    {/* Thread — horizontal wavy band */}
    <path d="M 0 400 Q 75 385 150 400 Q 225 415 300 400 Q 375 385 450 400 Q 525 415 595 400"
      fill="none" stroke={accentColor} strokeWidth="2.5" opacity="0.2" strokeDasharray="8,4" />
    <path d="M 0 408 Q 75 393 150 408 Q 225 423 300 408 Q 375 393 450 408 Q 525 423 595 408"
      fill="none" stroke={accentColor2} strokeWidth="1.5" opacity="0.15" strokeDasharray="6,6" />
    {/* Rakhi medallion centre */}
    <g transform="translate(297, 420)" opacity="0.2">
      <circle cx="0" cy="0" r="36" fill="none" stroke={accentColor} strokeWidth="2.5" />
      <circle cx="0" cy="0" r="24" fill={accentColor} opacity="0.25" />
      <circle cx="0" cy="0" r="12" fill={accentColor2} opacity="0.4" />
      {Array.from({length:8}).map((_,i) => {
        const a = (i/8)*Math.PI*2;
        return <ellipse key={i} cx={Math.cos(a)*30} cy={Math.sin(a)*30}
          rx="7" ry="4" fill={accentColor}
          transform={`rotate(${(i/8)*360},${Math.cos(a)*30},${Math.sin(a)*30})`} />;
      })}
    </g>
    {/* Scattered flowers */}
    {[[70,300],[525,290],[80,620],[515,610],[160,740],[435,745]].map(([x,y],i) => (
      <g key={`fl${i}`} transform={`translate(${x},${y})`} opacity="0.2">
        {[0,72,144,216,288].map(a => {
          const rad = (a*Math.PI)/180;
          return <ellipse key={a} cx={Math.cos(rad)*9} cy={Math.sin(rad)*9}
            rx="7" ry="4" fill={i%2===0?accentColor:accentColor2}
            transform={`rotate(${a},${Math.cos(rad)*9},${Math.sin(rad)*9})`} />;
        })}
        <circle cx="0" cy="0" r="3" fill={accentColor2} opacity="0.7" />
      </g>
    ))}
    {/* Dot border top & bottom */}
    {Array.from({length:20}).map((_,i) => (
      <circle key={`rd${i}`} cx={30+i*27} cy={182} r="2.5"
        fill={i%2===0?accentColor:accentColor2} opacity="0.3" />
    ))}
    {Array.from({length:20}).map((_,i) => (
      <circle key={`rd2${i}`} cx={30+i*27} cy={825} r="2.5"
        fill={i%2===0?accentColor:accentColor2} opacity="0.3" />
    ))}
  </svg>
);

// GANESH CHATURTHI — saffron BG, Om, marigolds, modak
const GaneshMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Large Om symbol backdrop */}
    <text x="297" y="480" textAnchor="middle" fontSize="200" fill={accentColor} opacity="0.1" fontFamily="serif">ॐ</text>
    {/* Marigold flowers — corners and sides */}
    {[[40,200],[555,200],[40,800],[555,800],[297,790],[100,750],[494,750]].map(([x,y],i) => (
      <g key={`mg${i}`} transform={`translate(${x},${y})`} opacity="0.3">
        {[0,36,72,108,144,180,216,252,288,324].map(a => {
          const rad = (a*Math.PI)/180;
          return <ellipse key={a} cx={Math.cos(rad)*12} cy={Math.sin(rad)*12}
            rx="10" ry="4" fill={i%2===0?accentColor:accentColor2}
            transform={`rotate(${a},${Math.cos(rad)*12},${Math.sin(rad)*12})`} />;
        })}
        <circle cx="0" cy="0" r="5" fill={accentColor2} />
      </g>
    ))}
    {/* Modak shapes at bottom */}
    {[100,200,297,394,494].map((x,i) => (
      <g key={`mod${i}`} transform={`translate(${x},800)`} opacity="0.2">
        <path d="M 0 -20 Q 18 -15 18 5 Q 18 20 0 22 Q -18 20 -18 5 Q -18 -15 0 -20 Z" fill={accentColor} />
        <path d="M -6 -20 Q 0 -28 6 -20" fill="none" stroke={accentColor} strokeWidth="2" />
      </g>
    ))}
    {/* Decorative border arcs */}
    <path d="M 20 180 Q 50 168 80 180" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.3" />
    <path d="M 515 180 Q 545 168 575 180" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.3" />
    <line x1="30" y1="175" x2="565" y2="175" stroke={accentColor} strokeWidth="1" opacity="0.2" />
    <line x1="30" y1="820" x2="565" y2="820" stroke={accentColor} strokeWidth="1" opacity="0.2" />
    {/* Side dots */}
    {[250,300,350,400,450,500,550,600,650,700,750].map((y,i) => (
      <g key={`sgd${i}`}>
        <circle cx="25" cy={y} r="2" fill={accentColor} opacity="0.2" />
        <circle cx="570" cy={y} r="2" fill={accentColor} opacity="0.2" />
      </g>
    ))}
  </svg>
);

// DUSSEHRA — orange BG, bow and arrow, flames
const DussehraMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Bow and arrow — large backdrop */}
    <g transform="translate(297, 430)" opacity="0.12">
      <path d="M -50 -80 Q -80 0 -50 80" fill="none" stroke={accentColor} strokeWidth="5" />
      <line x1="-50" y1="-80" x2="-50" y2="80" stroke={accentColor} strokeWidth="2" />
      <line x1="-46" y1="-60" x2="80" y2="0" stroke={accentColor} strokeWidth="3" />
      <polygon points="80,0 65,-8 68,0 65,8" fill={accentColor} />
      <line x1="-46" y1="60" x2="80" y2="0" stroke={accentColor} strokeWidth="3" />
    </g>
    {/* Flame trio at bottom */}
    {[[120,800],[297,780],[474,800]].map(([x,y],i) => (
      <g key={`fl${i}`} transform={`translate(${x},${y})`} opacity="0.3">
        <path d={`M0,-50 Q14,-35 12,-15 Q20,-28 18,0 Q10,-10 0,10 Q-10,-10 -18,0 Q-20,-28 -12,-15 Q-14,-35 0,-50Z`}
          fill="#FF4500" />
        <path d={`M0,-35 Q9,-22 8,-5 Q0,5 -8,-5 Q-9,-22 0,-35Z`} fill="#FFD700" />
        <ellipse cx="0" cy="5" rx="18" ry="8" fill="#8B4513" opacity="0.5" />
      </g>
    ))}
    {/* Star ornaments */}
    {[[40,190],[555,190],[40,810],[555,810],[160,250],[435,245]].map(([x,y],i) => (
      <polygon key={`ds${i}`}
        points={`${x},${y-10} ${x+3},${y-3} ${x+10},${y-3} ${x+4},${y+2} ${x+6},${y+10} ${x},${y+6} ${x-6},${y+10} ${x-4},${y+2} ${x-10},${y-3} ${x-3},${y-3}`}
        fill={accentColor2} opacity="0.35" />
    ))}
    {/* Gold border lines */}
    <line x1="30" y1="178" x2="565" y2="178" stroke={accentColor2} strokeWidth="2" opacity="0.25" />
    <line x1="30" y1="824" x2="565" y2="824" stroke={accentColor2} strokeWidth="2" opacity="0.25" />
    {/* Side dots */}
    {[280,320,360,400,440,480,520,560,600].map((y,i) => (
      <g key={`dsd${i}`}>
        <circle cx="28" cy={y} r="2.5" fill={accentColor2} opacity="0.2" />
        <circle cx="567" cy={y} r="2.5" fill={accentColor2} opacity="0.2" />
      </g>
    ))}
  </svg>
);

// NAVRATRI — pale purple BG, Cars24 purple garba silhouettes, magenta dandiya accent
const NavratriMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Dancing garba circle silhouettes — Cars24 purple */}
    {Array.from({length:8}).map((_,i) => {
      const a = (i/8)*Math.PI*2;
      const cx = 297 + Math.cos(a)*120;
      const cy = 430 + Math.sin(a)*80;
      return (
        <g key={`garba${i}`} transform={`translate(${cx},${cy})`} opacity="0.22">
          <ellipse cx="0" cy="12" rx="10" ry="18" fill={accentColor} />
          <circle cx="0" cy="-14" r="7" fill={accentColor} />
          <line x1="-12" y1="5" x2="-22" y2="-5" stroke={accentColor} strokeWidth="2" />
          <line x1="12" y1="5" x2="22" y2="-5" stroke={accentColor} strokeWidth="2" />
          <line x1="-5" y1="30" x2="-10" y2="50" stroke={accentColor} strokeWidth="2" />
          <line x1="5" y1="30" x2="10" y2="50" stroke={accentColor} strokeWidth="2" />
        </g>
      );
    })}
    {/* Dandiya sticks — corners: Cars24 purple body, magenta tip accent */}
    {[[60,200,-30],[535,200,30],[60,760,20],[535,760,-20]].map(([x,y,rot],i) => (
      <g key={`dan${i}`} transform={`translate(${x},${y}) rotate(${rot})`} opacity="0.28">
        <rect x="-4" y="-55" width="8" height="110" rx="4" fill={i%2===0?accentColor:'#6B57FF'} />
        <circle cx="0" cy="-58" r="8" fill={i%2===0?accentColor2:accentColor} />
        <circle cx="0" cy="58" r="8" fill={i%2===0?accentColor2:accentColor} />
      </g>
    ))}
    {/* Border dots — Cars24 purple with magenta pops */}
    {Array.from({length:22}).map((_,i) => (
      <circle key={`nbd${i}`} cx={25+i*25} cy={178} r="4"
        fill={i%4===3?accentColor2:accentColor} opacity="0.35" />
    ))}
    {Array.from({length:22}).map((_,i) => (
      <circle key={`nbd2${i}`} cx={25+i*25} cy={824} r="4"
        fill={i%4===3?accentColor2:accentColor} opacity="0.35" />
    ))}
    {/* Central mandala rings — Cars24 purple */}
    {[30,50,70,90,110].map((r,i) => (
      <circle key={`nm${i}`} cx="297" cy="430" r={r} fill="none"
        stroke={i===4?accentColor2:accentColor}
        strokeWidth="1" opacity="0.12" />
    ))}
  </svg>
);

// ONAM — green, pookalam (flower rangoli), snake-boat, Kerala green
const OnamMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Pookalam base — concentric rings with petals */}
    <g transform="translate(297, 720)" opacity="0.3">
      {[8,20,35,52,68].map(r => (
        <circle key={r} cx="0" cy="0" r={r} fill="none" stroke={accentColor} strokeWidth="1.5" />
      ))}
      {Array.from({length:16}).map((_,i) => {
        const a = (i/16)*Math.PI*2;
        return <circle key={i} cx={Math.cos(a)*72} cy={Math.sin(a)*72} r="5"
          fill={['#FFD700','#FF6B00','#FF1493','#CC0066'][i%4]} opacity="0.7" />;
      })}
      {Array.from({length:8}).map((_,i) => {
        const a = (i/8)*Math.PI*2;
        return <ellipse key={`op${i}`} cx={Math.cos(a)*54} cy={Math.sin(a)*54}
          rx="10" ry="5" fill={accentColor2}
          transform={`rotate(${(i/8)*360},${Math.cos(a)*54},${Math.sin(a)*54})`} opacity="0.7" />;
      })}
      <circle cx="0" cy="0" r="8" fill="#FF6B00" opacity="0.7" />
    </g>
    {/* Banana leaves — sides */}
    {[[30,420,-15],[565,420,15],[30,600,-10],[565,600,10]].map(([x,y,rot],i) => (
      <g key={`leaf${i}`} transform={`translate(${x},${y}) rotate(${rot})`} opacity="0.22">
        <ellipse cx="0" cy="0" rx="16" ry="60" fill={accentColor} />
        <line x1="0" y1="-60" x2="0" y2="60" stroke="#006400" strokeWidth="2" />
        {[-40,-20,0,20,40].map(ly => (
          <line key={ly} x1="0" y1={ly} x2={i%2===0?14:-14} y2={ly+8}
            stroke="#006400" strokeWidth="1" opacity="0.6" />
        ))}
      </g>
    ))}
    {/* Snake boat silhouette */}
    <g transform="translate(297, 320)" opacity="0.1">
      <path d="M -130 20 Q -100 -5 0 -15 Q 100 -25 130 10 Q 120 25 100 25 Q 0 15 -100 25 Q -120 25 -130 20 Z"
        fill={accentColor} />
      {Array.from({length:12}).map((_,i) => (
        <line key={i} x1={-110+i*20} y1={15} x2={-105+i*20} y2={-30}
          stroke={accentColor} strokeWidth="1.5" opacity="0.8" />
      ))}
    </g>
    {/* Flower dot border */}
    {Array.from({length:18}).map((_,i) => (
      <circle key={`ob${i}`} cx={30+i*30} cy={184} r="3"
        fill={['#FFD700','#FF6B00','#FF1493',accentColor][i%4]} opacity="0.3" />
    ))}
    {Array.from({length:18}).map((_,i) => (
      <circle key={`ob2${i}`} cx={30+i*30} cy={820} r="3"
        fill={['#FFD700','#FF6B00','#FF1493',accentColor][i%4]} opacity="0.3" />
    ))}
  </svg>
);

// PONGAL — harvest yellow, pongal pot, sugarcane, kolam
const PongalMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Pongal pot — centred, prominent */}
    <g transform="translate(297, 680)" opacity="0.28">
      <rect x="-32" y="-40" width="64" height="65" rx="10" fill={accentColor} />
      <ellipse cx="0" cy="-40" rx="36" ry="13" fill={accentColor} />
      <ellipse cx="0" cy="-53" rx="26" ry="16" fill={accentColor} opacity="0.8" />
      {[[-18,-58],[-8,-65],[2,-63],[12,-60],[22,-57],[-24,-52],[24,-54]].map(([dx,dy],i) => (
        <circle key={i} cx={dx} cy={dy} r="4" fill="white" opacity="0.7" />
      ))}
      <path d="M -36 10 L -40 30 L -28 30" fill="none" stroke={accentColor2} strokeWidth="2" opacity="0.7" />
      <path d="M 36 10 L 40 30 L 28 30" fill="none" stroke={accentColor2} strokeWidth="2" opacity="0.7" />
    </g>
    {/* Sugarcane stalks — sides */}
    {[[45,750,1],[550,750,-1]].map(([x,y,flip],i) => (
      <g key={`cane${i}`} transform={`translate(${x},${y}) scale(${flip},1)`} opacity="0.22">
        <rect x="-4" y="-280" width="8" height="280" rx="4" fill="#228B22" />
        {[-240,-200,-160,-120,-80,-40,0].map(cy => (
          <ellipse key={cy} cx="14" cy={cy} rx="16" ry="6" fill="#228B22" transform="rotate(-25)" />
        ))}
      </g>
    ))}
    {/* Kolam (rangoli) border dots */}
    {Array.from({length:20}).map((_,i) => (
      <circle key={`kb${i}`} cx={30+i*27} cy={186} r="2.5"
        fill={i%2===0?accentColor:accentColor2} opacity="0.35" />
    ))}
    {Array.from({length:20}).map((_,i) => (
      <circle key={`kb2${i}`} cx={30+i*27} cy={822} r="2.5"
        fill={i%2===0?accentColor:accentColor2} opacity="0.35" />
    ))}
    {/* Sun rays — top */}
    <g transform="translate(297, 200)" opacity="0.12">
      <circle cx="0" cy="0" r="22" fill={accentColor2} />
      {Array.from({length:12}).map((_,i) => {
        const a = (i/12)*Math.PI*2;
        return <line key={i} x1={Math.cos(a)*25} y1={Math.sin(a)*25}
          x2={Math.cos(a)*38} y2={Math.sin(a)*38}
          stroke={accentColor2} strokeWidth="2.5" />;
      })}
    </g>
  </svg>
);

// BAISAKHI — wheat fields, khanda, Punjab green
const BaisakhiMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Wheat stalks — full bottom band */}
    {[50,90,130,170,210,250,290,330,370,410,450,490,530].map((x,i) => (
      <g key={`ws${i}`} transform={`translate(${x},842) rotate(${-8+(i%5)*4})`} opacity="0.25">
        <rect x="-3" y="-180" width="6" height="180" rx="3" fill="#D2691E" />
        {[-160,-140,-120,-100,-80,-60,-40].map(y => (
          <ellipse key={y} cx={i%2===0?10:-10} cy={y} rx="12" ry="4" fill="#DAA520"
            transform={`rotate(${i%2===0?35:-35},${i%2===0?10:-10},${y})`} />
        ))}
        <ellipse cx="0" cy="-178" rx="5" ry="10" fill="#DAA520" />
      </g>
    ))}
    {/* Khanda (Sikh symbol) — faint backdrop */}
    <g transform="translate(297, 420)" opacity="0.1">
      <rect x="-4" y="-65" width="8" height="130" rx="2" fill={accentColor} />
      <circle cx="0" cy="0" r="38" fill="none" stroke={accentColor} strokeWidth="4" />
      <path d="M -55 -25 Q -20 -40 0 -65 Q 20 -40 55 -25 L 55 25 Q 20 40 0 65 Q -20 40 -55 25 Z"
        fill="none" stroke={accentColor} strokeWidth="2.5" />
    </g>
    {/* Dhol drum shapes */}
    {[[70,350],[525,350]].map(([x,y],i) => (
      <g key={`dhol${i}`} transform={`translate(${x},${y})`} opacity="0.18">
        <ellipse cx="0" cy="-20" rx="22" ry="10" fill="none" stroke={accentColor2} strokeWidth="2" />
        <ellipse cx="0" cy="20" rx="22" ry="10" fill="none" stroke={accentColor2} strokeWidth="2" />
        <line x1="-22" y1="-20" x2="-22" y2="20" stroke={accentColor2} strokeWidth="2" />
        <line x1="22" y1="-20" x2="22" y2="20" stroke={accentColor2} strokeWidth="2" />
        {[-14,-4,6,16].map(x2 => (
          <line key={x2} x1={x2} y1="-20" x2={x2} y2="20" stroke={accentColor2} strokeWidth="0.8" opacity="0.5" />
        ))}
      </g>
    ))}
    {/* Dot border */}
    {Array.from({length:18}).map((_,i) => (
      <circle key={`bb${i}`} cx={30+i*30} cy={186} r="2.5" fill={accentColor} opacity="0.3" />
    ))}
  </svg>
);

// LOHRI — dark warm BG, bonfire centre, logs, sparks
const LohriMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Large bonfire centre */}
    <g transform="translate(297, 680)" opacity="0.55">
      {/* Logs — Cars24 purple */}
      <rect x="-50" y="10" width="100" height="14" rx="7" fill={accentColor} opacity="0.5" transform="rotate(-15)" />
      <rect x="-50" y="10" width="100" height="14" rx="7" fill="#6B57FF" opacity="0.4" transform="rotate(15)" />
      {/* Outer flame — fire orange festival accent */}
      <path d="M0,-90 Q35,-60 30,-20 Q45,-50 40,10 Q20,-5 0,20 Q-20,-5 -40,10 Q-45,-50 -30,-20 Q-35,-60 0,-90Z"
        fill={accentColor2} />
      {/* Mid flame */}
      <path d="M0,-65 Q22,-40 20,-5 Q0,10 -20,-5 Q-22,-40 0,-65Z" fill="#FFAB40" />
      {/* Inner flame — gold accent */}
      <path d="M0,-40 Q12,-20 10,5 Q0,15 -10,5 Q-12,-20 0,-40Z" fill="#FFD54F" />
      {/* Glow */}
      <radialGradient id="lohriGlow" cx="50%" cy="60%" r="50%">
        <stop offset="0%" stopColor={accentColor2} stopOpacity="0.35" />
        <stop offset="100%" stopColor={accentColor2} stopOpacity="0" />
      </radialGradient>
      <ellipse cx="0" cy="0" rx="80" ry="60" fill="url(#lohriGlow)" />
    </g>
    {/* Sparks / embers — orange/gold accent */}
    {[[260,580],[310,560],[280,540],[320,590],[250,570],[340,555],
      [230,610],[360,605],[270,520],[300,510]].map(([x,y],i) => (
      <circle key={`sp${i}`} cx={x} cy={y} r={2+(i%3)}
        fill={i%2===0?accentColor2:'#FFD54F'} opacity={0.5+i*0.03} />
    ))}
    {/* Glow ring around fire */}
    <radialGradient id="lohriAmbient" cx="50%" cy="81%" r="30%">
      <stop offset="0%" stopColor={accentColor2} stopOpacity="0.18" />
      <stop offset="100%" stopColor={accentColor2} stopOpacity="0" />
    </radialGradient>
    <ellipse cx="297" cy="680" rx="180" ry="120" fill="url(#lohriAmbient)" />
    {/* Sugarcane stalks — Cars24 purple */}
    {[[55,680,1],[540,680,-1]].map(([x,y,flip],i) => (
      <g key={`lsc${i}`} transform={`translate(${x},${y}) scale(${flip},1)`} opacity="0.22">
        <rect x="-3" y="-200" width="6" height="200" rx="3" fill={accentColor} />
        {[-160,-120,-80,-40].map(cy => (
          <ellipse key={cy} cx="12" cy={cy} rx="14" ry="5" fill="#6B57FF" transform="rotate(-30)" />
        ))}
      </g>
    ))}
    {/* Gold ornament border dots */}
    {Array.from({length:18}).map((_,i) => (
      <circle key={`lbd${i}`} cx={30+i*30} cy={184} r="2.5" fill={accentColor2} opacity="0.35" />
    ))}
    {Array.from({length:18}).map((_,i) => (
      <circle key={`lbd2${i}`} cx={30+i*30} cy={820} r="2.5" fill={accentColor} opacity="0.3" />
    ))}
    {/* Star / peanut motifs scattered */}
    {[[70,300],[525,300],[100,500],[495,500]].map(([x,y],i) => (
      <g key={`lpn${i}`} transform={`translate(${x},${y})`} opacity="0.2">
        <ellipse cx="-8" cy="0" rx="10" ry="6" fill={accentColor2} />
        <ellipse cx="8" cy="0" rx="10" ry="6" fill={accentColor2} />
        <rect x="-2" y="-4" width="4" height="8" rx="2" fill={accentColor2} opacity="0.5" />
      </g>
    ))}
  </svg>
);

// GURPURAB — deep saffron/navy, Khanda, lanterns
const GurpurabMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Khanda symbol — large backdrop */}
    <text x="297" y="480" textAnchor="middle" fontSize="160" fill={accentColor} opacity="0.1" fontFamily="serif">☬</text>
    {/* Double-frame border */}
    <rect x="20" y="168" width="555" height="656" rx="6" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.25" />
    <rect x="30" y="178" width="535" height="636" rx="4" fill="none" stroke={accentColor} strokeWidth="0.8" opacity="0.15" />
    {/* Lanterns */}
    {[[70,280],[525,280],[100,560],[495,560],[160,720],[435,720],[297,250]].map(([x,y],i) => (
      <g key={`glan${i}`} transform={`translate(${x},${y})`} opacity="0.28">
        <rect x="-12" y="-32" width="24" height="44" rx="5" fill="none" stroke={accentColor} strokeWidth="1.8" />
        <line x1="0" y1="-32" x2="0" y2="-44" stroke={accentColor} strokeWidth="2" />
        <ellipse cx="0" cy="-12" rx="6" ry="7" fill={accentColor} opacity="0.4" />
        <line x1="-12" y1="12" x2="-16" y2="24" stroke={accentColor} strokeWidth="1.2" />
        <line x1="12" y1="12" x2="16" y2="24" stroke={accentColor} strokeWidth="1.2" />
      </g>
    ))}
    {/* Nishan Sahib (flag) top corners */}
    {[[40,220,1],[555,220,-1]].map(([x,y,flip],i) => (
      <g key={`ns${i}`} transform={`translate(${x},${y}) scale(${flip},1)`} opacity="0.22">
        <rect x="-2" y="-40" width="4" height="80" rx="2" fill={accentColor} />
        <path d="M 2 -38 L 26 -26 L 2 -14 Z" fill={accentColor} />
      </g>
    ))}
    {/* Dot border */}
    {Array.from({length:18}).map((_,i) => (
      <circle key={`gbd${i}`} cx={30+i*30} cy={186} r="2.5" fill={accentColor} opacity="0.35" />
    ))}
  </svg>
);

// GOOD FRIDAY — reverent purple/white, cross, floral corners
const GoodFridayMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Large cross — faint backdrop */}
    <g transform="translate(297, 430)" opacity="0.1">
      <rect x="-8" y="-90" width="16" height="180" rx="4" fill={accentColor2} />
      <rect x="-60" y="-25" width="120" height="16" rx="4" fill={accentColor2} />
    </g>
    {/* Radiant light beams from cross */}
    {Array.from({length:16}).map((_,i) => {
      const a = (i/16)*Math.PI*2;
      return <line key={`gl${i}`}
        x1={297 + Math.cos(a)*12} y1={430 + Math.sin(a)*12}
        x2={297 + Math.cos(a)*220} y2={430 + Math.sin(a)*180}
        stroke={accentColor2} strokeWidth="1" opacity="0.05" />;
    })}
    {/* Olive branch / floral corners */}
    {[[20,168,1,1],[575,168,-1,1],[20,824,1,-1],[575,824,-1,-1]].map(([x,y,sx,sy],i) => (
      <g key={`gffc${i}`} transform={`translate(${x},${y}) scale(${sx},${sy})`} opacity="0.22">
        {[[15,20,20],[25,12,35],[35,22,15],[12,35,45]].map(([cx,cy,rot],j) => (
          <ellipse key={j} cx={cx} cy={cy} rx="12" ry="5" fill={accentColor}
            transform={`rotate(${rot},${cx},${cy})`} />
        ))}
        <circle cx="18" cy="18" r="3" fill={accentColor2} opacity="0.6" />
      </g>
    ))}
    {/* Border frame */}
    <rect x="24" y="172" width="547" height="650" rx="4" fill="none" stroke={accentColor} strokeWidth="1" opacity="0.15" />
    {/* Dove silhouette */}
    <g transform="translate(297, 300)" opacity="0.08">
      <path d="M 0 0 Q -30 -20 -45 -5 Q -30 5 0 0 Z" fill={accentColor2} />
      <path d="M 0 0 Q 30 -20 45 -5 Q 30 5 0 0 Z" fill={accentColor2} />
      <ellipse cx="0" cy="8" rx="12" ry="8" fill={accentColor2} />
      <circle cx="-5" cy="5" r="3" fill={accentColor2} />
    </g>
  </svg>
);

// BUDDHA PURNIMA — lotus, pastel gold + white, serene
const BuddhaMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Lotus flower — centre */}
    <g transform="translate(297, 680)" opacity="0.28">
      {[0,36,72,108,144,180,216,252,288,324].map(a => {
        const rad = (a*Math.PI)/180;
        return <ellipse key={a} cx={Math.cos(rad)*32} cy={Math.sin(rad)*32-8}
          rx="16" ry="8" fill={accentColor}
          transform={`rotate(${a},${Math.cos(rad)*32},${Math.sin(rad)*32-8})`} />;
      })}
      {[0,40,80,120,160,200,240,280,320].map((a,i) => {
        const rad = (a*Math.PI)/180;
        return <ellipse key={`l2${i}`} cx={Math.cos(rad)*18} cy={Math.sin(rad)*18-4}
          rx="10" ry="5" fill={accentColor2} opacity="0.7"
          transform={`rotate(${a},${Math.cos(rad)*18},${Math.sin(rad)*18-4})`} />;
      })}
      <circle cx="0" cy="-2" r="10" fill={accentColor} opacity="0.9" />
    </g>
    {/* Side lotus flowers */}
    {[[60,500],[535,500]].map(([x,y],i) => (
      <g key={`sl${i}`} transform={`translate(${x},${y})`} opacity="0.18">
        {[0,72,144,216,288].map(a => {
          const rad = (a*Math.PI)/180;
          return <ellipse key={a} cx={Math.cos(rad)*18} cy={Math.sin(rad)*18}
            rx="12" ry="5" fill={accentColor}
            transform={`rotate(${a},${Math.cos(rad)*18},${Math.sin(rad)*18})`} />;
        })}
        <circle cx="0" cy="0" r="5" fill={accentColor} />
      </g>
    ))}
    {/* Bodhi tree leaves — top corners */}
    {[[0,168,1],[595,168,-1]].map(([x,y,flip],i) => (
      <g key={`bt${i}`} transform={`translate(${x},${y}) scale(${flip},1)`} opacity="0.15">
        {[[20,30,10],[40,20,25],[30,45,5],[50,38,18]].map(([cx,cy,rot],j) => (
          <path key={j} d={`M ${cx} ${cy} Q ${cx+8} ${cy-12} ${cx+4} ${cy+10}`}
            fill={accentColor2} transform={`rotate(${rot},${cx},${cy})`} />
        ))}
      </g>
    ))}
    {/* Dharma wheel — faint */}
    <g transform="translate(297, 420)" opacity="0.08">
      <circle cx="0" cy="0" r="65" fill="none" stroke={accentColor} strokeWidth="4" />
      <circle cx="0" cy="0" r="50" fill="none" stroke={accentColor} strokeWidth="2" />
      <circle cx="0" cy="0" r="12" fill={accentColor} />
      {Array.from({length:8}).map((_,i) => {
        const a = (i/8)*Math.PI*2;
        return <line key={i} x1={Math.cos(a)*14} y1={Math.sin(a)*14}
          x2={Math.cos(a)*48} y2={Math.sin(a)*48}
          stroke={accentColor} strokeWidth="3" />;
      })}
    </g>
    {/* Gentle concentric rings */}
    {[160,200,240].map(r => (
      <circle key={r} cx="297" cy="420" r={r} fill="none" stroke={accentColor} strokeWidth="0.8" opacity="0.06" />
    ))}
  </svg>
);

// MAHAVIR JAYANTI — gold-white, Jain hand symbol, swastika
const MahavirMotif = ({ accentColor, accentColor2 }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }}
    viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {/* Jain hand (Ahimsa) — centre */}
    <g transform="translate(297, 430)" opacity="0.1">
      <path d="M -25 40 L -25 -20 Q -25 -35 -15 -35 Q -5 -35 -5 -20 L -5 -30 Q -5 -45 5 -45 Q 15 -45 15 -30 L 15 -20 Q 15 -35 25 -35 Q 35 -35 35 -20 L 35 20 Q 35 50 10 55 L -15 55 Q -35 50 -35 30 L -35 20 Q -35 5 -25 0 Z"
        fill={accentColor} />
      <circle cx="5" cy="20" r="12" fill="none" stroke={accentColor} strokeWidth="3" />
      <text x="5" y="26" textAnchor="middle" fontSize="14" fill={accentColor} fontFamily="serif">अहिंसा</text>
    </g>
    {/* Geometric border */}
    <rect x="22" y="170" width="551" height="652" rx="4" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.22" />
    {/* Diamond ornaments at corners */}
    {[[22,170],[573,170],[22,822],[573,822]].map(([x,y],i) => (
      <g key={`mj${i}`} transform={`translate(${x},${y})`} opacity="0.4">
        <polygon points="0,-16 10,0 0,16 -10,0" fill={accentColor} opacity="0.6" />
        <polygon points="0,-9 6,0 0,9 -6,0" fill={accentColor} />
      </g>
    ))}
    {/* Concentric decoration rings */}
    {[40,60,80,100].map(r => (
      <circle key={r} cx="297" cy="430" r={r} fill="none" stroke={accentColor} strokeWidth="1" opacity="0.06" />
    ))}
    {/* Side dots */}
    {[280,320,360,400,440,480,520,560].map((y,i) => (
      <g key={`mjd${i}`}>
        <circle cx="26" cy={y} r="2" fill={accentColor} opacity="0.2" />
        <circle cx="569" cy={y} r="2" fill={accentColor} opacity="0.2" />
      </g>
    ))}
    {/* Star strip top */}
    {[80,160,240,320,400,480].map((x,i) => (
      <polygon key={`mjs${i}`}
        points={`${x},${186} ${x+3},${193} ${x+10},${193} ${x+5},${197} ${x+7},${204} ${x},${200} ${x-7},${204} ${x-5},${197} ${x-10},${193} ${x-3},${193}`}
        fill={accentColor} opacity="0.25" />
    ))}
  </svg>
);

// ─── Event motifs (unchanged, kept from original) ──────────────────────────────
const CelebrationMotif = ({ accentColor }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {Array.from({length:28}).map((_,i) => { const x=(i*89)%560+17; const y=200+(i*113)%600; const colors=['#FFD700','#FF69B4','#00FFFF','#98FF98','#FF6B00','#C0C0C0']; const c=colors[i%colors.length]; return <rect key={i} x={x} y={y} width="6" height="6" fill={c} opacity="0.2" transform={`rotate(${i*25},${x+3},${y+3})`} />; })}
    {[[80,350],[515,350],[150,650],[445,650]].map(([x,y],i) => (<g key={i} transform={`translate(${x},${y})`} opacity="0.15"><ellipse cx="0" cy="0" rx="18" ry="22" fill={accentColor} /><path d="M 0 22 Q 5 35 -3 50" fill="none" stroke={accentColor} strokeWidth="1.5" /></g>))}
    <path d="M 0 160 Q 150 350 80 550 Q 20 750 150 842" fill="none" stroke="#FF69B4" strokeWidth="2" opacity="0.08" />
    <path d="M 595 160 Q 445 350 515 550 Q 575 750 445 842" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.08" />
  </svg>
);

const TownHallMotif = ({ accentColor }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 421)" opacity="0.08"><rect x="-14" y="-30" width="28" height="40" rx="14" fill={accentColor} /><path d="M -22 5 Q -22 30 0 30 Q 22 30 22 5" fill="none" stroke={accentColor} strokeWidth="2" /><line x1="0" y1="30" x2="0" y2="45" stroke={accentColor} strokeWidth="2" /><line x1="-12" y1="45" x2="12" y2="45" stroke={accentColor} strokeWidth="2" /></g>
    {[250,350,450,550,650,750].map(y => (<line key={y} x1="0" y1={y} x2="595" y2={y} stroke={accentColor} strokeWidth="0.5" opacity="0.05" />))}
    {[[0,160,1,1],[595,160,-1,1],[0,842,1,-1],[595,842,-1,-1]].map(([x,y,sx,sy],i) => (<g key={i} transform={`translate(${x},${y})`} opacity="0.15"><line x1="0" y1="0" x2={sx*40} y2="0" stroke={accentColor} strokeWidth="2" /><line x1="0" y1="0" x2="0" y2={sy*40} stroke={accentColor} strokeWidth="2" /></g>))}
  </svg>
);

const RnRMotif = ({ accentColor }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 421)" opacity="0.1"><path d="M -24 -30 L 24 -30 L 18 10 Q 0 20 -18 10 Z" fill={accentColor} /><rect x="-8" y="10" width="16" height="20" fill={accentColor} /><rect x="-18" y="30" width="36" height="6" rx="2" fill={accentColor} /><path d="M -24 -30 Q -40 -30 -40 -10 Q -40 10 -18 10" fill="none" stroke={accentColor} strokeWidth="3" /><path d="M 24 -30 Q 40 -30 40 -10 Q 40 10 18 10" fill="none" stroke={accentColor} strokeWidth="3" /></g>
    {[[60,250],[535,240],[80,680],[515,670],[180,760],[415,755]].map(([x,y],i) => (<polygon key={i} points={`${x},${y-8} ${x+2},${y-2} ${x+8},${y-2} ${x+3},${y+2} ${x+5},${y+8} ${x},${y+5} ${x-5},${y+8} ${x-3},${y+2} ${x-8},${y-2} ${x-2},${y-2}`} fill={accentColor} opacity="0.18" />))}
    {Array.from({length:15}).map((_,i) => (<rect key={i} x={(i*97)%555+20} y={200+(i*157)%580} width="5" height="5" fill={['#FFD700','#C0C0C0','#FF69B4'][i%3]} opacity="0.2" transform={`rotate(${i*24})`} />))}
  </svg>
);

const HackathonMotif = ({ accentColor }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <text x="80" y="420" fontSize="80" fill={accentColor} opacity="0.07" fontFamily="monospace">{'{}'}</text>
    <text x="420" y="680" fontSize="80" fill={accentColor} opacity="0.07" fontFamily="monospace">{'<>'}</text>
    {[[50,400,200,400],[200,400,200,450],[200,450,350,450],[400,500,550,500],[550,500,550,600]].map(([x1,y1,x2,y2],i) => (<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accentColor} strokeWidth="1.5" opacity="0.1" />))}
    {[[200,400],[200,450],[350,450],[400,500],[550,500],[550,600]].map(([x,y],i) => (<circle key={i} cx={x} cy={y} r="5" fill={accentColor} opacity="0.15" />))}
    <g transform="translate(297, 421)" opacity="0.1"><path d="M 10 -35 L -6 0 L 4 0 L -10 35 L 18 -5 L 6 -5 Z" fill={accentColor} /></g>
  </svg>
);

const WellnessMotif = ({ accentColor }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 421)" opacity="0.1"><path d="M 0 10 Q -30 -20 -30 -30 A 20 20 0 0 1 0 -15 A 20 20 0 0 1 30 -30 Q 30 -20 0 10 Z" fill={accentColor} /></g>
    {[[60,500],[535,500],[150,700],[445,700]].map(([x,y],i) => (<g key={i} transform={`translate(${x},${y}) rotate(${i*45})`} opacity="0.12"><ellipse cx="0" cy="0" rx="15" ry="30" fill={accentColor} /><line x1="0" y1="-30" x2="0" y2="30" stroke="white" strokeWidth="1" opacity="0.5" /></g>))}
    {[30,50,70,90].map(r => (<circle key={r} cx="297" cy="421" r={r} fill="none" stroke={accentColor} strokeWidth="1" opacity="0.06" />))}
  </svg>
);

const LaunchMotif = ({ accentColor }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 421) rotate(-45)" opacity="0.1"><path d="M 0 -40 Q 15 -20 15 10 L 0 0 L -15 10 Q -15 -20 0 -40 Z" fill={accentColor} /><path d="M -15 10 Q -22 18 -18 26 L -6 18 Z" fill={accentColor} /><path d="M 15 10 Q 22 18 18 26 L 6 18 Z" fill={accentColor} /><circle cx="0" cy="0" r="6" fill={accentColor} opacity="0.5" /></g>
    {[[60,220],[535,200],[100,450],[490,480],[80,680],[510,660]].map(([x,y],i) => (<circle key={i} cx={x} cy={y} r={2+i%3} fill={accentColor} opacity="0.2" />))}
    {Array.from({length:6}).map((_,r) => Array.from({length:6}).map((_,c) => (<circle key={`${r}-${c}`} cx={80+c*85} cy={300+r*100} r="2" fill={accentColor} opacity="0.08" />)))}
  </svg>
);

const AnniversaryMotif = ({ accentColor }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <path d="M 0 220 L 595 180" stroke={accentColor} strokeWidth="2" opacity="0.1" />
    <path d="M 0 842 L 595 800" stroke={accentColor} strokeWidth="2" opacity="0.1" />
    {Array.from({length:10}).map((_,i) => { const x=50+i*50; const y=250+i*55; return <polygon key={i} points={`${x},${y-8} ${x+2},${y-2} ${x+8},${y-2} ${x+3},${y+2} ${x+5},${y+8} ${x},${y+5} ${x-5},${y+8} ${x-3},${y+2} ${x-8},${y-2} ${x-2},${y-2}`} fill={accentColor} opacity={0.08+i*0.015} />; })}
    <circle cx="297" cy="421" r="55" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.12" />
    <circle cx="297" cy="421" r="40" fill={accentColor} opacity="0.06" />
  </svg>
);

const OffsiteMotif = ({ accentColor }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g opacity="0.07"><path d="M 0 700 L 150 450 L 300 600 L 450 380 L 595 580 L 595 842 L 0 842 Z" fill={accentColor} /></g>
    <g transform="translate(480, 300)" opacity="0.12"><circle cx="0" cy="0" r="30" fill={accentColor} />{Array.from({length:8}).map((_,i) => { const a=(i/8)*Math.PI*2; return <line key={i} x1={Math.cos(a)*34} y1={Math.sin(a)*34} x2={Math.cos(a)*44} y2={Math.sin(a)*44} stroke={accentColor} strokeWidth="2" />; })}</g>
    <g transform="translate(100, 280)" opacity="0.1"><ellipse cx="20" cy="0" rx="25" ry="18" fill={accentColor} /><ellipse cx="0" cy="6" rx="20" ry="14" fill={accentColor} /><ellipse cx="40" cy="6" rx="20" ry="14" fill={accentColor} /></g>
  </svg>
);

const DefaultFestivalMotif = ({ accentColor }) => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <circle cx="297" cy="421" r="60" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.12" />
    <circle cx="297" cy="421" r="44" fill="none" stroke={accentColor} strokeWidth="1" opacity="0.1" />
    <circle cx="297" cy="421" r="28" fill={accentColor} opacity="0.06" />
    {[[40,200],[555,200],[40,802],[555,802]].map(([x,y],i) => (<polygon key={i} points={`${x},${y-10} ${x+3},${y-3} ${x+10},${y-3} ${x+5},${y+2} ${x+7},${y+10} ${x},${y+5} ${x-7},${y+10} ${x-5},${y+2} ${x-10},${y-3} ${x-3},${y-3}`} fill={accentColor} opacity="0.15" />))}
  </svg>
);

// ─── Motif lookup ─────────────────────────────────────────────────────────────
const motifComponents = {
  diwali:      DiwaliMotif,
  holi:        HoliMotif,
  eid:         EidMotif,
  christmas:   ChristmasMotif,
  newyear:     NewYearMotif,
  independence:IndependenceMotif,
  republic:    RepublicMotif,
  rakhi:       RakhiMotif,
  ganesh:      GaneshMotif,
  dussehra:    DussehraMotif,
  navratri:    NavratriMotif,
  onam:        OnamMotif,
  pongal:      PongalMotif,
  baisakhi:    BaisakhiMotif,
  lohri:       LohriMotif,
  gurpurab:    GurpurabMotif,
  goodfriday:  GoodFridayMotif,
  buddha:      BuddhaMotif,
  mahavir:     MahavirMotif,
  celebration: CelebrationMotif,
  townhall:    TownHallMotif,
  rnr:         RnRMotif,
  hackathon:   HackathonMotif,
  wellness:    WellnessMotif,
  offsite:     OffsiteMotif,
  launch:      LaunchMotif,
  anniversary: AnniversaryMotif,
};

// ─── Font stacks (poster canvas) ─────────────────────────────────────────────
const FONT_DISPLAY_POSTER = "'Playfair Display', Georgia, serif";
const FONT_FRAUNCES_POSTER = "'Fraunces', Georgia, serif";

// ─── Editorial label strip ────────────────────────────────────────────────────
const LabelStrip = ({ children, accentColor }) => (
  <div style={{
    display: 'inline-block',
    background: accentColor,
    borderRadius: '3px',
    padding: '3px 10px',
    marginBottom: '14px',
  }}>
    <span style={{
      color: '#FFFFFF',
      fontSize: '8px',
      fontWeight: '700',
      letterSpacing: '2.5px',
      textTransform: 'uppercase',
      fontFamily: FONT_SANS,
    }}>{children}</span>
  </div>
);

// ─── Diagonal accent ribbon ───────────────────────────────────────────────────
const DiagonalRibbon = ({ accentColor }) => (
  <div style={{
    position: 'absolute',
    top: 0,
    right: 0,
    width: '120px',
    height: '120px',
    overflow: 'hidden',
    zIndex: 1,
    pointerEvents: 'none',
  }}>
    <div style={{
      position: 'absolute',
      top: '28px',
      right: '-32px',
      width: '130px',
      height: '22px',
      background: `linear-gradient(135deg, ${accentColor}CC, ${accentColor}88)`,
      transform: 'rotate(45deg)',
    }} />
  </div>
);

// ─── Layered shape decorations ────────────────────────────────────────────────
const LayeredCircles = ({ accentColor }) => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', right: '-60px', top: '80px',
      width: '260px', height: '260px', borderRadius: '50%',
      background: accentColor, opacity: 0.05,
    }} />
    <div style={{
      position: 'absolute', right: '-30px', top: '120px',
      width: '180px', height: '180px', borderRadius: '50%',
      border: `2px solid ${accentColor}`, opacity: 0.1,
    }} />
    <div style={{
      position: 'absolute', left: '-80px', bottom: '140px',
      width: '200px', height: '200px', borderRadius: '50%',
      background: accentColor, opacity: 0.06,
    }} />
  </div>
);

// ─── Purple-on-purple contrast block ─────────────────────────────────────────
const PurpleBlock = ({ children, style = {} }) => (
  <div style={{
    background: 'linear-gradient(135deg, #4A35FE 0%, #6B57FF 100%)',
    borderRadius: '6px',
    padding: '14px 22px',
    ...style,
  }}>
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// FESTIVAL WISHES CANVAS — editorial per-festival design
// ═══════════════════════════════════════════════════════════════════════════════

const FestivalWishesCanvas = ({ template, formData }) => {
  const MotifComponent = motifComponents[template.motif] || DefaultFestivalMotif;
  const headline      = formData.headline?.trim()      || template.headline;
  const recipientName = formData.recipientName?.trim() || 'Team Cars24';
  const fromName      = formData.fromName?.trim()      || '';
  const fromTitle     = formData.fromTitle?.trim()     || '';
  const message       = formData.message               || template.defaultMessage;
  const footerText    = formData.footerText?.trim()    || 'With warm wishes from Team Cars24';

  const fontStack   = template.fontStack   || FONT_SANS;
  const accentColor = template.accentColor || '#4A35FE';
  const accent2     = template.accentColor2 || accentColor;
  const posterBg    = template.posterBg    || '#FFFFFF';

  // Choose editorial layout variant per template id
  const layoutVariant = (() => {
    switch (template.id) {
      case 'diwali':          return 'glow-centre';
      case 'holi':            return 'asymmetric-splash';
      case 'eid-ul-fitr':
      case 'eid-al-adha':     return 'crescent-editorial';
      case 'christmas':       return 'ornament-split';
      case 'new-year':        return 'oversized-year';
      case 'independence-day':
      case 'republic-day':    return 'national-pride';
      case 'navratri':        return 'mandala-editorial';
      case 'lohri':           return 'fire-glow';
      default:                return 'classic-editorial';
    }
  })();

  // Display font choice
  const displayFont = (() => {
    if (fontStack.includes('Fraunces')) return FONT_FRAUNCES_POSTER;
    if (fontStack.includes('Playfair')) return FONT_DISPLAY_POSTER;
    return FONT_DISPLAY_POSTER;
  })();

  // Headline size — bump up all templates
  const hlSize = (() => {
    const base = parseInt(template.headlineFontSize || '52', 10);
    return Math.min(86, base + 18) + 'px';
  })();

  return (
    <div style={{
      width: '595px',
      height: '842px',
      background: posterBg,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: FONT_SANS,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Full-poster motif layer — behind everything */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <MotifComponent accentColor={accentColor} accentColor2={accent2} secondaryColor={template.secondaryColor || accent2} />
      </div>

      {/* Layered background circles for depth */}
      <LayeredCircles accentColor={accentColor} />

      {/* Diagonal ribbon accent — top-right corner */}
      <DiagonalRibbon accentColor={accentColor} />

      {/* ── Cars24 logo — top-left, prominent ── */}
      <div style={{
        position: 'absolute',
        top: '22px',
        left: '30px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <Cars24LogoDark />
      </div>

      {/* ── Editorial label strip — top-right ── */}
      <div style={{
        position: 'absolute',
        top: '26px',
        right: '30px',
        zIndex: 10,
      }}>
        <div style={{
          border: `1.5px solid ${accentColor}`,
          borderRadius: '3px',
          padding: '3px 10px',
        }}>
          <span style={{
            color: accentColor,
            fontSize: '7.5px',
            fontWeight: '700',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontFamily: FONT_SANS,
          }}>We're Celebrating</span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '90px 52px 24px',
        boxSizing: 'border-box',
        justifyContent: layoutVariant === 'oversized-year' ? 'flex-start' : 'center',
      }}>

        {/* "DEAR" small caps */}
        <p style={{
          color: `${accentColor}99`,
          fontSize: '11px',
          fontWeight: '700',
          margin: '0 0 3px 0',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          fontFamily: FONT_SANS,
          textAlign: layoutVariant === 'asymmetric-splash' ? 'left' : 'center',
        }}>
          Dear
        </p>

        {/* Recipient name */}
        <h2 style={{
          color: accentColor,
          fontSize: '24px',
          fontWeight: '700',
          textAlign: layoutVariant === 'asymmetric-splash' ? 'left' : 'center',
          margin: '0 0 18px 0',
          fontFamily: FONT_SANS,
          letterSpacing: '-0.2px',
        }}>
          {recipientName}
        </h2>

        {/* Decorative rule */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
          justifyContent: layoutVariant === 'asymmetric-splash' ? 'flex-start' : 'center',
        }}>
          <div style={{ width: '40px', height: '1.5px', background: `linear-gradient(90deg, transparent, ${accentColor})`, borderRadius: '1px' }} />
          <span style={{ color: accentColor, fontSize: '10px', opacity: 0.7 }}>✦</span>
          <div style={{ width: '40px', height: '1.5px', background: `linear-gradient(90deg, ${accentColor}, transparent)`, borderRadius: '1px' }} />
        </div>

        {/* Oversized year number — for New Year layout */}
        {layoutVariant === 'oversized-year' && (
          <div style={{
            fontSize: '110px',
            fontWeight: '900',
            lineHeight: '0.9',
            fontFamily: FONT_DISPLAY_POSTER,
            letterSpacing: '-4px',
            background: `linear-gradient(135deg, #4A35FE, #8B7BFF)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '8px',
            textAlign: 'center',
          }}>2027</div>
        )}

        {/* Festival headline — THE HERO */}
        <div style={{
          textAlign: layoutVariant === 'asymmetric-splash' ? 'left' : 'center',
          marginBottom: '10px',
        }}>
          {/* Open quote for ornament-split / crescent layouts */}
          {(layoutVariant === 'ornament-split' || layoutVariant === 'crescent-editorial') && (
            <span style={{
              fontSize: '72px',
              lineHeight: '0.5',
              color: accentColor,
              opacity: 0.25,
              fontFamily: FONT_DISPLAY_POSTER,
              display: 'block',
              marginBottom: '-8px',
              textAlign: 'center',
            }}>"</span>
          )}
          <h1 style={{
            fontSize: hlSize,
            fontWeight: template.headlineWeight || '800',
            textAlign: layoutVariant === 'asymmetric-splash' ? 'left' : 'center',
            margin: '0',
            lineHeight: '1.05',
            letterSpacing: '-1px',
            fontFamily: displayFont,
            maxWidth: layoutVariant === 'asymmetric-splash' ? '340px' : '490px',
            background: `linear-gradient(135deg, #4A35FE 0%, #6B57FF 60%, #8B7BFF 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
          }}>
            {headline}
          </h1>
        </div>

        {/* Accent ornament below headline */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '14px 0 18px',
          justifyContent: layoutVariant === 'asymmetric-splash' ? 'flex-start' : 'center',
        }}>
          <div style={{ width: '50px', height: '2px', background: `linear-gradient(90deg, ${accentColor}, transparent)`, borderRadius: '1px' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accentColor, opacity: 0.7 }} />
          <div style={{ width: '50px', height: '2px', background: `linear-gradient(90deg, transparent, ${accentColor})`, borderRadius: '1px' }} />
        </div>

        {/* Uploaded image */}
        <UploadedImageBlock src={formData.uploadedImage} />

        {/* Message — wrapped in editorial quote block */}
        <div style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(6px)',
          borderRadius: '8px',
          padding: '16px 22px',
          border: `1px solid ${accentColor}20`,
          borderLeft: `3px solid ${accentColor}`,
          maxWidth: '440px',
          alignSelf: layoutVariant === 'asymmetric-splash' ? 'flex-start' : 'center',
        }}>
          <p style={{
            color: '#4A4A4A',
            fontSize: '12.5px',
            lineHeight: '1.85',
            textAlign: layoutVariant === 'asymmetric-splash' ? 'left' : 'center',
            margin: '0',
            fontFamily: FONT_SANS,
          }}>
            {message}
          </p>
        </div>

        {/* Signatory block */}
        {(fromName || fromTitle) && (
          <div style={{
            textAlign: layoutVariant === 'asymmetric-splash' ? 'left' : 'center',
            marginTop: '20px',
            paddingTop: '14px',
            borderTop: `1px solid ${accentColor}22`,
            width: layoutVariant === 'asymmetric-splash' ? 'auto' : '80%',
            alignSelf: layoutVariant === 'asymmetric-splash' ? 'flex-start' : 'center',
          }}>
            {fromName && (
              <p style={{
                color: accentColor,
                fontSize: '13px',
                fontWeight: '600',
                margin: '0 0 2px 0',
                fontFamily: FONT_SANS,
              }}>
                {fromName}
              </p>
            )}
            {fromTitle && (
              <p style={{
                color: '#4A4A4A',
                fontSize: '11px',
                margin: 0,
                letterSpacing: '0.5px',
                fontFamily: FONT_SANS,
              }}>
                {fromTitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Footer — purple band with footerText ── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        padding: '10px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: `linear-gradient(90deg, ${accentColor}18, ${accentColor}08)`,
        borderTop: `1px solid ${accentColor}22`,
        flexShrink: 0,
      }}>
        <p style={{
          color: `rgba(74,53,254,0.55)`,
          fontSize: '9px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          margin: 0,
          fontWeight: '600',
          fontFamily: FONT_SANS,
        }}>
          {footerText}
        </p>
        <span style={{ color: `${accentColor}44`, fontSize: '9px', fontFamily: FONT_SANS }}>✦</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT ANNOUNCEMENT CANVAS — full editorial magazine treatment
// ═══════════════════════════════════════════════════════════════════════════════
const EventAnnouncementCanvas = ({ template, formData }) => {
  const MotifComponent = motifComponents[template.motif] || DefaultFestivalMotif;
  const eventTitle   = formData.eventTitle?.trim()   || template.defaultTitle;
  const subheadline  = formData.subheadline?.trim()  || 'You are invited';
  const description  = formData.description          || template.defaultDescription;
  const footerText   = formData.footerText?.trim()   || 'Cars24 People Team';

  const eventDate = formData.eventDate ? (() => {
    const d = new Date(formData.eventDate + 'T00:00:00');
    const day = d.toLocaleDateString('en-IN', { day: '2-digit' });
    const mon = d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
    const yr  = d.getFullYear();
    return { day, mon, yr, full: formatDate(formData.eventDate) };
  })() : null;

  return (
    <div style={{
      width: '595px',
      height: '842px',
      background: BRAND.bg,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: FONT_SANS,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Subtle dot-grid pattern background */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
        viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 18 }).map((_, row) =>
          Array.from({ length: 14 }).map((_, col) => (
            <circle key={`${row}-${col}`}
              cx={30 + col * 40} cy={170 + row * 40} r="1.5"
              fill={BRAND.primary} opacity="0.07" />
          ))
        )}
      </svg>

      {/* Purple hero block — top ~40% */}
      <div style={{
        background: BRAND.headerGrad,
        width: '100%',
        padding: '24px 38px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden',
        minHeight: '310px',
      }}>
        {/* Decorative rings inside hero */}
        <div style={{
          position: 'absolute', right: '-70px', top: '-70px',
          width: '320px', height: '320px', borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.09)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: '-30px', top: '-30px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: '0', bottom: '0', right: '0',
          height: '80px',
          background: 'linear-gradient(180deg, transparent, rgba(46,31,204,0.3))',
          pointerEvents: 'none',
        }} />

        {/* Logo row + "We're Hiring" / "You're Invited" badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}><Cars24LogoWhite /></div>
          <div style={{
            background: 'rgba(255,255,255,0.14)',
            border: '1px solid rgba(255,255,255,0.22)',
            borderRadius: '20px', padding: '4px 14px',
          }}>
            <span style={{ color: '#FFFFFF', fontSize: '8px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: FONT_SANS }}>
              {subheadline}
            </span>
          </div>
        </div>

        {/* Editorial label */}
        <p style={{
          color: 'rgba(255,255,255,0.55)',
          fontSize: '9px',
          fontWeight: '700',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          margin: '0 0 10px 0',
          fontFamily: FONT_SANS,
          position: 'relative', zIndex: 1,
        }}>
          Cars24 Presents
        </p>

        {/* Event title — oversized editorial Playfair */}
        <h1 style={{
          color: '#FFFFFF',
          fontSize: '52px',
          fontWeight: '800',
          lineHeight: '1.05',
          margin: '0 0 16px 0',
          letterSpacing: '-1px',
          maxWidth: '480px',
          fontFamily: FONT_DISPLAY_POSTER,
          position: 'relative', zIndex: 1,
        }}>
          {eventTitle}
        </h1>

        {/* Date displayed as hero element */}
        {eventDate && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            position: 'relative', zIndex: 1,
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              padding: '8px 16px',
              textAlign: 'center',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '8px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 3px 0', fontFamily: FONT_SANS }}>
                {eventDate.mon}
              </p>
              <p style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: '900', margin: '0', lineHeight: '1', fontFamily: FONT_DISPLAY_POSTER, letterSpacing: '-0.5px' }}>
                {eventDate.day}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '9px', margin: '2px 0 0', fontFamily: FONT_SANS }}>
                {eventDate.yr}
              </p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.2)' }} />
            <div>
              {formData.eventTime && (
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: '600', margin: '0 0 4px', fontFamily: FONT_SANS }}>
                  {formData.eventTime}
                </p>
              )}
              {formData.venue && (
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', margin: 0, fontFamily: FONT_SANS }}>
                  {formData.venue}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Thin accent bar */}
        <div style={{
          width: '60px', height: '3px',
          background: template.accentColor || 'rgba(255,255,255,0.5)',
          borderRadius: '2px',
          marginTop: '14px',
          position: 'relative', zIndex: 1,
        }} />
      </div>

      {/* Gradient transition */}
      <div style={{ height: '4px', background: `linear-gradient(90deg, ${BRAND.primary}, #8B7BFF, transparent)`, flexShrink: 0, zIndex: 2 }} />

      {/* White body area */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 38px 0',
        boxSizing: 'border-box',
        overflow: 'hidden',
        zIndex: 1,
      }}>
        <MotifComponent accentColor={template.accentColor} secondaryColor={template.secondaryColor} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>

          {/* Description text */}
          <p style={{ color: BRAND.textSecond, fontSize: '13.5px', lineHeight: '1.8', margin: '0 0 20px 0', maxWidth: '460px', fontFamily: FONT_SANS }}>
            {description}
          </p>

          {/* Uploaded image */}
          {formData.uploadedImage && (
            <div style={{ width: '220px', height: '148px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 20px rgba(74,53,254,0.14)', marginBottom: '18px' }}>
              <img src={formData.uploadedImage} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          )}

          {/* Detail cards row — icon + label pairs */}
          {[
            { icon: '📅', label: 'Date',  value: formData.eventDate ? formatDate(formData.eventDate) : '' },
            { icon: '🕐', label: 'Time',  value: formData.eventTime },
            { icon: '📍', label: 'Venue', value: formData.venue },
            { icon: '📧', label: 'RSVP',  value: formData.rsvp },
          ].filter(item => item.value).length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              maxWidth: '460px',
            }}>
              {[
                { icon: '📅', label: 'Date',  value: formData.eventDate ? formatDate(formData.eventDate) : '' },
                { icon: '🕐', label: 'Time',  value: formData.eventTime },
                { icon: '📍', label: 'Venue', value: formData.venue },
                { icon: '📧', label: 'RSVP',  value: formData.rsvp },
              ].filter(item => item.value).map((item, i) => (
                <div key={i} style={{
                  background: '#F4F1FF',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  borderLeft: `3px solid ${BRAND.primary}`,
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: '14px', lineHeight: '1.4', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <p style={{ color: BRAND.primary, fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 3px 0', fontWeight: '700', fontFamily: FONT_SANS }}>{item.label}</p>
                    <p style={{ color: BRAND.textPrimary, fontSize: '12.5px', fontWeight: '600', margin: 0, fontFamily: FONT_SANS, lineHeight: '1.4' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Purple footer with thin accent line */}
      <div style={{
        background: BRAND.primary,
        width: '100%',
        padding: '11px 38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 2,
        boxSizing: 'border-box',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '9.5px', letterSpacing: '2.5px', textTransform: 'uppercase', margin: 0, fontWeight: '600', fontFamily: FONT_SANS }}>
          {footerText}
        </p>
        <Cars24LogoWhite />
      </div>
    </div>
  );
};

// ─── Public export ────────────────────────────────────────────────────────────
const PosterCanvas = forwardRef(({ template, formData, mode }, ref) => (
  <div ref={ref}>
    {mode === 'festival'
      ? <FestivalWishesCanvas template={template} formData={formData} />
      : <EventAnnouncementCanvas template={template} formData={formData} />
    }
  </div>
));

PosterCanvas.displayName = 'PosterCanvas';
export default PosterCanvas;
