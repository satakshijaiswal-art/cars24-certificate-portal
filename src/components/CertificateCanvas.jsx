import { forwardRef } from 'react';

const RaiseStandardsBadge = () => (
  <img 
    src="/raise-standards-badge.png" 
    alt="Raise Standards Badge" 
    style={{ width: '156px', height: '156px' }}
  />
);

const BarRaiserLayout = ({ template, formData }) => {
  return (
    <div
      className="w-[595px] h-[842px] relative shadow-2xl flex flex-col items-center"
      style={{ backgroundColor: '#ffffff', paddingTop: '40px', paddingLeft: '48px', paddingRight: '48px', paddingBottom: '48px' }}
    >
      {/* Cars24 Logo */}
      <div style={{ marginBottom: '48px' }}>
        <img
          src={import.meta.env.BASE_URL + 'cars24-logo.png'}
          alt="Cars24"
          style={{ height: '32px', objectFit: 'contain' }}
        />
      </div>

      {/* Stars and Line - Top */}
      <div style={{ marginBottom: '12px' }}>
        <img src="/stars.png" alt="Stars" style={{ height: '24px', objectFit: 'contain' }} />
      </div>

      {/* Bar Raiser Title */}
      <h1 style={{ 
        color: '#4A35FE', 
        fontSize: '42px', 
        fontWeight: '600',
        fontStyle: 'normal',
        fontFamily: 'Geist, sans-serif',
        margin: '0 0 12px 0'
      }}>
        Bar Raiser
      </h1>

      {/* Stars and Line - Bottom */}
      <div style={{ marginBottom: '32px' }}>
        <img src="/stars.png" alt="Stars" style={{ height: '24px', objectFit: 'contain' }} />
      </div>

      {/* Recipient Name */}
      <h2 style={{ 
        color: '#1C1C1C', 
        fontSize: '28px', 
        fontWeight: '700',
        fontFamily: 'Geist, sans-serif',
        lineHeight: '100%',
        margin: '0 0 4px 0'
      }}>
        {formData.holderName || 'Rahul Tayal'}
      </h2>
      
      {/* Business Unit */}
      <p style={{ 
        color: '#4A35FE', 
        fontSize: '16px',
        fontFamily: 'Geist, sans-serif',
        lineHeight: '100%',
        margin: '0 0 40px 0'
      }}>
        {formData.businessUnit || 'Business Finance'}
      </p>

      {/* Badge - Using RaiseStandardsBadge component */}
      <div style={{ marginBottom: '40px' }}>
        <RaiseStandardsBadge />
      </div>

      {/* Tagline */}
      <p style={{ 
        color: '#1C1C1C', 
        fontSize: '16px',
        fontFamily: 'Geist, sans-serif',
        textAlign: 'center',
        margin: '0',
        lineHeight: '1.6',
        flex: '1',
        display: 'flex',
        alignItems: 'center'
      }}>
        For the one who raise the bar<br/>and inspires the excellence.
      </p>

      {/* Signature Section */}
      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        {formData.signature ? (
          <img
            src={formData.signature}
            alt="Signature"
            style={{ height: '48px', marginBottom: '8px', objectFit: 'contain' }}
          />
        ) : (
          <div style={{ 
            fontFamily: "'Great Vibes', cursive", 
            color: '#2B3990',
            fontSize: '28px',
            marginBottom: '8px'
          }}>
            {formData.signatoryName || 'Ruchit Agarwal'}
          </div>
        )}
        <p style={{ 
          color: '#4A35FE', 
          fontSize: '12px',
          fontWeight: '500',
          letterSpacing: '2px',
          fontFamily: 'Geist, sans-serif',
          margin: '0'
        }}>
          {formData.signatoryTitle || 'CFO & CO-FOUNDER'}
        </p>
      </div>
    </div>
  );
};

const ClassicLayout = ({ template, formData, formatDate }) => {
  return (
    <div
      className="w-[800px] h-[600px] relative shadow-2xl"
      style={{ backgroundColor: template.bgColor }}
    >
      {/* Decorative Border */}
      <div
        className="absolute inset-4 border-4 rounded-sm"
        style={{ borderColor: template.borderColor }}
      />
      <div
        className="absolute inset-6 border-2 rounded-sm"
        style={{ borderColor: template.borderColor, opacity: 0.5 }}
      />

      {/* Corner Decorations */}
      <div
        className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4"
        style={{ borderColor: template.accentColor }}
      />
      <div
        className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4"
        style={{ borderColor: template.accentColor }}
      />
      <div
        className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4"
        style={{ borderColor: template.accentColor }}
      />
      <div
        className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4"
        style={{ borderColor: template.accentColor }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-16 py-12">
        {/* Header */}
        <div
          className="text-sm tracking-[0.3em] uppercase mb-2"
          style={{ color: template.accentColor }}
        >
          {formData.businessUnit || 'Company Name'}
        </div>

        {/* Title */}
        <h1
          className="text-5xl font-bold tracking-wide mb-2"
          style={{
            color: template.accentColor,
            fontFamily: template.titleFont,
          }}
        >
          CERTIFICATE
        </h1>
        <p
          className="text-xl tracking-widest uppercase mb-8"
          style={{ color: template.textColor }}
        >
          of Achievement
        </p>

        {/* Presented To */}
        <p
          className="text-sm tracking-wider uppercase mb-4"
          style={{ color: template.textColor, opacity: 0.7 }}
        >
          This certificate is proudly presented to
        </p>

        {/* Recipient Name */}
        <div className="mb-6 text-center">
          <h2
            className="text-4xl font-bold pb-2"
            style={{
              color: template.accentColor,
              fontFamily: "'Great Vibes', cursive",
              borderBottom: `2px solid ${template.borderColor}`,
              minWidth: '300px',
              display: 'inline-block',
            }}
          >
            {formData.holderName || 'Recipient Name'}
          </h2>
        </div>

        {/* Description */}
        <p
          className="text-center text-sm max-w-md mb-8 leading-relaxed"
          style={{ color: template.textColor, fontFamily: template.bodyFont }}
        >
          For outstanding performance and dedication in achieving excellence.
          This recognition is awarded in appreciation of your valuable
          contributions.
        </p>

        {/* Footer Section */}
        <div className="flex items-end justify-between w-full mt-auto px-8">
          {/* Date */}
          <div className="text-center">
            <p
              className="text-sm mb-1"
              style={{ color: template.textColor }}
            >
              {formatDate(formData.date) || 'Date'}
            </p>
            <div
              className="w-32 h-0.5"
              style={{ backgroundColor: template.borderColor }}
            />
            <p
              className="text-xs mt-1 uppercase tracking-wider"
              style={{ color: template.textColor, opacity: 0.6 }}
            >
              Date
            </p>
          </div>

          {/* Seal/Logo Placeholder */}
          <div
            className="w-20 h-20 rounded-full border-4 flex items-center justify-center"
            style={{ borderColor: template.accentColor }}
          >
            <div
              className="text-xs font-bold text-center"
              style={{ color: template.accentColor }}
            >
              SEAL
            </div>
          </div>

          {/* Signature */}
          <div className="text-center">
            {formData.signature ? (
              <img
                src={formData.signature}
                alt="Signature"
                className="h-12 mx-auto mb-1 object-contain"
              />
            ) : (
              <div className="h-12 mb-1" />
            )}
            <div
              className="w-32 h-0.5"
              style={{ backgroundColor: template.borderColor }}
            />
            <p
              className="text-sm mt-1"
              style={{ color: template.textColor }}
            >
              {formData.signatoryName || 'Signatory Name'}
            </p>
            <p
              className="text-xs uppercase tracking-wider"
              style={{ color: template.textColor, opacity: 0.6 }}
            >
              {formData.signatoryTitle || 'Title'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SvgTemplateLayout = ({ template, formData, globalSignature }) => {
  return (
    <div
      className="w-[595px] h-[842px] relative shadow-2xl"
      style={{ backgroundColor: '#ffffff' }}
    >
      <img 
        src={template.svgPath} 
        alt={template.name}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      {/* Dynamic Text Overlays - positioned to match certificate layout */}
      {/* Awardee Name - 24px below bottom star line */}
      <div
        style={{
          position: 'absolute',
          top: '255px',
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'Geist, sans-serif',
            fontSize: '32px',
            fontWeight: '600',
            color: '#1a1a1a',
            lineHeight: '1',
          }}
        >
          {formData?.holderName || 'Awardee Name'}
        </div>
      </div>
      {/* Business Unit - 12px below awardee name */}
      <div
        style={{
          position: 'absolute',
          top: '299px',
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'Geist, sans-serif',
            fontSize: '20px',
            fontWeight: '300',
            color: '#666666',
            lineHeight: '1',
          }}
        >
          {formData?.businessUnit || 'Business Unit'}
        </div>
      </div>
      {/* Signature Overlay - prioritize per-certificate signature over global */}
      {(formData?.signature || (globalSignature && globalSignature.imagePath)) && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <img 
            src={formData?.signature || globalSignature?.imagePath} 
            alt={formData?.signatoryName || globalSignature?.name || 'Signature'} 
            style={{ height: '80px', margin: '0 auto' }}
          />
        </div>
      )}
    </div>
  );
};

const CertificateCanvas = forwardRef(({ template, formData, globalSignature }, ref) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (template.layout === 'bar-raiser') {
    return (
      <div ref={ref}>
        <BarRaiserLayout template={template} formData={formData} />
      </div>
    );
  }

  if (template.layout === 'svg-template') {
    return (
      <div ref={ref}>
        <SvgTemplateLayout template={template} formData={formData} globalSignature={globalSignature} />
      </div>
    );
  }

  return (
    <div ref={ref}>
      <ClassicLayout template={template} formData={formData} formatDate={formatDate} />
    </div>
  );
});

CertificateCanvas.displayName = 'CertificateCanvas';

export default CertificateCanvas;
