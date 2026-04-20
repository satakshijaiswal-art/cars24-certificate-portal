import React, { useState, useRef, useEffect } from 'react';
import { FileSpreadsheet, Download, ChevronDown, ChevronUp, ArrowLeft, Upload, Image } from 'lucide-react';
import * as XLSX from 'xlsx';
import PptxGenJS from 'pptxgenjs';
import JSZip from 'jszip';
import { pptSlideTemplates, getSlideTemplateByCategory } from '../data/pptTemplates';
import { rnrSlideConfig, awardCategories } from '../data/rnrSlideTemplates';

function PPTCreator({ onBack }) {
  const [awardees, setAwardees] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [groupedAwardees, setGroupedAwardees] = useState({});
  const [pptData, setPptData] = useState({
    title: 'RnR Awards 2026',
    subtitle: 'Celebrating Innovation, Passion & Excellence',
    endTitle: 'Every role matters.',
    endSubtitle: "Let's celebrate yours."
  });
  const [uploadedImages, setUploadedImages] = useState({});
  const excelInputRef = useRef(null);
  const zipInputRef = useRef(null);

  const findColumnValue = (row, patterns) => {
    const keys = Object.keys(row);
    for (const pattern of patterns) {
      if (row[pattern] !== undefined && row[pattern] !== '') return row[pattern];
      const matchedKey = keys.find(k => k.toLowerCase() === pattern.toLowerCase());
      if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== '') return row[matchedKey];
    }
    for (const pattern of patterns) {
      const partialMatch = keys.find(k => k.toLowerCase().includes(pattern.toLowerCase().replace(/[-_ ]/g, '')));
      if (partialMatch && row[partialMatch] !== undefined && row[partialMatch] !== '') return row[partialMatch];
    }
    return '';
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = evt.target.result;
          if (!data) {
            console.error('No data read from file');
            alert('Error reading file. Please try again.');
            return;
          }
          
          const workbook = XLSX.read(data, { type: 'binary' });
          if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
            console.error('Invalid Excel file or no sheets found');
            alert('Invalid Excel file. Please ensure the file has at least one sheet.');
            return;
          }
          
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (!jsonData || jsonData.length === 0) {
            console.error('No data found in Excel sheet');
            alert('No data found in Excel sheet. Please ensure the sheet contains data.');
            return;
          }

          const processedData = jsonData.map((row, index) => {
            if (!row || typeof row !== 'object') {
              console.warn(`Invalid row data at index ${index}:`, row);
              return null;
            }
            
            return {
              id: index + 1,
              name: findColumnValue(row, ['Nominee Name', 'Employee Name', 'Awardee Name', 'Name', 'nominee_name', 'employee_name', 'awardee_name']) || 'Unknown',
              awardCategory: findColumnValue(row, ['Award Category', 'award_category', 'Award', 'Category']) || 'Uncategorized',
              department: findColumnValue(row, ['Sub-Function', 'Sub - Function', 'SubFunction', 'sub_function', 'Business Unit', 'Department', 'Function']) || '',
              successStory: findColumnValue(row, ['Success Story', 'success_story', 'Achievement', 'achievement', 'Contribution', 'contribution']) || ''
            };
          }).filter(Boolean); // Remove null entries

          if (processedData.length === 0) {
            console.error('No valid data processed from Excel');
            alert('No valid data found in Excel. Please check column headers.');
            return;
          }

          setAwardees(processedData);

          // Group by award category
          const grouped = processedData.reduce((acc, awardee) => {
            const category = awardee.awardCategory || 'Uncategorized';
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(awardee);
            return acc;
          }, {});

          setGroupedAwardees(grouped);
          
          // Expand all categories by default
          const expanded = {};
          Object.keys(grouped).forEach(cat => {
            expanded[cat] = true;
          });
          setExpandedCategories(expanded);
        } catch (error) {
          console.error('Error processing Excel file:', error);
          alert('Error processing Excel file: ' + error.message);
        }
      };
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        alert('Error reading file. Please try again.');
      };
      
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error setting up file reader:', error);
      alert('Error uploading file: ' + error.message);
    }
    
    e.target.value = '';
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const removeAwardee = (id) => {
    const updatedAwardees = awardees.filter(a => a.id !== id);
    setAwardees(updatedAwardees);
    
    // Regroup
    const grouped = updatedAwardees.reduce((acc, awardee) => {
      const category = awardee.awardCategory || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(awardee);
      return acc;
    }, {});
    setGroupedAwardees(grouped);
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all awardees?')) {
      setAwardees([]);
      setGroupedAwardees({});
      setExpandedCategories({});
    }
  };

  const handlePptDataChange = (field, value) => {
    setPptData(prev => ({ ...prev, [field]: value }));
  };

  const handleZipUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      const images = {};

      // Extract all image files from zip
      for (const [filename, fileData] of Object.entries(zipContent.files)) {
        if (!fileData.dir && (filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png'))) {
          const base64 = await fileData.async('base64');
          const mimeType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
          const awardeeName = filename.replace(/\.[^/.]+$/, ''); // Remove extension
          images[awardeeName.toLowerCase()] = `data:${mimeType};base64,${base64}`;
        }
      }

      setUploadedImages(images);
    } catch (error) {
      console.error('Error processing zip file:', error);
      alert('Error processing zip file. Please check the file format.');
    }
    e.target.value = '';
  };

  // Helper function to convert SVG to PNG base64
  const svgToPngBase64 = async (svgUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 1920, 1080);
        const pngBase64 = canvas.toDataURL('image/png').split(',')[1];
        resolve(pngBase64);
      };
      img.onerror = reject;
      img.src = svgUrl;
    });
  };

  const generatePPT = async () => {
    if (Object.keys(groupedAwardees).length === 0) return;
    
    setIsGenerating(true);
    
    try {
      // Convert SVG background to PNG base64
      let bgBase64 = null;
      try {
        bgBase64 = await svgToPngBase64('/assets/rnr-bg.svg');
      } catch (err) {
        console.warn('Could not load background SVG, using fallback color');
      }

      // Load Cars24 logo as base64
      let logoBase64 = null;
      try {
        const logoResponse = await fetch('/assets/cars24-logo.png');
        const logoBlob = await logoResponse.blob();
        logoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.readAsDataURL(logoBlob);
        });
      } catch (err) {
        console.warn('Could not load Cars24 logo');
      }

      // Load star SVG as base64 PNG
      let starBase64 = null;
      try {
        starBase64 = await svgToPngBase64('/assets/star.svg');
      } catch (err) {
        console.warn('Could not load star SVG');
      }

      const pptx = new pptxgen();
      pptx.layout = 'LAYOUT_16x9';
      pptx.title = 'RnR Celebration 2024';
      pptx.author = 'Cars24';

      // RnR Brand Colors
      const accentGreen = '63FFB1';
      const textWhite = 'FFFFFF';
      const textMuted = 'B8B8B8';

      // Helper function to set slide background
      const setSlideBackground = (slide) => {
        if (bgBase64) {
          slide.background = { 
            data: bgBase64,
            sizing: { type: 'cover', w: '100%', h: '100%' }
          };
        } else {
          slide.background = { color: '4736FE' };
        }
      };

      // Helper function to add Cars24 logo - larger, centered
      const addLogo = (slide, centered = false) => {
        if (logoBase64) {
          slide.addImage({
            data: `image/png;base64,${logoBase64}`,
            x: centered ? 4.0 : 8.2,
            y: centered ? 0.5 : 0.25,
            w: 2.0,
            h: 0.43,
          });
        } else {
          slide.addText('Cars24', {
            x: centered ? 4.0 : 8.2,
            y: centered ? 0.5 : 0.25,
            w: 2.0,
            h: 0.5,
            fontSize: 24,
            bold: true,
            color: textWhite,
            align: 'center',
          });
        }
      };

      // Helper function to add decorative star - large, at left edge
      const addStar = (slide, x = -0.3, y = 0.3, size = 1.2) => {
        if (starBase64) {
          slide.addImage({
            data: `image/png;base64,${starBase64}`,
            x: x,
            y: y,
            w: size,
            h: size,
          });
        } else {
          slide.addText('✦', {
            x: x,
            y: y,
            w: size,
            h: size,
            fontSize: 72,
            color: accentGreen,
            align: 'center',
          });
        }
      };

      // Title Slide - RnR Awards 2026
      const titleSlide = pptx.addSlide();
      setSlideBackground(titleSlide);
      addStar(titleSlide, -0.3, 0.3, 1.2);
      addLogo(titleSlide, true);
      
      titleSlide.addText('RnR Awards 2026', {
        x: 0,
        y: 2.0,
        w: '100%',
        h: 1.2,
        fontSize: 80,
        bold: true,
        color: accentGreen,
        fontFace: 'Geist',
        align: 'center',
      });
      titleSlide.addText('Celebrating Innovation, Passion & Excellence', {
        x: 0,
        y: 3.2,
        w: '100%',
        h: 0.6,
        fontSize: 32,
        color: textWhite,
        fontFace: 'Geist',
        align: 'center',
      });

      // Create slides for each award category
      for (const [category, categoryAwardees] of Object.entries(groupedAwardees)) {
        const categoryConfig = awardCategories[category] || { displayName: category, color: '#4736FE' };
        
        // Category Title Slide
        const categorySlide = pptx.addSlide();
        setSlideBackground(categorySlide);
        addLogo(categorySlide);
        addStar(categorySlide, 2.8, 2.0);
        
        categorySlide.addText(category, {
          x: 0.5,
          y: 2.5,
          w: 6,
          h: 1.2,
          fontSize: 64,
          bold: true,
          color: textWhite,
          fontFace: 'Arial Black',
        });
        
        categorySlide.addText('Award Category', {
          x: 0.5,
          y: 3.8,
          w: 5,
          h: 0.6,
          fontSize: 24,
          color: textMuted,
          fontFace: 'Arial',
        });
        
        categorySlide.addText(`${categoryAwardees.length} Awardee${categoryAwardees.length > 1 ? 's' : ''}`, {
          x: 0.5,
          y: 4.4,
          w: 5,
          h: 0.5,
          fontSize: 18,
          color: accentGreen,
          fontFace: 'Arial',
        });

        // Awardees Slide(s) - max 4 per slide (card layout)
        const awardeesPerSlide = 4;
        const totalSlides = Math.ceil(categoryAwardees.length / awardeesPerSlide);
        
        for (let slideIndex = 0; slideIndex < totalSlides; slideIndex++) {
          const slideAwardees = categoryAwardees.slice(
            slideIndex * awardeesPerSlide,
            (slideIndex + 1) * awardeesPerSlide
          );
          
          const awardeesSlide = pptx.addSlide();
          setSlideBackground(awardeesSlide);
          addLogo(awardeesSlide);
          
          // Category header
          awardeesSlide.addText(category, {
            x: 0.5,
            y: 0.3,
            w: 6,
            h: 0.6,
            fontSize: 36,
            bold: true,
            color: textWhite,
            fontFace: 'Arial Black',
          });
          
          awardeesSlide.addText('For the team', {
            x: 0.5,
            y: 0.85,
            w: 3,
            h: 0.4,
            fontSize: 16,
            color: textMuted,
            fontFace: 'Arial',
          });

          // Awardees cards (4 columns)
          slideAwardees.forEach((awardee, index) => {
            const cardWidth = 2.2;
            const cardHeight = 2.8;
            const startX = 0.5;
            const gapX = 2.4;
            const xPos = startX + (index * gapX);
            const yPos = 1.5;

            // Card background
            awardeesSlide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
              x: xPos,
              y: yPos,
              w: cardWidth,
              h: cardHeight,
              fill: { color: 'F7F5F2' },
              rectRadius: 0.3,
            });

            // Photo placeholder
            awardeesSlide.addShape(pptx.shapes.RECTANGLE, {
              x: xPos + 0.2,
              y: yPos + 0.2,
              w: cardWidth - 0.4,
              h: 1.8,
              fill: { color: 'E0E0E0' },
            });
            
            // Photo icon placeholder
            awardeesSlide.addText('👤', {
              x: xPos + 0.2,
              y: yPos + 0.6,
              w: cardWidth - 0.4,
              h: 1,
              fontSize: 36,
              color: 'AAAAAA',
              align: 'center',
              valign: 'middle',
            });

            // Name (below card)
            awardeesSlide.addText(awardee.name || 'Unknown', {
              x: xPos,
              y: yPos + cardHeight + 0.1,
              w: cardWidth,
              h: 0.4,
              fontSize: 14,
              bold: true,
              color: textWhite,
              align: 'center',
              fontFace: 'Arial',
            });

            // Department (below name)
            awardeesSlide.addText(awardee.department || '', {
              x: xPos,
              y: yPos + cardHeight + 0.45,
              w: cardWidth,
              h: 0.35,
              fontSize: 10,
              color: textMuted,
              align: 'center',
              fontFace: 'Arial',
            });
          });

          // Page indicator if multiple slides
          if (totalSlides > 1) {
            awardeesSlide.addText(`${slideIndex + 1} / ${totalSlides}`, {
              x: 8.5,
              y: 5,
              w: 1,
              h: 0.3,
              fontSize: 12,
              color: textMuted,
              align: 'right',
            });
          }
        }
      }

      // Thank You Slide
      const thankYouSlide = pptx.addSlide();
      setSlideBackground(thankYouSlide);
      addLogo(thankYouSlide);
      addStar(thankYouSlide, 2.8, 2.0);
      
      thankYouSlide.addText('Every role matters.', {
        x: 0.5,
        y: 2.5,
        w: 6,
        h: 1,
        fontSize: 48,
        bold: true,
        color: textWhite,
        fontFace: 'Arial Black',
      });
      thankYouSlide.addText("Let's celebrate yours.", {
        x: 0.5,
        y: 3.6,
        w: 6,
        h: 0.8,
        fontSize: 28,
        color: textMuted,
        fontFace: 'Arial',
      });

      await pptx.writeFile({ fileName: 'RnR_Celebration_2024.pptx' });
    } catch (error) {
      console.error('Error generating PPT:', error);
      alert('Error generating PPT. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: '#1c1c1c',
        padding: '72px 120px 24px'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                padding: '10px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                width: '42px',
                height: '42px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 style={{ color: '#FFFFFF', fontSize: '32px' }} className="font-semibold">PPT Creator</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="file"
            ref={excelInputRef}
            onChange={handleExcelUpload}
            accept=".xlsx,.xls,.csv"
            style={{ display: 'none' }}
          />
          <input
            type="file"
            ref={zipInputRef}
            onChange={handleZipUpload}
            accept=".zip"
            style={{ display: 'none' }}
          />
          <button
            onClick={() => excelInputRef.current?.click()}
            style={{
              background: '#00FFAA',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 255, 170, 0.3)',
              color: '#1c1c1c',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <FileSpreadsheet size={16} />
            Upload Excel
          </button>
          <button
            onClick={() => zipInputRef.current?.click()}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '10px 20px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <Image size={16} />
            Upload Images
          </button>
          <button
            onClick={generatePPT}
            disabled={isGenerating || Object.keys(groupedAwardees).length === 0}
            style={{
              background: isGenerating || Object.keys(groupedAwardees).length === 0 ? '#666' : '#4736FE',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: isGenerating || Object.keys(groupedAwardees).length === 0 ? 'not-allowed' : 'pointer',
              boxShadow: isGenerating || Object.keys(groupedAwardees).length === 0 ? 'none' : '0 4px 6px rgba(71, 54, 254, 0.3)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <Download size={16} />
            {isGenerating ? 'Generating...' : 'Generate PPT'}
          </button>
                  </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Left Panel - Editable Fields */}
        <div 
          style={{
            width: '320px',
            backgroundColor: '#252525',
            borderRadius: '16px',
            padding: '24px',
            maxHeight: 'calc(100vh - 180px)',
            overflowY: 'auto'
          }}
        >
          <h2 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            PPT Content
          </h2>
          
          {/* Title Slide Fields */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#63FFB1', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              Title Slide
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                  Main Title
                </label>
                <input
                  type="text"
                  value={pptData.title}
                  onChange={(e) => handlePptDataChange('title', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                  Subtitle
                </label>
                <input
                  type="text"
                  value={pptData.subtitle}
                  onChange={(e) => handlePptDataChange('subtitle', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* End Slide Fields */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#63FFB1', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              End Slide
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                  Main Text
                </label>
                <input
                  type="text"
                  value={pptData.endTitle}
                  onChange={(e) => handlePptDataChange('endTitle', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                  Subtext
                </label>
                <input
                  type="text"
                  value={pptData.endSubtitle}
                  onChange={(e) => handlePptDataChange('endSubtitle', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Image Upload Status */}
          {Object.keys(uploadedImages).length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#63FFB1', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                Images Uploaded
              </h3>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                {Object.keys(uploadedImages).length} images loaded
              </div>
            </div>
          )}
        </div>
        
        {/* Right Panel - Content */}
        <div style={{ flex: 1 }}>
          {awardees.length === 0 ? (
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 200px)',
                textAlign: 'center'
              }}
            >
              <div 
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #00FFAA 0%, #00D4AA 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  opacity: 0.8
                }}
              >
                <FileSpreadsheet size={48} color="#1c1c1c" />
              </div>
              
              <h2 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
                Upload Excel to Get Started
              </h2>
              
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', maxWidth: '400px', lineHeight: '1.6' }}>
                Upload an Excel file with awardee names, award categories, and departments. 
                The PPT will be automatically organized by award category.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '24px' }}>
              {/* Left Panel - Awardees List */}
              <div 
                style={{
                  width: '220px',
                  minWidth: '220px',
                  backgroundColor: '#252525',
                  borderRadius: '16px',
                  padding: '20px',
                  maxHeight: 'calc(100vh - 180px)',
                  overflowY: 'auto'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h2 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600' }}>
                    Awardees by Category
                  </h2>
                  <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
                    {awardees.length} total
                  </span>
                </div>

                {Object.entries(groupedAwardees).map(([category, categoryAwardees]) => {
                  const template = getSlideTemplateByCategory(category) || pptSlideTemplates[0];
                  const isExpanded = expandedCategories[category];
                  
                  return (
                    <div 
                      key={category}
                      style={{
                        marginBottom: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        onClick={() => toggleCategory(category)}
                        style={{
                          padding: '12px',
                          backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  borderRadius: '8px',
                  padding: '0',
                  aspectRatio: '16/9',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transform: 'scale(0.6)',
                  transformOrigin: 'top center',
                  width: '1920px',
                  height: '1080px'
                }}
              >
                {/* Background decorative elements */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, rgba(81, 104, 255, 0.93) 0%, rgba(72, 55, 255, 0.93) 35%, rgba(43, 33, 153, 0.93) 100%)',
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                }} />
                
                {/* Decorative shapes */}
                <div style={{
                  position: 'absolute',
                  top: '-200px',
                  left: '-100px',
                  width: '600px',
                  height: '600px',
                  background: 'linear-gradient(45deg, rgba(81, 104, 255, 0.93) 0%, rgba(72, 55, 255, 0.93) 35%, rgba(43, 33, 153, 0.93) 100%)',
                  borderRadius: '50%',
                  transform: 'rotate(-30deg)',
                  opacity: 0.9
                }} />
                
                {/* Green Star - positioned exactly as in SVG */}
                <div style={{
                  position: 'absolute',
                  top: '295px',
                  left: '415px',
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#63FFB1',
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                }} />
                
                {/* RnR Text - positioned exactly as in SVG */}
                <div style={{
                  position: 'absolute',
                  top: '461px',
                  left: '428px',
                  color: '#FFFFFF',
                  fontSize: '120px',
                  fontWeight: 'bold',
                  fontFamily: 'Arial Black, sans-serif',
                  letterSpacing: '-2px'
                }}>
                  RnR
                </div>
                
                {/* Subtitle - positioned exactly as in SVG */}
                <div style={{
                  position: 'absolute',
                  top: '604px',
                  left: '359px',
                  color: '#B8B8B8',
                  fontSize: '48px',
                  fontWeight: 'normal',
                  fontFamily: 'Arial, sans-serif'
                }}>
                  {pptData.subtitle || 'Celebration 2024'}
                </div>
                
                {/* Cars24 Logo - positioned exactly as in SVG */}
                <div style={{
                  position: 'absolute',
                  top: '269px',
                  left: '799px',
                  width: '321px',
                  height: '68px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#4A35FE'
                }}>
                  Cars24
                </div>
              </div>

              {/* Award Category Slides using different templates based on category */}
              {Object.entries(groupedAwardees || {}).map(([category, categoryAwardees]) => {
                // Safety check for category and awardees
                if (!category || !categoryAwardees || !Array.isArray(categoryAwardees)) {
                  return null;
                }
                
                // Determine template type based on category
                const isActionHero = category.toLowerCase().includes('action hero');
                const isBarRaiser = category.toLowerCase().includes('bar raiser');
                const isRockAward = category.toLowerCase().includes('rock award');
                const isCulturalChampion = category.toLowerCase().includes('cultural champion');
                
                return (
                  <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Multiple slides for this category with 3 awardees each */}
                    {Array.from({ length: Math.ceil(categoryAwardees.length / 3) }, (_, slideIndex) => {
                      const slideAwardees = categoryAwardees.slice(slideIndex * 3, (slideIndex + 1) * 3);
                      
                      // Safety check for slide awardees
                      if (!slideAwardees || !Array.isArray(slideAwardees)) {
                        return null;
                      }
                      
                      // Use single consistent layout with different headings and subheadings
                      return (
                        <div 
                          key={`${category}-slide-${slideIndex}`}
                          style={{
                            backgroundColor: '#4A35FE',
                            backgroundImage: 'linear-gradient(135deg, #5168FF 0%, #4837FF 35%, #2B2199 100%)',
                            borderRadius: '8px',
                            padding: '0',
                            aspectRatio: '16/9',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            transform: 'scale(0.6)',
                            transformOrigin: 'top center',
                            width: '1920px',
                            height: '1080px'
                          }}
                        >
                          {/* Background decorative elements */}
                          <div style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(45deg, rgba(81, 104, 255, 0.93) 0%, rgba(72, 55, 255, 0.93) 35%, rgba(43, 33, 153, 0.93) 100%)',
                            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                          }} />
                          
                          {/* Category Title */}
                          <div style={{
                            position: 'absolute',
                            top: '110px',
                            left: '0',
                            right: '0',
                            textAlign: 'center',
                            color: '#FFFFFF',
                            fontSize: '64px',
                            fontWeight: 'bold',
                            fontFamily: 'Arial Black, sans-serif'
                          }}>
                            {category}
                          </div>
                          
                          {/* Dynamic Subtitle based on category */}
                          <div style={{
                            position: 'absolute',
                            top: '172px',
                            left: '0',
                            right: '0',
                            textAlign: 'center',
                            color: '#B8B8B8',
                            fontSize: '24px',
                            fontFamily: 'Arial, sans-serif'
                          }}>
                            {isCulturalChampion ? 'Building Culture Together' :
                             isRockAward ? 'Solid as a Rock' :
                             isActionHero ? 'Taking Action • Making Impact' :
                             'Excellence in Performance'}
                          </div>
                          
                          {/* Consistent Picture Frame Layout */}
                          {/* Frame 1 */}
                          <div style={{
                            position: 'absolute',
                            top: '247px',
                            left: '177px',
                            width: '460px',
                            height: '340px',
                            backgroundColor: '#F7F5F2',
                            borderRadius: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <div style={{
                              width: '428px',
                              height: '447px',
                              backgroundColor: 'rgba(0,0,0,0.1)',
                              borderRadius: '60px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '24px',
                              color: 'rgba(0,0,0,0.3)',
                              fontWeight: 'bold'
                            }}>
                              {slideAwardees[0] ? slideAwardees[0].name : 'Photo'}
                            </div>
                          </div>
                          
                          {/* Frame 2 */}
                          <div style={{
                            position: 'absolute',
                            top: '247px',
                            left: '730px',
                            width: '460px',
                            height: '340px',
                            backgroundColor: '#FDFDFD',
                            borderRadius: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <div style={{
                              width: '542px',
                              height: '362px',
                              backgroundColor: 'rgba(0,0,0,0.05)',
                              borderRadius: '60px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '24px',
                              color: 'rgba(0,0,0,0.2)',
                              fontWeight: 'bold'
                            }}>
                              {slideAwardees[1] ? slideAwardees[1].name : 'Photo'}
                            </div>
                          </div>
                          
                          {/* Frame 3 */}
                          <div style={{
                            position: 'absolute',
                            top: '248px',
                            left: '1283px',
                            width: '460px',
                            height: '340px',
                            backgroundColor: '#F7F5F2',
                            borderRadius: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <div style={{
                              width: '381px',
                              height: '459px',
                              backgroundColor: 'rgba(0,0,0,0.1)',
                              borderRadius: '60px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '24px',
                              color: 'rgba(0,0,0,0.3)',
                              fontWeight: 'bold'
                            }}>
                              {slideAwardees[2] ? slideAwardees[2].name : 'Photo'}
                            </div>
                          </div>
                          
                          {/* Awardee Names, Departments, and Success Stories */}
                          {slideAwardees.map((awardee, index) => {
                            const nameTop = '640px';
                            const deptTop = '690px';
                            const storyTop = '730px';
                            const leftPositions = ['177px', '730px', '1283px'];
                            
                            if (!awardee) return null;
                            
                            return (
                              <div key={awardee.id}>
                                <div style={{
                                  position: 'absolute',
                                  top: nameTop,
                                  left: leftPositions[index],
                                  width: '460px',
                                  textAlign: 'center',
                                  color: '#FFFFFF',
                                  fontSize: '36px',
                                  fontWeight: 'bold',
                                  fontFamily: 'Arial, sans-serif'
                                }}>
                                  {awardee.name || 'Unknown'}
                                </div>
                                <div style={{
                                  position: 'absolute',
                                  top: deptTop,
                                  left: leftPositions[index],
                                  width: '460px',
                                  textAlign: 'center',
                                  color: '#B8B8B8',
                                  fontSize: '24px',
                                  fontFamily: 'Arial, sans-serif'
                                }}>
                                  {awardee.department || ''}
                                </div>
                                <div style={{
                                  position: 'absolute',
                                  top: storyTop,
                                  left: leftPositions[index],
                                  width: '460px',
                                  textAlign: 'center',
                                  color: '#B8B8B8',
                                  fontSize: '18px',
                                  fontFamily: 'Arial, sans-serif',
                                  fontStyle: 'italic',
                                  padding: '0 10px',
                                  lineHeight: '1.3'
                                }}>
                                  {awardee.successStory || 'Success story goes here'}
                                </div>
                              </div>
                            );
                          })}
                          
                          {/* Slide indicator */}
                          <div style={{ 
                            position: 'absolute', 
                            bottom: '10px', 
                            right: '10px',
                            fontSize: '8px',
                            color: 'rgba(255,255,255,0.5)',
                            fontFamily: 'Arial, sans-serif'
                          }}>
                            {slideIndex + 1}/{Math.ceil(categoryAwardees.length / 3)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* Thank You Slide Preview - Same design as first page with different text */}
              <div 
                style={{
                  backgroundColor: '#4A35FE',
                  backgroundImage: 'linear-gradient(135deg, #5168FF 0%, #4837FF 35%, #2B2199 100%)',
                  borderRadius: '8px',
                  padding: '0',
                  aspectRatio: '16/9',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transform: 'scale(0.6)',
                  transformOrigin: 'top center',
                  width: '1920px',
                  height: '1080px'
                }}
              >
                {/* Background decorative elements - same as first page */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, rgba(81, 104, 255, 0.93) 0%, rgba(72, 55, 255, 0.93) 35%, rgba(43, 33, 153, 0.93) 100%)',
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                }} />
                
                {/* Decorative shapes - same as first page */}
                <div style={{
                  position: 'absolute',
                  top: '-200px',
                  left: '-100px',
                  width: '600px',
                  height: '600px',
                  background: 'linear-gradient(45deg, rgba(81, 104, 255, 0.93) 0%, rgba(72, 55, 255, 0.93) 35%, rgba(43, 33, 153, 0.93) 100%)',
                  borderRadius: '50%',
                  transform: 'rotate(-30deg)',
                  opacity: 0.9
                }} />
                
                {/* Green Star - positioned exactly as in first page */}
                <div style={{
                  position: 'absolute',
                  top: '295px',
                  left: '415px',
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#63FFB1',
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                }} />
                
                {/* Main Text - positioned exactly as in last page SVG */}
                <div style={{
                  position: 'absolute',
                  top: '450px',
                  left: '471px',
                  color: '#FFFFFF',
                  fontSize: '64px',
                  fontWeight: 'bold',
                  fontFamily: 'Arial Black, sans-serif',
                  textAlign: 'center',
                  width: '1000px'
                }}>
                  {pptData.endTitle || 'Every role matters.'}
                </div>
                
                {/* Subtext - positioned exactly as in last page SVG */}
                <div style={{
                  position: 'absolute',
                  top: '580px',
                  left: '669px',
                  color: '#B8B8B8',
                  fontSize: '36px',
                  fontWeight: 'normal',
                  fontFamily: 'Arial, sans-serif',
                  textAlign: 'center',
                  width: '800px'
                }}>
                  {pptData.endSubtitle || "Let's celebrate yours."}
                </div>
                
                {/* Cars24 Logo - positioned exactly as in first page */}
                <div style={{
                  position: 'absolute',
                  top: '269px',
                  left: '799px',
                  width: '321px',
                  height: '68px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#4A35FE'
                }}>
                  Cars24
                </div>
              </div>
            </div>
          </div>

          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#FFFFFF' }}>Slides to be generated:</strong>
            </p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li>1 Title slide</li>
              {Object.entries(groupedAwardees).map(([category, categoryAwardees]) => (
                <li key={category}>
                  {category}: {Math.ceil(categoryAwardees.length / 3)} slide{Math.ceil(categoryAwardees.length / 3) > 1 ? 's' : ''} (3 awardees per slide)
                </li>
              ))}
              <li>1 Thank you slide</li>
            </ul>
            <p style={{ marginTop: '12px', color: '#63FFB1' }}>
              Total: {2 + Object.entries(groupedAwardees).reduce((acc, [, arr]) => acc + Math.ceil(arr.length / 3), 0)} slides
            </p>
          </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PPTCreator;
