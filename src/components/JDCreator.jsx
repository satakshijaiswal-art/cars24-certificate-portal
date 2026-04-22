import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ArrowLeft, Download, Briefcase } from 'lucide-react';
import JDCanvas from './JDCanvas';
import { jdTemplates, defaultJDForm } from './jdTemplates';

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const B = {
  primary: '#4736FE',
  primaryLight: '#6B57FF',
  primaryPale: '#E8E4FF',
};

// ─── Shared input styles ──────────────────────────────────────────────────────
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

const sectionHeadStyle = {
  color: '#FFFFFF',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  marginBottom: '12px',
  paddingBottom: '8px',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
};

// ─── Template thumbnail ───────────────────────────────────────────────────────
function JDTemplateThumbnail({ template, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderRadius: '10px',
        border: selected ? `2px solid ${B.primary}` : '2px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        background: '#1c1c1c',
        flexShrink: 0,
      }}
      onMouseOver={(e) => {
        if (!selected) e.currentTarget.style.border = `2px solid rgba(71,54,254,0.5)`;
      }}
      onMouseOut={(e) => {
        if (!selected) e.currentTarget.style.border = '2px solid rgba(255,255,255,0.08)';
      }}
    >
      <div style={{
        width: '100%',
        height: '90px',
        background: 'linear-gradient(135deg, #4736FE 0%, #6B57FF 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Briefcase size={28} color="rgba(255,255,255,0.6)" />
      </div>
      <div style={{ padding: '8px 10px' }}>
        <p style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: '600', margin: '0 0 2px 0' }}>
          {template.name}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', margin: 0, lineHeight: '1.4' }}>
          {template.description}
        </p>
      </div>
    </div>
  );
}

// ─── Field group ──────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// JDCreator — main component
// ═══════════════════════════════════════════════════════════════════════════════
export default function JDCreator({ onBack }) {
  const [selectedTemplate, setSelectedTemplate] = useState(jdTemplates[0]);
  const [form, setForm] = useState(defaultJDForm());
  const [isDownloading, setIsDownloading] = useState(false);

  const canvasRef = useRef(null);
  const exportRef = useRef(null);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDownloadPNG = async () => {
    if (!exportRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `jd-${(form.roleTitle || 'job-description').replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!exportRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      });
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      pdf.save(`jd-${(form.roleTitle || 'job-description').replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', backgroundColor: '#1c1c1c', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left sidebar — template picker ── */}
      <div style={{
        width: '220px',
        backgroundColor: '#161616',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Back + title */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
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
              marginBottom: '16px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={16} color={B.primary} />
            <h2 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '700', margin: 0 }}>JD Creator</h2>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: '4px 0 0 0' }}>Job Description</p>
        </div>

        {/* Templates */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
            Templates
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {jdTemplates.map((t) => (
              <JDTemplateThumbnail
                key={t.id}
                template={t}
                selected={selectedTemplate.id === t.id}
                onClick={() => setSelectedTemplate(t)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Centre — canvas preview ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#222222' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignSelf: 'flex-end' }}>
          <button
            onClick={handleDownloadPNG}
            disabled={isDownloading}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              padding: '9px 18px',
              color: '#FFFFFF',
              cursor: isDownloading ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontFamily: "'Inter', sans-serif",
              opacity: isDownloading ? 0.6 : 1,
            }}
          >
            <Download size={14} />
            PNG
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            style={{
              background: `linear-gradient(135deg, ${B.primary} 0%, ${B.primaryLight} 100%)`,
              border: 'none',
              borderRadius: '8px',
              padding: '9px 18px',
              color: '#FFFFFF',
              cursor: isDownloading ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 4px 14px rgba(71,54,254,0.3)',
              opacity: isDownloading ? 0.6 : 1,
            }}
          >
            <Download size={14} />
            {isDownloading ? 'Downloading…' : 'PDF'}
          </button>
        </div>

        {/* Visible preview — scaled */}
        <div
          ref={canvasRef}
          style={{
            transform: 'scale(0.72)',
            transformOrigin: 'top center',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <JDCanvas template={selectedTemplate} form={form} />
        </div>
      </div>

      {/* ── Right sidebar — edit panel ── */}
      <div style={{
        width: '280px',
        backgroundColor: '#161616',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        overflowY: 'auto',
        padding: '20px 16px',
        flexShrink: 0,
      }}>
        <p style={{ ...sectionHeadStyle }}>Role Details</p>

        <Field label="Role Title">
          <input
            style={inputStyle}
            value={form.roleTitle}
            onChange={(e) => updateField('roleTitle', e.target.value)}
            placeholder="e.g. Senior Product Manager"
          />
        </Field>

        <Field label="Department / Function">
          <input
            style={inputStyle}
            value={form.department}
            onChange={(e) => updateField('department', e.target.value)}
            placeholder="e.g. Product"
          />
        </Field>

        <Field label="Location">
          <input
            style={inputStyle}
            value={form.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="e.g. Gurgaon / Remote"
          />
        </Field>

        <Field label="Experience">
          <input
            style={inputStyle}
            value={form.experience}
            onChange={(e) => updateField('experience', e.target.value)}
            placeholder="e.g. 5–8 years"
          />
        </Field>

        <Field label="Employment Type">
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={form.employmentType}
            onChange={(e) => updateField('employmentType', e.target.value)}
          >
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
        </Field>

        <div style={{ ...sectionHeadStyle, marginTop: '8px' }}>Editorial Details</div>

        <Field label="Eyebrow Text">
          <input
            style={inputStyle}
            value={form.eyebrow}
            onChange={(e) => updateField('eyebrow', e.target.value)}
            placeholder="Cars24 · Hiring · 2026"
          />
        </Field>

        <Field label="One-line Hook / Tagline">
          <input
            style={inputStyle}
            value={form.hook}
            onChange={(e) => updateField('hook', e.target.value)}
            placeholder="Build what moves millions."
          />
        </Field>

        <Field label="Pull-quote / Stat (optional)">
          <input
            style={inputStyle}
            value={form.pullQuote}
            onChange={(e) => updateField('pullQuote', e.target.value)}
            placeholder="Join 8,000+ Carters shaping the future..."
          />
        </Field>

        <div style={{ ...sectionHeadStyle, marginTop: '8px' }}>Content</div>

        <Field label="About the Role">
          <textarea
            style={{ ...textareaStyle, minHeight: '70px' }}
            value={form.aboutRole}
            onChange={(e) => updateField('aboutRole', e.target.value)}
            placeholder="Brief description of the role..."
          />
        </Field>

        <Field label="Key Responsibilities (one per line)">
          <textarea
            style={{ ...textareaStyle, minHeight: '90px' }}
            value={form.responsibilities}
            onChange={(e) => updateField('responsibilities', e.target.value)}
            placeholder="Lead product roadmap&#10;Collaborate with engineering..."
          />
        </Field>

        <Field label="Requirements (one per line)">
          <textarea
            style={{ ...textareaStyle, minHeight: '90px' }}
            value={form.requirements}
            onChange={(e) => updateField('requirements', e.target.value)}
            placeholder="5+ years experience&#10;Strong analytical skills..."
          />
        </Field>

        <Field label="Perks / What You'll Get (one per line, optional)">
          <textarea
            style={{ ...textareaStyle, minHeight: '70px' }}
            value={form.perks}
            onChange={(e) => updateField('perks', e.target.value)}
            placeholder="Competitive salary&#10;Flexible working..."
          />
        </Field>

        <div style={{ ...sectionHeadStyle, marginTop: '8px' }}>Contact</div>

        <Field label="Apply Link / Email">
          <input
            style={inputStyle}
            value={form.applyLink}
            onChange={(e) => updateField('applyLink', e.target.value)}
            placeholder="careers.cars24.com or hr@..."
          />
        </Field>

        <Field label="Recruiter Name (optional)">
          <input
            style={inputStyle}
            value={form.recruiterName}
            onChange={(e) => updateField('recruiterName', e.target.value)}
            placeholder="e.g. Satakshi Jaiswal"
          />
        </Field>

        <Field label="Recruiter Title (optional)">
          <input
            style={inputStyle}
            value={form.recruiterTitle}
            onChange={(e) => updateField('recruiterTitle', e.target.value)}
            placeholder="e.g. HR Business Partner"
          />
        </Field>

        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', marginTop: '8px', lineHeight: '1.5', fontFamily: "'Inter', sans-serif" }}>
          Colours, fonts, and layout are locked to Cars24 brand guidelines.
        </p>
      </div>

      {/* Hidden full-size export ref */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={exportRef} style={{ width: '595px', height: '842px' }}>
          <JDCanvas template={selectedTemplate} form={form} />
        </div>
      </div>
    </div>
  );
}
