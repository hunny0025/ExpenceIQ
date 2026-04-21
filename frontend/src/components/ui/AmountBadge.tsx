/**
 * AmountBadge.tsx
 *
 * Displays a monetary value with:
 *  – green  for positive / income
 *  – red    for negative / expense
 *  – muted  for zero
 *
 * Props:
 *   value      – number (positive = income, negative = expense)
 *   currency   – currency code, e.g. 'USD' (default: 'USD')
 *   locale     – BCP 47 locale   (default: 'en-US')
 *   size       – 'sm' | 'md' | 'lg'
 *   showSign   – always show +/- prefix (default: true for positive)
 *   className  – extra classes
 */

import type { CSSProperties } from 'react';

export interface AmountBadgeProps {
  value:      number;
  currency?:  string;
  locale?:    string;
  size?:      'sm' | 'md' | 'lg';
  showSign?:  boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { fontSize: '0.75rem',  padding: '0.15rem 0.5rem',  gap: '0.2rem'  },
  md: { fontSize: '0.875rem', padding: '0.25rem 0.65rem', gap: '0.25rem' },
  lg: { fontSize: '1.05rem',  padding: '0.3rem 0.85rem',  gap: '0.3rem'  },
};

export default function AmountBadge({
  value,
  currency  = 'USD',
  locale    = 'en-US',
  size      = 'md',
  showSign  = true,
  className = '',
}: AmountBadgeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isZero     = value === 0;

  // Semantic color
  const color =
    isPositive ? '#10B981' :   // emerald-500
    isNegative ? '#F43F5E' :   // rose-500
    '#9CA3AF';                  // muted

  const bgColor =
    isPositive ? 'rgba(16,185,129,0.12)' :
    isNegative ? 'rgba(244,63,94,0.12)'  :
    'rgba(156,163,175,0.10)';

  const borderColor =
    isPositive ? 'rgba(16,185,129,0.25)' :
    isNegative ? 'rgba(244,63,94,0.25)'  :
    'rgba(156,163,175,0.20)';

  // Format absolute value
  const formatted = new Intl.NumberFormat(locale, {
    style:    'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));

  // Build prefix: arrow + sign
  const arrow  = isPositive ? '▲' : isNegative ? '▼' : '—';
  const prefix =
    isZero  ? '' :
    showSign
      ? (isPositive ? '+' : '−')
      : '';

  const { fontSize, padding, gap } = SIZE_MAP[size];

  const style: CSSProperties = {
    display:         'inline-flex',
    alignItems:      'center',
    gap,
    padding,
    borderRadius:    '9999px',
    fontSize,
    fontWeight:      600,
    fontFamily:      "'Inter', system-ui, sans-serif",
    fontVariantNumeric: 'tabular-nums',
    letterSpacing:   '0.01em',
    backgroundColor: bgColor,
    color,
    border:          `1px solid ${borderColor}`,
    whiteSpace:      'nowrap',
    userSelect:      'none',
    transition:      'opacity 0.15s ease',
  };

  return (
    <span style={style} className={className} aria-label={`${isPositive ? 'Income' : 'Expense'}: ${formatted}`}>
      {!isZero && (
        <span aria-hidden="true" style={{ fontSize: '0.65em', lineHeight: 1 }}>
          {arrow}
        </span>
      )}
      {prefix}{formatted}
    </span>
  );
}
