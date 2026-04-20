/**
 * ChartWrapper
 *
 * A generic, reusable wrapper for react-chartjs-2 charts.
 *
 * Props:
 *  - type        {'line' | 'bar'}  Chart type (default: 'line')
 *  - data        {object}          Chart.js data object  (labels + datasets)
 *  - options     {object}          Chart.js options overrides
 *  - loading     {boolean}         Show loading state
 *  - error       {string|null}     Show error state with message
 *  - title       {string}          Optional card title
 *  - subtitle    {string}          Optional card subtitle / description
 *  - height      {number}          Canvas height in px (default: 280)
 *  - className   {string}          Extra class on the root element
 */

import { useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';

// Registers all Chart.js components + sets global defaults:
import './chartConfig';
import './ChartWrapper.css';

// ─── Helpers ────────────────────────────────────────────────────────────────

function isDataEmpty(data) {
  if (!data) return true;
  if (!data.datasets || data.datasets.length === 0) return true;
  return data.datasets.every(
    (ds) => !ds.data || ds.data.length === 0,
  );
}

// ─── State sub-components ────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="chart-state chart-state--loading" aria-busy="true" aria-label="Loading chart">
      <div className="spinner" />
      <p>Loading chart…</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="chart-state chart-state--error" role="alert">
      <span className="error-icon">⚠️</span>
      <p>{message || 'Something went wrong. Please try again.'}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="chart-state chart-state--empty">
      <span className="empty-icon">📊</span>
      <p>No data available yet.</p>
    </div>
  );
}

// ─── Chart type map ──────────────────────────────────────────────────────────

const CHART_COMPONENTS = { line: Line, bar: Bar };

// ─── Main component ──────────────────────────────────────────────────────────

export default function ChartWrapper({
  type = 'line',
  data,
  options = {},
  loading = false,
  error = null,
  title,
  subtitle,
  height = 280,
  className = '',
}) {
  const ChartComponent = CHART_COMPONENTS[type];

  if (!ChartComponent) {
    console.error(`[ChartWrapper] Unsupported type: "${type}". Use "line" or "bar".`);
    return <ErrorState message={`Unsupported chart type: ${type}`} />;
  }

  // Memoize merged options so downstream memo comparisons stay stable
  const mergedOptions = useMemo(() => options, [options]);

  // ── Determine content ────────────────────────────────────────────────────

  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error)   return <ErrorState message={error} />;
    if (isDataEmpty(data)) return <EmptyState />;

    return (
      <div className="chart-wrapper__canvas" style={{ height }}>
        <ChartComponent data={data} options={mergedOptions} aria-label={title || 'Chart'} />
      </div>
    );
  };

  return (
    <div className={`chart-wrapper ${className}`}>
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
