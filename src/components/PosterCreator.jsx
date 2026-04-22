import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ArrowLeft, Download, Image, Megaphone, Upload, X } from 'lucide-react';
import PosterCanvas from './PosterCanvas';
import { festivalWishTemplates, eventAnnouncementTemplates } from './posterTemplates';

// ─── Default form data factories ─────────────────────────────────────────────
const defaultFestivalForm = (template) => ({
  // locked-display fields (editable by user)
  headline: template?.headline || '',
  subheadline: '',
  recipientName: '',
  message: template?.defaultMessage || '',
  footerText: 'With warm wishes from Team Cars24',
  fromName: '',
  fromTitle: '',
  // image upload
  uploadedImage: null,
});

const defaultEventForm = (template) => ({
  // locked-display fields (editable by user)
  headline: template?.defaultTitle || '',
  subheadline: 'You are invited',
  description: template?.defaultDescription || '',
  footerText: 'Cars24 People Team',
  // event-specific fields
  eventTitle: template?.defaultTitle || '',
  eventDate: '',
  eventTime: '',
  venue: '',
  rsvp: '',
  // image upload
  uploadedImage: null,
});

// ─── Template thumbnail ───────────────────────────────────────────────────────
function TemplateThumbnail({ template, selected, onClick, mode }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderRadius: '10px',
        border: selected
          ? '2px solid #FF6B9D'
          : '2px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        background: '#1c1c1c',
        flexShrink: 0,
      }}
      onMouseOver={(e) => {
        if (!selected) e.currentTarget.style.border = '2px solid rgba(255,107,157,0.5)';
      }}
      onMouseOut={(e) => {
        if (!selected) e.currentTarget.style.border = '2px solid rgba(255,255,255,0.08)';
      }}
    >
      <div style={{
        width: '100%',
        height: '90px',
        background: template.posterBg || template.gradient || '#4A35FE',
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <span style={{
          color: template.accentColor,
          fontSize: '11px',
          fontWeight: '700',
          textAlign: 'center',
          padding: '0 8px',
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          lineHeight: '1.3',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '4px',
        }}>
          {mode === 'festival' ? template.headline : template.defaultTitle}
        </span>
      </div>
      <div style={{ padding: '8px 10px' }}>
        <p style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: '500', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {template.name}
        </p>
      </div>
    </div>
  );
}

// ─── Shared input / textarea styles ──────────────────────────────────────────
const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
  color: '#FFFFFF',
  fontSize: '14px',
  padding: '10px 12px',
  outline: 'none',
  boxSizing: 'border-box',
};
const textareaStyle = {
  ...inputStyle,
  fontSize: '13px',
  resize: 'vertical',
  lineHeight: '1.6',
  fontFamily: 'inherit',
};
const labelStyle = {
  color: 'rgba(255,255,255,0.6)',
  fontSize: '11px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
};

// ─── Image Upload control (shared between both panels) ────────────────────────
function ImageUploadField({ uploadedImage, onChange, onRemove }) {
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#FF6B9D';
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
  };

  return (
    <div>
      <label style={labelStyle}>Upload Image</label>
      {uploadedImage ? (
        <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
          <img
            src={uploadedImage}
            alt="Uploaded"
            style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
          />
          <button
            onClick={onRemove}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.65)',
              border: 'none',
              borderRadius: '50%',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFFFFF',
            }}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: '1.5px dashed rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '20px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
        >
          <Upload size={20} color="rgba(255,255,255,0.4)" />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textAlign: 'center', lineHeight: '1.5' }}>
            Click to upload or drag and drop
          </span>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>PNG, JPG, GIF</span>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────
function SectionDivider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '600', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
    </div>
  );
}

// ─── Festival Edit Panel ──────────────────────────────────────────────────────
function FestivalEditPanel({ formData, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <SectionDivider label="Text Content" />

      <div>
        <label style={labelStyle}>Headline</label>
        <input
          type="text"
          value={formData.headline || ''}
          onChange={(e) => onChange('headline', e.target.value)}
          placeholder="e.g. Happy Diwali"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Recipient Name</label>
        <input
          type="text"
          value={formData.recipientName || ''}
          onChange={(e) => onChange('recipientName', e.target.value)}
          placeholder="Team Cars24 (default if blank)"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Message</label>
        <textarea
          value={formData.message || ''}
          onChange={(e) => onChange('message', e.target.value)}
          rows={5}
          style={textareaStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Signatory Name</label>
        <input
          type="text"
          value={formData.fromName || ''}
          onChange={(e) => onChange('fromName', e.target.value)}
          placeholder="e.g. Vikram Chopra"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Signatory Title</label>
        <input
          type="text"
          value={formData.fromTitle || ''}
          onChange={(e) => onChange('fromTitle', e.target.value)}
          placeholder="e.g. CEO & Co-Founder"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Footer Line</label>
        <input
          type="text"
          value={formData.footerText || ''}
          onChange={(e) => onChange('footerText', e.target.value)}
          placeholder="Cars24 People Team"
          style={inputStyle}
        />
      </div>

      <SectionDivider label="Image" />

      <ImageUploadField
        uploadedImage={formData.uploadedImage}
        onChange={(val) => onChange('uploadedImage', val)}
        onRemove={() => onChange('uploadedImage', null)}
      />
    </div>
  );
}

// ─── Event Edit Panel ─────────────────────────────────────────────────────────
function EventEditPanel({ formData, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <SectionDivider label="Text Content" />

      <div>
        <label style={labelStyle}>Event Title / Headline</label>
        <input
          type="text"
          value={formData.eventTitle || ''}
          onChange={(e) => {
            onChange('eventTitle', e.target.value);
            onChange('headline', e.target.value);
          }}
          placeholder="e.g. Q2 All Hands Town Hall"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Subheadline</label>
        <input
          type="text"
          value={formData.subheadline || ''}
          onChange={(e) => onChange('subheadline', e.target.value)}
          placeholder="e.g. You are invited"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          rows={4}
          style={textareaStyle}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            value={formData.eventDate || ''}
            onChange={(e) => onChange('eventDate', e.target.value)}
            style={{ ...inputStyle, fontSize: '13px', colorScheme: 'dark' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Time</label>
          <input
            type="text"
            value={formData.eventTime || ''}
            onChange={(e) => onChange('eventTime', e.target.value)}
            placeholder="3:00 PM – 5:00 PM"
            style={{ ...inputStyle, fontSize: '13px' }}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Venue</label>
        <input
          type="text"
          value={formData.venue || ''}
          onChange={(e) => onChange('venue', e.target.value)}
          placeholder="e.g. SAS Tower, Sector 39, Gurugram"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>RSVP / Contact</label>
        <input
          type="text"
          value={formData.rsvp || ''}
          onChange={(e) => onChange('rsvp', e.target.value)}
          placeholder="e.g. hr@cars24.com"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Footer Line</label>
        <input
          type="text"
          value={formData.footerText || ''}
          onChange={(e) => onChange('footerText', e.target.value)}
          placeholder="Cars24 People Team"
          style={inputStyle}
        />
      </div>

      <SectionDivider label="Image" />

      <ImageUploadField
        uploadedImage={formData.uploadedImage}
        onChange={(val) => onChange('uploadedImage', val)}
        onRemove={() => onChange('uploadedImage', null)}
      />
    </div>
  );
}

// ─── Main PosterCreator component ─────────────────────────────────────────────
function PosterCreator({ onBack }) {
  const [mode, setMode] = useState('festival'); // 'festival' | 'event'

  const festivalTemplates = festivalWishTemplates;
  const eventTemplates = eventAnnouncementTemplates;

  const [selectedFestivalTemplate, setSelectedFestivalTemplate] = useState(festivalTemplates[0]);
  const [selectedEventTemplate, setSelectedEventTemplate] = useState(eventTemplates[0]);

  const [festivalForm, setFestivalForm] = useState(defaultFestivalForm(festivalTemplates[0]));
  const [eventForm, setEventForm] = useState(defaultEventForm(eventTemplates[0]));

  const [isDownloading, setIsDownloading] = useState(false);

  const exportRef = useRef(null);

  const activeTemplate = mode === 'festival' ? selectedFestivalTemplate : selectedEventTemplate;
  const activeForm = mode === 'festival' ? festivalForm : eventForm;

  const handleFestivalTemplateSelect = (template) => {
    setSelectedFestivalTemplate(template);
    setFestivalForm(prev => ({
      ...prev,
      headline: template.headline,
      message: template.defaultMessage,
    }));
  };

  const handleEventTemplateSelect = (template) => {
    setSelectedEventTemplate(template);
    setEventForm(prev => ({
      ...prev,
      headline: template.defaultTitle,
      eventTitle: template.defaultTitle,
      description: template.defaultDescription,
    }));
  };

  const handleFestivalFormChange = (field, value) => {
    setFestivalForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEventFormChange = (field, value) => {
    setEventForm(prev => ({ ...prev, [field]: value }));
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
  };

  const getPosterName = () => {
    if (mode === 'festival') {
      const name = festivalForm.recipientName?.trim() || 'Team-Cars24';
      return `poster-${selectedFestivalTemplate.festival.replace(/\s+/g, '-')}-${name}`.toLowerCase();
    }
    const title = (eventForm.eventTitle || selectedEventTemplate.defaultTitle).replace(/\s+/g, '-');
    return `poster-${title}`.toLowerCase();
  };

  const captureCanvas = async () => {
    const target = exportRef.current;
    if (!target) throw new Error('Canvas ref not ready');
    return html2canvas(target, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
  };

  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    try {
      const canvas = await captureCanvas();
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
      const canvas = await captureCanvas();
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save(`${getPosterName()}.pdf`);
    } catch (err) {
      console.error('PDF download failed:', err);
    }
    setIsDownloading(false);
  };

  const templates = mode === 'festival' ? festivalTemplates : eventTemplates;
  const selectedTemplate = mode === 'festival' ? selectedFestivalTemplate : selectedEventTemplate;

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 60px)',
      backgroundColor: '#1c1c1c',
      overflow: 'hidden',
    }}>
      {/* Left Sidebar: Template list */}
      <div style={{
        width: '200px',
        flexShrink: 0,
        background: '#252525',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0, fontWeight: '600' }}>
            {mode === 'festival' ? 'Festival Templates' : 'Event Templates'}
          </p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {templates.map((t) => (
            <TemplateThumbnail
              key={t.id}
              template={t}
              mode={mode}
              selected={selectedTemplate.id === t.id}
              onClick={() => mode === 'festival' ? handleFestivalTemplateSelect(t) : handleEventTemplateSelect(t)}
            />
          ))}
        </div>
      </div>

      {/* Center: Canvas area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
          background: '#1c1c1c',
        }}>
          {/* Left: Back + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <h1 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '600', margin: 0 }}>
              Poster Creator
            </h1>
          </div>

          {/* Centre: Mode toggle pill */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.07)',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <button
              onClick={() => handleModeSwitch('festival')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                background: mode === 'festival'
                  ? 'linear-gradient(135deg, #FF6B9D 0%, #FFA726 100%)'
                  : 'transparent',
                color: mode === 'festival' ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                boxShadow: mode === 'festival' ? '0 2px 8px rgba(255,107,157,0.35)' : 'none',
              }}
            >
              <Image size={14} />
              Festival Wishes
            </button>
            <button
              onClick={() => handleModeSwitch('event')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                background: mode === 'event'
                  ? 'linear-gradient(135deg, #FF6B9D 0%, #FFA726 100%)'
                  : 'transparent',
                color: mode === 'event' ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                boxShadow: mode === 'event' ? '0 2px 8px rgba(255,107,157,0.35)' : 'none',
              }}
            >
              <Megaphone size={14} />
              Event Announcement
            </button>
          </div>

          {/* Right: Download buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleDownloadPNG}
              disabled={isDownloading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '500',
                cursor: isDownloading ? 'not-allowed' : 'pointer',
                opacity: isDownloading ? 0.6 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => { if (!isDownloading) e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            >
              <Download size={14} />
              PNG
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                background: 'linear-gradient(135deg, #FF6B9D 0%, #FFA726 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '600',
                cursor: isDownloading ? 'not-allowed' : 'pointer',
                opacity: isDownloading ? 0.6 : 1,
                boxShadow: '0 4px 12px rgba(255,107,157,0.35)',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => { if (!isDownloading) e.currentTarget.style.opacity = '0.9'; }}
              onMouseOut={(e) => { e.currentTarget.style.opacity = isDownloading ? '0.6' : '1'; }}
            >
              <Download size={14} />
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
          background: '#252525',
          padding: '32px',
        }}>
          {/* Scaled preview */}
          <div style={{
            transform: 'scale(0.52)',
            transformOrigin: 'center center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            borderRadius: '2px',
            flexShrink: 0,
          }}>
            <PosterCanvas
              template={activeTemplate}
              formData={activeForm}
              mode={mode}
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar: Edit panel */}
      <div style={{
        width: '290px',
        flexShrink: 0,
        background: '#252525',
        borderLeft: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600', margin: 0 }}>
            {mode === 'festival' ? 'Festival Details' : 'Event Details'}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: '4px 0 0 0' }}>
            {mode === 'festival' ? selectedFestivalTemplate.name : selectedEventTemplate.name}
          </p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {mode === 'festival' ? (
            <FestivalEditPanel
              formData={festivalForm}
              onChange={handleFestivalFormChange}
            />
          ) : (
            <EventEditPanel
              formData={eventForm}
              onChange={handleEventFormChange}
            />
          )}
        </div>
      </div>

      {/* Hidden full-size export canvas (off-screen) */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none', zIndex: -1 }}>
        <div ref={exportRef} style={{ width: '595px', height: '842px' }}>
          <PosterCanvas
            template={activeTemplate}
            formData={activeForm}
            mode={mode}
          />
        </div>
      </div>
    </div>
  );
}

export default PosterCreator;
