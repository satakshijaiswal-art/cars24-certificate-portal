import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Download, Plus, Trash2, X, FileSpreadsheet, ArrowLeft } from 'lucide-react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import PPTCreator from './components/PPTCreator';
import PosterCreator from './components/PosterCreator';
import JDCreator from './components/JDCreator';
import VideoCreator from './components/VideoCreator';
import TemplateSidebar from './components/TemplateSidebar';
import EditPanel from './components/EditPanel';
import CertificateCanvas from './components/CertificateCanvas';
import { templates } from './data/templates';
import './index.css';

const STATIC_USER = { name: 'Cars24 Team', email: '' };

function App() {
  const [activeSection, setActiveSection] = useState(null); // null = landing, 'certificate', 'ppt', 'poster', 'jd'
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificateId, setSelectedCertificateId] = useState(1);
  const [dragOverCertificates, setDragOverCertificates] = useState(false);
  const [showDownloadPopover, setShowDownloadPopover] = useState(false);
  const [selectedForDownload, setSelectedForDownload] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [pendingExcelData, setPendingExcelData] = useState([]);
  const [unmatchedCategories, setUnmatchedCategories] = useState([]);
  const [globalSignature, setGlobalSignature] = useState(null);
  const [certificatesHistory, setCertificatesHistory] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState(null); // null = not downloading, 0-100 = progress
  const [missingDataAlert, setMissingDataAlert] = useState(null); // { type: 'upload' | 'download', certificates: [] }
  const certificateRefs = useRef({});
  const exportRefs = useRef({});
  const excelInputRef = useRef(null);
  const downloadPopoverRef = useRef(null);

  // Undo functionality with Cmd+Z (Mac) / Ctrl+Z (Windows)
  useEffect(() => {
    const handleUndo = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
        event.preventDefault();
        if (certificatesHistory.length > 0) {
          const previousState = certificatesHistory[certificatesHistory.length - 1];
          setCertificatesHistory(prev => prev.slice(0, -1));
          setCertificates(previousState);
        }
      }
    };

    document.addEventListener('keydown', handleUndo);
    return () => document.removeEventListener('keydown', handleUndo);
  }, [certificatesHistory]);

  // Save state to history before changes
  const saveToHistory = () => {
    setCertificatesHistory(prev => [...prev.slice(-19), certificates]); // Keep last 20 states
  };

  // Close download popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (downloadPopoverRef.current && !downloadPopoverRef.current.contains(event.target)) {
        setShowDownloadPopover(false);
      }
    };

    if (showDownloadPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDownloadPopover]);

  // Show landing page to choose section
  if (!activeSection) {
    return (
      <>
        <Header user={STATIC_USER} />
        <div style={{ paddingTop: '60px' }}>
          <LandingPage onSelectSection={setActiveSection} />
        </div>
      </>
    );
  }

  // Show PPT Creator
  if (activeSection === 'ppt') {
    return (
      <>
        <Header user={STATIC_USER} />
        <div style={{ paddingTop: '60px' }}>
          <PPTCreator onBack={() => setActiveSection(null)} />
        </div>
      </>
    );
  }

  // Show Poster Creator
  if (activeSection === 'poster') {
    return (
      <>
        <Header user={STATIC_USER} />
        <div style={{ paddingTop: '60px' }}>
          <PosterCreator onBack={() => setActiveSection(null)} />
        </div>
      </>
    );
  }

  // Show JD Creator
  if (activeSection === 'jd') {
    return (
      <>
        <Header user={STATIC_USER} />
        <div style={{ paddingTop: '60px' }}>
          <JDCreator onBack={() => setActiveSection(null)} />
        </div>
      </>
    );
  }

  // Show Video Templates
  if (activeSection === 'video') {
    return (
      <>
        <Header user={STATIC_USER} />
        <div style={{ paddingTop: '60px' }}>
          <VideoCreator onBack={() => setActiveSection(null)} />
        </div>
      </>
    );
  }

  const formData = certificates.find(c => c.id === selectedCertificateId) || certificates[0] || {
    holderName: '',
    businessUnit: '',
    signature: null,
    signatoryName: '',
    signatoryTitle: '',
    date: new Date().toISOString().split('T')[0],
  };

  const handleFormChange = (field, value) => {
    saveToHistory();
    setCertificates(prev => prev.map(cert =>
      cert.id === selectedCertificateId ? { ...cert, [field]: value } : cert
    ));
  };

  const addCertificate = (template = selectedTemplate) => {
    saveToHistory();
    const newId = certificates.length > 0 ? Math.max(...certificates.map(c => c.id)) + 1 : 1;
    setCertificates(prev => [...prev, {
      id: newId,
      template: template,
      holderName: '',
      businessUnit: '',
      signature: null,
      signatoryName: '',
      signatoryTitle: '',
      date: new Date().toISOString().split('T')[0],
      _isFromExcel: false, // Flag to track if from Excel import
    }]);
    setSelectedCertificateId(newId);
  };

  const handleTemplateDrop = (e) => {
    e.preventDefault();
    setDragOverCertificates(false);
    const templateId = e.dataTransfer.getData('templateId');
    const template = templates.find(t => t.id === templateId);
    if (template) {
      addCertificate(template);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOverCertificates(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverCertificates(false);
  };

  const deleteCertificate = (id) => {
    saveToHistory();
    setCertificates(prev => prev.filter(cert => cert.id !== id));
    if (selectedCertificateId === id) {
      setSelectedCertificateId(certificates.find(c => c.id !== id)?.id || 1);
    }
  };

  const getTemplateByAwardCategory = (awardCategory) => {
    if (!awardCategory) return null;
    const category = awardCategory.toLowerCase().trim();
    
    if (category.includes('bar raiser')) {
      return templates.find(t => t.id === 'bar-raiser') || null;
    } else if (category.includes('action hero')) {
      return templates.find(t => t.id === 'action-hero') || null;
    } else if (category.includes('phoenix')) {
      return templates.find(t => t.id === 'phoenix-award') || null;
    } else if (category.includes('glue')) {
      return templates.find(t => t.id === 'glue-award') || null;
    } else if (category.includes('culture champion')) {
      return templates.find(t => t.id === 'culture-champion') || null;
    } else if (category.includes('rock') || category.includes('accountable')) {
      return templates.find(t => t.id === 'rock-award') || null;
    } else if (category.includes('dream builder') || category.includes('ambitious')) {
      return templates.find(t => t.id === 'dream-builder') || null;
    }
    return null;
  };

  const handleTemplateSelection = (categoryName, template) => {
    setPendingExcelData(prev => prev.map(row => {
      if (row._unmatchedCategory === categoryName) {
        return { ...row, template: template, _unmatchedCategory: null };
      }
      return row;
    }));
    setUnmatchedCategories(prev => prev.filter(c => c !== categoryName));
  };

  const finalizePendingCertificates = () => {
    const startId = certificates.length > 0 ? Math.max(...certificates.map(c => c.id)) + 1 : 1;
    const newCertificates = pendingExcelData.map((row, index) => ({
      id: startId + index,
      template: row.template,
      holderName: row.holderName,
      businessUnit: row.businessUnit,
      signature: null,
      signatoryName: row.signatoryName,
      signatoryTitle: row.signatoryTitle,
      date: row.date,
    }));

    setCertificates(prev => [...prev, ...newCertificates]);
    if (newCertificates.length > 0) {
      setSelectedCertificateId(newCertificates[0].id);
    }
    setShowTemplateModal(false);
    setPendingExcelData([]);
    setUnmatchedCategories([]);
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) return;

      // Get all column names from the first row
      const columnNames = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

      const unmatched = new Set();
      
      // Helper function to find column value by partial match (case-insensitive)
      const findColumnValue = (row, patterns) => {
        const keys = Object.keys(row);
        for (const pattern of patterns) {
          // First try exact match
          if (row[pattern] !== undefined && row[pattern] !== '') return row[pattern];
          // Then try case-insensitive match
          const matchedKey = keys.find(k => k.toLowerCase() === pattern.toLowerCase());
          if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== '') return row[matchedKey];
        }
        // Try partial match as last resort
        for (const pattern of patterns) {
          const partialMatch = keys.find(k => k.toLowerCase().includes(pattern.toLowerCase().replace(/[-_ ]/g, '')));
          if (partialMatch && row[partialMatch] !== undefined && row[partialMatch] !== '') return row[partialMatch];
        }
        return '';
      };

      const processedData = jsonData.map((row) => {
        const awardCategory = findColumnValue(row, ['Award Category', 'award_category', 'Award', 'Category']);
        const template = getTemplateByAwardCategory(awardCategory);
        
        if (!template && awardCategory) {
          unmatched.add(awardCategory);
        }
        
        return {
          template: template || selectedTemplate,
          holderName: findColumnValue(row, ['Nominee Name', 'Employee Name', 'Awardee Name', 'Name', 'nominee_name', 'employee_name', 'awardee_name']),
          businessUnit: findColumnValue(row, ['Sub-Function', 'Sub - Function', 'SubFunction', 'sub_function', 'Business Unit', 'Department', 'Function']),
          signatoryName: findColumnValue(row, ['Signatory Name', 'signatory_name', 'Signatory']),
          signatoryTitle: findColumnValue(row, ['Signatory Title', 'signatory_title', 'Title']),
          date: findColumnValue(row, ['Date', 'date']) || new Date().toISOString().split('T')[0],
          _unmatchedCategory: !template && awardCategory ? awardCategory : null,
          _rawRow: row, // Store the raw row data for column remapping
        };
      });

      if (unmatched.size > 0) {
        setPendingExcelData(processedData);
        setUnmatchedCategories([...unmatched]);
        setShowTemplateModal(true);
      } else {
        saveToHistory();
        const startId = certificates.length > 0 ? Math.max(...certificates.map(c => c.id)) + 1 : 1;
        const newCertificates = processedData.map((row, index) => ({
          id: startId + index,
          template: row.template,
          holderName: row.holderName,
          businessUnit: row.businessUnit,
          signature: null,
          signatoryName: row.signatoryName,
          signatoryTitle: row.signatoryTitle,
          date: row.date,
          _isFromExcel: true, // Flag to track if from Excel import
          _hasMissingData: !row.businessUnit || !row.holderName,
          _rawRow: row._rawRow, // Keep raw row for potential remapping
        }));

        // Check for missing sub-function data
        const missingSubFunction = newCertificates.filter(c => !c.businessUnit);
        if (missingSubFunction.length > 0) {
          setMissingDataAlert({
            type: 'upload',
            columnNames: columnNames,
            certificates: missingSubFunction.map(c => c.holderName || `Certificate ${c.id}`),
            certificateIds: missingSubFunction.map(c => c.id),
          });
        }

        setCertificates(prev => [...prev, ...newCertificates]);
        if (newCertificates.length > 0) {
          setSelectedCertificateId(newCertificates[0].id);
        }
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGlobalSignature(prev => ({ ...prev, customImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGlobalSignatureChange = (signature) => {
    setGlobalSignature(signature);
  };

  const handleSignatureClick = (preset, certId) => {
    saveToHistory();
    if (certId && certificates.length > 0) {
      // If a certificate is selected, apply to that one only
      setCertificates(prev => prev.map(c => 
        c.id === certId 
          ? { ...c, signature: preset.imagePath, signatoryName: preset.name, signatoryTitle: preset.title }
          : c
      ));
    } else {
      // Apply to all certificates
      setCertificates(prev => prev.map(c => ({
        ...c,
        signature: preset.imagePath,
        signatoryName: preset.name,
        signatoryTitle: preset.title
      })));
    }
    setGlobalSignature(preset);
  };

  const handleDownload = async (certId) => {
    const ref = certificateRefs.current[certId];
    const cert = certificates.find(c => c.id === certId);
    if (ref) {
      const canvas = await html2canvas(ref, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `certificate-${cert?.holderName || 'unnamed'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const openDownloadPopover = () => {
    setSelectedForDownload(certificates.map(c => c.id));
    setShowDownloadPopover(true);
  };

  const toggleCertificateSelection = (certId) => {
    setSelectedForDownload(prev => 
      prev.includes(certId) 
        ? prev.filter(id => id !== certId)
        : [...prev, certId]
    );
  };

  const handleDownloadPDF = async (skipMissingCheck = false) => {
    if (selectedForDownload.length === 0) return;
    
    // Check for missing data before download
    if (!skipMissingCheck) {
      const selectedCerts = certificates.filter(c => selectedForDownload.includes(c.id));
      const certsWithMissingData = selectedCerts.map(cert => {
        const missing = [];
        if (!cert.holderName) missing.push('Awardee Name');
        if (!cert.businessUnit) missing.push('Sub-Function');
        // Check for signature - either from cert itself or global
        const hasSignature = cert.signature || globalSignature?.imagePath;
        if (!hasSignature) missing.push('Signature');
        return { cert, missing };
      }).filter(item => item.missing.length > 0);
      
      if (certsWithMissingData.length > 0) {
        setMissingDataAlert({
          type: 'download',
          certificatesWithDetails: certsWithMissingData.map(item => ({
            name: item.cert.holderName || `Certificate ${item.cert.id}`,
            id: item.cert.id,
            missing: item.missing
          })),
        });
        return;
      }
    }
    
    setDownloadProgress(0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 210;
    const pdfHeight = 297;
    const total = selectedForDownload.length;
    
    // Use the hidden export refs
    for (let i = 0; i < total; i++) {
      const certId = selectedForDownload[i];
      const exportRef = exportRefs.current[certId];
      if (!exportRef) continue;
      
      const canvas = await html2canvas(exportRef, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight);
      setDownloadProgress(Math.round(((i + 1) / total) * 100));
    }
    
    pdf.save('certificates.pdf');
    setDownloadProgress(null);
    setShowDownloadPopover(false);
  };

  return (
    <>
      <Header user={STATIC_USER} />
      <div className="flex" style={{ backgroundColor: '#1c1c1c', padding: '48px 56px', paddingTop: '72px', gap: '24px', minHeight: '100vh' }}>
      {/* Left Sidebar - Templates */}
      <TemplateSidebar
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
        onTemplateClick={addCertificate}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col" style={{ padding: '24px', minHeight: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveSection(null)}
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
            <h1 style={{ color: '#FFFFFF', fontSize: '24px', whiteSpace: 'nowrap' }} className="font-semibold">Certificate Designer</h1>
          </div>
          <div className="flex items-center gap-[6px] relative">
            <input
              type="file"
              ref={excelInputRef}
              onChange={handleExcelUpload}
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
            />
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
            <button
              onClick={() => addCertificate()}
              className="hover:opacity-90 transition-all"
              style={{ 
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              title="Add Certificate"
            >
              <Plus size={16} color="#ffffff" />
            </button>
            {certificates.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete all certificates?')) {
                    saveToHistory();
                    setCertificates([]);
                    setSelectedCertificateId(null);
                  }
                }}
                className="hover:opacity-90 transition-all"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                title="Delete All Certificates"
              >
                <Trash2 size={16} color="#ffffff" />
              </button>
            )}
            <button
              onClick={openDownloadPopover}
              className="hover:opacity-90 transition-all"
              style={{ 
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              title="Download Certificates"
            >
              <Download size={16} color="#ffffff" />
            </button>
            
            {/* Download Popover */}
            {showDownloadPopover && (
              <div 
                ref={downloadPopoverRef}
                className="absolute top-full right-0 mt-2 rounded-lg shadow-xl z-50"
                style={{
                  background: 'rgba(37, 37, 37, 0.95)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  minWidth: '280px',
                  padding: '16px'
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                  <h3 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>Download Certificates</h3>
                  <button
                    onClick={() => setShowDownloadPopover(false)}
                    className="hover:opacity-80"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    <X size={16} color="#ffffff" />
                  </button>
                </div>
                <div 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '8px', 
                    marginBottom: '16px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  {certificates.map((cert) => (
                    <label 
                      key={cert.id}
                      className="flex items-center gap-3 cursor-pointer hover:opacity-80"
                      style={{ 
                        color: (cert._isFromExcel && !cert.businessUnit) ? '#FF6B6B' : '#FFFFFF', 
                        fontSize: '13px',
                        backgroundColor: (cert._isFromExcel && !cert.businessUnit) ? 'rgba(255, 107, 107, 0.1)' : 'transparent',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        margin: '-4px -8px',
                        marginBottom: '4px'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedForDownload.includes(cert.id)}
                        onChange={() => toggleCertificateSelection(cert.id)}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: (cert._isFromExcel && !cert.businessUnit) ? '#FF6B6B' : '#00FFAA',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ flex: 1 }}>{cert.holderName || cert.template.name}</span>
                      {(cert._isFromExcel && !cert.businessUnit) && (
                        <span style={{ fontSize: '10px', color: '#FF6B6B' }}>⚠️ Missing</span>
                      )}
                    </label>
                  ))}
                </div>
                
                {/* Error message for missing sub-function */}
                {certificates.filter(c => selectedForDownload.includes(c.id) && c._isFromExcel && !c.businessUnit).length > 0 && (
                  <div style={{
                    backgroundColor: 'rgba(255, 107, 107, 0.15)',
                    border: '1px solid #FF6B6B',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>⚠️</span>
                    <span style={{ color: '#FF6B6B', fontSize: '12px' }}>
                      {certificates.filter(c => selectedForDownload.includes(c.id) && c._isFromExcel && !c.businessUnit).length} certificate(s) missing sub-function data
                    </span>
                  </div>
                )}
                
                <button
                  onClick={() => handleDownloadPDF(false)}
                  disabled={selectedForDownload.length === 0 || downloadProgress !== null}
                  className="w-full flex items-center justify-center gap-2 text-white py-2 transition-all font-medium"
                  style={{ 
                    background: downloadProgress !== null 
                      ? `linear-gradient(90deg, #4736FE ${downloadProgress}%, rgba(255,255,255,0.2) ${downloadProgress}%)`
                      : selectedForDownload.length > 0 
                        ? '#4736FE' 
                        : 'rgba(255, 255, 255, 0.2)',
                    cursor: (selectedForDownload.length > 0 && downloadProgress === null) ? 'pointer' : 'not-allowed',
                    padding: '14px 24px',
                    borderRadius: '14px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                  onMouseOver={(e) => {
                    if (selectedForDownload.length > 0) {
                      e.currentTarget.style.background = '#3a2bd4';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedForDownload.length > 0) {
                      e.currentTarget.style.background = '#4736FE';
                    }
                  }}
                >
                  <Download size={16} />
                  {downloadProgress !== null 
                    ? `Downloading... ${downloadProgress}%` 
                    : `Download PDF (${selectedForDownload.length})`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Canvas Container */}
        <div 
          className="flex-1 overflow-auto rounded-lg" 
          style={{ 
            backgroundColor: '#252525', 
            padding: '24px',
            minHeight: '600px',
            overflowX: 'hidden'
          }}
          onDrop={handleTemplateDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {certificates.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              width: '100%'
            }}>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.5)', 
                fontSize: '24px', 
                fontWeight: '500',
                letterSpacing: '2px'
              }}>
                Select. Drag. Create.
              </p>
            </div>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', alignItems: 'center' }}>
            {certificates.map((cert, index) => (
              <React.Fragment key={cert.id}>
                <div 
                  onClick={() => setSelectedCertificateId(cert.id)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.style.outline = '2px dashed #00FFAA';
                  }}
                  onDragLeave={(e) => {
                    e.stopPropagation();
                    e.currentTarget.style.outline = 'none';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.style.outline = 'none';
                    const signatureData = e.dataTransfer.getData('signature');
                    if (signatureData) {
                      const signature = JSON.parse(signatureData);
                      // Update only this specific certificate's signature
                      saveToHistory();
                      setCertificates(prev => prev.map(c => 
                        c.id === cert.id 
                          ? { ...c, signature: signature.imagePath, signatoryName: signature.name, signatoryTitle: signature.title }
                          : c
                      ));
                    }
                  }}
                  className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
                  style={{
                    borderRadius: '8px',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    width: '100%',
                    position: 'relative',
                    outline: (cert._isFromExcel && !cert.businessUnit) ? '3px solid #FF6B6B' : 'none',
                    boxShadow: (cert._isFromExcel && !cert.businessUnit) ? '0 0 12px rgba(255, 107, 107, 0.4)' : 'none'
                  }}
                >
                <div className="transform scale-[0.5] origin-top-left" style={{ width: '298px', height: '421px' }}>
                  <CertificateCanvas
                    ref={(el) => certificateRefs.current[cert.id] = el}
                    template={cert.template}
                    formData={cert}
                    globalSignature={globalSignature}
                  />
                </div>
                <div className="flex flex-row z-10" style={{ gap: '8px', position: 'absolute', top: '4px', right: '4px' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownload(cert.id); }}
                    className="hover:opacity-90 transition-all"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    title="Download"
                  >
                    <Download size={16} color="#ffffff" />
                  </button>
                  {certificates.length >= 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteCertificate(cert.id); }}
                      className="hover:opacity-90 transition-all"
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      title="Delete"
                    >
                      <Trash2 size={16} color="#ffffff" />
                    </button>
                  )}
                </div>
              </div>
              {index < certificates.length - 1 && (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '12px 0',
                  width: '100%'
                }}>
                  <div style={{ 
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: '1px'
                  }} />
                </div>
              )}
            </React.Fragment>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Edit Panel */}
      <EditPanel
        formData={formData}
        onFormChange={handleFormChange}
        onSignatureUpload={handleSignatureUpload}
        globalSignature={globalSignature}
        onGlobalSignatureChange={handleGlobalSignatureChange}
        hasCertificateSelected={certificates.length > 0}
        onSignatureClick={handleSignatureClick}
        selectedCertificateId={selectedCertificateId}
      />
    </div>

    {/* Template Selection Modal */}
    {/* Hidden full-size certificates for PDF export */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '595px', overflow: 'visible' }}>
        {certificates.map((cert) => (
          <div key={`export-${cert.id}`} style={{ width: '595px', height: '842px' }}>
            <CertificateCanvas
              ref={(el) => exportRefs.current[cert.id] = el}
              template={cert.template}
              formData={cert}
              globalSignature={globalSignature}
            />
          </div>
        ))}
      </div>

      {showTemplateModal && (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200
        }}
      >
        <div 
          style={{
            backgroundColor: '#252525',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
        >
          <h2 style={{ color: '#FFFFFF', fontSize: '24px', marginBottom: '8px', fontWeight: '600' }}>
            Select Templates
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '24px' }}>
            The following award categories don't match any template. Please select a template for each:
          </p>

          {unmatchedCategories.map((category) => (
            <div key={category} style={{ marginBottom: '24px' }}>
              <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
                "{category}"
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelection(category, template)}
                    style={{
                      padding: '12px',
                      backgroundColor: '#1c1c1c',
                      border: '2px solid #333',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = '#00FFAA';
                      e.target.style.backgroundColor = 'rgba(0, 255, 170, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#333';
                      e.target.style.backgroundColor = '#1c1c1c';
                    }}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={() => {
                setShowTemplateModal(false);
                setPendingExcelData([]);
                setUnmatchedCategories([]);
              }}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: 'transparent',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={finalizePendingCertificates}
              disabled={unmatchedCategories.length > 0}
              style={{
                flex: 1,
                padding: '14px 24px',
                background: unmatchedCategories.length > 0 ? '#333' : '#4736FE',
                border: 'none',
                borderRadius: '14px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: unmatchedCategories.length > 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Create Certificates
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Missing Data Alert Modal */}
    {missingDataAlert && (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300
        }}
      >
        <div 
          style={{
            backgroundColor: '#252525',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid #FF6B6B'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(255, 107, 107, 0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#FF6B6B',
              fontSize: '20px'
            }}>
              ⚠️
            </div>
            <h2 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '600', margin: 0 }}>
              {missingDataAlert.type === 'upload' ? 'Missing Sub-Function Data' : 'Incomplete Certificates'}
            </h2>
          </div>
          
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginBottom: '16px' }}>
            {missingDataAlert.type === 'upload' 
              ? 'The following certificates are missing sub-function information.'
              : 'The following certificates have missing information. You can edit them or proceed with download anyway.'
            }
          </p>
          
          {/* Column selection for upload type with columnNames */}
          {missingDataAlert.type === 'upload' && missingDataAlert.columnNames && (
            <div style={{
              backgroundColor: 'rgba(71, 54, 254, 0.15)',
              border: '1px solid #4736FE',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                Choose another column to use as Sub-Function:
              </label>
              <select
                onChange={(e) => {
                  const selectedColumn = e.target.value;
                  if (selectedColumn && missingDataAlert.certificateIds) {
                    // Update all certificates with missing sub-function using the selected column
                    setCertificates(prev => prev.map(cert => {
                      if (missingDataAlert.certificateIds.includes(cert.id) && cert._rawRow) {
                        const newBusinessUnit = cert._rawRow[selectedColumn] || '';
                        return {
                          ...cert,
                          businessUnit: newBusinessUnit,
                          _hasMissingData: !newBusinessUnit || !cert.holderName
                        };
                      }
                      return cert;
                    }));
                    setMissingDataAlert(null);
                  }
                }}
                style={{
                  width: '100%',
                  background: '#333',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  padding: '10px 12px',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select a column...</option>
                {missingDataAlert.columnNames.map((col, idx) => (
                  <option key={idx} value={col}>{col}</option>
                ))}
              </select>
            </div>
          )}
          
          <div style={{ 
            backgroundColor: 'rgba(255, 107, 107, 0.1)', 
            borderRadius: '8px', 
            padding: '12px',
            maxHeight: '200px',
            overflowY: 'auto',
            marginBottom: '24px'
          }}>
            {missingDataAlert.certificatesWithDetails ? (
              missingDataAlert.certificatesWithDetails.map((item, index) => (
                <div key={index} style={{ 
                  padding: '8px 0',
                  borderBottom: index < missingDataAlert.certificatesWithDetails.length - 1 ? '1px solid rgba(255, 107, 107, 0.2)' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '500' }}>
                      {item.name}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCertificateId(item.id);
                        setMissingDataAlert(null);
                        setShowDownloadPopover(false);
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid #FFFFFF',
                        borderRadius: '4px',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        padding: '2px 8px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <div style={{ color: '#FF6B6B', fontSize: '11px', marginTop: '4px' }}>
                    Missing: {item.missing.join(', ')}
                  </div>
                </div>
              ))
            ) : (
              missingDataAlert.certificates?.map((name, index) => (
                <div key={index} style={{ 
                  color: '#FF6B6B', 
                  fontSize: '13px',
                  padding: '4px 0',
                  borderBottom: index < missingDataAlert.certificates.length - 1 ? '1px solid rgba(255, 107, 107, 0.2)' : 'none'
                }}>
                  • {name}
                </div>
              ))
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setMissingDataAlert(null)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#333',
                border: 'none',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {missingDataAlert.type === 'upload' ? 'Skip' : 'Cancel'}
            </button>
            {missingDataAlert.type === 'download' && (
              <button
                onClick={() => {
                  setMissingDataAlert(null);
                  handleDownloadPDF(true);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#4736FE',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Download Anyway
              </button>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default App;
