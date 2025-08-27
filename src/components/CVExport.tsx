import React, { useState } from 'react';
import jsPDF from 'jspdf';

interface CVExportProps {
  cvText: string;
  jobTitle?: string;
  userPlan: 'free' | 'pro';
  onUpgrade: () => void;
}

const CVExport: React.FC<CVExportProps> = ({ cvText, jobTitle, userPlan, onUpgrade }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic' | 'ats'>('modern');

  const exportToPDF = async () => {
    if (userPlan === 'free') {
      onUpgrade();
      return;
    }

    if (!cvText.trim()) {
      alert('Please generate a CV first');
      return;
    }

    setIsExporting(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      
      // Set font
      pdf.setFont('helvetica');
      
      // Title
      if (jobTitle) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`CV - ${jobTitle}`, margin, margin + 10);
      }
      
      // CV Content
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      const lines = cvText.split('\n');
      let yPosition = jobTitle ? margin + 30 : margin + 20;
      
      lines.forEach((line) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin + 20;
        }
        
        // Handle long lines
        const wrappedLines = pdf.splitTextToSize(line, maxWidth);
        wrappedLines.forEach((wrappedLine: string) => {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin + 20;
          }
          pdf.text(wrappedLine, margin, yPosition);
          yPosition += 6;
        });
        
        yPosition += 2; // Extra space between paragraphs
      });
      
      // Add footer
      const fileName = `CV_${jobTitle ? jobTitle.replace(/[^a-zA-Z0-9]/g, '_') : 'Optimized'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToWord = async () => {
    if (userPlan === 'free') {
      onUpgrade();
      return;
    }

    if (!cvText.trim()) {
      alert('Please generate a CV first');
      return;
    }

    // Create a simple Word document using HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>CV - ${jobTitle || 'Optimized'}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          h1 { color: #333; border-bottom: 2px solid #333; }
          h2 { color: #555; margin-top: 20px; }
          p { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        ${jobTitle ? `<h1>CV - ${jobTitle}</h1>` : '<h1>Optimized CV</h1>'}
        <div style="white-space: pre-line;">${cvText}</div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CV_${jobTitle ? jobTitle.replace(/[^a-zA-Z0-9]/g, '_') : 'Optimized'}_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyAsPlainText = async () => {
    if (!cvText.trim()) {
      alert('Please generate a CV first');
      return;
    }

    await navigator.clipboard.writeText(cvText);
    alert('CV copied to clipboard!');
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Export CV</h3>
      
      {/* Template Selection (Pro Feature) */}
      {userPlan === 'pro' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Template Style
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as any)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="modern">Modern (Recommended)</option>
            <option value="classic">Classic Professional</option>
            <option value="ats">ATS-Optimized</option>
          </select>
        </div>
      )}

      {/* Export Options */}
      <div className="grid grid-cols-1 gap-3">
        {/* PDF Export */}
        <button
          onClick={exportToPDF}
          disabled={isExporting || !cvText.trim()}
          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
            userPlan === 'pro' 
              ? 'bg-indigo-600/20 border-indigo-500/30 text-white hover:bg-indigo-600/30' 
              : 'bg-slate-700/50 border-slate-600 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">📄</div>
            <div className="text-left">
              <div className="font-medium">Export as PDF</div>
              <div className="text-xs text-slate-400">Professional formatting</div>
            </div>
          </div>
          {userPlan === 'free' && (
            <span className="text-xs bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-2 py-1 rounded">
              Pro
            </span>
          )}
        </button>

        {/* Word Export */}
        <button
          onClick={exportToWord}
          disabled={!cvText.trim()}
          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
            userPlan === 'pro' 
              ? 'bg-blue-600/20 border-blue-500/30 text-white hover:bg-blue-600/30' 
              : 'bg-slate-700/50 border-slate-600 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">📝</div>
            <div className="text-left">
              <div className="font-medium">Export as Word</div>
              <div className="text-xs text-slate-400">Editable document</div>
            </div>
          </div>
          {userPlan === 'free' && (
            <span className="text-xs bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-2 py-1 rounded">
              Pro
            </span>
          )}
        </button>

        {/* Plain Text Copy */}
        <button
          onClick={copyAsPlainText}
          disabled={!cvText.trim()}
          className="flex items-center justify-between p-3 rounded-lg border bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">📋</div>
            <div className="text-left">
              <div className="font-medium">Copy Text</div>
              <div className="text-xs text-slate-400">Plain text format</div>
            </div>
          </div>
        </button>
      </div>

      {/* Pro Features Info */}
      {userPlan === 'free' && (
        <div className="mt-4 p-4 bg-gradient-to-r from-indigo-600/10 to-cyan-600/10 border border-indigo-500/20 rounded-lg">
          <h4 className="font-medium text-white mb-2">🚀 Pro Export Features</h4>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Professional PDF formatting</li>
            <li>• Multiple template styles</li>
            <li>• ATS-optimized layouts</li>
            <li>• Word document export</li>
            <li>• Custom branding options</li>
          </ul>
          <button
            onClick={onUpgrade}
            className="mt-3 w-full py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg hover:from-indigo-700 hover:to-cyan-700 transition-all text-sm"
          >
            Upgrade to Pro
          </button>
        </div>
      )}
    </div>
  );
};

export default CVExport;