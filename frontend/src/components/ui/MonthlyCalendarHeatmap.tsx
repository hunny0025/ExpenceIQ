/**
 * MonthlyCalendarHeatmap — displays a single-month calendar heatmap
 * coloured by daily spending intensity.
 *
 * Uses {@link https://github.com/kevinsqi/react-calendar-heatmap react-calendar-heatmap}
 * under the hood and maps spending amounts to a three-step colour scale
 * (light → medium → dark blue).
 *
 * @example
 * ```tsx
 * <MonthlyCalendarHeatmap
 *   data={[{ date: '2026-04-01', amount: 42.5 }]}
 *   year={2026}
 *   month={4}
 * />
 * ```
 */

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './MonthlyCalendarHeatmap.css';

/** A single day's spending data point. */
export interface HeatmapData {
  /** Date string (`YYYY-MM-DD`) or Date object. */
  date: string | Date;
  /** Total spend for this day. */
  amount: number;
}

/** Props for the {@link MonthlyCalendarHeatmap} component. */
export interface MonthlyCalendarHeatmapProps {
  /** Array of daily spending data points. */
  data: HeatmapData[];
  /**
   * Full year to display.
   * @default current year
   */
  year?: number;
  /**
   * Month to display (1-indexed: 1 = January … 12 = December).
   * @default current month
   */
  month?: number;
  /** Extra CSS class on the root container. */
  className?: string;
}

export default function MonthlyCalendarHeatmap({
  data,
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1,
  className = ''
}: MonthlyCalendarHeatmapProps) {
  // react-calendar-heatmap: startDate is exclusive, endDate is inclusive
  const startDate = new Date(year, month - 1, 0);
  const endDate = new Date(year, month, 0); // last day of the month

  // Guard: handle empty / undefined data gracefully
  const safeData = Array.isArray(data) ? data : [];

  const amounts = safeData.map(d => d.amount).filter(a => a != null && a > 0);
  const maxAmount = amounts.length ? Math.max(...amounts) : 0;

  const heatmapValues = safeData.map(item => ({
    date: item.date,
    count: item.amount ?? 0,
  }));

  /** Assigns a CSS class based on spending intensity. */
  const getClassForValue = (value: { date: Date | string, count: number } | null) => {
    if (!value || value.count == null || value.count === 0) {
      return 'color-empty';
    }
    if (maxAmount === 0) return 'color-scale-1';

    const ratio = value.count / maxAmount;
    if (ratio <= 0.33) return 'color-scale-1';
    if (ratio <= 0.66) return 'color-scale-2';
    return 'color-scale-3';
  };

  /** Returns HTML `title` attributes for native browser tooltips. */
  const getTooltipDataAttrs = (value: { date: Date | string, count: number } | null) => {
    if (!value?.date) return null;

    const dateStr = typeof value.date === 'string'
      ? value.date
      : (value.date as Date).toISOString().split('T')[0];

    return {
      title: `${dateStr}: $${(value.count ?? 0).toFixed(2)}`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  };

  return (
    <div className={`monthly-heatmap-container ${className}`}>
      <div className="heatmap-header">
        <h3>Spending Heatmap</h3>
        <span className="heatmap-subtitle">
          {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div className="heatmap-wrapper">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={heatmapValues}
          classForValue={getClassForValue}
          showWeekdayLabels={true}
          tooltipDataAttrs={getTooltipDataAttrs}
        />
      </div>

      <div className="heatmap-legend">
        <span className="legend-label">Less</span>
        <div className="legend-squares">
          <div className="legend-square color-empty"></div>
          <div className="legend-square color-scale-1"></div>
          <div className="legend-square color-scale-2"></div>
          <div className="legend-square color-scale-3"></div>
        </div>
        <span className="legend-label">More</span>
      </div>
    </div>
  );
}
