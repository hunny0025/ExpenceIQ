/**
 * chartConfig.ts
 *
 * Registers all Chart.js v4 components and sets dark-theme global defaults.
 * Import as a side-effect ONCE — ChartWrapper.tsx does this automatically.
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  defaults,
} from 'chart.js';

import { COLORS, TYPOGRAPHY } from './tokens';

// ─── Registration (idempotent) ────────────────────────────────────────────────
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// ─── Global font / animation ──────────────────────────────────────────────────
defaults.font.family        = TYPOGRAPHY.fontFamily;
defaults.color              = COLORS.textSecondary;
defaults.animation          = { duration: 500, easing: 'easeInOutQuart' };
defaults.responsive         = true;
defaults.maintainAspectRatio = false;

// ─── Axis scale defaults ──────────────────────────────────────────────────────
const sharedTicks = {
  color:   COLORS.textSecondary,
  font:    { size: TYPOGRAPHY.sizes.tick, family: TYPOGRAPHY.fontFamily },
  padding: 8,
};

const sharedGrid = { color: COLORS.gridLine };

(['category', 'linear', 'time'] as const).forEach((scaleType) => {
  const scale = (defaults.scales as Record<string, object>)[scaleType];
  if (!scale) return;
  Object.assign(scale, {
    grid:   sharedGrid,
    ticks:  sharedTicks,
    border: { color: COLORS.gridLine, dash: [4, 4] },
  });
});

// ─── Plugin defaults ──────────────────────────────────────────────────────────
Object.assign(defaults.plugins.legend, {
  display:  true,
  position: 'top',
  align:    'end',
  labels: {
    color:           COLORS.textPrimary,
    font:            { size: TYPOGRAPHY.sizes.legend, family: TYPOGRAPHY.fontFamily },
    boxWidth:        10,
    boxHeight:       10,
    borderRadius:    3,
    useBorderRadius: true,
    padding:         16,
  },
});

Object.assign(defaults.plugins.tooltip, {
  enabled:         true,
  backgroundColor: COLORS.tooltipBg,
  titleColor:      COLORS.textPrimary,
  bodyColor:       COLORS.textSecondary,
  borderColor:     COLORS.border,
  borderWidth:     1,
  padding:         12,
  cornerRadius:    8,
  titleFont:       { size: TYPOGRAPHY.sizes.tooltip, family: TYPOGRAPHY.fontFamily, weight: String(TYPOGRAPHY.weights.semiBold) },
  bodyFont:        { size: TYPOGRAPHY.sizes.tooltip, family: TYPOGRAPHY.fontFamily, weight: String(TYPOGRAPHY.weights.normal)   },
});

// ─── Option Builders ──────────────────────────────────────────────────────────

/** Base options for a dark-theme line chart. Spread overrides to customise. */
export function buildLineOptions(overrides: Partial<ChartOptions<'line'>> = {}): ChartOptions<'line'> {
  return {
    plugins: { legend: {}, tooltip: {} },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
    elements: {
      line:  { tension: 0.4, borderWidth: 2 },
      point: { radius: 3, hoverRadius: 6, borderWidth: 2 },
    },
    ...overrides,
  } as ChartOptions<'line'>;
}

/** Base options for a dark-theme bar chart. Spread overrides to customise. */
export function buildBarOptions(overrides: Partial<ChartOptions<'bar'>> = {}): ChartOptions<'bar'> {
  return {
    plugins: { legend: {}, tooltip: {} },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
    elements: {
      bar: { borderRadius: 6, borderSkipped: false },
    },
    ...overrides,
  } as ChartOptions<'bar'>;
}
