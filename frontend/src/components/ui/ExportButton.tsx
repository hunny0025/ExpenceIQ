import React, { useState } from 'react';
import Papa from 'papaparse';
import './ExportButton.css';

export interface DateRange {
  startDate?: Date | string;
  endDate?: Date | string;
}

export interface ExportButtonProps<T> {
  data: T[];
  dateRange?: DateRange | string;
  filenamePrefix?: string;
  className?: string;
  buttonText?: string;
}

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

export default function ExportButton<T>({
  data,
  dateRange,
  filenamePrefix = 'expenses',
  className = '',
  buttonText = 'Export to CSV'
}: React.PropsWithChildren<ExportButtonProps<T>>) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    if (!data || data.length === 0) return;

    setIsExporting(true);

    try {
      // Generate CSV
      // papaparse nicely handles arrays of objects automatically mapping keys to columns.
      const csv = Papa.unparse(data);
      
      // Determine filename
      let startStr = '';
      let endStr = '';

      if (typeof dateRange === 'string') {
        startStr = dateRange;
        endStr = dateRange;
      } else if (dateRange) {
        startStr = formatDate(dateRange.startDate);
        endStr = formatDate(dateRange.endDate);
      }

      let filename = filenamePrefix;
      if (startStr && endStr && startStr !== endStr) {
        filename += `_${startStr}_to_${endStr}`;
      } else if (startStr) {
        filename += `_${startStr}`;
      } else {
        // Fallback to today's date if no date range is provided
        filename += `_${formatDate(new Date())}`;
      }
      
      filename += '.csv';

      // Trigger download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      
      // We create a temporary unattached anchor element to trigger the download
      const link = document.createElement('a'); 
      if (link.download !== undefined) { 
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error generating CSV', error);
    } finally {
      setIsExporting(false);
    }
  };

  const isDisabled = !data || data.length === 0 || isExporting;

  return (
    <button 
      className={`export-btn ${className} ${isDisabled ? 'disabled' : ''}`}
      onClick={handleExport}
      disabled={isDisabled}
      aria-label="Export data to CSV"
      title={isDisabled ? "No data to export" : "Export data to CSV"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="export-icon"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      {isExporting ? 'Exporting...' : buttonText}
    </button>
  );
}
