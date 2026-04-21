/**
 * Design Tokens — single source of truth for all chart theming.
 * Update here to propagate across all charts and UI components.
 */

export const COLORS = {
  // Brand
  primary:       '#7C3AED',          // violet-600
  primaryAlpha:  'rgba(124,58,237,0.18)',
  secondary:     '#0EA5E9',          // sky-500
  secondaryAlpha:'rgba(14,165,233,0.18)',
  accent:        '#10B981',          // emerald-500
  accentAlpha:   'rgba(16,185,129,0.18)',

  // Semantic
  success:       '#10B981',
  successAlpha:  'rgba(16,185,129,0.18)',
  warning:       '#F59E0B',
  warningAlpha:  'rgba(245,158,11,0.18)',
  danger:        '#F43F5E',
  dangerAlpha:   'rgba(244,63,94,0.18)',
  info:          '#38BDF8',
  infoAlpha:     'rgba(56,189,248,0.18)',

  // Text
  textPrimary:   '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted:     '#6B7280',

  // Surfaces
  chartBg:       '#111827',          // gray-900
  tooltipBg:     '#1F2937',          // gray-800
  surface1:      '#1F2937',
  surface2:      '#111827',

  // Grid / borders
  gridLine:      'rgba(255,255,255,0.06)',
  border:        'rgba(255,255,255,0.10)',
} as const;

export const TYPOGRAPHY = {
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  sizes: {
    tick:    11,
    legend:  12,
    tooltip: 13,
    title:   14,
  },
  weights: {
    normal:   400,
    medium:   500,
    semiBold: 600,
  },
} as const;

/** Ordered palette for multi-dataset charts */
export const SERIES_PALETTE: readonly string[] = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent,
  COLORS.warning,
  COLORS.danger,
  COLORS.info,
];

/** Category → color map used by CategoryTag */
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  food:          { bg: 'rgba(245,158,11,0.15)',  text: '#F59E0B', border: 'rgba(245,158,11,0.3)'  },
  transport:     { bg: 'rgba(14,165,233,0.15)',  text: '#0EA5E9', border: 'rgba(14,165,233,0.3)'  },
  shopping:      { bg: 'rgba(124,58,237,0.15)',  text: '#7C3AED', border: 'rgba(124,58,237,0.3)'  },
  health:        { bg: 'rgba(16,185,129,0.15)',  text: '#10B981', border: 'rgba(16,185,129,0.3)'  },
  entertainment: { bg: 'rgba(244,63,94,0.15)',   text: '#F43F5E', border: 'rgba(244,63,94,0.3)'   },
  utilities:     { bg: 'rgba(56,189,248,0.15)',  text: '#38BDF8', border: 'rgba(56,189,248,0.3)'  },
  housing:       { bg: 'rgba(167,139,250,0.15)', text: '#A78BFA', border: 'rgba(167,139,250,0.3)' },
  education:     { bg: 'rgba(251,191,36,0.15)',  text: '#FBBF24', border: 'rgba(251,191,36,0.3)'  },
  travel:        { bg: 'rgba(52,211,153,0.15)',  text: '#34D399', border: 'rgba(52,211,153,0.3)'  },
  other:         { bg: 'rgba(156,163,175,0.15)', text: '#9CA3AF', border: 'rgba(156,163,175,0.3)' },
};
