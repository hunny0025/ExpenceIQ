/**
 * analyticsTransformers.ts
 *
 * Pure functions that convert raw analytics API responses into
 * Chart.js ChartData objects consumable by ChartWrapper.
 */

import type { ChartData } from 'chart.js';
import type {
  AnalyticsData,
  CategoryBreakdown,
  DailyTrendPoint,
} from './analytics.service';
import {
  COLORS,
  SERIES_PALETTE,
  CATEGORY_COLORS,
} from '../charts/tokens';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Format "YYYY-MM-DD" → "Apr 7" */
function shortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Resolve a color for a category.
 * Tries CATEGORY_COLORS first (by lowercase name), then uses the API color,
 * and finally falls back to the series palette.
 */
function categoryColor(cat: CategoryBreakdown, idx: number): string {
  const key = cat.categoryName.toLowerCase();
  if (CATEGORY_COLORS[key]) return CATEGORY_COLORS[key].text;
  if (cat.categoryColor) return cat.categoryColor;
  return SERIES_PALETTE[idx % SERIES_PALETTE.length];
}

// ─── Transformers ───────────────────────────────────────────────────────────

/**
 * Monthly bar chart — income vs expense totals for the selected period.
 * (Single month view: two bars side-by-side.)
 */
export function toMonthlyBarData(analytics: AnalyticsData): ChartData<'bar'> {
  const { summary, period } = analytics;
  const monthLabel = new Date(period.year, period.month - 1)
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return {
    labels: [monthLabel],
    datasets: [
      {
        label: 'Income',
        data: [summary.totalIncome],
        backgroundColor: COLORS.accent,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Expenses',
        data: [summary.totalExpense],
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };
}

/**
 * Pie chart — spending distribution by category.
 */
export function toCategoryPieData(
  categories: CategoryBreakdown[],
): ChartData<'pie'> {
  if (!categories.length) {
    return { labels: [], datasets: [{ data: [] }] };
  }

  return {
    labels: categories.map((c) => c.categoryName),
    datasets: [
      {
        data: categories.map((c) => c.total),
        backgroundColor: categories.map((c, i) => categoryColor(c, i)),
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };
}

/**
 * Line chart — daily spending trend over the month.
 */
export function toTrendLineData(
  dailyTrend: DailyTrendPoint[],
): ChartData<'line'> {
  if (!dailyTrend.length) {
    return { labels: [], datasets: [{ data: [] }] };
  }

  return {
    labels: dailyTrend.map((d) => shortDate(d.date)),
    datasets: [
      {
        label: 'Daily Spend',
        data: dailyTrend.map((d) => d.total),
        borderColor: COLORS.secondary,
        backgroundColor: COLORS.secondaryAlpha,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: COLORS.secondary,
        pointBorderColor: COLORS.surface1,
        pointBorderWidth: 2,
      },
    ],
  };
}
