import { forwardRef } from 'react';

// ─── Cars24 brand tokens — LOCKED, not driven by props ───────────────────────
// These constants are the single source of truth for brand colours, font stack,
// padding, and alignment. They are NEVER exposed as editable props.
const BRAND = {
  primary:     '#4A35FE',
  primaryLight:'#6B57FF',
  primaryDark: '#2E1FCC',
  bg:          '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecond:  '#4A4A4A',
  headerGrad:  'linear-gradient(135deg, #4A35FE 0%, #6B57FF 100%)',
  bodyWash:    'linear-gradient(180deg, rgba(74,53,254,0.03) 0%, rgba(255,255,255,1) 30%)',
};

// ─── Brand font stack — LOCKED ────────────────────────────────────────────────
const FONT = "'Inter', 'Segoe UI', system-ui, sans-serif";

// ─── Layout constants — LOCKED ────────────────────────────────────────────────
const LAYOUT = {
  headerPadH: 40,   // px horizontal padding inside header
  bodyPadH:   56,   // px horizontal padding inside body (festival)
  bodyPadHEv: 40,   // px horizontal padding inside body (event)
  footerH:    40,   // px footer height
};

// ─── Decorative SVG motifs ────────────────────────────────────────────────────
// Position, opacity, and accent colour are fixed — not overridable by the user.

const DiwaliMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {[
      [60, 700], [120, 720], [475, 700], [535, 720],
      [90, 760], [505, 760], [297, 790],
    ].map(([cx, cy], i) => (
      <g key={i} transform={`translate(${cx},${cy})`}>
        <ellipse rx="10" ry="6" fill="#8B4513" opacity="0.7" />
        <ellipse rx="6" ry="4" cy="-1" fill="#D2691E" opacity="0.5" />
        <path d={`M0,${-6} Q4,${-14} 0,${-20} Q-4,${-14} 0,${-6}`} fill="#FF6B00" opacity="0.85" />
        <path d={`M0,${-8} Q2,${-14} 0,${-18} Q-2,${-14} 0,${-8}`} fill="#FFD700" opacity="0.9" />
      </g>
    ))}
    <circle cx="297" cy="421" r="40" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.25" />
    <circle cx="297" cy="421" r="28" fill="none" stroke={accentColor} strokeWidth="1" opacity="0.2" />
    <circle cx="297" cy="421" r="16" fill={accentColor} opacity="0.1" />
    {[[40, 200], [555, 200], [40, 802], [555, 802]].map(([x, y], i) => (
      <polygon key={i} points={`${x},${y-12} ${x+4},${y-3} ${x+12},${y-3} ${x+6},${y+3} ${x+8},${y+12} ${x},${y+7} ${x-8},${y+12} ${x-6},${y+3} ${x-12},${y-3} ${x-4},${y-3}`}
        fill={accentColor} opacity="0.2" />
    ))}
    {[40, 100, 160, 220, 375, 435, 495, 555].map((x, i) =>
      [300, 400, 500].map((y, j) => (
        <circle key={`${i}-${j}`} cx={x} cy={y} r="2" fill={accentColor} opacity="0.12" />
      ))
    )}
  </svg>
);

const HoliMotif = () => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <ellipse cx="80" cy="420" rx="90" ry="70" fill="#FF1493" opacity="0.1" />
    <ellipse cx="515" cy="450" rx="80" ry="60" fill="#00CED1" opacity="0.1" />
    <ellipse cx="150" cy="720" rx="100" ry="65" fill="#FFD700" opacity="0.12" />
    <ellipse cx="460" cy="700" rx="85" ry="60" fill="#FF6B00" opacity="0.1" />
    <ellipse cx="297" cy="620" rx="120" ry="50" fill="#7B68EE" opacity="0.08" />
    {[[50,250],[545,260],[30,590],[565,600],[150,400],[450,440],[100,550],[490,380]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={10+i*2} fill={['#FF1493','#00CED1','#FFD700','#FF6B00','#7B68EE','#00FF7F','#FF4500','#4169E1'][i % 8]} opacity="0.15" />
    ))}
  </svg>
);

const EidMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 421)">
      <circle cx="-8" cy="0" r="50" fill={accentColor} opacity="0.12" />
      <circle cx="20" cy="0" r="42" fill="white" />
    </g>
    <polygon points="297,358 302,373 318,373 305,383 310,398 297,388 284,398 289,383 276,373 292,373"
      fill={accentColor} opacity="0.25" />
    {[[20, 160], [575, 160]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x},${y})`}>
        <rect x="-16" y="-16" width="32" height="32" fill="none" stroke={accentColor} strokeWidth="1" opacity="0.15" transform="rotate(45)" />
        <rect x="-10" y="-10" width="20" height="20" fill="none" stroke={accentColor} strokeWidth="1" opacity="0.1" transform="rotate(45)" />
      </g>
    ))}
    {[150, 297, 445].map((x, i) => (
      <g key={i} transform={`translate(${x},780)`}>
        <rect x="-12" y="-30" width="24" height="40" rx="4" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.2" />
        <line x1="0" y1="-30" x2="0" y2="-40" stroke={accentColor} strokeWidth="1.5" opacity="0.2" />
        <ellipse cx="0" cy="-10" rx="5" ry="6" fill={accentColor} opacity="0.12" />
      </g>
    ))}
    {[[80,300],[515,280],[60,600],[535,580],[180,750],[420,760]].map(([x,y],i) => (
      <polygon key={i} points={`${x},${y-6} ${x+2},${y-1} ${x+6},${y-1} ${x+3},${y+2} ${x+4},${y+7} ${x},${y+4} ${x-4},${y+7} ${x-3},${y+2} ${x-6},${y-1} ${x-2},${y-1}`}
        fill={accentColor} opacity="0.18" />
    ))}
  </svg>
);

const ChristmasMotif = ({ accentColor, secondaryColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {[[80,280],[515,300],[150,380],[450,360],[60,500],[540,480],[200,720],[395,730],[297,600]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`} opacity="0.18">
        <line x1="-10" y1="0" x2="10" y2="0" stroke={accentColor} strokeWidth="1.5" />
        <line x1="0" y1="-10" x2="0" y2="10" stroke={accentColor} strokeWidth="1.5" />
        <line x1="-7" y1="-7" x2="7" y2="7" stroke={accentColor} strokeWidth="1.5" />
        <line x1="7" y1="-7" x2="-7" y2="7" stroke={accentColor} strokeWidth="1.5" />
        {[0,45,90,135].map(a => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1="0" y1="-10" x2="-3" y2="-7" stroke={accentColor} strokeWidth="1" />
            <line x1="0" y1="-10" x2="3" y2="-7" stroke={accentColor} strokeWidth="1" />
          </g>
        ))}
      </g>
    ))}
    <g transform="translate(297, 500)" opacity="0.07">
      <polygon points="0,-50 -35,10 35,10" fill={accentColor} />
      <polygon points="0,-20 -45,30 45,30" fill={accentColor} />
      <polygon points="0,10 -55,55 55,55" fill={accentColor} />
      <rect x="-10" y="55" width="20" height="15" fill="#8B4513" />
    </g>
    {[[40, 800], [555, 800]].map(([x, y], i) => (
      <g key={i}>
        <ellipse cx={x} cy={y} rx="16" ry="8" fill="#1a4731" opacity="0.2" transform="rotate(-30)" />
        <ellipse cx={x+8} cy={y-5} rx="14" ry="7" fill="#1a4731" opacity="0.18" transform="rotate(20)" />
        <circle cx={x} cy={y} r="5" fill={secondaryColor} opacity="0.35" />
        <circle cx={x+6} cy={y-3} r="5" fill={secondaryColor} opacity="0.35" />
      </g>
    ))}
  </svg>
);

const NewYearMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {[[100,350],[500,320],[80,600],[510,580],[297,450]].map(([cx,cy],i) => {
      const colors = ['#FFD700','#C0C0C0','#FF69B4','#00FFFF','#FFD700'];
      const c = colors[i];
      const rays = 12;
      return (
        <g key={i} transform={`translate(${cx},${cy})`} opacity="0.2">
          {Array.from({length: rays}).map((_, r) => {
            const angle = (r / rays) * 360;
            const rad = (angle * Math.PI) / 180;
            const len = 20 + (i * 4);
            return <line key={r} x1="0" y1="0" x2={Math.cos(rad)*len} y2={Math.sin(rad)*len} stroke={c} strokeWidth="1.5" />;
          })}
          <circle cx="0" cy="0" r="4" fill={c} />
        </g>
      );
    })}
    <g transform="translate(297, 421)" opacity="0.1">
      <circle cx="0" cy="0" r="40" fill="none" stroke={accentColor} strokeWidth="2" />
      <circle cx="0" cy="0" r="36" fill="none" stroke={accentColor} strokeWidth="1" />
      <line x1="0" y1="-28" x2="0" y2="2" stroke={accentColor} strokeWidth="2" />
      <line x1="0" y1="0" x2="18" y2="0" stroke={accentColor} strokeWidth="2" />
    </g>
    {Array.from({length: 30}).map((_, i) => (
      <rect key={i} x={(i * 73) % 560 + 17} y={200 + (i * 137) % 600} width="4" height="4"
        fill={['#FFD700','#C0C0C0','#FF69B4','#00FFFF'][i % 4]} opacity="0.18" transform={`rotate(${i * 30})`} />
    ))}
  </svg>
);

const IndependenceMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 421)" opacity="0.15">
      <circle cx="0" cy="0" r="60" fill="none" stroke={accentColor} strokeWidth="3" />
      <circle cx="0" cy="0" r="10" fill={accentColor} />
      {Array.from({length: 24}).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        return <line key={i} x1={Math.cos(angle)*11} y1={Math.sin(angle)*11}
          x2={Math.cos(angle)*57} y2={Math.sin(angle)*57}
          stroke={accentColor} strokeWidth="1.5" />;
      })}
    </g>
    <g opacity="0.08">
      <path d="M 40 260 Q 180 250 297 260 Q 420 270 555 260 L 555 285 Q 420 295 297 285 Q 180 275 40 285 Z" fill="#FF9933" />
      <path d="M 40 285 Q 180 275 297 285 Q 420 295 555 285 L 555 310 Q 420 320 297 310 Q 180 300 40 310 Z" fill="#FFFFFF" />
      <path d="M 40 310 Q 180 300 297 310 Q 420 320 555 310 L 555 335 Q 420 345 297 335 Q 180 325 40 335 Z" fill="#138808" />
    </g>
    {[[50,200],[545,200],[50,792],[545,792]].map(([x,y],i) => (
      <polygon key={i} points={`${x},${y-8} ${x+2},${y-2} ${x+8},${y-2} ${x+3},${y+2} ${x+5},${y+8} ${x},${y+5} ${x-5},${y+8} ${x-3},${y+2} ${x-8},${y-2} ${x-2},${y-2}`}
        fill={accentColor} opacity="0.3" />
    ))}
  </svg>
);

const RakhiMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <path d="M 0 320 Q 150 300 297 320 Q 445 340 595 320" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.15" strokeDasharray="6,4" />
    <g transform="translate(297, 421)" opacity="0.18">
      <circle cx="0" cy="0" r="28" fill="none" stroke={accentColor} strokeWidth="2" />
      <circle cx="0" cy="0" r="16" fill={accentColor} opacity="0.3" />
      {Array.from({length: 8}).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return <ellipse key={i} cx={Math.cos(angle)*22} cy={Math.sin(angle)*22} rx="5" ry="3" fill={accentColor} transform={`rotate(${(i/8)*360},${Math.cos(angle)*22},${Math.sin(angle)*22})`} />;
      })}
    </g>
    {[[40,200],[555,200],[40,802],[555,802]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`} opacity="0.18">
        {[0,60,120,180,240,300].map(a => {
          const rad = (a * Math.PI) / 180;
          return <ellipse key={a} cx={Math.cos(rad)*12} cy={Math.sin(rad)*12} rx="6" ry="3" fill={accentColor}
            transform={`rotate(${a},${Math.cos(rad)*12},${Math.sin(rad)*12})`} />;
        })}
        <circle cx="0" cy="0" r="4" fill={accentColor} />
      </g>
    ))}
  </svg>
);

const GaneshMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <text x="297" y="450" textAnchor="middle" fontSize="100" fill={accentColor} opacity="0.08" fontFamily="serif">&#2384;</text>
    {[[50,220],[545,220],[50,792],[545,792],[297,792]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`} opacity="0.2">
        {[0,36,72,108,144,180,216,252,288,324].map(a => {
          const rad = (a * Math.PI) / 180;
          return <ellipse key={a} cx={Math.cos(rad)*10} cy={Math.sin(rad)*10} rx="7" ry="4" fill="#FF6B00"
            transform={`rotate(${a},${Math.cos(rad)*10},${Math.sin(rad)*10})`} />;
        })}
        <circle cx="0" cy="0" r="5" fill="#FFD700" />
      </g>
    ))}
  </svg>
);

const NavratriMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {[[80,750],[515,750]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y}) rotate(${i===0?-30:30})`} opacity="0.25">
        <rect x="-4" y="-60" width="8" height="60" rx="4" fill="#8B4513" />
        <circle cx="0" cy="-64" r="8" fill={accentColor} />
      </g>
    ))}
    <g transform="translate(297, 421)" opacity="0.12">
      {[20,36,52,68].map(r => (
        <circle key={r} cx="0" cy="0" r={r} fill="none" stroke={accentColor} strokeWidth="1" />
      ))}
      {Array.from({length: 8}).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return <line key={i} x1="0" y1="0" x2={Math.cos(angle)*68} y2={Math.sin(angle)*68}
          stroke={accentColor} strokeWidth="1" />;
      })}
    </g>
    {[[60,500],[535,500],[160,680],[435,680]].map(([x,y],i) => (
      <polygon key={i} points={`${x},${y-20} ${x+18},${y+12} ${x-18},${y+12}`}
        fill={['#CC0066','#FF6B00','#FFD700','#CC0066'][i]} opacity="0.18" />
    ))}
  </svg>
);

const OnamMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 421)" opacity="0.15">
      {[8,18,30,42,54,68].map(r => (
        <circle key={r} cx="0" cy="0" r={r} fill="none" stroke={accentColor} strokeWidth="1.5" />
      ))}
      {Array.from({length: 12}).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return <circle key={i} cx={Math.cos(angle)*70} cy={Math.sin(angle)*70} r="4" fill={accentColor} opacity="0.5" />;
      })}
    </g>
    {[[40,500],[555,500]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y}) rotate(${i===0?-20:20})`} opacity="0.18">
        <ellipse cx="0" cy="0" rx="18" ry="55" fill="#228B22" />
        <line x1="0" y1="-55" x2="0" y2="55" stroke="#006400" strokeWidth="2" />
      </g>
    ))}
    {Array.from({length: 20}).map((_, i) => (
      <circle key={i} cx={30 + i * 27} cy={820} r="3" fill={accentColor} opacity="0.2" />
    ))}
  </svg>
);

const DefaultFestivalMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <circle cx="297" cy="421" r="60" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.12" />
    <circle cx="297" cy="421" r="44" fill="none" stroke={accentColor} strokeWidth="1" opacity="0.1" />
    <circle cx="297" cy="421" r="28" fill={accentColor} opacity="0.06" />
    {[[40,200],[555,200],[40,802],[555,802]].map(([x,y],i) => (
      <polygon key={i} points={`${x},${y-10} ${x+3},${y-3} ${x+10},${y-3} ${x+5},${y+2} ${x+7},${y+10} ${x},${y+5} ${x-7},${y+10} ${x-5},${y+2} ${x-10},${y-3} ${x-3},${y-3}`}
        fill={accentColor} opacity="0.15" />
    ))}
  </svg>
);

const CelebrationMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {Array.from({length: 28}).map((_, i) => {
      const x = (i * 89) % 560 + 17;
      const y = 200 + (i * 113) % 600;
      const colors = ['#FFD700','#FF69B4','#00FFFF','#98FF98','#FF6B00','#C0C0C0'];
      const c = colors[i % colors.length];
      return <rect key={i} x={x} y={y} width="6" height="6" fill={c} opacity="0.2" transform={`rotate(${i*25},${x+3},${y+3})`} />;
    })}
    {[[80,350],[515,350],[150,650],[445,650]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`} opacity="0.15">
        <ellipse cx="0" cy="0" rx="18" ry="22" fill={accentColor} />
        <path d="M 0 22 Q 5 35 -3 50" fill="none" stroke={accentColor} strokeWidth="1.5" />
      </g>
    ))}
    <path d="M 0 160 Q 150 350 80 550 Q 20 750 150 842" fill="none" stroke="#FF69B4" strokeWidth="2" opacity="0.08" />
    <path d="M 595 160 Q 445 350 515 550 Q 575 750 445 842" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.08" />
  </svg>
);

const TownHallMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 421)" opacity="0.08">
      <rect x="-14" y="-30" width="28" height="40" rx="14" fill={accentColor} />
      <path d="M -22 5 Q -22 30 0 30 Q 22 30 22 5" fill="none" stroke={accentColor} strokeWidth="2" />
      <line x1="0" y1="30" x2="0" y2="45" stroke={accentColor} strokeWidth="2" />
      <line x1="-12" y1="45" x2="12" y2="45" stroke={accentColor} strokeWidth="2" />
    </g>
    {[250,350,450,550,650,750].map(y => (
      <line key={y} x1="0" y1={y} x2="595" y2={y} stroke={accentColor} strokeWidth="0.5" opacity="0.05" />
    ))}
    {[[0,160,1,1],[595,160,-1,1],[0,842,1,-1],[595,842,-1,-1]].map(([x,y,sx,sy],i) => (
      <g key={i} transform={`translate(${x},${y})`} opacity="0.15">
        <line x1="0" y1="0" x2={sx*40} y2="0" stroke={accentColor} strokeWidth="2" />
        <line x1="0" y1="0" x2="0" y2={sy*40} stroke={accentColor} strokeWidth="2" />
      </g>
    ))}
  </svg>
);

const RnRMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 421)" opacity="0.1">
      <path d="M -24 -30 L 24 -30 L 18 10 Q 0 20 -18 10 Z" fill={accentColor} />
      <rect x="-8" y="10" width="16" height="20" fill={accentColor} />
      <rect x="-18" y="30" width="36" height="6" rx="2" fill={accentColor} />
      <path d="M -24 -30 Q -40 -30 -40 -10 Q -40 10 -18 10" fill="none" stroke={accentColor} strokeWidth="3" />
      <path d="M 24 -30 Q 40 -30 40 -10 Q 40 10 18 10" fill="none" stroke={accentColor} strokeWidth="3" />
    </g>
    {[[60,250],[535,240],[80,680],[515,670],[180,760],[415,755]].map(([x,y],i) => (
      <polygon key={i} points={`${x},${y-8} ${x+2},${y-2} ${x+8},${y-2} ${x+3},${y+2} ${x+5},${y+8} ${x},${y+5} ${x-5},${y+8} ${x-3},${y+2} ${x-8},${y-2} ${x-2},${y-2}`}
        fill={accentColor} opacity="0.18" />
    ))}
    {Array.from({length: 15}).map((_, i) => (
      <rect key={i} x={(i*97)%555+20} y={200+(i*157)%580} width="5" height="5" fill={['#FFD700','#C0C0C0','#FF69B4'][i%3]} opacity="0.2" transform={`rotate(${i*24})`} />
    ))}
  </svg>
);

const HackathonMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <text x="80" y="420" fontSize="80" fill={accentColor} opacity="0.07" fontFamily="monospace">{'{}'}</text>
    <text x="420" y="680" fontSize="80" fill={accentColor} opacity="0.07" fontFamily="monospace">{'<>'}</text>
    {[[50,400,200,400],[200,400,200,450],[200,450,350,450],[400,500,550,500],[550,500,550,600]].map(([x1,y1,x2,y2],i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accentColor} strokeWidth="1.5" opacity="0.1" />
    ))}
    {[[200,400],[200,450],[350,450],[400,500],[550,500],[550,600]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="5" fill={accentColor} opacity="0.15" />
    ))}
    <g transform="translate(297, 421)" opacity="0.1">
      <path d="M 10 -35 L -6 0 L 4 0 L -10 35 L 18 -5 L 6 -5 Z" fill={accentColor} />
    </g>
  </svg>
);

const WellnessMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 421)" opacity="0.1">
      <path d="M 0 10 Q -30 -20 -30 -30 A 20 20 0 0 1 0 -15 A 20 20 0 0 1 30 -30 Q 30 -20 0 10 Z" fill={accentColor} />
    </g>
    {[[60,500],[535,500],[150,700],[445,700]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y}) rotate(${i*45})`} opacity="0.12">
        <ellipse cx="0" cy="0" rx="15" ry="30" fill={accentColor} />
        <line x1="0" y1="-30" x2="0" y2="30" stroke="white" strokeWidth="1" opacity="0.5" />
      </g>
    ))}
    {[30,50,70,90].map(r => (
      <circle key={r} cx="297" cy="421" r={r} fill="none" stroke={accentColor} strokeWidth="1" opacity="0.06" />
    ))}
  </svg>
);

const LaunchMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 421) rotate(-45)" opacity="0.1">
      <path d="M 0 -40 Q 15 -20 15 10 L 0 0 L -15 10 Q -15 -20 0 -40 Z" fill={accentColor} />
      <path d="M -15 10 Q -22 18 -18 26 L -6 18 Z" fill={accentColor} />
      <path d="M 15 10 Q 22 18 18 26 L 6 18 Z" fill={accentColor} />
      <circle cx="0" cy="0" r="6" fill={accentColor} opacity="0.5" />
    </g>
    {[[60,220],[535,200],[100,450],[490,480],[80,680],[510,660]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={2+i%3} fill={accentColor} opacity="0.2" />
    ))}
    {Array.from({length: 6}).map((_, r) =>
      Array.from({length: 6}).map((_, c) => (
        <circle key={`${r}-${c}`} cx={80 + c*85} cy={300 + r*100} r="2" fill={accentColor} opacity="0.08" />
      ))
    )}
  </svg>
);

const AnniversaryMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <path d="M 0 220 L 595 180" stroke={accentColor} strokeWidth="2" opacity="0.1" />
    <path d="M 0 842 L 595 800" stroke={accentColor} strokeWidth="2" opacity="0.1" />
    {Array.from({length: 10}).map((_, i) => {
      const x = 50 + i * 50;
      const y = 250 + i * 55;
      return <polygon key={i} points={`${x},${y-8} ${x+2},${y-2} ${x+8},${y-2} ${x+3},${y+2} ${x+5},${y+8} ${x},${y+5} ${x-5},${y+8} ${x-3},${y+2} ${x-8},${y-2} ${x-2},${y-2}`}
        fill={accentColor} opacity={0.08 + i*0.015} />;
    })}
    <circle cx="297" cy="421" r="55" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.12" />
    <circle cx="297" cy="421" r="40" fill={accentColor} opacity="0.06" />
  </svg>
);

const OffsiteMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g opacity="0.07">
      <path d="M 0 700 L 150 450 L 300 600 L 450 380 L 595 580 L 595 842 L 0 842 Z" fill={accentColor} />
    </g>
    <g transform="translate(480, 300)" opacity="0.12">
      <circle cx="0" cy="0" r="30" fill={accentColor} />
      {Array.from({length: 8}).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <line key={i} x1={Math.cos(a)*34} y1={Math.sin(a)*34} x2={Math.cos(a)*44} y2={Math.sin(a)*44}
          stroke={accentColor} strokeWidth="2" />;
      })}
    </g>
    <g transform="translate(100, 280)" opacity="0.1">
      <ellipse cx="20" cy="0" rx="25" ry="18" fill={accentColor} />
      <ellipse cx="0" cy="6" rx="20" ry="14" fill={accentColor} />
      <ellipse cx="40" cy="6" rx="20" ry="14" fill={accentColor} />
    </g>
  </svg>
);

const BuddhaMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 421)" opacity="0.12">
      {[0,36,72,108,144,180,216,252,288,324].map(a => {
        const rad = (a * Math.PI) / 180;
        return <ellipse key={a} cx={Math.cos(rad)*30} cy={Math.sin(rad)*30} rx="14" ry="7" fill={accentColor}
          transform={`rotate(${a},${Math.cos(rad)*30},${Math.sin(rad)*30})`} />;
      })}
      <circle cx="0" cy="0" r="12" fill={accentColor} opacity="0.5" />
    </g>
    {[[60,400],[535,400],[60,600],[535,600]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`} opacity="0.12">
        <path d={`M 0 -25 Q 20 0 0 25 Q -20 0 0 -25`} fill={accentColor} />
        <line x1="0" y1="-25" x2="0" y2="25" stroke="white" strokeWidth="1" opacity="0.5" />
      </g>
    ))}
    {Array.from({length: 8}).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return <circle key={i} cx={297 + Math.cos(a)*180} cy={421 + Math.sin(a)*140} r="3" fill={accentColor} opacity="0.15" />;
    })}
  </svg>
);

const GoodFridayMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 421)" opacity="0.1">
      <rect x="-5" y="-50" width="10" height="90" rx="2" fill={accentColor} />
      <rect x="-35" y="-20" width="70" height="12" rx="2" fill={accentColor} />
    </g>
    {Array.from({length: 12}).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <line key={i} x1={297 + Math.cos(a)*70} y1={421 + Math.sin(a)*70}
        x2={297 + Math.cos(a)*200} y2={421 + Math.sin(a)*200}
        stroke={accentColor} strokeWidth="1" opacity="0.05" />;
    })}
    {[[-50,0],[-30,15],[-10,25],[10,22],[30,12],[50,-2]].map(([dx,dy],i) => (
      <ellipse key={i} cx={297+dx} cy={750+dy} rx="12" ry="6" fill={accentColor} opacity="0.12" transform={`rotate(${i*15},${297+dx},${750+dy})`} />
    ))}
  </svg>
);

const MahavirMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 421)" opacity="0.08">
      <rect x="-5" y="-30" width="10" height="60" rx="2" fill={accentColor} />
      <rect x="-30" y="-5" width="60" height="10" rx="2" fill={accentColor} />
      <rect x="5" y="-30" width="15" height="10" rx="2" fill={accentColor} />
      <rect x="5" y="20" width="15" height="10" rx="2" fill={accentColor} transform="rotate(180,12.5,25)" />
      <rect x="-30" y="-30" width="10" height="15" rx="2" fill={accentColor} />
      <rect x="20" y="15" width="10" height="15" rx="2" fill={accentColor} />
    </g>
    {Array.from({length: 16}).map((_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return <circle key={i} cx={297 + Math.cos(a)*70} cy={421 + Math.sin(a)*70} r="3" fill={accentColor} opacity="0.15" />;
    })}
    {[[60,500],[535,500],[200,720],[395,720]].map(([x,y],i) => (
      <polygon key={i} points={`${x},${y-15} ${x+10},${y} ${x},${y+15} ${x-10},${y}`} fill={accentColor} opacity="0.15" />
    ))}
  </svg>
);

const LohriMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 750)" opacity="0.25">
      <polygon points="-30,0 30,0 20,-20 10,-10 0,-35 -10,-10 -20,-20" fill="#FF4500" />
      <polygon points="-20,-10 20,-10 12,-25 0,-40 -12,-25" fill="#FF6B00" />
      <polygon points="-10,-20 10,-20 0,-45" fill="#FFD700" />
      <ellipse cx="0" cy="5" rx="30" ry="8" fill="#8B4513" opacity="0.5" />
    </g>
    {[[260,720],[290,700],[320,715],[250,700],[340,725]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={2+i%3} fill="#FFD700" opacity={0.3+i*0.04} />
    ))}
    {[[60,500],[535,500]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`} opacity="0.18">
        <rect x="-4" y="-80" width="8" height="160" rx="4" fill="#228B22" />
        {[-60,-40,-20,0,20,40,60].map(dy => (
          <ellipse key={dy} cx={i===0?15:-15} cy={dy} rx="18" ry="6" fill="#228B22" transform={`rotate(${i===0?30:-30})`} />
        ))}
      </g>
    ))}
  </svg>
);

const BaisakhiMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    {[80,160,240,355,435,515].map((x, i) => (
      <g key={i} transform={`translate(${x}, 750) rotate(${-10+i*4})`} opacity="0.22">
        <rect x="-2" y="-100" width="4" height="100" fill="#D2691E" />
        {[-80,-60,-40,-20,0].map(y => (
          <ellipse key={y} cx={i%2===0?8:-8} cy={y} rx="10" ry="4" fill="#FFD700" transform={`rotate(${i%2===0?30:-30})`} />
        ))}
      </g>
    ))}
    <g transform="translate(297, 421)" opacity="0.1">
      <rect x="-4" y="-50" width="8" height="100" rx="2" fill={accentColor} />
      <ellipse cx="0" cy="0" rx="38" ry="38" fill="none" stroke={accentColor} strokeWidth="3" />
    </g>
    {Array.from({length: 8}).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return <line key={i} x1={297 + Math.cos(a)*42} y1={421 + Math.sin(a)*42}
        x2={297 + Math.cos(a)*62} y2={421 + Math.sin(a)*62}
        stroke={accentColor} strokeWidth="2" opacity="0.15" />;
    })}
  </svg>
);

const GurpurabMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <text x="297" y="460" textAnchor="middle" fontSize="100" fill={accentColor} opacity="0.08" fontFamily="serif">&#2873;</text>
    <rect x="20" y="160" width="555" height="662" rx="8" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.12" />
    <rect x="30" y="170" width="535" height="642" rx="6" fill="none" stroke={accentColor} strokeWidth="0.8" opacity="0.08" />
    {[100, 297, 495].map((x, i) => (
      <g key={i} transform={`translate(${x}, 780)`} opacity="0.2">
        <rect x="-10" y="-25" width="20" height="35" rx="3" fill="none" stroke={accentColor} strokeWidth="1.5" />
        <line x1="0" y1="-25" x2="0" y2="-35" stroke={accentColor} strokeWidth="1.5" />
        <ellipse cx="0" cy="-8" rx="4" ry="5" fill={accentColor} opacity="0.4" />
      </g>
    ))}
  </svg>
);

const DussehraMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 421)" opacity="0.1">
      <path d="M -30 -30 Q 0 0 -30 30" fill="none" stroke={accentColor} strokeWidth="3" />
      <line x1="-30" y1="-30" x2="-30" y2="30" stroke={accentColor} strokeWidth="1.5" />
      <line x1="-26" y1="0" x2="30" y2="0" stroke={accentColor} strokeWidth="2" />
      <polygon points="30,0 20,-5 22,0 20,5" fill={accentColor} />
    </g>
    {[[80,780],[297,760],[515,780]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`} opacity="0.2">
        <polygon points="0,-30 -12,0 12,0" fill="#FF4500" />
        <polygon points="0,-45 -6,-10 6,-10" fill="#FFD700" />
        <rect x="-12" y="0" width="24" height="30" fill="#8B4513" opacity="0.5" />
      </g>
    ))}
    {[[50,250],[545,260],[60,600],[535,590]].map(([x,y],i) => (
      <polygon key={i} points={`${x},${y-10} ${x+3},${y-3} ${x+10},${y-3} ${x+4},${y+2} ${x+6},${y+10} ${x},${y+6} ${x-6},${y+10} ${x-4},${y+2} ${x-10},${y-3} ${x-3},${y-3}`}
        fill={accentColor} opacity="0.18" />
    ))}
  </svg>
);

const PongalMotif = ({ accentColor }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }} viewBox="0 0 595 842" preserveAspectRatio="xMidYMid slice">
    <g transform="translate(297, 750)" opacity="0.22">
      <rect x="-25" y="-30" width="50" height="50" rx="8" fill={accentColor} />
      <ellipse cx="0" cy="-30" rx="28" ry="10" fill={accentColor} />
      <ellipse cx="0" cy="-40" rx="20" ry="12" fill={accentColor} opacity="0.7" />
      {[[-15,-42],[-5,-48],[5,-46],[15,-43],[-20,-38],[20,-39]].map(([dx,dy],i) => (
        <circle key={i} cx={dx} cy={dy} r="3" fill="white" opacity="0.6" />
      ))}
    </g>
    <g transform="translate(297, 421)" opacity="0.12">
      {[14,28,42,56].map(r => (
        <circle key={r} cx="0" cy="0" r={r} fill="none" stroke={accentColor} strokeWidth="1" />
      ))}
    </g>
    {[[25,500],[570,500]].map(([x,y],i) => (
      <rect key={i} x={x-4} y={y-150} width="8" height="300" rx="4" fill="#228B22" opacity="0.15" />
    ))}
  </svg>
);

// ─── Motif lookup ─────────────────────────────────────────────────────────────
const motifComponents = {
  diwali: DiwaliMotif,
  holi: HoliMotif,
  eid: EidMotif,
  christmas: ChristmasMotif,
  newyear: NewYearMotif,
  independence: IndependenceMotif,
  rakhi: RakhiMotif,
  ganesh: GaneshMotif,
  dussehra: DussehraMotif,
  navratri: NavratriMotif,
  onam: OnamMotif,
  pongal: PongalMotif,
  baisakhi: BaisakhiMotif,
  lohri: LohriMotif,
  gurpurab: GurpurabMotif,
  goodfriday: GoodFridayMotif,
  buddha: BuddhaMotif,
  mahavir: MahavirMotif,
  celebration: CelebrationMotif,
  townhall: TownHallMotif,
  rnr: RnRMotif,
  hackathon: HackathonMotif,
  wellness: WellnessMotif,
  offsite: OffsiteMotif,
  launch: LaunchMotif,
  anniversary: AnniversaryMotif,
};

// ─── Date helper ──────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

// ─── Shared Cars24 logo block ─────────────────────────────────────────────────
const Cars24LogoWhite = () => (
  <>
    <img
      src="/cars24-logo.png"
      alt="Cars24"
      style={{ height: '26px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'block';
      }}
    />
    <span style={{
      display: 'none',
      color: '#FFFFFF',
      fontSize: '20px',
      fontWeight: '800',
      letterSpacing: '0.5px',
    }}>
      Cars24
    </span>
  </>
);

// ─── Uploaded image block ─────────────────────────────────────────────────────
// Renders only when uploadedImage is set. Fixed size, centred, no placeholder shown.
const UploadedImageBlock = ({ src }) => {
  if (!src) return null;
  return (
    <div style={{
      width: '240px',
      height: '170px',
      borderRadius: '6px',
      overflow: 'hidden',
      flexShrink: 0,
      alignSelf: 'center',
      boxShadow: '0 4px 16px rgba(74,53,254,0.12)',
      margin: '4px 0 16px 0',
    }}>
      <img
        src={src}
        alt="Uploaded"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
};

// ─── Festival Wishes Canvas ───────────────────────────────────────────────────
const FestivalWishesCanvas = ({ template, formData }) => {
  const MotifComponent = motifComponents[template.motif] || DefaultFestivalMotif;
  const headline      = formData.headline?.trim()      || template.headline;
  const recipientName = formData.recipientName?.trim() || 'Team Cars24';
  const fromName      = formData.fromName?.trim()      || '';
  const fromTitle     = formData.fromTitle?.trim()     || '';
  const message       = formData.message               || template.defaultMessage;
  const footerText    = formData.footerText?.trim()    || 'Cars24 People Team';

  return (
    <div
      style={{
        width: '595px',
        height: '842px',
        background: BRAND.bg,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONT,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Purple header strip — brand locked ── */}
      <div style={{
        background: BRAND.headerGrad,
        width: '100%',
        minHeight: '140px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `24px ${LAYOUT.headerPadH}px 20px`,
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 2,
        flexShrink: 0,
      }}>
        {/* Cars24 logo — top-left, locked */}
        <div style={{ position: 'absolute', top: '18px', left: '32px', display: 'flex', alignItems: 'center' }}>
          <Cars24LogoWhite />
        </div>

        {/* Festival headline — editable text from formData */}
        <h1 style={{
          color: '#FFFFFF',
          fontSize: '38px',
          fontWeight: '800',
          textAlign: 'center',
          margin: '28px 0 0 0',
          lineHeight: '1.15',
          letterSpacing: '-0.5px',
          fontFamily: FONT,
        }}>
          {headline}
        </h1>

        {/* Accent underline — locked colour from template accent */}
        <div style={{
          width: '60px',
          height: '3px',
          background: template.accentColor,
          borderRadius: '2px',
          marginTop: '10px',
          opacity: 0.85,
        }} />
      </div>

      {/* ── White body area ── */}
      <div style={{
        flex: 1,
        background: BRAND.bodyWash,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `32px ${LAYOUT.bodyPadH}px 0`,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        {/* Motif watermark — position/opacity locked */}
        <MotifComponent accentColor={template.accentColor} secondaryColor={template.secondaryColor} />

        {/* Body content — sits above motif, zIndex: 1 */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          flex: 1,
        }}>
          {/* Dear + Recipient */}
          <p style={{
            color: BRAND.textSecond,
            fontSize: '14px',
            fontWeight: '400',
            margin: '0 0 6px 0',
            letterSpacing: '0.3px',
            fontFamily: FONT,
          }}>
            Dear
          </p>
          <h2 style={{
            color: BRAND.primary,
            fontSize: '32px',
            fontWeight: '700',
            textAlign: 'center',
            margin: '0 0 20px 0',
            letterSpacing: '-0.3px',
            fontFamily: FONT,
          }}>
            {recipientName}
          </h2>

          {/* Thin divider — festival accent */}
          <div style={{
            width: '48px',
            height: '2px',
            background: template.accentColor,
            borderRadius: '2px',
            marginBottom: '20px',
            opacity: 0.6,
          }} />

          {/* Uploaded image — centred, no placeholder */}
          <UploadedImageBlock src={formData.uploadedImage} />

          {/* Message */}
          <p style={{
            color: BRAND.textSecond,
            fontSize: '14.5px',
            lineHeight: '1.8',
            textAlign: 'center',
            maxWidth: '440px',
            margin: '0 0 auto 0',
            fontFamily: FONT,
          }}>
            {message}
          </p>

          {/* Signatory */}
          {(fromName || fromTitle) && (
            <div style={{
              textAlign: 'center',
              marginTop: '28px',
              borderTop: `1px solid ${BRAND.primary}20`,
              paddingTop: '18px',
              width: '100%',
            }}>
              {fromName && (
                <p style={{
                  color: BRAND.textPrimary,
                  fontSize: '15px',
                  fontWeight: '600',
                  margin: '0 0 3px 0',
                  fontFamily: FONT,
                }}>
                  {fromName}
                </p>
              )}
              {fromTitle && (
                <p style={{
                  color: BRAND.textSecond,
                  fontSize: '12px',
                  margin: 0,
                  letterSpacing: '0.4px',
                  fontFamily: FONT,
                }}>
                  {fromTitle}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Purple footer — brand locked ── */}
      <div style={{
        background: BRAND.primary,
        width: '100%',
        height: `${LAYOUT.footerH}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        zIndex: 2,
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.75)',
          fontSize: '10px',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          margin: 0,
          fontWeight: '500',
          fontFamily: FONT,
        }}>
          {footerText}
        </p>
      </div>
    </div>
  );
};

// ─── Event Announcement Canvas ────────────────────────────────────────────────
const EventAnnouncementCanvas = ({ template, formData }) => {
  const MotifComponent = motifComponents[template.motif] || DefaultFestivalMotif;
  const eventTitle   = formData.eventTitle?.trim()   || template.defaultTitle;
  const subheadline  = formData.subheadline?.trim()  || 'You are invited';
  const description  = formData.description          || template.defaultDescription;
  const footerText   = formData.footerText?.trim()   || 'Cars24 People Team';

  return (
    <div
      style={{
        width: '595px',
        height: '842px',
        background: BRAND.bg,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONT,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Purple header strip — brand locked ── */}
      <div style={{
        background: BRAND.headerGrad,
        width: '100%',
        minHeight: '150px',
        padding: '22px 36px 24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Logo + subheadline row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Cars24LogoWhite />
          </div>
          <span style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: '10px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontWeight: '500',
            fontFamily: FONT,
          }}>
            {subheadline}
          </span>
        </div>

        {/* Event title block */}
        <div>
          <p style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: '10px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            margin: '12px 0 6px 0',
            fontWeight: '500',
            fontFamily: FONT,
          }}>
            Cars24 Presents
          </p>
          <h1 style={{
            color: '#FFFFFF',
            fontSize: '32px',
            fontWeight: '800',
            lineHeight: '1.15',
            margin: '0',
            letterSpacing: '-0.5px',
            maxWidth: '480px',
            fontFamily: FONT,
          }}>
            {eventTitle}
          </h1>
          {/* Accent divider — template accent colour, locked */}
          <div style={{
            width: '48px',
            height: '3px',
            background: template.accentColor,
            borderRadius: '2px',
            marginTop: '10px',
            opacity: 0.9,
          }} />
        </div>
      </div>

      {/* ── White body area ── */}
      <div style={{
        flex: 1,
        background: BRAND.bodyWash,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: `32px ${LAYOUT.bodyPadHEv}px 0`,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        {/* Motif watermark */}
        <MotifComponent accentColor={template.accentColor} secondaryColor={template.secondaryColor} />

        {/* Body content */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Description */}
          <p style={{
            color: BRAND.textSecond,
            fontSize: '14.5px',
            lineHeight: '1.75',
            margin: '0 0 24px 0',
            maxWidth: '460px',
            fontFamily: FONT,
          }}>
            {description}
          </p>

          {/* Uploaded image */}
          {formData.uploadedImage && (
            <div style={{
              width: '240px',
              height: '160px',
              borderRadius: '6px',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 4px 16px rgba(74,53,254,0.12)',
              marginBottom: '20px',
            }}>
              <img
                src={formData.uploadedImage}
                alt="Uploaded"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )}

          {/* Details block */}
          <div style={{
            background: 'rgba(74,53,254,0.04)',
            border: `1px solid ${BRAND.primary}20`,
            borderLeft: `3px solid ${template.accentColor}`,
            borderRadius: '8px',
            padding: '22px 26px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxWidth: '440px',
          }}>
            {[
              { icon: '📅', label: 'Date',  value: formData.eventDate ? formatDate(formData.eventDate) : '' },
              { icon: '🕐', label: 'Time',  value: formData.eventTime },
              { icon: '📍', label: 'Venue', value: formData.venue },
              { icon: '📧', label: 'RSVP',  value: formData.rsvp },
            ].filter(item => item.value).map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '15px', lineHeight: '1.5' }}>{item.icon}</span>
                <div>
                  <p style={{
                    color: BRAND.primary,
                    fontSize: '9px',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    margin: '0 0 2px 0',
                    fontWeight: '700',
                    fontFamily: FONT,
                  }}>
                    {item.label}
                  </p>
                  <p style={{
                    color: BRAND.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500',
                    margin: 0,
                    fontFamily: FONT,
                  }}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Purple footer — brand locked ── */}
      <div style={{
        background: BRAND.primary,
        width: '100%',
        height: `${LAYOUT.footerH}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        zIndex: 2,
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.75)',
          fontSize: '10px',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          margin: 0,
          fontWeight: '500',
          fontFamily: FONT,
        }}>
          {footerText}
        </p>
      </div>
    </div>
  );
};

// ─── Public export ────────────────────────────────────────────────────────────
const PosterCanvas = forwardRef(({ template, formData, mode }, ref) => {
  return (
    <div ref={ref}>
      {mode === 'festival' ? (
        <FestivalWishesCanvas template={template} formData={formData} />
      ) : (
        <EventAnnouncementCanvas template={template} formData={formData} />
      )}
    </div>
  );
});

PosterCanvas.displayName = 'PosterCanvas';

export default PosterCanvas;
