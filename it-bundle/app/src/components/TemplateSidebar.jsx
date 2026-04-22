import { templates } from '../data/templates';

const ClassicPreview = ({ template }) => (
  <div
    className="h-32 p-3 flex flex-col justify-between"
    style={{ backgroundColor: template.bgColor }}
  >
    <div
      className="w-full h-1 rounded"
      style={{ backgroundColor: template.borderColor }}
    />
    <div className="text-center">
      <div
        className="text-xs font-bold"
        style={{
          color: template.accentColor,
          fontFamily: template.titleFont,
        }}
      >
        CERTIFICATE
      </div>
      <div
        className="text-[8px] mt-1"
        style={{ color: template.textColor }}
      >
        of Achievement
      </div>
    </div>
    <div
      className="w-full h-1 rounded"
      style={{ backgroundColor: template.borderColor }}
    />
  </div>
);

const BarRaiserPreview = ({ template }) => (
  <div
    className="h-32 p-3 flex flex-col items-center justify-center"
    style={{ backgroundColor: template.bgColor }}
  >
    <div className="flex items-center gap-1 mb-1">
      <span className="text-[8px]">★</span>
      <span className="text-[10px]">★</span>
      <span className="text-[8px]">★</span>
    </div>
    <div
      className="text-sm font-bold italic"
      style={{ color: template.accentColor }}
    >
      Bar Raiser
    </div>
    <div className="flex items-center gap-1 mt-1">
      <span className="text-[8px]">★</span>
      <span className="text-[10px]">★</span>
      <span className="text-[8px]">★</span>
    </div>
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center mt-2 text-[10px]"
      style={{ backgroundColor: template.badgeColor, color: 'white' }}
    >
      👌
    </div>
  </div>
);

const SvgTemplatePreview = ({ template }) => (
  <div
    className="p-2 flex items-center justify-center"
    style={{ backgroundColor: '#ffffff', aspectRatio: '595/842' }}
  >
    <img 
      src={template.svgPath} 
      alt={template.name}
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  </div>
);

export default function TemplateSidebar({ selectedTemplate, onSelectTemplate, onTemplateClick }) {
  const handleDragStart = (e, template) => {
    e.dataTransfer.setData('templateId', template.id);
  };
  return (
    <div className="overflow-y-auto border-r" style={{ backgroundColor: '#1c1c1c', borderColor: '#333', padding: '24px', width: '240px', flexShrink: 0, position: 'sticky', top: '60px', height: 'calc(100vh - 60px)' }}>
      <h2 style={{ color: '#FFFFFF', marginBottom: '24px', fontSize: '24px' }} className="font-semibold">Templates</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {templates.map((template) => (
          <div
            key={template.id}
            draggable
            onDragStart={(e) => handleDragStart(e, template)}
            onClick={() => onTemplateClick(template)}
            onDoubleClick={() => onSelectTemplate(template)}
            className="cursor-pointer rounded-lg overflow-hidden transition-all hover:scale-105"
            style={{
              border: selectedTemplate.id === template.id ? '4px solid #00FFAA' : '2px solid #333',
              boxShadow: selectedTemplate.id === template.id ? '0 0 12px rgba(0, 255, 170, 0.3)' : 'none'
            }}
            title="Click to add certificate, Double-click to set as default"
          >
            {template.layout === 'bar-raiser' ? (
              <BarRaiserPreview template={template} />
            ) : template.layout === 'svg-template' ? (
              <SvgTemplatePreview template={template} />
            ) : (
              <ClassicPreview template={template} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
