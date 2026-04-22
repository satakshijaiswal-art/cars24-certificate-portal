import { forwardRef } from 'react';

// ─── Cars24 brand tokens ──────────────────────────────────────────────────────
const B = {
  primary:       '#4A35FE',
  primaryLight:  '#6B57FF',
  primaryLighter:'#8B7BFF',
  primaryPale:   '#E8E4FF',
  primaryDark:   '#2E1FCC',
  white:         '#FFFFFF',
  offWhite:      '#FAFAFF',
  textPrimary:   '#1A1A1A',
  textSecondary: '#4A4A4A',
  headerGrad:    'linear-gradient(135deg, #4A35FE 0%, #6B57FF 100%)',
};

const FONT_BODY  = "'Inter', 'Segoe UI', system-ui, sans-serif";
const FONT_TITLE = "'Playfair Display', Georgia, serif";

// ─── A4 dimensions at 96dpi screen equivalent ─────────────────────────────────
// 595 × 842 px — same as poster
const W = 595;
const H = 842;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Logo = ({ invert = false }) => (
  <>
    <img
      src="/cars24-logo.png"
      alt="Cars24"
      style={{ height: '24px', objectFit: 'contain', ...(invert ? { filter: 'brightness(0) invert(1)' } : {}) }}
      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
    />
    <span style={{
      display: 'none',
      color: invert ? '#FFFFFF' : B.primary,
      fontSize: '20px',
      fontWeight: '800',
      fontFamily: FONT_BODY,
      letterSpacing: '-0.5px',
    }}>Cars24</span>
  </>
);

const BulletList = ({ text, color = B.textSecondary }) => {
  if (!text) return null;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
      {lines.map((line, i) => (
        <li key={i} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          marginBottom: '5px',
          color,
          fontSize: '11px',
          lineHeight: '1.6',
          fontFamily: FONT_BODY,
        }}>
          <span style={{ color: B.primary, fontWeight: '700', marginTop: '1px', flexShrink: 0 }}>•</span>
          {line}
        </li>
      ))}
    </ul>
  );
};

const SectionLabel = ({ children, color = B.primary }) => (
  <p style={{
    color,
    fontSize: '9px',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    margin: '0 0 6px 0',
    fontFamily: FONT_BODY,
  }}>
    {children}
  </p>
);

const Divider = ({ color = B.primaryPale, my = '12px' }) => (
  <div style={{ width: '100%', height: '1px', background: color, margin: `${my} 0` }} />
);

// ─── META ROW (icon-less) ─────────────────────────────────────────────────────
const MetaTag = ({ label, value, light = false }) => (
  value ? (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      gap: '2px',
    }}>
      <span style={{ color: light ? 'rgba(255,255,255,0.55)' : B.textSecondary, fontSize: '8px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: FONT_BODY }}>{label}</span>
      <span style={{ color: light ? '#FFFFFF' : B.textPrimary, fontSize: '11px', fontWeight: '600', fontFamily: FONT_BODY }}>{value}</span>
    </div>
  ) : null
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 1 — CLASSIC
// Cars24 purple header strip, white body, purple footer
// ═══════════════════════════════════════════════════════════════════════════════
const ClassicLayout = ({ form }) => (
  <div style={{ width: W, height: H, background: B.white, display: 'flex', flexDirection: 'column', fontFamily: FONT_BODY, overflow: 'hidden' }}>
    {/* Header */}
    <div style={{
      background: B.headerGrad,
      padding: '28px 36px 24px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Logo invert />
        <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: FONT_BODY }}>
          {form.employmentType || 'Full-time'}
        </span>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 6px 0', fontFamily: FONT_BODY }}>
        We are hiring
      </p>
      <h1 style={{ color: '#FFFFFF', fontSize: '30px', fontWeight: '700', margin: '0 0 14px 0', lineHeight: '1.15', fontFamily: FONT_TITLE, letterSpacing: '-0.3px' }}>
        {form.roleTitle || 'Role Title'}
      </h1>
      <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
        <MetaTag label="Department" value={form.department} light />
        <MetaTag label="Location" value={form.location} light />
        <MetaTag label="Experience" value={form.experience} light />
      </div>
    </div>

    {/* Body */}
    <div style={{ flex: 1, padding: '28px 36px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* About */}
      {form.aboutRole && (
        <div>
          <SectionLabel>About the Role</SectionLabel>
          <p style={{ color: B.textSecondary, fontSize: '11.5px', lineHeight: '1.75', margin: 0, fontFamily: FONT_BODY }}>
            {form.aboutRole}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '28px', flex: 1 }}>
        {/* Left col */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {form.responsibilities && (
            <div>
              <SectionLabel>Key Responsibilities</SectionLabel>
              <BulletList text={form.responsibilities} />
            </div>
          )}
        </div>
        {/* Right col */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {form.requirements && (
            <div>
              <SectionLabel>What We Are Looking For</SectionLabel>
              <BulletList text={form.requirements} />
            </div>
          )}
          {form.perks && (
            <div>
              <SectionLabel>What You Will Get</SectionLabel>
              <BulletList text={form.perks} />
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Footer */}
    <div style={{
      background: B.primaryDark,
      padding: '14px 36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div>
        {form.applyLink && (
          <p style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: '600', margin: '0 0 2px 0', fontFamily: FONT_BODY }}>
            Apply: <span style={{ color: B.primaryPale }}>{form.applyLink}</span>
          </p>
        )}
        {(form.recruiterName || form.recruiterTitle) && (
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9.5px', margin: 0, fontFamily: FONT_BODY }}>
            Contact: {form.recruiterName}{form.recruiterTitle ? ` · ${form.recruiterTitle}` : ''}
          </p>
        )}
      </div>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '8.5px', letterSpacing: '1px', margin: 0, fontFamily: FONT_BODY }}>
        Team Cars24
      </p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 2 — BOLD HERO
// Large purple hero block, clean minimal body
// ═══════════════════════════════════════════════════════════════════════════════
const BoldHeroLayout = ({ form }) => (
  <div style={{ width: W, height: H, background: B.offWhite, display: 'flex', flexDirection: 'column', fontFamily: FONT_BODY, overflow: 'hidden' }}>
    {/* Hero */}
    <div style={{
      background: 'linear-gradient(140deg, #2E1FCC 0%, #4A35FE 55%, #6B57FF 100%)',
      padding: '40px 40px 32px',
      minHeight: '240px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background circle decoration */}
      <div style={{ position: 'absolute', right: '-60px', top: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: '20px', bottom: '-80px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <Logo invert />
        <div style={{
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '20px',
          padding: '4px 12px',
        }}>
          <span style={{ color: '#FFFFFF', fontSize: '9px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: FONT_BODY }}>
            {form.employmentType || 'Full-time'}
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ color: '#FFFFFF', fontSize: '36px', fontWeight: '800', margin: '0 0 16px 0', lineHeight: '1.1', fontFamily: FONT_TITLE, letterSpacing: '-0.5px', maxWidth: '460px' }}>
          {form.roleTitle || 'Role Title'}
        </h1>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {[
            form.department && { label: form.department },
            form.location && { label: form.location },
            form.experience && { label: form.experience },
          ].filter(Boolean).map((item, i) => (
            <span key={i} style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '11px',
              fontFamily: FONT_BODY,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: B.primaryLighter, display: 'inline-block', flexShrink: 0 }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Body */}
    <div style={{ flex: 1, padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'hidden' }}>
      {form.aboutRole && (
        <div>
          <SectionLabel>About the Role</SectionLabel>
          <p style={{ color: B.textSecondary, fontSize: '11.5px', lineHeight: '1.75', margin: 0, fontFamily: FONT_BODY }}>
            {form.aboutRole}
          </p>
        </div>
      )}

      <Divider color={B.primaryPale} />

      <div style={{ display: 'flex', gap: '32px', flex: 1 }}>
        <div style={{ flex: 1 }}>
          {form.responsibilities && (
            <>
              <SectionLabel>Key Responsibilities</SectionLabel>
              <BulletList text={form.responsibilities} />
            </>
          )}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {form.requirements && (
            <div>
              <SectionLabel>What We Are Looking For</SectionLabel>
              <BulletList text={form.requirements} />
            </div>
          )}
          {form.perks && (
            <div>
              <SectionLabel>What You Will Get</SectionLabel>
              <BulletList text={form.perks} />
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Footer bar */}
    <div style={{
      borderTop: `3px solid ${B.primary}`,
      padding: '12px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: B.white,
      flexShrink: 0,
    }}>
      {form.applyLink ? (
        <p style={{ color: B.primary, fontSize: '11px', fontWeight: '700', margin: 0, fontFamily: FONT_BODY }}>
          Apply: {form.applyLink}
        </p>
      ) : <span />}
      <p style={{ color: B.textSecondary, fontSize: '9px', letterSpacing: '1px', margin: 0, fontFamily: FONT_BODY }}>
        careers.cars24.com
      </p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 3 — SPLIT
// Left purple sidebar (role meta), right white body
// ═══════════════════════════════════════════════════════════════════════════════
const SplitLayout = ({ form }) => (
  <div style={{ width: W, height: H, background: B.white, display: 'flex', flexDirection: 'row', fontFamily: FONT_BODY, overflow: 'hidden' }}>
    {/* Left Sidebar */}
    <div style={{
      width: '190px',
      background: B.headerGrad,
      padding: '28px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      flexShrink: 0,
    }}>
      <Logo invert />

      <div style={{ marginTop: '8px' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 6px 0', fontFamily: FONT_BODY }}>Role</p>
        <h2 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '700', margin: 0, lineHeight: '1.3', fontFamily: FONT_TITLE, letterSpacing: '-0.2px' }}>
          {form.roleTitle || 'Role Title'}
        </h2>
      </div>

      <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.15)' }} />

      {[
        { label: 'Department', value: form.department },
        { label: 'Location', value: form.location },
        { label: 'Experience', value: form.experience },
        { label: 'Type', value: form.employmentType },
      ].filter(i => i.value).map((item, i) => (
        <div key={i}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 4px 0', fontFamily: FONT_BODY }}>{item.label}</p>
          <p style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: '600', margin: 0, fontFamily: FONT_BODY, lineHeight: '1.4' }}>{item.value}</p>
        </div>
      ))}

      <div style={{ flex: 1 }} />

      {form.applyLink && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 4px 0', fontFamily: FONT_BODY }}>Apply At</p>
          <p style={{ color: B.primaryPale, fontSize: '10px', fontWeight: '600', margin: 0, fontFamily: FONT_BODY, wordBreak: 'break-all', lineHeight: '1.4' }}>{form.applyLink}</p>
        </div>
      )}
      {form.recruiterName && (
        <div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 4px 0', fontFamily: FONT_BODY }}>Contact</p>
          <p style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: '600', margin: '0 0 2px 0', fontFamily: FONT_BODY }}>{form.recruiterName}</p>
          {form.recruiterTitle && <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '9px', margin: 0, fontFamily: FONT_BODY }}>{form.recruiterTitle}</p>}
        </div>
      )}
    </div>

    {/* Right Body */}
    <div style={{ flex: 1, padding: '32px 30px', display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
      {form.aboutRole && (
        <div>
          <SectionLabel>About the Role</SectionLabel>
          <p style={{ color: B.textSecondary, fontSize: '11px', lineHeight: '1.75', margin: 0, fontFamily: FONT_BODY }}>
            {form.aboutRole}
          </p>
        </div>
      )}

      {form.responsibilities && (
        <div>
          <SectionLabel>Key Responsibilities</SectionLabel>
          <BulletList text={form.responsibilities} />
        </div>
      )}

      {form.requirements && (
        <div>
          <SectionLabel>What We Are Looking For</SectionLabel>
          <BulletList text={form.requirements} />
        </div>
      )}

      {form.perks && (
        <div>
          <SectionLabel>What You Will Get</SectionLabel>
          <BulletList text={form.perks} />
        </div>
      )}

      <div style={{ flex: 1 }} />
      <p style={{ color: 'rgba(0,0,0,0.2)', fontSize: '8.5px', letterSpacing: '1px', margin: 0, textAlign: 'right', fontFamily: FONT_BODY }}>
        Team Cars24
      </p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 4 — MODERN CARD
// White BG, three purple-bordered content cards
// ═══════════════════════════════════════════════════════════════════════════════
const ModernCardLayout = ({ form }) => (
  <div style={{ width: W, height: H, background: B.offWhite, display: 'flex', flexDirection: 'column', fontFamily: FONT_BODY, overflow: 'hidden' }}>
    {/* Top bar */}
    <div style={{
      background: B.white,
      borderBottom: `3px solid ${B.primary}`,
      padding: '18px 36px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0,
    }}>
      <Logo />
      <div style={{
        background: B.primaryPale,
        borderRadius: '20px',
        padding: '4px 14px',
      }}>
        <span style={{ color: B.primary, fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: FONT_BODY }}>
          {form.employmentType || 'Full-time'}
        </span>
      </div>
    </div>

    {/* Role hero row */}
    <div style={{
      background: B.white,
      padding: '22px 36px 18px',
      borderBottom: `1px solid ${B.primaryPale}`,
      flexShrink: 0,
    }}>
      <h1 style={{ color: B.primary, fontSize: '28px', fontWeight: '800', margin: '0 0 10px 0', lineHeight: '1.15', fontFamily: FONT_TITLE, letterSpacing: '-0.3px' }}>
        {form.roleTitle || 'Role Title'}
      </h1>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {[form.department, form.location, form.experience].filter(Boolean).map((val, i) => (
          <span key={i} style={{
            color: B.textSecondary,
            fontSize: '11px',
            fontFamily: FONT_BODY,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: B.primary, display: 'inline-block', flexShrink: 0 }} />
            {val}
          </span>
        ))}
      </div>
    </div>

    {/* About role */}
    {form.aboutRole && (
      <div style={{ padding: '16px 36px', background: B.white, borderBottom: `1px solid ${B.primaryPale}`, flexShrink: 0 }}>
        <SectionLabel>About the Role</SectionLabel>
        <p style={{ color: B.textSecondary, fontSize: '11px', lineHeight: '1.7', margin: 0, fontFamily: FONT_BODY }}>
          {form.aboutRole}
        </p>
      </div>
    )}

    {/* Three cards */}
    <div style={{ flex: 1, padding: '16px 36px', display: 'flex', gap: '14px', overflow: 'hidden' }}>
      {/* Card 1 — Responsibilities */}
      <div style={{
        flex: 1,
        background: B.white,
        border: `1.5px solid ${B.primaryPale}`,
        borderTop: `3px solid ${B.primary}`,
        borderRadius: '8px',
        padding: '16px 14px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <SectionLabel>What You Will Do</SectionLabel>
        <BulletList text={form.responsibilities} />
      </div>

      {/* Card 2 — Requirements */}
      <div style={{
        flex: 1,
        background: B.white,
        border: `1.5px solid ${B.primaryPale}`,
        borderTop: `3px solid ${B.primaryLight}`,
        borderRadius: '8px',
        padding: '16px 14px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <SectionLabel>What We Are Looking For</SectionLabel>
        <BulletList text={form.requirements} />
      </div>

      {/* Card 3 — Perks */}
      <div style={{
        flex: 1,
        background: B.white,
        border: `1.5px solid ${B.primaryPale}`,
        borderTop: `3px solid ${B.primaryLighter}`,
        borderRadius: '8px',
        padding: '16px 14px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <SectionLabel>What You Will Get</SectionLabel>
        <BulletList text={form.perks} />
      </div>
    </div>

    {/* Footer */}
    <div style={{
      background: B.white,
      borderTop: `1px solid ${B.primaryPale}`,
      padding: '12px 36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div>
        {form.applyLink && (
          <p style={{ color: B.primary, fontSize: '10.5px', fontWeight: '700', margin: '0 0 2px 0', fontFamily: FONT_BODY }}>
            Apply: {form.applyLink}
          </p>
        )}
        {(form.recruiterName || form.recruiterTitle) && (
          <p style={{ color: B.textSecondary, fontSize: '9.5px', margin: 0, fontFamily: FONT_BODY }}>
            Contact: {form.recruiterName}{form.recruiterTitle ? ` · ${form.recruiterTitle}` : ''}
          </p>
        )}
      </div>
      <p style={{ color: 'rgba(0,0,0,0.25)', fontSize: '8.5px', letterSpacing: '1px', margin: 0, fontFamily: FONT_BODY }}>
        Team Cars24
      </p>
    </div>
  </div>
);

// ─── Layout map ───────────────────────────────────────────────────────────────
const layouts = {
  'classic':      ClassicLayout,
  'bold-hero':    BoldHeroLayout,
  'split':        SplitLayout,
  'modern-card':  ModernCardLayout,
};

// ═══════════════════════════════════════════════════════════════════════════════
// JDCanvas — main export
// ═══════════════════════════════════════════════════════════════════════════════
const JDCanvas = forwardRef(({ template, form }, ref) => {
  const Layout = layouts[template?.layout] || ClassicLayout;
  return (
    <div ref={ref} style={{ width: W, height: H, position: 'relative', overflow: 'hidden' }}>
      <Layout form={form} />
    </div>
  );
});

JDCanvas.displayName = 'JDCanvas';
export default JDCanvas;
