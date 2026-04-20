/**
 * Design Tokens
 * Single source of truth for chart theming.
 * Update here to propagate across all charts.
 */

export const COLORS = {
  primary: '#6C63FF',       // purple – main data series
  primaryAlpha: 'rgba(108, 99, 255, 0.15)',
  secondary: '#F97316',     // orange – secondary data series
  secondaryAlpha: 'rgba(249, 115, 22, 0.15)',
  accent: '#22D3EE',        // cyan – tertiary / highlight
  accentAlpha: 'rgba(34, 211, 238, 0.15)',

  success: '#10B981',
  warning: '#FBBF24',
  danger: '#EF4444',

  // Text
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#475569',

  // Grid / structure
  gridLine: 'rgba(148, 163, 184, 0.12)',
  border: 'rgba(148, 163, 184, 0.2)',

  // Chart background
  chartBg: '#0F172A',
  tooltipBg: '#1E293B',
};

export const TYPOGRAPHY = {
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  sizes: {
    tick: 11,
    legend: 12,
    tooltip: 13,
    title: 14,
  },
  weights: {
    normal: 400,
    medium: 500,
    semiBold: 600,
  },
};

/** Convenience palette array for multi-series charts */
export const SERIES_PALETTE = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
];
