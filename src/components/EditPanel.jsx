import { useState, useRef } from 'react';

const signaturePresets = [
  { id: 'vc', name: 'Vikram Chopra', title: 'CEO & CO-FOUNDER', imagePath: '/vc.svg' },
  { id: 'ruchit', name: 'Ruchit Agarwal', title: 'CFO & CO-FOUNDER', imagePath: '/ruchit.svg' },
];

export default function EditPanel({ formData, onFormChange, onSignatureUpload, globalSignature, onGlobalSignatureChange, hasCertificateSelected, onSignatureClick, selectedCertificateId }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleSignaturePreset = (preset) => {
    // If a certificate is selected, apply to that one only
    // Otherwise apply to all certificates
    if (onSignatureClick) {
      onSignatureClick(preset, selectedCertificateId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onGlobalSignatureChange({ 
          id: 'custom', 
          name: 'Custom Signature', 
          title: '', 
          customImage: reader.result 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onGlobalSignatureChange({ 
          id: 'custom', 
          name: 'Custom Signature', 
          title: '', 
          customImage: reader.result 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const inputStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '14px',
    color: '#FFFFFF',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  };

  const focusStyle = "focus:outline-none focus:ring-1";

  return (
    <div className="overflow-y-auto border-l" style={{ backgroundColor: '#1c1c1c', borderColor: '#333', padding: '24px', width: '240px', flexShrink: 0, position: 'sticky', top: '60px', height: 'calc(100vh - 60px)' }}>
      <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginBottom: '24px' }} className="font-semibold">Edit</h2>
      
      {/* Global Signature Section - Applies to all certificates */}
      <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #333' }}>
        <div>
          <label style={{ color: '#FFFFFF', display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
            Select Signatory
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {signaturePresets.map((preset) => (
              <button
                key={preset.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('signature', JSON.stringify(preset));
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => handleSignaturePreset(preset)}
                className="rounded-lg border text-left transition-all cursor-grab active:cursor-grabbing"
                style={{
                  backgroundColor: globalSignature?.id === preset.id ? 'rgba(0, 255, 170, 0.15)' : '#252525',
                  borderColor: globalSignature?.id === preset.id ? '#00FFAA' : '#333',
                  color: '#FFFFFF',
                  padding: '4px',
                }}
              >
                <div style={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '8px', 
                  padding: '8px', 
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    src={preset.imagePath} 
                    alt={preset.name} 
                    style={{ height: '40px', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div className="text-sm font-medium">{preset.name}</div>
                <div className="text-xs" style={{ color: '#888' }}>{preset.title}</div>
              </button>
            ))}
          </div>
          
          {/* Drag and Drop Zone for Custom Signature */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              marginTop: '12px',
              padding: '16px',
              border: isDragging ? '2px dashed #00FFAA' : '2px dashed #444',
              borderRadius: '12px',
              backgroundColor: isDragging ? 'rgba(0, 255, 170, 0.1)' : 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            {globalSignature?.customImage ? (
              <div>
                <img 
                  src={globalSignature.customImage} 
                  alt="Custom Signature" 
                  style={{ height: '40px', maxWidth: '100%', objectFit: 'contain', margin: '0 auto' }}
                />
                <p style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
                  Click or drag to replace
                </p>
              </div>
            ) : (
              <div>
                <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
                  Drag & drop custom signature
                </p>
                <p style={{ color: '#666', fontSize: '11px', marginTop: '4px' }}>
                  or click to browse
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Details Section - Only shows when a certificate is selected */}
      {hasCertificateSelected && (
        <div>
          <label style={{ color: '#FFFFFF', display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
            Selected Certificate
          </label>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: '6px' }}>
              <label className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
                Awardee Name
              </label>
              <input
                type="text"
                value={formData.holderName}
                onChange={(e) => {
                  const value = e.target.value;
                  const capitalized = value.replace(/\b\w/g, (char) => char.toUpperCase());
                  onFormChange('holderName', capitalized);
                }}
                placeholder="Enter awardee name"
                className={`w-full border ${focusStyle}`}
                style={{ ...inputStyle, '--tw-ring-color': '#00FFAA', padding: '12px 16px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: '6px' }}>
              <label className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
                Sub-Function
              </label>
              <input
                type="text"
                value={formData.businessUnit}
                onChange={(e) => {
                  const value = e.target.value;
                  const capitalized = value.replace(/\b\w/g, (char) => char.toUpperCase());
                  onFormChange('businessUnit', capitalized);
                }}
                placeholder="Enter sub-function"
                className={`w-full border ${focusStyle}`}
                style={{ ...inputStyle, padding: '12px 16px' }}
              />
            </div>
          </div>
        </div>
      )}

      {!hasCertificateSelected && (
        <div style={{ color: '#666', fontSize: '14px', textAlign: 'center', padding: '24px 0' }}>
          Select a certificate to edit its details
        </div>
      )}
    </div>
  );
}
