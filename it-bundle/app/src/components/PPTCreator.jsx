import React, { useState, useRef, useEffect } from 'react';
import { FileSpreadsheet, Download, ChevronDown, ChevronUp, ArrowLeft, Upload, Image, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  const [imagePositions, setImagePositions] = useState({}); // Store Y position for each image (0-100)
  const [imageScales, setImageScales] = useState({}); // Store scale for each image (default 1)
  const [draggingImage, setDraggingImage] = useState(null); // Track which image is being dragged
  const [dragStartY, setDragStartY] = useState(0);
  const [selectedAwardeeForImage, setSelectedAwardeeForImage] = useState(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [processingProgress, setProcessingProgress] = useState('');
  const [bgRemovalError, setBgRemovalError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const excelInputRef = useRef(null);
  const zipInputRef = useRef(null);
  const multiImageInputRef = useRef(null);
  const singleImageInputRef = useRef(null);
  const slidesContainerRef = useRef(null);

  // Compute total slides: 1 title + category slides + 1 thank-you
  const totalSlides = awardees.length > 0
    ? 1 + Object.entries(groupedAwardees).reduce(
        (total, [, categoryAwardees]) => total + Math.ceil(categoryAwardees.length / 3),
        0
      ) + 1
    : 0;

  // Track which slide is currently visible in the preview scroll area
  useEffect(() => {
    if (!slidesContainerRef.current || awardees.length === 0) return;

    const slides = slidesContainerRef.current.querySelectorAll('.slide-preview');
    if (slides.length === 0) return;

    const scrollContainer = slidesContainerRef.current.parentElement;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the highest intersection ratio
        let best = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry;
            }
          }
        });
        if (best) {
          const idx = parseInt(best.target.getAttribute('data-slide-index'), 10);
          if (!Number.isNaN(idx)) setCurrentSlide(idx);
        }
      },
      {
        root: scrollContainer,
        threshold: [0.25, 0.5, 0.75],
      }
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [awardees, groupedAwardees]);

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
              successStory: findColumnValue(row, ['Success Story', 'Success Stories', 'success_story', 'SuccessStory', 'Story', 'Achievement', 'achievement', 'Contribution', 'contribution', 'Description', 'Comments', 'Remarks', 'Citation']) || ''
            };
          }).filter(Boolean);

          if (processedData.length === 0) {
            console.error('No valid data processed from Excel');
            alert('No valid data found in Excel. Please check column headers.');
            return;
          }

          setAwardees(processedData);

          const grouped = processedData.reduce((acc, awardee) => {
            const category = awardee.awardCategory || 'Uncategorized';
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(awardee);
            return acc;
          }, {});

          setGroupedAwardees(grouped);
          
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

      for (const [filename, fileData] of Object.entries(zipContent.files)) {
        if (!fileData.dir && (filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png'))) {
          const base64 = await fileData.async('base64');
          const mimeType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
          const awardeeName = filename.replace(/\.[^/.]+$/, '');
          images[awardeeName.toLowerCase()] = `data:${mimeType};base64,${base64}`;
        }
      }

      setUploadedImages(prev => ({ ...prev, ...images }));
    } catch (error) {
      console.error('Error processing zip file:', error);
      alert('Error processing zip file. Please check the file format.');
    }
    e.target.value = '';
  };

  // Remove background using API. Silently falls back to original image if
  // backend/API keys are unavailable — we never block the upload on this.
  const removeBackgroundAPI = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        // 503 = API keys not configured; other non-OK = transient failure.
        // Fall back to the original image without surfacing an error.
        console.warn('BG removal unavailable, using original image');
        return null;
      }

      const data = await response.json();
      return data.processedImage || null;
    } catch (error) {
      console.warn('BG removal request failed, using original image:', error?.message);
      return null;
    }
  };

  // Normalize name for matching
  const normalizeName = (name) => {
    if (!name) return '';
    return name.toLowerCase().trim()
      .replace(/[_\-\.]/g, ' ')  // Replace underscores, dashes, dots with spaces
      .replace(/\s+/g, ' ')       // Normalize multiple spaces
      .trim();
  };

  // Calculate similarity between two strings (simple Levenshtein-like score)
  const getSimilarity = (str1, str2) => {
    const s1 = normalizeName(str1);
    const s2 = normalizeName(str2);
    
    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) return 0.9;
    
    // Check first name match
    const firstName1 = s1.split(' ')[0];
    const firstName2 = s2.split(' ')[0];
    if (firstName1 === firstName2 && firstName1.length > 2) return 0.8;
    
    // Check if names share significant parts
    const words1 = s1.split(' ');
    const words2 = s2.split(' ');
    let matchCount = 0;
    for (const w1 of words1) {
      for (const w2 of words2) {
        if (w1 === w2 && w1.length > 2) matchCount++;
      }
    }
    if (matchCount > 0) return 0.7 * (matchCount / Math.max(words1.length, words2.length));
    
    return 0;
  };

  // Handle multiple image upload
  const handleMultipleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsRemovingBg(true);
    setBgRemovalError(null);
    const newImages = {};
    const totalFiles = Array.from(files).filter(f => f.type.startsWith('image/')).length;
    let processedCount = 0;

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const awardeeName = file.name.replace(/\.[^/.]+$/, '');
        setProcessingProgress(`Processing ${processedCount + 1}/${totalFiles}: ${awardeeName}`);
        
        let imageDataUrl;
        
        // Try to remove background using API
        const processedImage = await removeBackgroundAPI(file);
        if (processedImage) {
          imageDataUrl = processedImage;
        } else {
          // Fallback to original image if API fails
          imageDataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (evt) => resolve(evt.target.result);
            reader.readAsDataURL(file);
          });
        }

        // Store with normalized key
        const nameKey = normalizeName(awardeeName);
        newImages[nameKey] = imageDataUrl;
        
        // Update incrementally
        setUploadedImages(prev => ({ ...prev, [nameKey]: imageDataUrl }));
        processedCount++;
      }
    }

    setProcessingProgress('');
    setIsRemovingBg(false);
    e.target.value = '';
  };

  // Handle single image upload for a specific awardee
  const handleSingleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedAwardeeForImage) return;

    setIsRemovingBg(true);
    setBgRemovalError(null);
    setProcessingProgress('Processing image...');
    
    let imageDataUrl;
    
    // Try to remove background using API
    const processedImage = await removeBackgroundAPI(file);
    if (processedImage) {
      imageDataUrl = processedImage;
    } else {
      // Fallback to original image if API fails
      imageDataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (evt) => resolve(evt.target.result);
        reader.readAsDataURL(file);
      });
    }
    
    const imageKey = normalizeName(selectedAwardeeForImage);
    setUploadedImages(prev => ({ ...prev, [imageKey]: imageDataUrl }));
    setSelectedAwardeeForImage(null);
    setProcessingProgress('');
    setIsRemovingBg(false);
    e.target.value = '';
  };
  
  // Helper function to find image for awardee with fuzzy matching
  const getAwardeeImage = (awardeeName) => {
    if (!awardeeName) return null;
    
    const normalizedName = normalizeName(awardeeName);
    
    // Try exact match first
    if (uploadedImages[normalizedName]) return uploadedImages[normalizedName];
    
    // Find best match using similarity score
    let bestMatch = null;
    let bestScore = 0;
    
    for (const key of Object.keys(uploadedImages)) {
      const score = getSimilarity(normalizedName, key);
      if (score > bestScore && score >= 0.5) {  // Minimum 50% match
        bestScore = score;
        bestMatch = key;
      }
    }
    
    if (bestMatch) {
      console.log(`Matched "${awardeeName}" to image "${bestMatch}" (score: ${bestScore})`);
      return uploadedImages[bestMatch];
    }
    
    return null;
  };

  // Handle clicking on a photo frame to change image
  const handleFrameClick = (awardeeName) => {
    setSelectedAwardeeForImage(awardeeName);
    singleImageInputRef.current?.click();
  };

  // Get image position for an awardee (default to 20% from top to show face)
  const getImagePosition = (awardeeName) => {
    const key = normalizeName(awardeeName);
    return imagePositions[key] ?? 20; // Default 20% from top (face area)
  };

  // Get image scale for an awardee (default 1)
  const getImageScale = (awardeeName) => {
    const key = normalizeName(awardeeName);
    return imageScales[key] ?? 1;
  };

  // Adjust image position with scroll wheel (hold Shift for scale)
  const handleImageScroll = (e, awardeeName) => {
    e.preventDefault();
    e.stopPropagation();
    const key = normalizeName(awardeeName);
    
    if (e.shiftKey) {
      // Shift + Scroll = Resize
      const currentScale = imageScales[key] ?? 1;
      const delta = e.deltaY > 0 ? -0.1 : 0.1; // Scroll up = zoom in
      const newScale = Math.max(0.5, Math.min(3, currentScale + delta));
      setImageScales(prev => ({ ...prev, [key]: newScale }));
    } else {
      // Normal scroll = Move position
      const currentPos = imagePositions[key] ?? 20;
      const delta = e.deltaY > 0 ? 5 : -5; // Scroll down = move image up (show lower part)
      const newPos = Math.max(0, Math.min(100, currentPos + delta));
      setImagePositions(prev => ({ ...prev, [key]: newPos }));
    }
  };

  // Start dragging to adjust image
  const handleDragStart = (e, awardeeName) => {
    e.preventDefault();
    setDraggingImage(awardeeName);
    setDragStartY(e.clientY);
  };

  // Handle drag movement
  const handleDragMove = (e) => {
    if (!draggingImage) return;
    
    const key = normalizeName(draggingImage);
    const currentPos = imagePositions[key] ?? 20;
    const deltaY = e.clientY - dragStartY;
    const sensitivity = 0.5; // Adjust sensitivity
    const newPos = Math.max(0, Math.min(100, currentPos + deltaY * sensitivity));
    
    setImagePositions(prev => ({ ...prev, [key]: newPos }));
    setDragStartY(e.clientY);
  };

  // End dragging
  const handleDragEnd = () => {
    setDraggingImage(null);
  };

  const generatePPT = async () => {
    if (awardees.length === 0) {
      alert('Please upload Excel file with awardee data first.');
      return;
    }

    if (!slidesContainerRef.current) {
      alert('Slides container not found.');
      return;
    }

    setIsGenerating(true);
    try {
      // Get all slide elements
      const slideElements = slidesContainerRef.current.querySelectorAll('.slide-preview');
      
      if (slideElements.length === 0) {
        alert('No slides found to export.');
        setIsGenerating(false);
        return;
      }

      // Create PDF with landscape orientation (16:9 aspect ratio)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [297, 167.0625] // A4 landscape with 16:9 aspect ratio
      });

      const pdfWidth = 297;
      const pdfHeight = 167.0625;

      for (let i = 0; i < slideElements.length; i++) {
        const slide = slideElements[i];
        
        // Hide control buttons temporarily
        const controls = slide.querySelectorAll('.frame-controls, .replace-btn, .move-hint');
        controls.forEach(ctrl => {
          ctrl.style.visibility = 'hidden';
        });
        
        // Capture slide as canvas - exact copy
        const canvas = await html2canvas(slide, {
          scale: 3, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          imageTimeout: 0,
          onclone: (clonedDoc, element) => {
            // Ensure background images are loaded
            element.style.borderRadius = '0';
          }
        });
        
        // Show controls again
        controls.forEach(ctrl => {
          ctrl.style.visibility = '';
        });
        
        // Add page (except for first slide)
        if (i > 0) {
          pdf.addPage();
        }
        
        // Add image to PDF - fit to page exactly
        const imgData = canvas.toDataURL('image/png', 1.0);
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }

      // Save PDF
      pdf.save('RnR_Awards_2026.pdf');
      alert('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1c1c1c',
        padding: '72px 56px 48px'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: '600', margin: 0, whiteSpace: 'nowrap' }} className="font-semibold">
            PPT Creator
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => excelInputRef.current?.click()}
            className="hover:opacity-90 transition-all"
            style={{
              background: '#4736FE',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(71, 54, 254, 0.3)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              whiteSpace: 'nowrap'
            }}
            title="Upload Excel"
          >
            <FileSpreadsheet size={16} color="#ffffff" />
            Upload Excel
          </button>
          <input
            ref={excelInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
            style={{ display: 'none' }}
          />
          
          <button
            onClick={() => multiImageInputRef.current?.click()}
            disabled={isRemovingBg}
            className="hover:opacity-90 transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '10px 16px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: isRemovingBg ? 'wait' : 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              opacity: isRemovingBg ? 0.7 : 1
            }}
            title="Upload Images"
          >
            <Image size={16} color="#ffffff" />
            {isRemovingBg ? (processingProgress || 'Processing...') : 'Upload Images'}
          </button>
          <input
            ref={multiImageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleMultipleImageUpload}
            style={{ display: 'none' }}
          />
          <input
            ref={singleImageInputRef}
            type="file"
            accept="image/*"
            onChange={handleSingleImageUpload}
            style={{ display: 'none' }}
          />
          <input
            ref={zipInputRef}
            type="file"
            accept=".zip"
            onChange={handleZipUpload}
            style={{ display: 'none' }}
          />
          
          <button
            onClick={generatePPT}
            disabled={isGenerating || awardees.length === 0}
            className="hover:opacity-90 transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '10px 16px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: isGenerating || awardees.length === 0 ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              opacity: isGenerating || awardees.length === 0 ? 0.6 : 1
            }}
            title="Download PDF"
          >
            <Download size={16} color="#ffffff" />
            {isGenerating ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Background Removal Error/Info */}
      {bgRemovalError && (
        <div style={{
          backgroundColor: 'rgba(255, 107, 107, 0.15)',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ color: '#FF6B6B' }}>⚠️</span>
          <span style={{ color: '#FF6B6B', fontSize: '13px' }}>{bgRemovalError}</span>
          <button 
            onClick={() => setBgRemovalError(null)}
            style={{ 
              marginLeft: 'auto', 
              background: 'none', 
              border: 'none', 
              color: '#FF6B6B', 
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >×</button>
        </div>
      )}

      {/* Main Content */}
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Left Panel - Awardees List */}
        <div 
          style={{
            width: '220px',
            minWidth: '220px',
            backgroundColor: '#252525',
            borderRadius: '16px',
            padding: '20px',
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ color: '#F7F5F2', fontSize: '18px', fontWeight: '600', margin: 0 }}>
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
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: template.color || '#63FFB1'
                    }} />
                    <span style={{ color: '#F7F5F2', fontSize: '14px', fontWeight: '500' }}>
                      {category}
                    </span>
                  </div>
                  {isExpanded ? <ChevronUp size={16} color="#FFFFFF" /> : <ChevronDown size={16} color="#FFFFFF" />}
                </div>
                
                {isExpanded && (
                  <div style={{ padding: '0 12px 12px' }}>
                    {categoryAwardees.map((awardee) => (
                      <div 
                        key={awardee.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '6px', 
                          padding: '6px 12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '8px',
                          fontSize: '14px', 
                          marginTop: '2px',
                        }}
                      >
                        <div>
                          <div style={{ color: '#F7F5F2', fontSize: '14px', fontWeight: '500' }}>
                            {awardee.name || 'Unknown'}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
                            {awardee.department || 'No department'}
                          </div>
                        </div>
                        <button
                          onClick={() => removeAwardee(awardee.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            opacity: 0.5
                          }}
                          onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                          onMouseOut={(e) => e.currentTarget.style.opacity = 0.5}
                        >
                          <Trash2 size={14} color="#FF6B6B" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Panel - Preview */}
        <div 
          style={{
            flex: 1,
            backgroundColor: '#252525',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ color: '#F7F5F2', fontSize: '18px', fontWeight: '600', margin: 0, fontFamily: 'Geist, sans-serif' }}>
                PPT Preview
              </h2>
              {awardees.length > 0 && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  gap: '2px',
                  fontSize: '13px',
                  fontFamily: 'Geist, sans-serif',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(71, 54, 254, 0.35)',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  <span style={{
                    color: '#4736FE',
                    fontWeight: 700,
                    fontSize: '14px'
                  }}>
                    {currentSlide}
                  </span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>/</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 500 }}>
                    {totalSlides}
                  </span>
                </span>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '700px', overflowY: 'auto', width: '100%' }}>
            {awardees.length === 0 ? (
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '400px',
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
                
                <h2 style={{ color: '#F7F5F2', fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
                  Upload Excel to Get Started
                </h2>
                
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', maxWidth: '400px', lineHeight: '1.6' }}>
                  Upload an Excel file with awardee names, award categories, and departments. 
                  The PPT will be automatically organized by award category.
                </p>
              </div>
            ) : (
              <div ref={slidesContainerRef}>
                {/* Title Slide Preview - Using exact bg.svg */}
                <div
                  className="slide-preview"
                  data-slide-index={1}
                  style={{
                    backgroundImage: 'url(/assets/bg.svg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '8px',
                    padding: '0',
                    aspectRatio: '16/9',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden'
                  }}
                >
                  {/* Green Star - positioned top left */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '16%',
                      left: '18%',
                      width: '42px',
                      height: '42px'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: `<svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M58.7215 40.7996L98.0239 48.3579C100.514 49.3087 100.336 52.1226 97.7778 52.8032L58.7311 60.3808C58.0457 65.1156 57.4955 69.8843 56.6895 74.5998C55.4684 81.7382 54.1121 90.7783 52.2732 97.6465C51.4961 100.542 48.6968 100.875 47.6204 98.0326L40.091 60.3905C27.4938 57.4463 14.7276 55.2502 2.01934 52.8032C-0.548381 52.113 -0.707657 49.3039 1.77318 48.3579C14.4959 45.8867 27.3152 43.8065 39.9028 40.7079C41.4907 33.9652 42.7794 27.1501 44.1212 20.3544C45.2554 14.6108 46.0325 7.86329 47.5239 2.3176C47.8811 0.980648 48.1658 0.102219 49.7393 0.00568844C51.3948 -0.0956688 51.974 1.17371 52.3118 2.51549C54.2135 9.96766 55.7097 19.3746 56.926 27.0488C57.65 31.6098 58.094 36.2288 58.7118 40.7996H58.7215Z" fill="#63FFB1"/>
</svg>`
                    }}
                  />

                  {/* Cars24 Logo - positioned at top center */}
                  <img 
                    src="/assets/logo.png"
                    alt="Cars24 Logo"
                    style={{
                      position: 'absolute',
                      top: '20%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      height: '30px',
                      objectFit: 'contain'
                    }}
                  />

                  {/* Text Content - vertically centered */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Main Title - green color */}
                    <div style={{
                      color: '#63FFB1',
                      fontSize: '54px',
                      fontWeight: 'bold',
                      fontFamily: 'Geist, sans-serif',
                      textAlign: 'center',
                      lineHeight: '1.2',
                      marginBottom: '8px',
                      whiteSpace: 'nowrap'
                    }}>
                      {pptData.title || 'RnR Awards 2026'}
                    </div>
                    
                    {/* Subtitle - #F7F5F2 color */}
                    <div style={{
                      color: '#F7F5F2',
                      fontSize: '24px',
                      fontWeight: 'normal',
                      fontFamily: 'Geist, sans-serif',
                      textAlign: 'center',
                      lineHeight: '1.4',
                      whiteSpace: 'nowrap'
                    }}>
                      {pptData.subtitle || 'Celebrating Innovation, Passion & Excellence'}
                    </div>
                  </div>
                </div>

                {/* Award Category Slides Preview */}
                {Object.entries(groupedAwardees).map(([category, categoryAwardees], categoryIndex, allEntries) => {
                  // Running start index for this category's first slide
                  const priorSlides = allEntries
                    .slice(0, categoryIndex)
                    .reduce((acc, [, arr]) => acc + Math.ceil(arr.length / 3), 0);
                  const categoryStartIndex = 2 + priorSlides; // title is 1, so categories start at 2
                  return (
                  <div key={category}>
                    {Array.from({ length: Math.ceil(categoryAwardees.length / 3) }, (_, slideIndex) => {
                      const slideAwardees = categoryAwardees.slice(slideIndex * 3, (slideIndex + 1) * 3);
                      const globalSlideIndex = categoryStartIndex + slideIndex;

                      return (
                        <div
                          key={`${category}-slide-${slideIndex}`}
                          className="slide-preview"
                          data-slide-index={globalSlideIndex}
                          style={{
                            backgroundImage: 'url(/assets/template-bg.svg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            borderRadius: '8px',
                            padding: '0',
                            aspectRatio: '16/9',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            width: '100%',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            marginTop: '20px'
                          }}
                        >
                          
                          {/* Category Title - adjusted positioning */}
                          <div style={{
                            position: 'absolute',
                            top: '10%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: '#63FFB1',
                            fontSize: '32px',
                            fontWeight: 'bold',
                            fontFamily: 'Geist, sans-serif',
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                          }}>
                            {category}
                          </div>
                          
                          {/* Category Subtitle - adjusted positioning */}
                          <div style={{
                            position: 'absolute',
                            top: '18%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: '#F7F5F2',
                            fontSize: '16px',
                            fontWeight: '400',
                            fontFamily: 'Geist, sans-serif',
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                          }}>
                            {category.toLowerCase().includes('cultural champion') ? 'For the one who makes the workplace a better, more positive space for everyone' :
                             category.toLowerCase().includes('rock award') ? 'For the one everyone counts on—steady, strong, and reliable' :
                             category.toLowerCase().includes('action hero') ? 'For the one who gets things done, no matter the challenge' :
                             category.toLowerCase().includes('bar raiser') ? 'For the one who raises the bar and inspires excellence' :
                             category.toLowerCase().includes('glue') ? 'For the one who brings people together and makes teamwork seamless' :
                             category.toLowerCase().includes('dream builder') ? 'For the visionaries who drive bold, ambitious ideas forward' :
                             'Excellence in Performance'}
                          </div>
                          
                          {/* Awardee Cards - horizontal layout */}
                          <div style={{
                            position: 'absolute',
                            top: '58%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            gap: '20px',
                            width: '95%'
                          }}>
                            {slideAwardees.map((awardee) => {
                              const awardeeImage = getAwardeeImage(awardee.name);
                              
                              return (
                                <div key={awardee.id} style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  textAlign: 'center',
                                  flex: '1',
                                  maxWidth: '30%',
                                  padding: '12px',
                                  backgroundColor: 'transparent'
                                }}>
                                  {/* Photo Frame with Controls */}
                                  <div style={{ position: 'relative', marginBottom: '10px' }}>
                                    <div 
                                      onDoubleClick={() => handleFrameClick(awardee.name)}
                                      onClick={(e) => !awardeeImage && handleFrameClick(awardee.name)}
                                      onWheel={(e) => awardeeImage && handleImageScroll(e, awardee.name)}
                                      onMouseDown={(e) => awardeeImage && e.target.tagName !== 'BUTTON' && handleDragStart(e, awardee.name)}
                                      onMouseMove={handleDragMove}
                                      onMouseUp={handleDragEnd}
                                      onMouseLeave={handleDragEnd}
                                      className="photo-frame"
                                      style={{
                                        width: '140px',
                                        height: '100px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        backgroundColor: '#FFFFFF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: awardeeImage ? 'move' : 'pointer',
                                        position: 'relative',
                                        userSelect: 'none'
                                      }}
                                    >
                                      {awardeeImage ? (
                                        <>
                                          <img 
                                            src={awardeeImage} 
                                            alt={awardee.name}
                                            draggable={false}
                                            style={{
                                              maxWidth: '100%',
                                              maxHeight: '100%',
                                              objectFit: 'contain',
                                              transform: `scale(${getImageScale(awardee.name)}) translateY(${getImagePosition(awardee.name) - 50}%)`,
                                              transition: 'transform 0.15s ease-out',
                                              pointerEvents: 'none'
                                            }}
                                          />
                                          {/* Replace button - top right corner */}
                                          <button
                                            className="replace-btn"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              e.preventDefault();
                                              handleFrameClick(awardee.name);
                                            }}
                                            style={{
                                              position: 'absolute',
                                              top: '4px',
                                              right: '4px',
                                              width: '20px',
                                              height: '20px',
                                              borderRadius: '50%',
                                              border: 'none',
                                              background: 'rgba(0,0,0,0.7)',
                                              color: '#fff',
                                              cursor: 'pointer',
                                              fontSize: '10px',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              opacity: 0,
                                              transition: 'opacity 0.2s',
                                              zIndex: 10
                                            }}
                                            title="Replace image"
                                          >↻</button>
                                          
                                          {/* Zoom controls - bottom center */}
                                          <div 
                                            className="frame-controls"
                                            style={{
                                              position: 'absolute',
                                              bottom: '4px',
                                              left: '50%',
                                              transform: 'translateX(-50%)',
                                              display: 'flex',
                                              gap: '8px',
                                              opacity: 0,
                                              transition: 'opacity 0.2s',
                                              zIndex: 10
                                            }}
                                          >
                                            {/* Zoom Out */}
                                            <button
                                              onMouseDown={(e) => e.stopPropagation()}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                const key = normalizeName(awardee.name);
                                                const currentScale = imageScales[key] ?? 1;
                                                setImageScales(prev => ({ ...prev, [key]: Math.max(0.5, currentScale - 0.1) }));
                                              }}
                                              style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                border: 'none',
                                                background: 'rgba(0,0,0,0.7)',
                                                color: '#fff',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold'
                                              }}
                                              title="Zoom out"
                                            >−</button>
                                            {/* Zoom In */}
                                            <button
                                              onMouseDown={(e) => e.stopPropagation()}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                const key = normalizeName(awardee.name);
                                                const currentScale = imageScales[key] ?? 1;
                                                setImageScales(prev => ({ ...prev, [key]: Math.min(3, currentScale + 0.1) }));
                                              }}
                                              style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                border: 'none',
                                                background: 'rgba(0,0,0,0.7)',
                                                color: '#fff',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold'
                                              }}
                                              title="Zoom in"
                                            >+</button>
                                          </div>
                                        </>
                                      ) : (
                                        <div style={{
                                          color: 'rgba(0, 0, 0, 0.3)',
                                          fontSize: '28px',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          gap: '4px'
                                        }}>
                                          <span>👤</span>
                                          <span style={{ fontSize: '8px', color: 'rgba(0,0,0,0.4)' }}>Click to add</span>
                                        </div>
                                      )}
                                    </div>
                                    <style>{`
                                      .photo-frame:hover .frame-controls,
                                      .photo-frame:hover .replace-btn {
                                        opacity: 1 !important;
                                      }
                                      .photo-frame:hover {
                                        box-shadow: 0 4px 12px rgba(99, 255, 177, 0.3);
                                      }
                                    `}</style>
                                  </div>
                                  
                                  {/* Name - Green color */}
                                  <div style={{
                                    color: '#63FFB1',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    fontFamily: 'Geist, sans-serif',
                                    marginBottom: '0px'
                                  }}>
                                    {awardee.name || 'Unknown'}
                                  </div>
                                  
                                  {/* Department - White color */}
                                  <div style={{
                                    color: '#F7F5F2',
                                    fontSize: '12px',
                                    fontFamily: 'Geist, sans-serif',
                                    marginBottom: '8px'
                                  }}>
                                    {awardee.department || ''}
                                  </div>
                                  
                                  {/* Success Story - White color */}
                                  <div style={{
                                    color: '#F7F5F2',
                                    fontSize: '11px',
                                    fontFamily: 'Geist, sans-serif',
                                    fontWeight: '400',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    maxWidth: '100%',
                                    lineHeight: '1.4',
                                    textAlign: 'center'
                                  }}>
                                    {awardee.successStory || ''}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  );
                })}

                {/* Thank You Slide Preview - Using exact bg.svg */}
                <div
                  className="slide-preview"
                  data-slide-index={totalSlides}
                  style={{
                    backgroundImage: 'url(/assets/bg.svg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '8px',
                    padding: '0',
                    aspectRatio: '16/9',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    marginTop: '20px'
                  }}
                >
                  {/* Green Star - positioned top left */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '16%',
                      left: '18%',
                      width: '42px',
                      height: '42px'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: `<svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M58.7215 40.7996L98.0239 48.3579C100.514 49.3087 100.336 52.1226 97.7778 52.8032L58.7311 60.3808C58.0457 65.1156 57.4955 69.8843 56.6895 74.5998C55.4684 81.7382 54.1121 90.7783 52.2732 97.6465C51.4961 100.542 48.6968 100.875 47.6204 98.0326L40.091 60.3905C27.4938 57.4463 14.7276 55.2502 2.01934 52.8032C-0.548381 52.113 -0.707657 49.3039 1.77318 48.3579C14.4959 45.8867 27.3152 43.8065 39.9028 40.7079C41.4907 33.9652 42.7794 27.1501 44.1212 20.3544C45.2554 14.6108 46.0325 7.86329 47.5239 2.3176C47.8811 0.980648 48.1658 0.102219 49.7393 0.00568844C51.3948 -0.0956688 51.974 1.17371 52.3118 2.51549C54.2135 9.96766 55.7097 19.3746 56.926 27.0488C57.65 31.6098 58.094 36.2288 58.7118 40.7996H58.7215Z" fill="#63FFB1"/>
</svg>`
                    }}
                  />

                  {/* Cars24 Logo - positioned at top center */}
                  <img 
                    src="/assets/logo.png"
                    alt="Cars24 Logo"
                    style={{
                      position: 'absolute',
                      top: '20%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      height: '30px',
                      objectFit: 'contain'
                    }}
                  />

                  {/* Thank You Content - Centered */}
                  <div style={{
                    position: 'absolute',
                    top: '55%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Main Text - Green */}
                    <div style={{
                      color: '#63FFB1',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      fontFamily: 'Geist, sans-serif',
                      textAlign: 'center',
                      marginBottom: '12px',
                      whiteSpace: 'nowrap'
                    }}>
                      Every achievement is a team effort.
                    </div>
                    
                    {/* Subtext - White */}
                    <div style={{
                      color: '#F7F5F2',
                      fontSize: '18px',
                      fontWeight: '400',
                      fontFamily: 'Geist, sans-serif',
                      textAlign: 'center',
                      lineHeight: '1.5'
                    }}>
                      Let's continue to support,<br />
                      celebrate, and grow together.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default PPTCreator;
