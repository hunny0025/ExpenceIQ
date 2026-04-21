/**
 * Design Tokens
 * Single source of truth for chart theming.
 * Update here to propagate across all charts.
 */

export const COLORS = {
  primary: '#0F3460',
  primaryAlpha: 'rgba(15, 52, 96, 0.15)',
  secondary: '#3178C6',
  secondaryAlpha: 'rgba(49, 120, 198, 0.15)',
  accent: '#2B9348',
  accentAlpha: 'rgba(43, 147, 72, 0.15)',

  success: '#10B981',
  warning: '#FBBF24',
  danger: '#EF4444',

  // Text
  textPrimary: '#EEF4FF',
  textSecondary: '#B6C7DD',
  textMuted: '#7E92AD',

  // Grid / structure
  gridLine: 'rgba(182, 199, 221, 0.12)',
  border: 'rgba(182, 199, 221, 0.2)',

  // Chart background
  chartBg: '#0D1A2D',
  tooltipBg: '#102038',
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
