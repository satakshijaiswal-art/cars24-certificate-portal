import { forwardRef } from 'react';

// ─── Cars24 brand tokens ──────────────────────────────────────────────────────
const B = {
  primary:       '#4A35FE',
  primaryLight:  '#6B57FF',
  primaryLighter:'#8B7BFF',
  primaryPale:   '#E8E4FF',
  primaryTint:   '#F4F1FF',
  primaryDark:   '#2E1FCC',
  white:         '#FFFFFF',
  offWhite:      '#FAFAFF',
  textPrimary:   '#1A1A1A',
  textSecondary: '#4A4A4A',
  headerGrad:    'linear-gradient(135deg, #4A35FE 0%, #6B57FF 100%)',
  heroGrad:      'linear-gradient(140deg, #2E1FCC 0%, #4A35FE 55%, #6B57FF 100%)',
  sidebarGrad:   'linear-gradient(180deg, #2E1FCC 0%, #4A35FE 100%)',
};

const FONT_BODY    = "'Inter', 'Segoe UI', system-ui, sans-serif";
const FONT_DISPLAY = "'Playfair Display', Georgia, serif";

// A4 at 96 dpi equivalent
const W = 595;
const H = 842;

// ─── Logo — uses SVG variants from /public ────────────────────────────────────
const Logo = ({ height = 40, invert = false, style: extraStyle = {} }) => (
  <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, ...extraStyle }}>
    <img
      src={import.meta.env.BASE_URL + (invert ? 'cars24-logo-white.svg' : 'cars24-logo.svg')}
      alt="Cars24"
      style={{
        height: `${height}px`,
        objectFit: 'contain',
        display: 'block',
      }}
    />
  </div>
);

// ─── Small-caps eyebrow / label ───────────────────────────────────────────────
const Eyebrow = ({ children, color = 'rgba(255,255,255,0.6)', size = '8px', spacing = '2.5px' }) => (
  <p style={{
    color, fontSize: size, fontWeight: '700',
    letterSpacing: spacing, textTransform: 'uppercase',
    margin: '0 0 5px 0', fontFamily: FONT_BODY,
  }}>{children}</p>
);

// ─── Numbered section badge ───────────────────────────────────────────────────
const Badge = ({ number, label, size = '22px', fontSize = '9px', labelSize = '9px' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${B.primary}, ${B.primaryLight})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ color: '#FFFFFF', fontSize, fontWeight: '800', fontFamily: FONT_BODY }}>
        {String(number).padStart(2, '0')}
      </span>
    </div>
    <span style={{
      color: B.primary,
      fontSize: labelSize,
      fontWeight: '700',
      letterSpacing: '1.8px',
      textTransform: 'uppercase',
      fontFamily: FONT_BODY,
    }}>{label}</span>
  </div>
);

// ─── Bullet list ──────────────────────────────────────────────────────────────
const BulletList = ({ text, color = B.textSecondary, fontSize = '11px', numbered = false }) => {
  if (!text) return null;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
      {lines.map((line, i) => (
        <li key={i} style={{
          display: 'flex', alignItems: 'flex-start', gap: '8px',
          marginBottom: '4px', color,
          fontSize, lineHeight: '1.65', fontFamily: FONT_BODY,
        }}>
          {numbered
            ? <span style={{
                color: B.primary, fontWeight: '800', fontFamily: FONT_DISPLAY,
                fontSize: '11px', marginTop: '0px', flexShrink: 0, minWidth: '18px',
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            : <span style={{ color: B.primary, fontWeight: '800', marginTop: '1px', flexShrink: 0, fontSize: '9px' }}>▸</span>
          }
          {line}
        </li>
      ))}
    </ul>
  );
};

// ─── Meta pill ────────────────────────────────────────────────────────────────
const MetaPill = ({ value, light = false }) => {
  if (!value) return null;
  return (
    <span style={{
      display: 'inline-block',
      border: light ? '1px solid rgba(255,255,255,0.35)' : `1px solid ${B.primary}`,
      borderRadius: '20px',
      padding: '3px 10px',
      color: light ? 'rgba(255,255,255,0.85)' : B.primary,
      fontSize: '9px',
      fontWeight: '600',
      fontFamily: FONT_BODY,
      letterSpacing: '0.3px',
    }}>
      {value}
    </span>
  );
};

// ─── Pull-quote block ─────────────────────────────────────────────────────────
const PullQuote = ({ text }) => {
  if (!text) return null;
  return (
    <div style={{
      position: 'relative',
      padding: '12px 16px 12px 20px',
      margin: '0 0 12px 0',
      background: B.primaryTint,
      borderLeft: `3px solid ${B.primary}`,
      borderRadius: '0 8px 8px 0',
    }}>
      <span style={{
        position: 'absolute',
        left: '10px',
        top: '4px',
        fontSize: '28px',
        lineHeight: '1',
        color: B.primary,
        opacity: 0.3,
        fontFamily: FONT_DISPLAY,
      }}>"</span>
      <p style={{
        color: B.primary,
        fontSize: '11px',
        fontWeight: '600',
        fontStyle: 'italic',
        lineHeight: '1.65',
        margin: 0,
        fontFamily: FONT_BODY,
      }}>{text}</p>
    </div>
  );
};

// ─── Divider ─────────────────────────────────────────────────────────────────
const Divider = ({ color = B.primaryPale, my = '10px' }) => (
  <div style={{ width: '100%', height: '1px', background: color, margin: `${my} 0` }} />
);

// ─── Apply CTA button ─────────────────────────────────────────────────────────
const ApplyButton = ({ link }) => {
  if (!link) return null;
  return (
    <div style={{
      display: 'inline-block',
      background: `linear-gradient(135deg, ${B.primary}, ${B.primaryLight})`,
      borderRadius: '24px',
      padding: '9px 22px',
      boxShadow: '0 4px 16px rgba(74,53,254,0.3)',
    }}>
      <span style={{
        color: '#FFFFFF',
        fontSize: '10.5px',
        fontWeight: '700',
        fontFamily: FONT_BODY,
        letterSpacing: '0.3px',
      }}>Apply Now →</span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 1 — EDITORIAL (classic layout)
// Purple header block (~220px) with logo top-left, "WE'RE HIRING" right,
// oversized Playfair role title, meta pills, vertical rule in body, purple footer CTA
// ═══════════════════════════════════════════════════════════════════════════════
const EditorialLayout = ({ form }) => (
  <div style={{ width: W, height: H, background: B.white, display: 'flex', flexDirection: 'column', fontFamily: FONT_BODY, overflow: 'hidden' }}>

    {/* Header block — ~220px purple */}
    <div style={{
      background: B.heroGrad,
      padding: '26px 36px 24px',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
      minHeight: '220px',
    }}>
      {/* Decorative rings */}
      <div style={{ position: 'absolute', right: '-60px', top: '-60px', width: '260px', height: '260px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.10)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: '50px', bottom: '-40px', width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)', pointerEvents: 'none' }} />

      {/* Logo row + WE'RE HIRING badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', position: 'relative', zIndex: 1 }}>
        <Logo height={40} invert />
        <div style={{ textAlign: 'right' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '20px', padding: '4px 14px', display: 'inline-block' }}>
            <span style={{ color: '#FFFFFF', fontSize: '8px', fontWeight: '700', letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: FONT_BODY }}>We're Hiring</span>
          </div>
        </div>
      </div>

      {/* Eyebrow */}
      <Eyebrow color="rgba(255,255,255,0.5)">{form.eyebrow || 'Cars24 · Hiring · 2026'}</Eyebrow>

      {/* Role title — Playfair 56px */}
      <h1 style={{
        color: '#FFFFFF', fontSize: '54px', fontWeight: '700',
        margin: '0 0 14px 0', lineHeight: '1.05',
        fontFamily: FONT_DISPLAY, letterSpacing: '-1px',
        maxWidth: '440px', position: 'relative', zIndex: 1,
      }}>
        {form.roleTitle || 'Role Title'}
      </h1>

      {/* Thin white divider */}
      <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.15)', margin: '0 0 12px', position: 'relative', zIndex: 1 }} />

      {/* Meta pills — outlined white */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        {[form.department, form.location, form.experience, form.employmentType].filter(Boolean).map((v, i) => (
          <MetaPill key={i} value={v} light />
        ))}
      </div>
    </div>

    {/* Gradient fade */}
    <div style={{ height: '3px', background: `linear-gradient(90deg, ${B.primary}, ${B.primaryLighter}, transparent)`, flexShrink: 0 }} />

    {/* Body — with vertical rule on left */}
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

      {/* Left vertical rule */}
      <div style={{ width: '3px', background: `linear-gradient(180deg, ${B.primary}, ${B.primaryLighter}, transparent)`, flexShrink: 0, opacity: 0.35 }} />

      <div style={{ flex: 1, padding: '18px 32px 14px 28px', display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden' }}>

        {/* Hook / pull-quote */}
        {(form.hook || form.pullQuote) && (
          <PullQuote text={form.pullQuote || form.hook} />
        )}

        {/* About */}
        {form.aboutRole && (
          <div>
            <Badge number={1} label="About the Role" />
            <p style={{ color: B.textSecondary, fontSize: '11px', lineHeight: '1.75', margin: 0, fontFamily: FONT_BODY }}>
              {form.aboutRole}
            </p>
          </div>
        )}

        {/* Two columns */}
        <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
          <div style={{ flex: 1 }}>
            {form.responsibilities && (
              <div>
                <Badge number={2} label="What You'll Do" />
                <BulletList text={form.responsibilities} numbered />
              </div>
            )}
          </div>
          <div style={{ width: '1px', background: B.primaryPale, flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {form.requirements && (
              <div>
                <Badge number={3} label="What You're Bringing" />
                <BulletList text={form.requirements} />
              </div>
            )}
            {form.perks && (
              <div>
                <Badge number={4} label="What You'll Get" />
                <BulletList text={form.perks} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Footer — solid purple with apply CTA */}
    <div style={{
      background: B.primary,
      padding: '14px 36px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div>
        {form.applyLink ? (
          <ApplyButton link={form.applyLink} />
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '10px', margin: 0, fontFamily: FONT_BODY }}>careers.cars24.com</p>
        )}
      </div>
      <div style={{ textAlign: 'right' }}>
        {(form.recruiterName || form.recruiterTitle) && (
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', margin: '0 0 4px', fontFamily: FONT_BODY }}>
            {form.recruiterName}{form.recruiterTitle ? ` · ${form.recruiterTitle}` : ''}
          </p>
        )}
        <Logo height={26} invert />
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 2 — MAGAZINE (bold hero)
// White background, purple gradient hero top-40%, giant Fraunces 72px role title,
// stat/quote area middle, clean two-column body, Cars24 logo bottom-right sign-off
// ═══════════════════════════════════════════════════════════════════════════════
const MagazineLayout = ({ form }) => (
  <div style={{ width: W, height: H, background: B.offWhite, display: 'flex', flexDirection: 'column', fontFamily: FONT_BODY, overflow: 'hidden' }}>

    {/* Hero — full-bleed purple gradient, ~340px */}
    <div style={{
      background: B.heroGrad,
      padding: '28px 40px 24px',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
      minHeight: '340px',
    }}>
      {/* Decorative circle compositions */}
      <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '340px', height: '340px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.09)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      {/* Dot cluster */}
      {[[480,140],[510,165],[455,158],[500,115],[535,180],[462,130]].map(([x,y],i) => (
        <div key={i} style={{ position: 'absolute', left: `${x - 400}px`, top: `${y - 20}px`, width: `${4+(i%3)*2}px`, height: `${4+(i%3)*2}px`, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', pointerEvents: 'none' }} />
      ))}

      {/* Logo row + JOIN CARS24 label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', position: 'relative', zIndex: 1 }}>
        <Logo height={44} invert />
        <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '4px 14px' }}>
          <span style={{ color: '#FFFFFF', fontSize: '8px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: FONT_BODY }}>Join Cars24</span>
        </div>
      </div>

      {/* Eyebrow */}
      <Eyebrow color="rgba(255,255,255,0.5)">{form.eyebrow || 'Cars24 · Hiring · 2026'}</Eyebrow>

      {/* Giant role title — Playfair 72px with gradient */}
      <h1 style={{
        color: '#FFFFFF',
        fontSize: '68px',
        fontWeight: '800',
        margin: '0 0 12px 0',
        lineHeight: '0.97',
        fontFamily: FONT_DISPLAY,
        letterSpacing: '-1.5px',
        maxWidth: '460px',
        position: 'relative',
        zIndex: 1,
      }}>
        {form.roleTitle || 'Role Title'}
      </h1>

      {/* Hook */}
      {form.hook && (
        <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '13px', fontWeight: '400', margin: '0 0 16px 0', fontFamily: FONT_BODY, fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
          {form.hook}
        </p>
      )}

      {/* Meta pills — outlined white */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        {[form.department, form.location, form.experience].filter(Boolean).map((v, i) => (
          <MetaPill key={i} value={v} light />
        ))}
      </div>
    </div>

    {/* Gradient fade */}
    <div style={{ height: '4px', background: `linear-gradient(90deg, ${B.primary}, ${B.primaryLighter}, transparent)`, flexShrink: 0 }} />

    {/* Pull-quote / stat area */}
    {form.pullQuote && (
      <div style={{
        padding: '14px 40px',
        background: B.white,
        borderBottom: `1px solid ${B.primaryPale}`,
        flexShrink: 0,
      }}>
        <p style={{
          color: B.primary,
          fontSize: '16px',
          fontWeight: '700',
          fontFamily: FONT_DISPLAY,
          fontStyle: 'italic',
          margin: 0,
          letterSpacing: '-0.3px',
        }}>
          "{form.pullQuote}"
        </p>
      </div>
    )}

    {/* White body — two columns */}
    <div style={{ flex: 1, padding: '16px 40px', display: 'flex', gap: '28px', overflow: 'hidden', background: B.white }}>
      <div style={{ flex: 1 }}>
        {form.aboutRole && (
          <div style={{ marginBottom: '12px' }}>
            <Badge number={1} label="About the Role" />
            <p style={{ color: B.textSecondary, fontSize: '11px', lineHeight: '1.75', margin: 0, fontFamily: FONT_BODY }}>
              {form.aboutRole}
            </p>
          </div>
        )}
        {form.responsibilities && (
          <div>
            <Badge number={2} label="What You'll Do" />
            <BulletList text={form.responsibilities} numbered />
          </div>
        )}
      </div>
      <div style={{ width: '1px', background: B.primaryPale, flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {form.requirements && (
          <div>
            <Badge number={3} label="What You're Bringing" />
            <BulletList text={form.requirements} />
          </div>
        )}
        {form.perks && (
          <div>
            <Badge number={4} label="What You'll Get" />
            <BulletList text={form.perks} />
          </div>
        )}
      </div>
    </div>

    {/* Footer */}
    <div style={{
      borderTop: `3px solid ${B.primary}`, background: B.white,
      padding: '12px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div>
        {form.applyLink ? <ApplyButton link={form.applyLink} /> : null}
        {form.recruiterName && (
          <p style={{ color: B.textSecondary, fontSize: '9px', margin: '6px 0 0', fontFamily: FONT_BODY }}>
            {form.recruiterName}{form.recruiterTitle ? ` · ${form.recruiterTitle}` : ''}
          </p>
        )}
      </div>
      <Logo height={28} />
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 3 — DOSSIER (split / magazine sidebar)
// Left 35% purple sidebar: logo top-centre, section labels in small caps,
// numbered circles, recruiter at bottom.
// Right 65% white: "WE'RE HIRING" label, Playfair 48px title, pull-quote with
// oversized quote mark, numbered circles for responsibilities, check bullets.
// ═══════════════════════════════════════════════════════════════════════════════
const DossierLayout = ({ form }) => (
  <div style={{ width: W, height: H, background: B.white, display: 'flex', flexDirection: 'row', fontFamily: FONT_BODY, overflow: 'hidden' }}>

    {/* Left Sidebar — deep purple */}
    <div style={{
      width: '205px',
      background: B.sidebarGrad,
      padding: '26px 18px',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Dot column decoration */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', right: '10px', top: `${90 + i * 36}px`,
          width: '3px', height: '3px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
        }} />
      ))}

      {/* Logo — centred at top */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
        <Logo height={38} invert />
      </div>

      {/* Vertical rule */}
      <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)', margin: '0 auto 14px' }} />

      {/* Meta stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        {[
          { label: 'Department', value: form.department },
          { label: 'Location',   value: form.location   },
          { label: 'Experience', value: form.experience },
          { label: 'Type',       value: form.employmentType },
          { label: 'Eyebrow',    value: form.eyebrow },
        ].filter(i => i.value).map((item, i) => (
          <div key={i}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '7px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 3px', fontFamily: FONT_BODY }}>{item.label}</p>
            <p style={{ color: '#FFFFFF', fontSize: '10.5px', fontWeight: '600', margin: 0, fontFamily: FONT_BODY, lineHeight: '1.4' }}>{item.value}</p>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Apply pill at bottom */}
      {form.applyLink && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.12)', marginBottom: '12px' }} />
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '7px', letterSpacing: '1.8px', textTransform: 'uppercase', margin: '0 0 5px', fontFamily: FONT_BODY }}>Apply Now</p>
          <div style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '20px', padding: '6px 12px', textAlign: 'center' }}>
            <p style={{ color: B.primaryPale, fontSize: '9px', fontWeight: '600', margin: 0, fontFamily: FONT_BODY, wordBreak: 'break-all', lineHeight: '1.4' }}>{form.applyLink}</p>
          </div>
        </div>
      )}

      {/* Recruiter block */}
      {form.recruiterName && (
        <div>
          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.12)', marginBottom: '10px' }} />
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
            <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '700', fontFamily: FONT_BODY }}>
              {(form.recruiterName || '?').charAt(0).toUpperCase()}
            </span>
          </div>
          <p style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: '600', margin: '0 0 2px', fontFamily: FONT_BODY }}>{form.recruiterName}</p>
          {form.recruiterTitle && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', margin: 0, fontFamily: FONT_BODY }}>{form.recruiterTitle}</p>}
        </div>
      )}
    </div>

    {/* Right Body */}
    <div style={{ flex: 1, padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden' }}>

      {/* "WE'RE HIRING" label */}
      <div style={{ display: 'inline-block', border: `1.5px solid ${B.primary}`, borderRadius: '3px', padding: '3px 10px', alignSelf: 'flex-start', marginBottom: '4px' }}>
        <span style={{ color: B.primary, fontSize: '7.5px', fontWeight: '700', letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: FONT_BODY }}>We're Hiring</span>
      </div>

      {/* Role title — Playfair 48px */}
      <h1 style={{
        color: B.primary, fontSize: '44px', fontWeight: '700',
        margin: '0 0 8px', lineHeight: '1.07',
        fontFamily: FONT_DISPLAY, letterSpacing: '-0.8px',
      }}>
        {form.roleTitle || 'Role Title'}
      </h1>

      {/* Hook */}
      {form.hook && (
        <p style={{ color: B.textSecondary, fontSize: '11.5px', fontStyle: 'italic', margin: '0 0 6px', fontFamily: FONT_BODY }}>
          {form.hook}
        </p>
      )}

      {/* Pull-quote — oversized opening quote */}
      <PullQuote text={form.pullQuote || 'Join 8,000+ Carters shaping the future of auto commerce.'} />

      {form.aboutRole && (
        <div>
          <Badge number={1} label="About the Role" />
          <p style={{ color: B.textSecondary, fontSize: '10.5px', lineHeight: '1.75', margin: 0, fontFamily: FONT_BODY }}>
            {form.aboutRole}
          </p>
        </div>
      )}

      {form.responsibilities && (
        <div>
          <Badge number={2} label="What You'll Do" />
          <BulletList text={form.responsibilities} fontSize="10.5px" numbered />
        </div>
      )}

      {form.requirements && (
        <div>
          <Badge number={3} label="What You're Bringing" />
          <BulletList text={form.requirements} fontSize="10.5px" />
        </div>
      )}

      {form.perks && (
        <div>
          <Badge number={4} label="What You'll Get" />
          <BulletList text={form.perks} fontSize="10.5px" />
        </div>
      )}

      <div style={{ flex: 1 }} />
      <p style={{ color: 'rgba(0,0,0,0.15)', fontSize: '8px', letterSpacing: '1px', margin: 0, textAlign: 'right', fontFamily: FONT_BODY }}>
        Team Cars24
      </p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 4 — TRI-FOLD (editorial cards)
// White background with faint purple dot grid, logo left, "WE'RE HIRING" right,
// hero row: role title Playfair 58px + location pill, three staggered cards each
// with purple top-border, big numeral, section title, bullets,
// bottom: purple CTA band with apply link.
// ═══════════════════════════════════════════════════════════════════════════════
const TriFoldLayout = ({ form }) => {
  const cardDrop = [0, 18, 36]; // staggered vertical offsets

  return (
    <div style={{ width: W, height: H, background: B.offWhite, display: 'flex', flexDirection: 'column', fontFamily: FONT_BODY, overflow: 'hidden', position: 'relative' }}>

      {/* Subtle dot-grid background */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} viewBox="0 0 595 842">
        {Array.from({ length: 20 }).map((_, row) =>
          Array.from({ length: 16 }).map((_, col) => (
            <circle key={`${row}-${col}`} cx={20 + col * 36} cy={20 + row * 40} r="1.5" fill={B.primary} opacity="0.06" />
          ))
        )}
      </svg>

      {/* Top bar — logo left, "WE'RE HIRING AT CARS24" right */}
      <div style={{
        background: B.white,
        borderBottom: `3px solid ${B.primary}`,
        padding: '14px 36px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
        position: 'relative', zIndex: 2,
      }}>
        <Logo height={38} />
        <div style={{ display: 'inline-block', border: `1.5px solid ${B.primary}`, borderRadius: '3px', padding: '3px 10px' }}>
          <span style={{ color: B.primary, fontSize: '7.5px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: FONT_BODY }}>We're Hiring at Cars24</span>
        </div>
      </div>

      {/* Hero row — role title + inline location pill + date */}
      <div style={{
        background: B.white,
        padding: '16px 36px 14px',
        borderBottom: `1px solid ${B.primaryPale}`,
        flexShrink: 0,
        position: 'relative', zIndex: 2,
      }}>
        <Eyebrow color={B.textSecondary} size="8px">{form.eyebrow || 'Cars24 · Hiring · 2026'}</Eyebrow>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', flexWrap: 'wrap' }}>
          <h1 style={{
            color: B.primary, fontSize: '54px', fontWeight: '800',
            margin: '2px 0 0', lineHeight: '1.0',
            fontFamily: FONT_DISPLAY, letterSpacing: '-1px',
          }}>
            {form.roleTitle || 'Role Title'}
          </h1>
          {form.location && (
            <span style={{
              display: 'inline-block',
              background: B.primaryPale,
              borderRadius: '20px', padding: '5px 12px',
              color: B.primary, fontSize: '10px', fontWeight: '600',
              fontFamily: FONT_BODY, marginBottom: '6px',
            }}>
              {form.location}
            </span>
          )}
        </div>
        {form.hook && (
          <p style={{ color: B.textSecondary, fontSize: '11.5px', fontStyle: 'italic', margin: '6px 0 0', fontFamily: FONT_BODY }}>
            {form.hook}
          </p>
        )}
      </div>

      {/* Pull-quote / about row */}
      {(form.pullQuote || form.aboutRole) && (
        <div style={{ padding: '10px 36px', background: B.white, borderBottom: `1px solid ${B.primaryPale}`, flexShrink: 0, zIndex: 2, position: 'relative' }}>
          {form.pullQuote && (
            <p style={{ color: B.primary, fontSize: '13px', fontWeight: '600', fontFamily: FONT_DISPLAY, fontStyle: 'italic', margin: '0 0 5px' }}>
              "{form.pullQuote}"
            </p>
          )}
          {form.aboutRole && (
            <p style={{ color: B.textSecondary, fontSize: '10px', lineHeight: '1.7', margin: 0, fontFamily: FONT_BODY }}>
              {form.aboutRole}
            </p>
          )}
        </div>
      )}

      {/* Three staggered content cards */}
      <div style={{ flex: 1, padding: '16px 36px 8px', display: 'flex', gap: '12px', alignItems: 'flex-start', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
        {[
          { num: 1, label: "What You'll Do",       text: form.responsibilities, borderColor: B.primary,       offset: cardDrop[0] },
          { num: 2, label: "What You're Bringing",  text: form.requirements,    borderColor: B.primaryLight,  offset: cardDrop[1] },
          { num: 3, label: "What You'll Get",       text: form.perks,           borderColor: B.primaryLighter, offset: cardDrop[2] },
        ].map(({ num, label, text, borderColor, offset }) => (
          <div key={num} style={{
            flex: 1,
            background: B.white,
            border: `1.5px solid ${B.primaryPale}`,
            borderTop: `3px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '20px 12px 12px',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            marginTop: `${offset}px`,
          }}>
            {/* Big numeral */}
            <div style={{
              fontSize: '32px', fontWeight: '900', fontFamily: FONT_DISPLAY,
              color: borderColor, opacity: 0.18, lineHeight: '1',
              position: 'absolute', top: '6px', right: '10px',
            }}>
              {String(num).padStart(2, '0')}
            </div>
            {/* Circular badge */}
            <div style={{
              position: 'absolute', top: '-13px', left: '12px',
              width: '26px', height: '26px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${borderColor}, ${borderColor}CC)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${B.white}`,
            }}>
              <span style={{ color: '#FFFFFF', fontSize: '9px', fontWeight: '800', fontFamily: FONT_BODY }}>
                {String(num).padStart(2, '0')}
              </span>
            </div>
            {/* Card heading */}
            <h3 style={{
              color: B.textPrimary, fontSize: '11px', fontWeight: '700',
              margin: '0 0 8px', fontFamily: FONT_DISPLAY, letterSpacing: '-0.2px',
            }}>{label}</h3>
            <BulletList text={text} fontSize="10px" />
          </div>
        ))}
      </div>

      {/* Bottom CTA band */}
      <div style={{
        background: B.primary,
        padding: '11px 36px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, zIndex: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {form.applyLink && (
            <p style={{ color: B.primaryPale, fontSize: '10px', fontFamily: FONT_BODY, fontWeight: '600', margin: 0 }}>
              Apply → <span style={{ color: 'rgba(255,255,255,0.85)' }}>{form.applyLink}</span>
            </p>
          )}
          {form.recruiterName && (
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '9px', fontFamily: FONT_BODY, margin: 0 }}>
              {form.recruiterName}{form.recruiterTitle ? ` · ${form.recruiterTitle}` : ''}
            </p>
          )}
        </div>
        <Logo height={26} invert />
      </div>
    </div>
  );
};

// ─── Layout map ───────────────────────────────────────────────────────────────
const layouts = {
  'classic':      EditorialLayout,
  'bold-hero':    MagazineLayout,
  'split':        DossierLayout,
  'modern-card':  TriFoldLayout,
};

// ═══════════════════════════════════════════════════════════════════════════════
// JDCanvas — main export
// ═══════════════════════════════════════════════════════════════════════════════
const JDCanvas = forwardRef(({ template, form }, ref) => {
  const Layout = layouts[template?.layout] || EditorialLayout;
  return (
    <div ref={ref} style={{ width: W, height: H, position: 'relative', overflow: 'hidden' }}>
      <Layout form={form} />
    </div>
  );
});

JDCanvas.displayName = 'JDCanvas';
export default JDCanvas;
