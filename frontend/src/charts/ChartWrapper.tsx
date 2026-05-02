/**
 * ChartWrapper — a generic, reusable wrapper for react-chartjs-2 charts
 * with built-in loading, error, and empty state handling.
 *
 * Supports `"line"`, `"bar"`, `"doughnut"`, and `"pie"` chart types.
 *
 * **Robustness**: Automatically sanitises datasets by replacing `null`,
 * `undefined`, and `NaN` values with `0` before rendering, so charts
 * never crash due to bad upstream data.
 *
 * @example
 * ```tsx
 * <ChartWrapper type="bar" data={barData} title="Monthly Spend" loading={isLoading} />
 * <ChartWrapper type="pie" data={pieData} error={err} height={300} />
 * ```
 */

import { useMemo } from 'react';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyChartData    = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyChartOptions = any;

import './chartConfig';       // registers Chart.js + sets global defaults
import './ChartWrapper.css';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Supported chart types. */
export type ChartType = 'line' | 'bar' | 'doughnut' | 'pie';

/** Props for the {@link ChartWrapper} component. */
export interface ChartWrapperProps {
  /**
   * Chart.js chart type to render.
   * @default "line"
   */
  type?: ChartType;
  /** Chart.js `ChartData` object. May be `undefined` while loading. */
  data?: AnyChartData;
  /** Chart.js options object (merged with global defaults). */
  options?: AnyChartOptions;
  /**
   * Show a loading spinner instead of the chart.
   * @default false
   */
  loading?: boolean;
  /** If truthy, renders an error state with this message. */
  error?: string | null;
  /** Optional heading above the chart card. */
  title?: string;
  /** Optional sub-heading above the chart card. */
  subtitle?: string;
  /**
   * Canvas height in pixels.
   * @default 280
   */
  height?: number;
  /** Extra CSS class on the root element. */
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns `true` when there is no meaningful data to chart.
 * Handles `undefined`, empty datasets, and datasets whose `data` arrays are
 * all empty or contain only nullish values.
 */
function isDataEmpty(data?: AnyChartData): boolean {
  if (!data) return true;
  if (!data.datasets || data.datasets.length === 0) return true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.datasets.every((ds: any) => {
    if (!ds.data || ds.data.length === 0) return true;
    // Also treat datasets of all null/undefined as empty
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ds.data.every((v: any) => v == null);
  });
}

/**
 * Deep-clones chart data and replaces every `null`, `undefined`, or `NaN`
 * value in each dataset's `data` array with `0`.
 *
 * This prevents Chart.js from throwing or rendering broken visuals when
 * upstream API data contains gaps.
 */
function sanitiseData(data: AnyChartData): AnyChartData {
  if (!data?.datasets) return data;

  return {
    ...data,
    labels: data.labels ?? [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    datasets: data.datasets.map((ds: any) => ({
      ...ds,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: Array.isArray(ds.data)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? ds.data.map((v: any) => (v == null || Number.isNaN(v) ? 0 : v))
        : [],
    })),
  };
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
  line:     Line,
  bar:      Bar,
  doughnut: Doughnut,
  pie:      Pie,
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

  // Sanitise data: replace null/undefined/NaN with 0 in all datasets
  const safeData = useMemo(() => (data ? sanitiseData(data) : data), [data]);

  if (!ChartComponent) {
    console.error(`[ChartWrapper] Unsupported chart type: "${type}". Use "line", "bar", "doughnut", or "pie".`);
    return <ErrorState message={`Unsupported chart type: ${type}`} />;
  }

  const renderContent = () => {
    if (loading)              return <LoadingState />;
    if (error)                return <ErrorState message={error} />;
    if (isDataEmpty(safeData)) return <EmptyState />;

    return (
      <div className="chart-wrapper__canvas" style={{ height }}>
        <ChartComponent
          data={safeData}
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
