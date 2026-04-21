/**
 * DateRangePicker.tsx
 *
 * A custom date-range picker built on top of react-datepicker.
 * Renders two linked calendar inputs (start / end date).
 *
 * Props:
 *   startDate   – Date | null
 *   endDate     – Date | null
 *   onChange    – (start: Date | null, end: Date | null) => void
 *   placeholder – string shown when no date selected
 *   minDate     – Date | undefined
 *   maxDate     – Date | undefined (defaults to today)
 *   disabled    – boolean
 *   className   – extra class on root
 */

import { useRef, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css';

export interface DateRangePickerProps {
  startDate?:   Date | null;
  endDate?:     Date | null;
  onChange:     (start: Date | null, end: Date | null) => void;
  placeholder?: string;
  minDate?:     Date;
  maxDate?:     Date;
  disabled?:    boolean;
  className?:   string;
}

export default function DateRangePicker({
  startDate   = null,
  endDate     = null,
  onChange,
  placeholder = 'Select date range',
  minDate,
  maxDate     = new Date(),
  disabled    = false,
  className   = '',
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const startRef = useRef<ReactDatePicker>(null);

  const handleStartChange = (date: Date | null) => {
    // If new start is after current end, clear the end
    const newEnd = endDate && date && date > endDate ? null : endDate;
    onChange(date, newEnd);
    if (date) startRef.current?.setOpen(false);
  };

  const handleEndChange = (date: Date | null) => {
    onChange(startDate, date);
    setOpen(false);
  };

  const clear = () => {
    onChange(null, null);
  };

  const formatDisplay = (d: Date | null | undefined) =>
    d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  const hasValue = startDate || endDate;
  const summary  =
    startDate && endDate
      ? `${formatDisplay(startDate)} – ${formatDisplay(endDate)}`
      : startDate
        ? `From ${formatDisplay(startDate)}`
        : endDate
          ? `To ${formatDisplay(endDate)}`
          : placeholder;

  return (
    <div className={`drp-root ${disabled ? 'drp-root--disabled' : ''} ${className}`.trim()}>
      {/* Trigger button */}
      <button
        type="button"
        className="drp-trigger"
        onClick={() => !disabled && setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
        aria-label="Open date range picker"
      >
        <span className="drp-trigger__icon" aria-hidden="true">📅</span>
        <span className={`drp-trigger__label ${!hasValue ? 'drp-trigger__label--placeholder' : ''}`}>
          {summary}
        </span>
        {hasValue && (
          <button
            type="button"
            className="drp-clear"
            onClick={(e) => { e.stopPropagation(); clear(); }}
            aria-label="Clear date range"
          >
            ×
          </button>
        )}
        <span className="drp-trigger__chevron" aria-hidden="true">
          {open ? '▲' : '▼'}
        </span>
      </button>

      {/* Picker dropdown */}
      {open && (
        <div className="drp-dropdown" role="dialog" aria-label="Date range picker">
          <div className="drp-pickers">
            {/* Start date */}
            <div className="drp-picker-group">
              <label className="drp-picker-label">Start Date</label>
              <ReactDatePicker
                ref={startRef}
                selected={startDate}
                onChange={handleStartChange}
                selectsStart
                startDate={startDate ?? undefined}
                endDate={endDate ?? undefined}
                minDate={minDate}
                maxDate={maxDate}
                inline
                calendarClassName="drp-calendar"
              />
            </div>

            {/* Divider */}
            <div className="drp-divider" aria-hidden="true" />

            {/* End date */}
            <div className="drp-picker-group">
              <label className="drp-picker-label">End Date</label>
              <ReactDatePicker
                selected={endDate}
                onChange={handleEndChange}
                selectsEnd
                startDate={startDate ?? undefined}
                endDate={endDate ?? undefined}
                minDate={startDate ?? minDate}
                maxDate={maxDate}
                inline
                calendarClassName="drp-calendar"
              />
            </div>
          </div>

          {/* Quick ranges */}
          <div className="drp-presets">
            {[
              { label: 'Today',      fn: () => { const t = new Date(); onChange(t, t); setOpen(false); } },
              { label: 'Last 7 days',fn: () => { const e=new Date(); const s=new Date(); s.setDate(e.getDate()-6); onChange(s,e); setOpen(false); } },
              { label: 'This month', fn: () => { const n=new Date(); onChange(new Date(n.getFullYear(),n.getMonth(),1),n); setOpen(false); } },
              { label: 'Last 30 days',fn: () => { const e=new Date(); const s=new Date(); s.setDate(e.getDate()-29); onChange(s,e); setOpen(false); } },
              { label: 'This year',  fn: () => { const n=new Date(); onChange(new Date(n.getFullYear(),0,1),n); setOpen(false); } },
            ].map(({ label, fn }) => (
              <button
                key={label}
                type="button"
                className="drp-preset-btn"
                onClick={fn}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close on outside click */}
      {open && (
        <div
          className="drp-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
