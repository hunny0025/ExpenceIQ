/**
 * ChartWrapper.tsx
 *
 * Generic reusable wrapper for react-chartjs-2 charts with full state handling.
 *
 * Props:
 *  type       – 'line' | 'bar'              (default: 'line')
 *  data       – Chart.js ChartData object
 *  options    – Chart.js options overrides
 *  loading    – boolean: show loading spinner
 *  error      – string | null: show error message
 *  title      – optional card heading
 *  subtitle   – optional card sub-heading
 *  height     – canvas height in px        (default: 280)
 *  className  – extra class on root element
 */

import { useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyChartData    = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyChartOptions = any;

import './chartConfig';       // registers Chart.js + sets global defaults
import './ChartWrapper.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChartType = 'line' | 'bar';

export interface ChartWrapperProps {
  type?:      ChartType;
  data?:      AnyChartData;
  options?:   AnyChartOptions;
  loading?:   boolean;
  error?:     string | null;
  title?:     string;
  subtitle?:  string;
  height?:    number;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isDataEmpty(data?: AnyChartData): boolean {
  if (!data) return true;
  if (!data.datasets || data.datasets.length === 0) return true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.datasets.every((ds: any) => !ds.data || ds.data.length === 0);
}

// ─── State sub-components ─────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="chart-state chart-state--loading" aria-busy="true" aria-label="Loading chart">
      <div className="spinner" role="status" />
      <p>Loading chart…</p>
    </div>
  );
}

function ErrorState({ message }: { message?: string | null }) {
  return (
    <div className="chart-state chart-state--error" role="alert">
      <span className="error-icon" aria-hidden="true">⚠️</span>
      <p>{message ?? 'Something went wrong. Please try again.'}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="chart-state chart-state--empty">
      <span className="empty-icon" aria-hidden="true">📊</span>
      <p>No data available yet.</p>
    </div>
  );
}

// ─── Chart type registry ──────────────────────────────────────────────────────

const CHART_COMPONENTS = {
  line: Line,
  bar:  Bar,
} as const;

// ─── Main component ───────────────────────────────────────────────────────────

export default function ChartWrapper({
  type      = 'line',
  data,
  options   = {},
  loading   = false,
  error     = null,
  title,
  subtitle,
  height    = 280,
  className = '',
}: ChartWrapperProps) {
  const ChartComponent = CHART_COMPONENTS[type];

  // Stable options reference to avoid unnecessary re-renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mergedOptions = useMemo(() => options, [JSON.stringify(options)]);

  if (!ChartComponent) {
    console.error(`[ChartWrapper] Unsupported chart type: "${type}". Use "line" or "bar".`);
    return <ErrorState message={`Unsupported chart type: ${type}`} />;
  }

  const renderContent = () => {
    if (loading)           return <LoadingState />;
    if (error)             return <ErrorState message={error} />;
    if (isDataEmpty(data)) return <EmptyState />;

    return (
      <div className="chart-wrapper__canvas" style={{ height }}>
        <ChartComponent
          data={data}
          options={mergedOptions}
          aria-label={title ?? 'Chart'}
        />
      </div>
    );
  };

  return (
    <div className={`chart-wrapper ${className}`.trim()}>
      {(title || subtitle) && (
        <div className="chart-wrapper__header">
          {title    && <h3 className="chart-wrapper__title">{title}</h3>}
          {subtitle && <p  className="chart-wrapper__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="chart-wrapper__box">
        {renderContent()}
      </div>
    </div>
  );
}
