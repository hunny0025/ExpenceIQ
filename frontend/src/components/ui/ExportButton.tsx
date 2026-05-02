/**
 * ExportButton — downloads the provided data array as a CSV file.
 *
 * Uses {@link https://www.papaparse.com/ PapaParse} to serialise rows and
 * generates a timestamped filename from the optional date range.
 *
 * @typeParam T - Row type (object keys become CSV column headers)
 *
 * @example
 * ```tsx
 * <ExportButton data={expenses} filenamePrefix="report" />
 * <ExportButton data={rows} dateRange={{ startDate: new Date(), endDate: new Date() }} />
 * ```
 */

import React, { useState } from 'react';
import Papa from 'papaparse';
import './ExportButton.css';

/** Date range descriptor for filename generation. */
export interface DateRange {
  /** Start of the range (Date or ISO string). */
  startDate?: Date | string;
  /** End of the range (Date or ISO string). */
  endDate?: Date | string;
}

/** Props for the {@link ExportButton} component. */
export interface ExportButtonProps<T> {
  /** Array of row objects to export. Column headers are derived from keys. */
  data: T[];
  /** Optional date range used to build the filename. */
  dateRange?: DateRange | string;
  /**
   * Prefix for the generated CSV filename.
   * @default "expenses"
   */
  filenamePrefix?: string;
  /** Extra CSS class on the root button element. */
  className?: string;
  /**
   * Label shown inside the button.
   * @default "Export to CSV"
   */
  buttonText?: string;
}

/** Formats a Date or ISO string into `YYYY-MM-DD`. Returns `""` for falsy input. */
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
      const csv = Papa.unparse(data);

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
        filename += `_${formatDate(new Date())}`;
      }

      filename += '.csv';

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

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
