/**
 * chartConfig.js
 *
 * Central Chart.js v4 registration and default global options.
 * Import this module ONCE (as a side-effect) before rendering any chart component.
 * ChartWrapper.jsx does this automatically via `import './chartConfig'`.
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  defaults,
} from 'chart.js';

import { COLORS, TYPOGRAPHY } from './tokens';

// ─── Registration (idempotent — safe to call multiple times) ──────────────────
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// ─── Global font / animation ─────────────────────────────────────────────────
defaults.font.family = TYPOGRAPHY.fontFamily;
defaults.color        = COLORS.textSecondary;
defaults.animation    = { duration: 500, easing: 'easeInOutQuart' };
defaults.responsive   = true;
defaults.maintainAspectRatio = false;

// ─── Axis scale defaults (Chart.js v4 API) ────────────────────────────────────
// In v4, per-scale defaults live at defaults.scales['category'] and defaults.scales['linear'].
const sharedTickDefaults = {
  color: COLORS.textSecondary,
  font: { size: TYPOGRAPHY.sizes.tick, family: TYPOGRAPHY.fontFamily },
  padding: 8,
};

const sharedGridDefaults = {
  color: COLORS.gridLine,
};

['category', 'linear', 'time'].forEach((scaleType) => {
  if (!defaults.scales[scaleType]) return;
  Object.assign(defaults.scales[scaleType], {
    grid:  sharedGridDefaults,
    ticks: sharedTickDefaults,
    border: { color: COLORS.gridLine, dash: [4, 4] },
  });
});

// ─── Plugin defaults ─────────────────────────────────────────────────────────
Object.assign(defaults.plugins.legend, {
  display:  true,
  position: 'top',
  align:    'end',
  labels: {
    color:          COLORS.textPrimary,
    font:           { size: TYPOGRAPHY.sizes.legend, family: TYPOGRAPHY.fontFamily },
    boxWidth:       10,
    boxHeight:      10,
    borderRadius:   3,
    useBorderRadius: true,
    padding:        16,
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
  titleFont: {
    size:   TYPOGRAPHY.sizes.tooltip,
    family: TYPOGRAPHY.fontFamily,
    weight: String(TYPOGRAPHY.weights.semiBold),
  },
  bodyFont: {
    size:   TYPOGRAPHY.sizes.tooltip,
    family: TYPOGRAPHY.fontFamily,
    weight: String(TYPOGRAPHY.weights.normal),
  },
});

// ─── Option builders ─────────────────────────────────────────────────────────

/**
 * buildLineOptions(overrides?)
 * Base Chart.js options for a dark-theme line chart.
 * Spread your overrides to customize per-chart.
 */
export function buildLineOptions(overrides = {}) {
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
  };
}

/**
 * buildBarOptions(overrides?)
 * Base Chart.js options for a dark-theme bar chart.
 */
export function buildBarOptions(overrides = {}) {
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
  };
}
